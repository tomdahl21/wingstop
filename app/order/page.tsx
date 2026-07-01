"use client";

import { useState } from "react";
import Link from "next/link";
import { ChainRail } from "@/components/ChainRail";
import { Phone } from "@/components/Phone";
import { IconReceipt, TRACK_ICONS, TRACK_LABELS } from "@/components/icons";
import { SCENES, type DemoCard } from "@/lib/demo/journey";

const STAGE_LABEL: Record<string, string> = {
  order: "Order",
  track: "Track",
  resolve: "Resolve",
  insight: "Heard",
};

export default function OrderExperiencePage() {
  const [i, setI] = useState(0);
  const [preempted, setPreempted] = useState(false);
  const [preemptTicket, setPreemptTicket] = useState<string | null>(null);
  const scene = SCENES[i];
  const atEnd = i === SCENES.length - 1;

  async function triggerPreempt() {
    if (preempted) return;
    setPreempted(true);
    try {
      const res = await fetch("/api/preempt", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const data = await res.json();
      setPreemptTicket(data?.ticket?.id ?? null);
    } catch {
      /* the seeded example still demonstrates the concept */
    }
  }

  return (
    <main className="bg-bg-tint min-h-screen">
      <ChainRail active="experience" />
      <div className="mx-auto grid max-w-[1100px] gap-8 px-5 py-10 lg:grid-cols-[340px_1fr]">
        {/* phone */}
        <div className="justify-self-center">
          <Phone appBar={scene.appBar} online={scene.stage === "track" ? "Live · on time" : "Ranch is in · here for your order"}>
            {scene.bubbles.map((b, bi) =>
              b.from === "guest" ? (
                <div key={bi} className="msg-user">
                  {b.text}
                </div>
              ) : (
                <div key={bi} className="msg-bot" lang={b.lang}>
                  {b.text}
                </div>
              ),
            )}
            {scene.card && <CardView card={scene.card} onPreempt={triggerPreempt} preempted={preempted} preemptTicket={preemptTicket} />}
          </Phone>

          {/* scene controls */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setI((n) => Math.max(0, n - 1))}
              disabled={i === 0}
              className="rounded-full border border-line-strong bg-white px-4 py-2 text-sm font-bold text-ink-mid transition-colors hover:border-hunter hover:text-hunter disabled:opacity-40"
            >
              ← Back
            </button>
            <div className="flex gap-1.5" role="tablist" aria-label="Scenes">
              {SCENES.map((_, n) => (
                <button
                  key={n}
                  onClick={() => setI(n)}
                  role="tab"
                  aria-selected={n === i}
                  aria-current={n === i ? "step" : undefined}
                  aria-label={`Scene ${n + 1}`}
                  className={`h-2 w-2 rounded-full transition-colors ${n === i ? "bg-crave" : n < i ? "bg-hunter/40" : "bg-line-strong"}`}
                />
              ))}
            </div>
            {atEnd ? (
              <Link
                href="/ranchie"
                className="rounded-full bg-hunter px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-hunter-deep"
              >
                …so Ranchie →
              </Link>
            ) : (
              <button
                onClick={() => setI((n) => Math.min(SCENES.length - 1, n + 1))}
                className="rounded-full bg-crave px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-crave-hi"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* narration */}
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-hunter px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white">
              {STAGE_LABEL[scene.stage]}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-lo">
              Scene {i + 1} / {SCENES.length}
            </span>
          </div>
          <h1 className="mt-3 font-display text-[clamp(26px,4vw,40px)] font-black uppercase leading-[0.98] text-ink">
            {scene.headline}
          </h1>
          <p className="mt-4 text-[15px] text-ink-mid">{scene.narration}</p>

          <div className="mt-5 rounded-xl border border-line border-l-[3px] border-l-neg bg-white p-4 shadow-[var(--sh1)]">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-neg">What it fixes — from TD R1</div>
            <p className="mt-1.5 text-[13.5px] text-ink-mid">{scene.fixes}</p>
          </div>

          <div className="mt-3 rounded-xl border border-crave/40 bg-crave-tint p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-hunter">Which means →</div>
            <p className="mt-1.5 text-[14px] text-ink">
              <b>{scene.whichMeans.metric}</b> — {scene.whichMeans.effect}
            </p>
          </div>

          {scene.precondition && (
            <div className="mt-3 rounded-xl border border-gold/50 bg-gold-tint p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold-ink">The honest precondition</div>
              <p className="mt-1.5 text-[13.5px] text-ink-mid">{scene.precondition}</p>
            </div>
          )}

          {scene.triggersPreempt && (
            <div className="mt-4 rounded-xl border border-line bg-bg-warm p-4">
              {!preempted ? (
                <>
                  <p className="text-[13.5px] text-ink-mid">
                    This recovery is a real write to the data spine — a would-be refund call logged instead as an
                    auto-resolved, positive event.
                  </p>
                  <button
                    onClick={triggerPreempt}
                    className="mt-3 rounded-full bg-hunter px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-hunter-deep"
                  >
                    Watch it hit the dashboard →
                  </button>
                </>
              ) : (
                <p className="text-[13.5px] text-ink">
                  ✓ Logged{preemptTicket ? ` as ${preemptTicket}` : ""}. Open the{" "}
                  <Link href="/dashboard" className="font-bold text-hunter underline">
                    GX Command Center
                  </Link>{" "}
                  — it's already there, sentiment positive. The loop ran forward.
                </p>
              )}
            </div>
          )}

          {atEnd && (
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/ranchie" className="rounded-full bg-hunter px-5 py-3 font-bold text-white transition-colors hover:bg-hunter-deep">
                …which means Ranchie could look like this →
              </Link>
              <Link
                href="/insights"
                className="rounded-full border border-line-strong bg-white px-5 py-3 font-bold text-ink transition-colors hover:border-hunter hover:text-hunter"
              >
                …and this baseline →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function CardView({
  card,
  onPreempt,
  preempted,
  preemptTicket,
}: {
  card: DemoCard;
  onPreempt: () => void;
  preempted: boolean;
  preemptTicket: string | null;
}) {
  switch (card.kind) {
    case "menu":
      return (
        <div className="rcard">
          <div className="rcard-h ok">● {card.title}</div>
          <div className="p-3">
            <div className="flex flex-wrap gap-1.5">
              {card.combos.map((c) => (
                <span key={c} className="rounded-full bg-gold-tint px-2 py-0.5 font-mono text-[10px] text-gold-ink">
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-2 text-[12.5px] text-ink-mid">{card.portion}</div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-display text-xl font-extrabold text-ink">{card.price}</span>
              <span className="rounded-full bg-crave px-3 py-1.5 text-xs font-bold text-white">Add</span>
            </div>
          </div>
        </div>
      );
    case "summary":
      return (
        <div className="rcard">
          <div className="rcard-h ok">● Review</div>
          <div className="p-3">
            {card.lines.map((l, i) => (
              <div key={i} className="flex justify-between gap-3 py-0.5 text-[12.5px]">
                <span className="text-ink-mid">{l.label}</span>
                <span className={l.tone === "good" ? "font-semibold text-pos" : l.tone === "muted" ? "text-ink-lo" : "text-ink"}>
                  {l.value}
                </span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-line pt-2 text-sm font-bold">
              <span>Total</span>
              <span>{card.total}</span>
            </div>
            <p className="mt-2 text-[11.5px] text-ink-lo">{card.note}</p>
          </div>
        </div>
      );
    case "confirm":
      return (
        <div className="rcard">
          <div className="rcard-h ok">● We got your order · #{card.orderNo}</div>
          <div className="p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-ink">
              <IconReceipt size={14} className="text-hunter" /> Itemized receipt
            </div>
            {card.items.map((it, i) => (
              <div key={i} className="flex justify-between py-0.5 text-[12.5px]">
                <span className="text-ink-mid">{it.name}</span>
                <span className="font-mono text-ink">×{it.qty}</span>
              </div>
            ))}
            <div className="mt-2 rounded-lg border border-line bg-bg-warm px-2.5 py-1.5 text-[11.5px] text-ink-mid">
              {card.eta} · check it against the bag when it lands
            </div>
          </div>
        </div>
      );
    case "tracker":
      return (
        <div className="rcard">
          <div className="rcard-h ok">● {card.eta}</div>
          <div className="p-3">
            <div className="flex items-center justify-between">
              {TRACK_ICONS.map((Icon, i) => (
                <div key={i} className="flex items-center" title={TRACK_LABELS[i]}>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      i <= card.step ? "bg-crave text-white" : "bg-[#EDF0EB] text-ink-lo"
                    }`}
                  >
                    <Icon size={15} />
                  </span>
                  {i < TRACK_ICONS.length - 1 && <div className={`h-0.5 w-3 ${i < card.step ? "bg-crave" : "bg-line-strong"}`} />}
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-[12.5px] text-ink-mid">{card.sub}</p>
          </div>
        </div>
      );
    case "preempt":
      return (
        <div className="rcard">
          <div className="rcard-h ok">● {card.title}</div>
          <div className="p-3">
            {card.lines.map((l, i) => (
              <div key={i} className="flex justify-between gap-3 py-0.5 text-[12.5px]">
                <span className="text-ink-mid">{l.label}</span>
                <span className="font-semibold text-ink">{l.value}</span>
              </div>
            ))}
            <button
              onClick={onPreempt}
              disabled={preempted}
              className="mt-2.5 w-full rounded-full bg-hunter px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-hunter-deep disabled:opacity-60"
            >
              {preempted ? `✓ Logged${preemptTicket ? ` · ${preemptTicket}` : ""}` : "Watch it hit the dashboard"}
            </button>
          </div>
        </div>
      );
    case "survey":
      return (
        <div className="rcard" lang={card.lang}>
          <div className="rcard-h warn">● {card.prompt}</div>
          <div className="p-3">
            <div className="flex gap-1.5 text-2xl text-gold" aria-label="5 stars">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-hunter">{card.reward}</div>
          </div>
        </div>
      );
    default:
      return null;
  }
}
