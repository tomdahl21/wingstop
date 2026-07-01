"use client";

/**
 * Operator surface kit — the dark, dense, tabular lineage for internal tools (design system §13).
 * Deliberately NOT the guest light kit: numerics are mono + tabular, density is high, chrome is a
 * slim terminal bar with a live/reconnecting signal. Optimized for the 10th interaction, not the 1st.
 */

import { Logo } from "./Logo";
import type { RefundStatus, TicketStatus } from "@/lib/domain/types";

const TICKET: Record<TicketStatus, { label: string; c: string }> = {
  new: { label: "New", c: "#66a6f5" },
  in_progress: { label: "In progress", c: "#ffc23c" },
  awaiting_bp: { label: "Awaiting BP", c: "#9fb3a6" },
  auto_resolved: { label: "Auto-resolved", c: "#35d07f" },
  escalated: { label: "Escalated", c: "#ff6f61" },
  resolved: { label: "Resolved", c: "#35d07f" },
};

const REFUND: Record<RefundStatus, { label: string; c: string }> = {
  eligible: { label: "Eligible", c: "#12c24d" },
  pending: { label: "Pending", c: "#ffc23c" },
  approved: { label: "Approved", c: "#35d07f" },
  issued: { label: "Issued", c: "#35d07f" },
  declined: { label: "Declined", c: "#ff6f61" },
};

function pillStyle(c: string): React.CSSProperties {
  return { color: c, borderColor: `${c}55`, background: `${c}14` };
}

export function OpTicketPill({ status }: { status: TicketStatus }) {
  const p = TICKET[status];
  return (
    <span className="op-pill" style={pillStyle(p.c)}>
      <span className="dot" style={{ background: p.c }} />
      {p.label}
    </span>
  );
}

export function OpRefundPill({ status }: { status: RefundStatus }) {
  const p = REFUND[status];
  return (
    <span className="op-pill" style={pillStyle(p.c)}>
      <span className="dot" style={{ background: p.c }} />
      {p.label}
    </span>
  );
}

export function OpChrome({ path, updatedAt }: { path: string; updatedAt?: number }) {
  return (
    <div className="op-chrome">
      <Logo height={18} variant="white" />
      <span className="font-mono text-[11px] tracking-[0.06em] text-[#9db1a4]">{path}</span>
      <span className="ml-auto op-live">
        {updatedAt ? (
          <>
            <span className="dot" /> LIVE · {new Date(updatedAt).toLocaleTimeString()}
          </>
        ) : (
          <>
            <span className="dot" style={{ background: "#ffc23c", animation: "none" }} /> connecting…
          </>
        )}
      </span>
    </div>
  );
}

export function OpKpi({
  label,
  value,
  color,
  sub,
  loading,
}: {
  label: string;
  value?: React.ReactNode;
  color?: string;
  sub?: string;
  loading?: boolean;
}) {
  return (
    <div className="op-kpi">
      <div className="lbl">{label}</div>
      {loading ? (
        <div className="mt-1.5 h-6 w-14 animate-pulse rounded bg-[#22332b]" />
      ) : (
        <div className="val" style={{ color: color ?? "var(--op-text)" }}>
          {value}
        </div>
      )}
      {sub && !loading && <div className="font-mono text-[10px] text-[#9db1a4]">{sub}</div>}
    </div>
  );
}

export function OpPanel({
  title,
  right,
  children,
  className,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`op-panel ${className ?? ""}`}>
      <div className="op-panel-head">
        <span>{title}</span>
        {right}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

export function OpSkeletonRows({ cols, rows = 4 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c}>
              <div className="h-3 animate-pulse rounded bg-[#1b2f26]" style={{ width: `${40 + ((r + c) % 3) * 20}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
