"use client";

/** Renders the structured message blocks (CONV-02) inside the phone — the in-app channel adapter. */

import type { MessageBlock, ResolutionOption } from "@/lib/domain/types";

function optionLabel(o: ResolutionOption): string {
  if (o.method === "loyalty_points" && o.points) return `Add ${o.points} loyalty points`;
  if (o.amount > 0)
    return `${o.method === "account_credit" ? "Account credit" : "Refund"} — $${o.amount.toFixed(2)}`;
  if (o.method === "remake") return "Remake for pickup";
  if (o.method === "discount_code") return "Discount code for next order";
  return o.method;
}

export function ChatBlock({
  block,
  onReply,
  disabled,
}: {
  block: MessageBlock;
  onReply: (value: string) => void;
  disabled?: boolean;
}) {
  switch (block.type) {
    case "text":
      return <div className="msg-bot">{block.text}</div>;

    case "order_status":
      return (
        <div className="rcard">
          <div className="rcard-h ok">● {block.title}</div>
          <div className="p-3">
            {block.order.lines.map((l, i) => (
              <div key={i} className="flex justify-between py-0.5 text-[12.5px]">
                <span className="text-ink-mid">{l.label}</span>
                <span className="text-right">{l.value}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "resolution_options":
      return (
        <div className="rcard">
          <div className="rcard-h warn">● {block.title}</div>
          <div className="flex flex-col gap-1.5 p-3">
            {block.options.map((o, i) => (
              <button
                key={i}
                disabled={disabled}
                onClick={() => onReply(optionLabel(o))}
                className="flex items-center justify-between rounded-[9px] border border-line-strong px-2.5 py-2.5 text-left text-[12.5px] transition-colors hover:border-crave disabled:opacity-50"
              >
                <span>{optionLabel(o)}</span>
                {o.suggested && (
                  <span className="rounded-full border border-crave px-1.5 py-px font-mono text-[9px] text-hunter">
                    Suggested
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      );

    case "confirmation":
      return (
        <div className="rcard">
          <div className="rcard-h ok">● {block.title}</div>
          <div className="p-3">
            {block.lines.map((l, i) => (
              <div key={i} className="flex justify-between gap-3 py-0.5 text-[12.5px]">
                <span className="text-ink-mid">{l.label}</span>
                <span className="text-right">{l.value}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "handoff":
      return (
        <div className="w-full rounded-[14px] rounded-bl-[5px] border border-blue/25 bg-blue-tint p-3">
          <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-blue">
            ↗ Connecting you to a teammate
          </div>
          <p className="m-0 text-[12.5px] text-ink-mid">
            {block.reason}. They'll have this whole conversation and your order — no repeating yourself.
            {block.ticketId && <span className="font-mono"> ({block.ticketId})</span>}
          </p>
        </div>
      );

    case "quick_replies":
      return (
        <div className="flex max-w-[90%] flex-wrap gap-1.5 self-start">
          {block.options.map((o, i) => (
            <button
              key={i}
              disabled={disabled}
              onClick={() => onReply(o.value)}
              className="rounded-full border border-hunter bg-white px-3 py-1.5 text-xs font-semibold text-hunter transition-colors hover:bg-crave-tint disabled:opacity-50"
            >
              {o.label}
            </button>
          ))}
        </div>
      );

    case "faq_link":
      return (
        <a href={block.url} className="msg-bot underline">
          {block.title}
        </a>
      );

    default:
      return null;
  }
}
