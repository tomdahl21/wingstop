/**
 * Structured message blocks (CONV-01..04). The conversation service emits typed blocks,
 * not free text; every rich block carries a plain-text fallback so thin channel adapters
 * can degrade gracefully (rich in-app → numbered replies over SMS).
 */

import { methodLabel, type PolicyDecision } from "./policy";
import type { MessageBlock, Order, ResolutionOption } from "./types";

export function textBlock(text: string): MessageBlock {
  return { type: "text", text, fallback: text };
}

export function orderStatusBlock(order: Order, affected?: string[]): MessageBlock {
  const lines = [
    { label: "Order", value: `#${order.id} · ${new Date(order.placedAt).toLocaleDateString()}` },
    { label: "Store", value: `#${order.store} ${order.storeName}` },
    {
      label: "Channel",
      value: order.source === "3P" ? `${order.channel} (3P)` : "Wingstop app",
    },
  ];
  if (affected && affected.length) {
    lines.push({ label: "Affected", value: affected.join(", ") });
  }
  const fallback = `Order #${order.id} from store #${order.store} ${order.storeName}.`;
  return { type: "order_status", title: "Order found", order: { id: order.id, placedAt: order.placedAt, store: order.store, lines }, fallback };
}

export function resolutionOptionsBlock(decision: PolicyDecision): MessageBlock {
  const fallbackLines = decision.options.map((o, i) => `${i + 1} · ${optionLabel(o)}`);
  fallbackLines.push(`0 · Talk to a person`);
  return {
    type: "resolution_options",
    title: "Make it right",
    options: decision.options,
    fallback: `Here's what I can do:\n${fallbackLines.join("\n")}`,
  };
}

export function confirmationBlock(input: {
  title: string;
  lines: { label: string; value: string }[];
  ticketId: string;
}): MessageBlock {
  const fallback = `${input.title}. Ticket ${input.ticketId}.`;
  return { type: "confirmation", title: input.title, lines: input.lines, ticketId: input.ticketId, fallback };
}

export function handoffBlock(reason: string, ticketId?: string): MessageBlock {
  return {
    type: "handoff",
    reason,
    ticketId,
    fallback: `I'm bringing in a teammate — they'll have everything we just covered.${
      ticketId ? ` (Ticket ${ticketId})` : ""
    }`,
  };
}

export function quickRepliesBlock(prompt: string, options: { label: string; value: string }[]): MessageBlock {
  const fallback = `${prompt}\n${options.map((o, i) => `${i + 1} · ${o.label}`).join("\n")}`;
  return { type: "quick_replies", prompt, options, fallback };
}

export function optionLabel(o: ResolutionOption): string {
  if (o.method === "loyalty_points" && o.points) return `${methodLabel(o.method)} (+${o.points} pts)`;
  if (o.amount > 0) return `${methodLabel(o.method)} — $${o.amount.toFixed(2)}`;
  return methodLabel(o.method);
}
