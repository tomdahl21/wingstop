import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Ranchie } from "@/components/Wing";
import { TODAY, FUTURE_STATE, responseMultiple } from "@/lib/demo/baseline";
import { CHANNELS, OWNED_SHARE, RENTED_SHARE, MOVE_META } from "@/lib/demo/channels";

const MOVE_STYLE: Record<string, string> = {
  grow: "bg-hunter text-white",
  convert: "bg-crave text-white",
  deflect: "border border-line-strong text-ink-mid",
  hold: "border border-line-strong text-ink-lo",
};

const CHAPTERS = [
  {
    href: "/order",
    eyebrow: "01 · Communication",
    title: "starts at the order",
    body: "Ranch and the relationship established at the order, tracking that tells the truth, and outreach that reaches the customer before they notice — Wingstop communicating the outcome, not the courier.",
    cta: "Walk the order",
  },
  {
    href: "/ranchie",
    eyebrow: "02 · Customer care",
    title: "owns the fix",
    body: "Because the relationship already exists, care isn't a stranger at the hiccup. A real, policy-enforced assistant that owns the resolution — and never bounces you to DoorDash.",
    cta: "Talk to Ranchie",
  },
  {
    href: "/insights",
    eyebrow: "03 · Customer listening",
    title: "closes the loop",
    body: "Hear every customer across channels — calls deflected, sentiment kept, surveys that return. Own the seam and a higher NPS baseline follows.",
    cta: "See the baseline",
  },
];

export default function Home() {
  return (
    <main>
      {/* hero — lead with the wound */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-[1100px] px-5 py-16">
          <Logo height={38} />
          <div className="mt-6 flex items-center gap-2.5">
            <Ranchie size={34} />
            <span className="font-mono text-[11px] uppercase tracking-[0.34em] text-hunter">
              Digital customer engagement strategy
            </span>
          </div>
          <h1 className="mt-5 font-display text-[clamp(32px,5.4vw,60px)] font-black uppercase leading-[0.95] text-ink">
            Evolve the digital
            <br />
            customer <span className="text-crave">relationship.</span>
          </h1>
          <div className="mt-5 h-1.5 w-20 rounded bg-gold" />
          <p className="mt-5 max-w-2xl text-[17px] text-ink-mid">
            One connected strategy across three moves — communicate before problems surface, own the care when they do,
            and listen across every channel to keep getting better. A real Wingstop order (TD R1) shows the stakes: when
            the moment went wrong, the platform Wingstop pays owned the customer. Here's the engagement strategy that takes
            the relationship back, end to end.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/order" className="rounded-full bg-crave px-5 py-3 font-bold text-white transition-colors hover:bg-crave-hi">
              Start the experience →
            </Link>
            <Link
              href="/insights"
              className="rounded-full border border-line-strong bg-white px-5 py-3 font-bold text-ink transition-colors hover:border-hunter hover:text-hunter"
            >
              Jump to the baseline
            </Link>
          </div>
        </div>
      </section>

      {/* the wound — dark, dense, breaks the rhythm */}
      <section className="bg-gradient-to-b from-hunter-deep to-hunter text-white">
        <div className="mx-auto max-w-[1100px] px-5 py-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">The seam where you leak customers</div>
          <h2 className="mt-2 max-w-3xl font-display text-[clamp(20px,2.8vw,30px)] font-extrabold uppercase leading-[1.02]">
            At the moment loyalty is won or lost, the platform you pay owns the customer
          </h2>
          <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {[
              ["The driver does your recovery", "The DoorDash courier arrived knowing the order was wrong and told the customer to ask for a refund. In his words: “Wingstop can't really do much.”"],
              ["The 1★ hits your store", "A bad third-party delivery becomes a public review on your store's Google listing. You wear a failure the courier caused."],
              ["You pay to be disintermediated", "20–30% commission to the platform that has become the customer's point of contact at the exact moment loyalty is decided."],
            ].map(([t, d], idx) => (
              <div key={t} className="bg-hunter-deep p-5">
                <div className="font-mono text-[10px] text-gold">0{idx + 1}</div>
                <div className="mt-1.5 font-display text-base font-extrabold uppercase leading-tight">{t}</div>
                <p className="mt-2 text-[13px] text-white/75">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* the causal chain — the fix */}
      <section className="bg-bg-tint">
        <div className="mx-auto max-w-[1100px] px-5 py-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-lo">One strategy, three moves</div>
          <h2 className="mt-2 font-display text-[clamp(22px,3vw,32px)] font-extrabold uppercase text-ink">
            Communication → customer care → customer listening
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {CHAPTERS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex flex-col rounded-2xl border border-line bg-white p-6 shadow-[var(--sh1)] transition-shadow hover:shadow-[var(--sh2)]"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-hunter">{c.eyebrow}</div>
                <div className="mt-2 font-display text-2xl font-extrabold uppercase text-ink">{c.title}</div>
                <p className="mt-3 flex-1 text-sm text-ink-mid">{c.body}</p>
                <span className="mt-4 font-bold text-crave group-hover:text-crave-hi">{c.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* quantify the channels → decide where to move people */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1100px] px-5 py-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-lo">Before you move anyone · quantify the channels</div>
          <h2 className="mt-2 max-w-3xl font-display text-[clamp(22px,3vw,32px)] font-extrabold uppercase text-ink">
            Measure every ordering channel, then move people on purpose
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] text-ink-mid">
            Score each channel on two axes — what the customer comes there for, and who owns the relationship and what it
            costs to serve. The decision isn't to force everyone into the app; it's to make the owned channel the better
            answer to what they already wanted, then move them there deliberately.
          </p>

          {/* owned vs rented headline split */}
          <div className="mt-6 flex flex-wrap items-stretch gap-3">
            <div className="flex-1 rounded-xl border border-line bg-bg-tint p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-hunter">Owned relationship</div>
              <div className="mt-1 font-mono text-3xl font-bold tabular-nums text-hunter">{OWNED_SHARE}%</div>
              <div className="text-[12px] text-ink-mid">of orders where Wingstop owns the customer</div>
            </div>
            <div className="flex-1 rounded-xl border border-line bg-bg-tint p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-crave">Rented from a platform</div>
              <div className="mt-1 font-mono text-3xl font-bold tabular-nums text-crave">{RENTED_SHARE}%</div>
              <div className="text-[12px] text-ink-mid">of orders where the marketplace owns the customer</div>
            </div>
          </div>

          {/* channel table */}
          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_minmax(0,1.5fr)_minmax(0,1fr)] gap-4 border-b border-line-strong pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-lo">
                <span>Channel</span>
                <span>Share · cost</span>
                <span>What they want</span>
                <span>The move</span>
              </div>
              {CHANNELS.map((c) => (
                <div
                  key={c.id}
                  className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_minmax(0,1.5fr)_minmax(0,1fr)] items-center gap-4 border-b border-line py-3.5"
                >
                  <div>
                    <div className="font-display text-sm font-extrabold uppercase text-ink">{c.label}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-lo">
                      {c.kind} · {c.owner === "wingstop" ? "owned" : "rented"}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold tabular-nums text-ink">{c.share}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full max-w-[80px] overflow-hidden rounded bg-line">
                      <div
                        className={c.owner === "wingstop" ? "h-full rounded bg-hunter" : "h-full rounded bg-crave"}
                        style={{ width: `${(c.share / 38) * 100}%` }}
                      />
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-ink-lo">{c.cost}</div>
                  </div>
                  <div className="text-[13px] text-ink-mid">{c.wants}</div>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.06em] ${MOVE_STYLE[c.move]}`}
                    >
                      {MOVE_META[c.move].glyph} {MOVE_META[c.move].label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-[13px] text-ink-mid">
            <span className="font-bold text-ink">Grow and enhance</span> the app,{" "}
            <span className="font-bold text-crave">convert</span> the marketplace order into a direct re-order,{" "}
            <span className="font-bold text-ink">deflect</span> routine phone calls to Ranchie, and{" "}
            <span className="font-bold text-ink">hold</span> the rest while capturing identity — every move earns back a
            relationship the platforms are renting you today.
          </p>
        </div>
      </section>

      {/* grounded in real research — denser editorial teardown */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-[1100px] px-5 py-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-lo">Grounded in a real order · TD R1</div>
          <h2 className="mt-2 font-display text-[clamp(20px,2.6vw,28px)] font-extrabold uppercase text-ink">
            What today actually looks like
          </h2>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {[
              ["Tracking dead-ends in a CAPTCHA", "The in-app DoorDash tracker spun, then demanded a Cloudflare “verify you are human” check — the whole delivery, including after it arrived."],
              ["The driver did the recovery", "He arrived knowing the order was wrong and told the customer to ask for a refund. Wingstop never owned it."],
              ["The brand moment was sold off", "A BetMGM $1,500 gambling ad was injected onto the order-confirmation screen, via Rokt."],
              ["Offers & points fought the customer", "“Applied” and “not valid” at once, a silent price shift, and points that post in 72 hours."],
            ].map(([t, d]) => (
              <li key={t} className="grid grid-cols-[1fr] gap-1 py-3.5 sm:grid-cols-[minmax(0,300px)_1fr] sm:gap-6">
                <span className="font-display text-sm font-extrabold uppercase text-ink">{t}</span>
                <span className="text-[13.5px] text-ink-mid">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* baseline payoff — directional, illustrative */}
      <section className="bg-gradient-to-b from-hunter to-hunter-deep text-white">
        <div className="mx-auto max-w-[1100px] px-5 py-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">The payoff · directional</div>
          <h2 className="mt-2 font-display text-[clamp(22px,3vw,32px)] font-extrabold uppercase">
            Today vs. the baseline you'd earn
          </h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["NPS", `+${TODAY.nps}`, `+${FUTURE_STATE.nps}`],
              ["Call deflection", `${TODAY.deflection}%`, `${FUTURE_STATE.deflection}%`],
              ["Positive sentiment", `${TODAY.sentiment}%`, `${FUTURE_STATE.sentiment}%`],
              ["Survey response", `${TODAY.responseRate}%`, `${responseMultiple(FUTURE_STATE)}× today`],
            ].map(([label, today, future]) => (
              <div key={label} className="rounded-xl border border-white/15 bg-white/[0.06] p-5">
                <div className="text-[11px] uppercase tracking-[0.04em] text-white/60">{label}</div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-sm text-white/45 line-through">{today}</span>
                  <span className="font-mono text-3xl font-bold tabular-nums text-gold">{future}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-2xl font-mono text-[11px] text-white/55">
            Illustrative and directional — anchored to the program's own targets and the TD R1 current-state, to size the
            relative weight of each investment, not to promise a point estimate.
          </p>
          <Link
            href="/insights"
            className="mt-6 inline-block rounded-full bg-white px-5 py-3 font-bold text-hunter transition-colors hover:bg-white/90"
          >
            See what each investment is worth →
          </Link>
        </div>
      </section>

      <footer className="bg-white">
        <div className="mx-auto max-w-[1100px] px-5 py-10 font-mono text-xs text-ink-lo">
          WINGSTOP GX · ART OF THE POSSIBLE · PROTOTYPE · ILLUSTRATIVE FIGURES · CONFIDENTIAL ·{" "}
          <Link href="/dashboard" className="text-hunter underline">
            GX Command Center
          </Link>{" "}
          ·{" "}
          <Link href="/queue" className="text-hunter underline">
            Refund Queue
          </Link>
        </div>
      </footer>
    </main>
  );
}
