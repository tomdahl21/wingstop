"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChainRail } from "@/components/ChainRail";
import { useSnapshot } from "@/components/useSnapshot";
import {
  ALL_INVESTMENT_IDS,
  INVESTMENTS,
  TODAY,
  callVolumeChangePct,
  computeBaseline,
  responseMultiple,
  type Stage,
} from "@/lib/demo/baseline";

const STAGE_ORDER: Stage[] = ["order", "track", "resolve", "insight"];
const STAGE_LABEL: Record<Stage, string> = {
  order: "At the order",
  track: "During tracking",
  resolve: "In resolution",
  insight: "In the loop",
};

export default function InsightsPage() {
  const [enabled, setEnabled] = useState<Set<string>>(new Set(ALL_INVESTMENT_IDS));
  const { data } = useSnapshot();
  const baseline = useMemo(() => computeBaseline(enabled), [enabled]);

  const toggle = (id: string) =>
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const callPct = callVolumeChangePct(baseline);

  // Live proof: the loop actually running (pre-emptive recovery + chat resolutions).
  const tickets = data?.tickets ?? [];
  const liveDeflected = tickets.filter((t) => t.status === "auto_resolved").length;
  const livePositive = (data?.sentiment ?? []).filter((s) => s.sentiment === "positive").length;

  return (
    <main className="bg-bg-tint min-h-screen">
      <ChainRail active="insights" />
      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-lo">The baseline you'd earn</div>
        <h1 className="mt-2 font-display text-[clamp(26px,4vw,42px)] font-black uppercase leading-[0.98] text-ink">
          Wing experts don't guess.
          <br />
          Every investment, <span className="text-crave">weighed.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] text-ink-mid">
          The front-stage experience isn't a cost — it's the input to issue volume and the insights baseline. Toggle the
          investments and watch the numbers move. Read these as <b className="text-ink">directional weights</b> — which lever
          is worth roughly how much relative to the others — not point predictions.
        </p>
        <p className="mt-2 inline-block rounded-full border border-gold/45 bg-gold-tint px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-gold-ink">
          Illustrative · anchored to program targets + TD R1 current-state · not measured
        </p>

        {/* resulting baseline */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <BaselineKpi label="NPS" value={`+${baseline.nps}`} base={`was +${TODAY.nps}`} tone="pos" />
          <BaselineKpi label="CSAT" value={`${baseline.csat}%`} base={`was ${TODAY.csat}%`} />
          <BaselineKpi label="Deflection" value={`${baseline.deflection}%`} base={`was ${TODAY.deflection}%`} tone="hunter" />
          <BaselineKpi
            label="Call volume"
            value={callPct === 0 ? "—" : `${callPct > 0 ? "+" : ""}${callPct}%`}
            base="vs today"
            tone={callPct < 0 ? "pos" : "neu"}
          />
          <BaselineKpi label="Positive sentiment" value={`${baseline.sentiment}%`} base={`was ${TODAY.sentiment}%`} />
          <BaselineKpi
            label="Survey response"
            value={`${responseMultiple(baseline)}×`}
            base={`${baseline.responseRate}% completion`}
            tone="hunter"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setEnabled(new Set(ALL_INVESTMENT_IDS))}
            className="rounded-full bg-crave px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-crave-hi"
          >
            Make every investment
          </button>
          <button
            onClick={() => setEnabled(new Set())}
            className="rounded-full border border-line-strong bg-white px-4 py-2 text-sm font-bold text-ink-mid transition-colors hover:border-hunter hover:text-hunter"
          >
            Reset to today
          </button>
        </div>

        {/* investments grouped by stage */}
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {STAGE_ORDER.map((stage) => {
            const items = INVESTMENTS.filter((i) => i.stage === stage);
            if (!items.length) return null;
            return (
              <div key={stage}>
                <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-hunter">{STAGE_LABEL[stage]}</div>
                <div className="space-y-2">
                  {items.map((inv) => {
                    const on = enabled.has(inv.id);
                    return (
                      <button
                        key={inv.id}
                        role="switch"
                        aria-checked={on}
                        onClick={() => toggle(inv.id)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left shadow-[var(--sh1)] transition-colors ${
                          on ? "border-crave bg-white" : "border-line bg-bg-warm opacity-70"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-10 flex-shrink-0 items-center rounded-full p-0.5 transition-colors ${
                            on ? "bg-crave" : "bg-line-strong"
                          }`}
                        >
                          <span className={`h-5 w-5 rounded-full bg-white transition-transform ${on ? "translate-x-4" : ""}`} />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-ink">{inv.label}</span>
                          <span className="mt-0.5 block text-[12.5px] text-ink-mid">{inv.fixes}</span>
                          <span className="mt-1.5 flex flex-wrap gap-1.5">
                            {effectChips(inv.effects).map((c) => (
                              <span key={c} className="rounded-full bg-crave-tint px-2 py-0.5 font-mono text-[10px] text-hunter">
                                {c}
                              </span>
                            ))}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* live proof */}
        <div className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-[var(--sh1)]">
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-lo">Not just a model — the loop is running</div>
          <p className="mt-1.5 text-[14px] text-ink-mid">
            Every resolution Lil Ranchie makes (including the pre-emptive store-stockout recovery) writes to the same
            spine these dashboards read. Right now:
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <LiveStat value={liveDeflected} label="auto-resolved in-app" />
            <LiveStat value={livePositive} label="positive sentiment records" />
            <LiveStat value={tickets.length} label="tickets on the spine" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/order" className="rounded-full bg-hunter px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-hunter-deep">
              ← Replay the experience
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-line-strong bg-white px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-hunter hover:text-hunter"
            >
              GX Command Center →
            </Link>
            <Link
              href="/queue"
              className="rounded-full border border-line-strong bg-white px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-hunter hover:text-hunter"
            >
              Refund Queue →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function effectChips(e: Record<string, number | undefined>): string[] {
  const out: string[] = [];
  if (e.nps) out.push(`NPS +${e.nps}`);
  if (e.deflection) out.push(`Deflection +${e.deflection}pp`);
  if (e.callVolume) out.push(`Calls ${e.callVolume}%`);
  if (e.sentiment) out.push(`Sentiment +${e.sentiment}pp`);
  if (e.responseRate) out.push(`Response +${e.responseRate}pp`);
  return out;
}

function BaselineKpi({ label, value, base, tone }: { label: string; value: string; base: string; tone?: "pos" | "hunter" | "neu" }) {
  const color = tone === "pos" ? "text-pos" : tone === "hunter" ? "text-hunter" : tone === "neu" ? "text-neu" : "text-ink";
  return (
    <div className="rounded-xl border border-line bg-white p-4 shadow-[var(--sh1)]">
      <div className="text-[11px] uppercase tracking-[0.04em] text-ink-lo">{label}</div>
      <div className={`font-display text-[30px] font-extrabold leading-[1.05] ${color}`}>{value}</div>
      <div className="font-mono text-[10px] text-ink-lo">{base}</div>
    </div>
  );
}

function LiveStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-[150px] flex-1 rounded-xl border border-line border-l-[3px] border-l-crave bg-bg-warm p-3.5">
      <div className="font-display text-2xl font-extrabold text-hunter">{value}</div>
      <div className="text-[12px] text-ink-mid">{label}</div>
    </div>
  );
}
