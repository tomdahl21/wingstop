/**
 * Lil Ranchie conversation service (WS2 backend).
 *
 * Runs a manual agentic loop against the Claude API: the model handles language and voice
 * and calls tools; this route executes those tools against the deterministic policy engine
 * and the shared store, then streams back BOTH the model's prose AND the structured message
 * blocks (CONV-01) the rich surface renders. Money never originates in the model.
 *
 * Stream protocol: newline-delimited JSON events —
 *   { "type": "text",  "text": "…" }      incremental assistant prose
 *   { "type": "blocks", "blocks": [...] }  structured blocks from a tool result
 *   { "type": "error", "message": "…" }
 *   { "type": "done" }
 */

import Anthropic from "@anthropic-ai/sdk";
import {
  RANCHIE_MODEL,
  SIGNED_IN_LOYALTY_ID,
  SYSTEM_PROMPT,
  TOOLS,
} from "@/lib/anthropic/ranchie";
import {
  confirmationBlock,
  handoffBlock,
  optionLabel,
  orderStatusBlock,
  quickRepliesBlock,
  resolutionOptionsBlock,
} from "@/lib/domain/blocks";
import { evaluatePolicy, methodLabel } from "@/lib/domain/policy";
import {
  getGuest,
  getOrder,
  latestOrderForGuest,
  recordHandoff,
  recordResolution,
} from "@/lib/domain/store";
import type { PolicyDecision } from "@/lib/domain/policy";
import type { IssueType, MessageBlock, Order, ResolutionMethod } from "@/lib/domain/types";

export const runtime = "nodejs";

interface Session {
  messages: Anthropic.MessageParam[];
  order?: Order;
  decision?: PolicyDecision;
  affected?: string[];
}

const globalForSessions = globalThis as unknown as { __ranchieSessions?: Map<string, Session> };
const sessions = globalForSessions.__ranchieSessions ?? (globalForSessions.__ranchieSessions = new Map());

function getSession(id: string): Session {
  let s = sessions.get(id);
  if (!s) {
    s = { messages: [] };
    sessions.set(id, s);
  }
  return s;
}

export async function POST(req: Request) {
  // An unset ANTHROPIC_API_KEY doesn't necessarily mean no credentials — the SDK also
  // resolves ANTHROPIC_AUTH_TOKEN and an `ant auth login` profile. Only show the setup
  // hint when there is genuinely no static credential to try.
  const hasStaticCred = !!process.env.ANTHROPIC_API_KEY || !!process.env.ANTHROPIC_AUTH_TOKEN;
  const { sessionId, message, reset } = (await req.json()) as {
    sessionId: string;
    message: string;
    reset?: boolean;
  };

  if (reset) sessions.delete(sessionId);
  const session = getSession(sessionId);

  if (!hasStaticCred) {
    return jsonStream([
      {
        type: "blocks",
        blocks: [
          {
            type: "text",
            text: "Lil Ranchie needs an ANTHROPIC_API_KEY to think. Add one to .env.local (see .env.example) and restart the dev server — the policy engine and dashboards work without it, but the chat brain needs the key.",
            fallback: "Set ANTHROPIC_API_KEY to enable the chatbot.",
          } as MessageBlock,
        ],
      },
      { type: "done" },
    ]);
  }

  const guest = getGuest(SIGNED_IN_LOYALTY_ID);
  if (!guest) {
    return new Response("Guest not found", { status: 500 });
  }

  // Zero-arg constructor resolves the credential from the environment (API key, auth
  // token, or profile). The deterministic policy engine owns money regardless.
  const client = new Anthropic();
  session.messages.push({ role: "user", content: message });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (evt: unknown) => controller.enqueue(encoder.encode(JSON.stringify(evt) + "\n"));

      try {
        // Manual agentic loop — keep going until the model stops calling tools.
        for (let guard = 0; guard < 8; guard++) {
          const ms = client.messages.stream({
            model: RANCHIE_MODEL,
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            tools: TOOLS,
            messages: session.messages,
          });

          ms.on("text", (delta: string) => send({ type: "text", text: delta }));
          const finalMessage = await ms.finalMessage();
          session.messages.push({ role: "assistant", content: finalMessage.content });

          if (finalMessage.stop_reason !== "tool_use") break;

          const toolResults: Anthropic.ToolResultBlockParam[] = [];
          for (const block of finalMessage.content) {
            if (block.type !== "tool_use") continue;
            const { result, blocks } = runTool(session, guest.loyaltyId, block);
            if (blocks.length) send({ type: "blocks", blocks });
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: JSON.stringify(result),
            });
          }
          session.messages.push({ role: "user", content: toolResults });
        }
        send({ type: "done" });
      } catch (err) {
        console.error("[ranchie] error", err);
        send({
          type: "error",
          message: err instanceof Error ? err.message : "Something went wrong talking to Lil Ranchie.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}

/** Execute one tool call. Returns the JSON the model sees plus the rich blocks to render. */
function runTool(
  session: Session,
  loyaltyId: string,
  block: Anthropic.ToolUseBlock,
): { result: unknown; blocks: MessageBlock[] } {
  const input = (block.input ?? {}) as Record<string, unknown>;
  const guest = getGuest(loyaltyId)!;

  switch (block.name) {
    case "lookup_order": {
      const orderId = typeof input.order_id === "string" ? input.order_id : undefined;
      const order = (orderId && getOrder(orderId)) || latestOrderForGuest(loyaltyId);
      if (!order) return { result: { error: "no order found" }, blocks: [] };
      session.order = order;
      return {
        result: {
          order_id: order.id,
          source: order.source,
          channel: order.channel,
          store: `${order.store} ${order.storeName}`,
          placed_at: order.placedAt,
          status: order.status,
          total: order.total,
          items: order.items,
          guest: { name: guest.name, tier: guest.tier, points: guest.pointsBalance },
        },
        blocks: [orderStatusBlock(order)],
      };
    }

    case "evaluate_resolution": {
      const order = session.order ?? latestOrderForGuest(loyaltyId);
      if (!order) return { result: { error: "look up the order first" }, blocks: [] };
      const issueType = input.issue_type as IssueType;
      const affected = Array.isArray(input.affected_item_names)
        ? (input.affected_item_names as string[])
        : undefined;
      const photoProvided = Boolean(input.photo_provided);
      const decision = evaluatePolicy({
        issueType,
        guest,
        order,
        affectedItemNames: affected,
        photoProvided,
      });
      session.order = order;
      session.decision = decision;
      session.affected = affected;
      return {
        // The model sees the engine's verdict — it does not compute any of this.
        result: {
          policy_path: decision.policyPath,
          amount_at_stake: decision.amount,
          auto_approve: decision.autoApprove,
          auto_approve_limit: decision.autoApproveLimit,
          requires_photo: decision.photoRequired,
          photo_satisfied: decision.photoSatisfied,
          else_action: decision.elseAction,
          rationale: decision.rationale,
          options: decision.options.map((o) => ({
            method: o.method,
            label: optionLabel(o),
            suggested: o.suggested,
          })),
        },
        blocks: [orderStatusBlock(order, affected), resolutionOptionsBlock(decision)],
      };
    }

    case "execute_resolution": {
      const order = session.order;
      const decision = session.decision;
      if (!order || !decision) {
        return { result: { error: "evaluate a resolution before executing one" }, blocks: [] };
      }
      const method = input.method as ResolutionMethod;
      const channel = "in_app" as const;
      const { ticket, refund, pointsAdded, newPointsBalance } = recordResolution({
        guest,
        order,
        decision,
        method,
        channel,
      });

      const lines: { label: string; value: string }[] = [];
      let title: string;
      if (refund) {
        if (refund.status === "issued") {
          title = `Refunded · $${refund.amount.toFixed(2)}`;
          lines.push({ label: "To", value: `${guest.paymentBrand} ··· ${guest.paymentLast4}` });
          lines.push({ label: "Arrives", value: "3–5 business days" });
        } else {
          title = `Refund submitted · $${refund.amount.toFixed(2)}`;
          lines.push({ label: "Status", value: "Pending agent review" });
          lines.push({ label: "Why", value: decision.rationale });
        }
        lines.push({ label: "Ticket", value: ticket.id });
      } else if (pointsAdded) {
        title = `+${pointsAdded} points added`;
        lines.push({ label: "New balance", value: `${newPointsBalance?.toLocaleString()} pts` });
        lines.push({ label: "Ticket", value: ticket.id });
      } else {
        title = `${methodLabel(method)} confirmed`;
        lines.push({ label: "Ticket", value: ticket.id });
      }

      const blocks: MessageBlock[] = [
        confirmationBlock({ title, lines, ticketId: ticket.id }),
        quickRepliesBlock("Anything else?", [
          { label: "I'm good, thanks", value: "I'm good, thanks!" },
          { label: "Talk to a person", value: "Can I talk to a person?" },
        ]),
      ];
      return {
        result: {
          status: "done",
          ticket_id: ticket.id,
          refund_id: refund?.id,
          refund_status: refund?.status,
          amount: refund?.amount,
          points_added: pointsAdded,
        },
        blocks,
      };
    }

    case "escalate_to_human": {
      const reason = typeof input.reason === "string" ? input.reason : "Guest requested a person";
      const ticket = recordHandoff(guest, session.order, reason, "in_app");
      return {
        result: { status: "handed_off", ticket_id: ticket.id },
        blocks: [handoffBlock(reason, ticket.id)],
      };
    }

    default:
      return { result: { error: `unknown tool ${block.name}` }, blocks: [] };
  }
}

/** Helper: emit a fixed list of events as an ndjson stream (used for the no-key path). */
function jsonStream(events: unknown[]): Response {
  const encoder = new TextEncoder();
  const body = events.map((e) => JSON.stringify(e) + "\n").join("");
  return new Response(encoder.encode(body), {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
