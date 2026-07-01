"use client";

import Link from "next/link";
import { OpChrome, OpKpi, OpPanel, OpRefundPill, OpSkeletonRows, OpTicketPill } from "@/components/operator";
import { useSnapshot } from "@/components/useSnapshot";

const CAT_COLOR: Record<string, string> = {
  neg: "#ff6f61",
  neu: "#ffc23c",
  gold: "#ffc23c",
  crave: "#12c24d",
};
const SENT_COLOR: Record<string, string> = { positive: "#35d07f", neutral: "#ffc23c", negative: "#ff6f61" };

function timeAgo(iso: string): string {
  const m = Math.max(0, Math.round((Date.now() - +new Date(iso)) / 60000));
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h}h` : `${Math.round(h / 24)}d`;
}

export default function DashboardPage() {
  const { data } = useSnapshot();
  const loading = !data;
  const cats = data?.issuesByCategory ?? [];
  const maxCat = cats.length ? Math.max(...cats.map((c) => c.count)) : 1;

  // Live, honest signals derived from the spine (not fabricated WoW arrows).
  const autoResolved = data?.tickets.filter((t) => t.status === "auto_resolved").length ?? 0;
  const openIssues = data?.tickets.filter((t) => t.status !== "resolved" && t.status !== "auto_resolved").length ?? 0;
  const toAction = data?.sentiment.filter((s) => s.sentiment === "negative").length ?? 0;

  return (
    <main className="op">
      <OpChrome path="gx.wingstop.com / command-center" updatedAt={data?.ts} />
      <div className="mx-auto max-w-[1320px] px-5 py-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-lg font-extrabold uppercase tracking-wide text-[#e7f0e9]">
              Guest Experience · Global
            </h1>
            <p className="font-mono text-[11px] text-[#9db1a4]">
              GX &amp; Social Care cockpit · all markets · resolutions land here from Lil Ranchie in real time
            </p>
          </div>
          <Link
            href="/queue"
            className="rounded border border-[#223a2e] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-[#9fb3a6] transition-colors hover:border-[#12c24d] hover:text-[#12c24d]"
          >
            Refund queue →
          </Link>
        </div>

        {/* KPI strip — program baseline (illustrative) + live counts (real) */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          <OpKpi label="NPS · baseline" value={loading ? undefined : `+${data!.kpis.nps}`} color="#35d07f" loading={loading} />
          <OpKpi label="CSAT · baseline" value={loading ? undefined : `${data!.kpis.csat}%`} loading={loading} />
          <OpKpi label="HYPE · baseline" value={loading ? undefined : `${data!.kpis.hospitality}%`} color="#ffc23c" loading={loading} />
          <OpKpi label="Deflection · live" value={loading ? undefined : `${data!.kpis.deflectionRate}%`} color="#12c24d" loading={loading} />
          <OpKpi label="Auto-resolved · live" value={loading ? undefined : autoResolved} color="#35d07f" loading={loading} sub="in-app, this session" />
          <OpKpi label="Open issues · live" value={loading ? undefined : openIssues} color="#ffc23c" loading={loading} />
        </div>
        <p className="mt-2 font-mono text-[10px] text-[#7f9488]">
          Baseline figures illustrative (program targets). “Live” fields update from the data spine as resolutions post.
        </p>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1.35fr_1fr]">
          {/* issues by category */}
          <OpPanel title="Issues by category" right={<span className="text-[#ff6f61]">Top · Missing item</span>}>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-[#1b2f26]" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {cats.map((c) => (
                  <div key={c.label} className="grid grid-cols-[120px_1fr_64px] items-center gap-2.5 text-[12px] text-[#9fb3a6]">
                    <span>{c.label}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-[#1b2f26]">
                      <span className="block h-full rounded-full" style={{ width: `${(c.count / maxCat) * 100}%`, background: CAT_COLOR[c.tone] }} />
                    </span>
                    <span className="text-right font-mono tabular-nums text-[#9db1a4]">{c.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </OpPanel>

          {/* live social listening */}
          <OpPanel
            title="Live social listening"
            right={
              <span className="op-pill" style={{ color: "#ffc23c", borderColor: "#ffc23c55", background: "#ffc23c14" }}>
                <span className="dot" style={{ background: "#ffc23c" }} />
                {loading ? "—" : toAction} to action
              </span>
            }
          >
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 animate-pulse rounded bg-[#1b2f26]" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {data!.sentiment.slice(0, 6).map((s) => (
                  <div key={s.id} className="flex items-start gap-2.5 text-[12px]">
                    <span className="w-14 shrink-0 font-mono text-[10px] text-[#9db1a4]">{s.channel}</span>
                    <div className="text-[#9fb3a6]">
                      <span className="font-mono text-[10px] uppercase" style={{ color: SENT_COLOR[s.sentiment] }}>
                        ● {s.sentiment}
                      </span>{" "}
                      {s.text}
                      <div className="font-mono text-[10px] text-[#7f9488]">
                        {s.store ? `#${s.store} · ` : s.source === "chat" ? "Lil Ranchie · " : ""}
                        {timeAgo(s.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </OpPanel>
        </div>

        {/* unified intake */}
        <div className="op-panel mt-3">
          <div className="op-panel-head">
            <span>Cross-channel intake · newest first</span>
            <span className="text-[#7f9488]">survey · chatbot handoff · phone · social</span>
          </div>
          <div className="overflow-x-auto">
            <table className="op-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Guest</th>
                  <th>Issue</th>
                  <th>Channel</th>
                  <th>Status</th>
                  <th className="num">Refund</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <OpSkeletonRows cols={6} rows={5} />
                ) : (
                  data!.tickets.slice(0, 9).map((t) => {
                    const refund = data!.refunds.find((r) => r.id === t.refundId);
                    return (
                      <tr key={t.id}>
                        <td className="font-mono text-[11px] text-[#9db1a4]">{t.id.replace("TICKET-", "")}</td>
                        <td>
                          <div className="text-[#e7f0e9]">{t.guestName}</div>
                          <div className="font-mono text-[10px] text-[#7f9488]">{t.tier}</div>
                        </td>
                        <td className="text-[#9fb3a6]">{t.issueLabel}</td>
                        <td className="font-mono text-[10px] uppercase text-[#9db1a4]">
                          {t.source === "lil_ranchie" ? "Ranchie" : t.channel.replace("_", " ")}
                        </td>
                        <td>
                          <OpTicketPill status={t.status} />
                        </td>
                        <td className="num">{refund ? <OpRefundPill status={refund.status} /> : <span className="text-[#7f9488]">—</span>}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
