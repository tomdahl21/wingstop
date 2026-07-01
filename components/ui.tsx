/** Shared presentational kit — status pills, sentiment chips, KPI cards (design system §06). */

import type { RefundStatus, Sentiment, TicketStatus } from "@/lib/domain/types";

const TICKET_PILL: Record<TicketStatus, { label: string; cls: string; dot: string }> = {
  new: { label: "New", cls: "bg-blue-tint text-blue border-blue/30", dot: "var(--blue)" },
  in_progress: { label: "In progress", cls: "bg-neu-tint text-neu border-gold/45", dot: "var(--neu)" },
  awaiting_bp: { label: "Awaiting BP", cls: "bg-[#F1F3EF] text-ink-mid border-line-strong", dot: "var(--ink-mid)" },
  auto_resolved: { label: "Auto-resolved", cls: "bg-crave-tint text-hunter border-crave/40", dot: "var(--green)" },
  escalated: { label: "Escalated", cls: "bg-neg-tint text-neg border-neg/30", dot: "var(--neg)" },
  resolved: { label: "Resolved", cls: "bg-pos-tint text-pos border-pos/30", dot: "var(--pos)" },
};

const REFUND_PILL: Record<RefundStatus, { label: string; cls: string; dot: string }> = {
  eligible: { label: "Eligible", cls: "bg-crave-tint text-hunter border-crave/40", dot: "var(--green)" },
  pending: { label: "Pending approval", cls: "bg-neu-tint text-neu border-gold/45", dot: "var(--neu)" },
  approved: { label: "Approved", cls: "bg-pos-tint text-pos border-pos/30", dot: "var(--pos)" },
  issued: { label: "Issued", cls: "bg-pos-tint text-pos border-pos/30", dot: "var(--pos)" },
  declined: { label: "Declined", cls: "bg-neg-tint text-neg border-neg/30", dot: "var(--neg)" },
};

export function TicketPill({ status }: { status: TicketStatus }) {
  const p = TICKET_PILL[status];
  return <Pill label={p.label} cls={p.cls} dot={p.dot} />;
}

export function RefundPill({ status }: { status: RefundStatus }) {
  const p = REFUND_PILL[status];
  return <Pill label={p.label} cls={p.cls} dot={p.dot} />;
}

function Pill({ label, cls, dot }: { label: string; cls: string; dot: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.02em] ${cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
      {label}
    </span>
  );
}

export function SentimentChip({ sentiment, small }: { sentiment: Sentiment; small?: boolean }) {
  const map: Record<Sentiment, { label: string; cls: string }> = {
    positive: { label: "Positive", cls: "bg-pos-tint text-pos" },
    neutral: { label: "Neutral", cls: "bg-neu-tint text-neu" },
    negative: { label: "Negative", cls: "bg-neg-tint text-neg" },
  };
  const s = map[sentiment];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${s.cls} ${
        small ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      ● {s.label}
    </span>
  );
}

export function Kpi({
  label,
  value,
  unit,
  delta,
  tone,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  tone?: "pos" | "neg" | "neu" | "hunter";
}) {
  const valColor =
    tone === "pos"
      ? "text-pos"
      : tone === "neg"
        ? "text-neg"
        : tone === "neu"
          ? "text-neu"
          : tone === "hunter"
            ? "text-hunter"
            : "text-ink";
  const deltaUp = delta?.startsWith("▲");
  return (
    <div className="min-w-[150px] rounded-xl border border-line bg-white p-4 shadow-[var(--sh1)]">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.04em] text-ink-lo">{label}</div>
      <div className={`font-display text-[34px] font-extrabold leading-[1.05] ${valColor}`}>
        {value}
        {unit && <span className="text-base text-ink-lo">{unit}</span>}
      </div>
      {delta && (
        <div className={`font-mono text-xs ${deltaUp ? "text-pos" : delta.startsWith("▼") ? "text-neg" : "text-ink-mid"}`}>
          {delta}
        </div>
      )}
    </div>
  );
}

export function Panel({
  title,
  right,
  children,
  className,
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-line bg-white p-4 shadow-[var(--sh1)] ${className ?? ""}`}>
      {(title || right) && (
        <div className="mb-3.5 flex items-center justify-between">
          {title && <span className="text-xs font-bold uppercase tracking-[0.02em] text-ink-mid">{title}</span>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function SurfaceChrome({ title, subtitle, right }: { title: string; subtitle: string; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="font-display text-lg font-extrabold uppercase text-ink">{title}</div>
        <div className="text-xs text-ink-lo">{subtitle}</div>
      </div>
      {right}
    </div>
  );
}
