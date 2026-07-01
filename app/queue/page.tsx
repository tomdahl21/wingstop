"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { OpChrome, OpRefundPill, OpSkeletonRows } from "@/components/operator";
import { useSnapshot } from "@/components/useSnapshot";
import type { Refund } from "@/lib/domain/types";

const ISSUE_LABEL: Record<Refund["issueType"], string> = {
  missing_item_1p: "Missing item (1P)",
  order_never_arrived_3p: "Never arrived (3P)",
  quality: "Quality — cold/wrong cook",
  wrong_order: "Wrong order",
  late_wait: "Late / long wait",
};

export default function QueuePage() {
  const { data, refresh } = useSnapshot();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const loading = !data;

  const refunds = data?.refunds ?? [];
  const tickets = data?.tickets ?? [];
  const actionable = refunds.find((r) => r.status === "pending" || r.status === "eligible");
  const selected = useMemo(() => {
    const id = selectedId ?? actionable?.id ?? refunds[0]?.id;
    return refunds.find((r) => r.id === id);
  }, [selectedId, actionable, refunds]);
  const selectedTicket = selected ? tickets.find((t) => t.id === selected.ticketId) : undefined;
  const slaRisk = tickets.filter((t) => t.status === "escalated").length;
  const decisionable = selected && (selected.status === "pending" || selected.status === "eligible");

  async function act(action: "approve" | "decline") {
    if (!selected || working) return;
    setWorking(true);
    try {
      await fetch("/api/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, action }),
      });
      await refresh();
    } finally {
      setWorking(false);
    }
  }

  return (
    <main className="op">
      <OpChrome path="gx.wingstop.com / call-center / queue" updatedAt={data?.ts} />
      <div className="mx-auto max-w-[1320px] px-5 py-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-lg font-extrabold uppercase tracking-wide text-[#e7f0e9]">Resolution queue</h1>
            <p className="font-mono text-[11px] text-[#9db1a4]">
              Unified intake · {loading ? "—" : refunds.length} refunds · sorted by SLA risk
            </p>
          </div>
          <span className="op-pill" style={{ color: "#ff6f61", borderColor: "#ff6f6155", background: "#ff6f6114" }}>
            <span className="dot" style={{ background: "#ff6f61" }} />
            {loading ? "—" : slaRisk} SLA risk
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
          {/* queue table */}
          <div className="op-panel">
            <div className="op-panel-head">
              <span>Refund queue</span>
              <span className="text-[#7f9488]">click a row to authorize</span>
            </div>
            <div className="overflow-x-auto">
              <table className="op-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Issue</th>
                    <th className="num">Amount</th>
                    <th>Refund</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <OpSkeletonRows cols={4} rows={4} />
                  ) : (
                    refunds.map((r) => {
                      const t = tickets.find((x) => x.id === r.ticketId);
                      const sel = selected?.id === r.id;
                      return (
                        <tr
                          key={r.id}
                          onClick={() => setSelectedId(r.id)}
                          className="cursor-pointer"
                          style={sel ? { background: "#12c24d1a", boxShadow: "inset 3px 0 0 #12c24d" } : undefined}
                        >
                          <td>
                            <div className="text-[#e7f0e9]">{t?.guestName ?? r.loyaltyId}</div>
                            <div className="font-mono text-[10px] text-[#7f9488]">
                              {t?.tier} · {r.ticketId}
                            </div>
                          </td>
                          <td className="text-[#9fb3a6]">{ISSUE_LABEL[r.issueType]}</td>
                          <td className="num text-[#e7f0e9]">${r.amount.toFixed(2)}</td>
                          <td>
                            <OpRefundPill status={r.status} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* authorization card — policy-enforced */}
          <div className="op-panel self-start">
            <div className="op-panel-head">
              <span>Authorization</span>
              <span className="text-[#7f9488]">engine decides · agent confirms</span>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-8 w-32 animate-pulse rounded bg-[#1b2f26]" />
                  <div className="h-24 animate-pulse rounded bg-[#1b2f26]" />
                </div>
              ) : selected ? (
                <>
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wide text-[#7f9488]">
                        Refund · {selected.ticketId}
                      </div>
                      <div className="font-mono text-[30px] font-bold tabular-nums text-[#e7f0e9]">
                        ${selected.amount.toFixed(2)}
                      </div>
                    </div>
                    <OpRefundPill status={selected.status} />
                  </div>
                  <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-[12px]">
                    {[
                      ["Guest", `${selectedTicket?.guestName ?? "—"} · ${selectedTicket?.tier ?? ""}`],
                      ["Issue", ISSUE_LABEL[selected.issueType]],
                      ["Policy path", selected.policyPath],
                      ["Method", selected.method.replace(/_/g, " ")],
                      ["BP impact", selected.bpAttribution],
                      ["Approver", selected.approver],
                    ].map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-[#9db1a4]">{k}</dt>
                        <dd className="m-0 text-right text-[#e7f0e9]">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  {decisionable ? (
                    <>
                      <div className="mb-3 rounded border border-[#66a6f555] bg-[#66a6f514] px-3 py-2.5 text-[12px] text-[#9fb3a6]">
                        Surfaced by the refund matrix as <b className="text-[#e7f0e9]">{selected.policyPath}</b>. The engine sets
                        the amount and eligibility — you confirm it, you never improvise one.
                      </div>
                      <div className="flex gap-2">
                        <button
                          disabled={working}
                          onClick={() => act("approve")}
                          className="flex-1 rounded bg-[#12c24d] px-4 py-2.5 text-center text-sm font-bold text-[#04140b] transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                          Approve &amp; issue
                        </button>
                        <button
                          disabled={working}
                          onClick={() => act("decline")}
                          className="rounded border border-[#ff6f6166] px-4 py-2.5 text-sm font-bold text-[#ff6f61] transition-colors hover:bg-[#ff6f61] hover:text-[#04140b] disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="rounded border border-[#223a2e] bg-[#16271f] px-3 py-2.5 text-[12px] text-[#9fb3a6]">
                      {selected.status === "issued"
                        ? "Issued. Closed-loop record visible to GX."
                        : selected.status === "declined"
                          ? "Declined — ticket escalated for review."
                          : "No agent action required."}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-[13px] text-[#9db1a4]">Queue empty — resolve an issue in Lil Ranchie.</div>
              )}
            </div>
          </div>
        </div>

        <p className="mt-3 font-mono text-[10px] text-[#7f9488]">
          Every refund logs policy path, method, amount, BP attribution, approver (REF-03), visible to GX. The engine
          enforces eligibility so a Brand Partner can’t quietly decline an eligible refund (REF-04). ·{" "}
          <Link href="/dashboard" className="text-[#12c24d] underline">
            Command Center
          </Link>
        </p>
      </div>
    </main>
  );
}
