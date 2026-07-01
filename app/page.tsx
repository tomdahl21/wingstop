import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Ranchie } from "@/components/Wing";
import { TODAY, FUTURE_STATE, responseMultiple } from "@/lib/demo/baseline";

const CHAPTERS = [
  {
    href: "/order",
    eyebrow: "01 · The experience",
    title: "could look like this",
    body: "Ranch established at the order, tracking that tells the truth, and recovery that happens before the guest notices — Wingstop owning the outcome, not the courier.",
    cta: "Walk the order",
  },
  {
    href: "/ranchie",
    eyebrow: "02 · …which means Ranchie",
    title: "could look like that",
    body: "Because the relationship already exists, support isn't a stranger at the hiccup. A real, policy-enforced assistant that owns the fix — and never bounces you to DoorDash.",
    cta: "Talk to Ranchie",
  },
  {
    href: "/insights",
    eyebrow: "03 · …which means your baseline",
    title: "could look like this",
    body: "Own the seam and the numbers follow — calls deflected, sentiment kept, a higher NPS baseline. See roughly what each investment is worth.",
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
              Art of the customer-experience possible
            </span>
          </div>
          <h1 className="mt-5 font-display text-[clamp(32px,5.4vw,60px)] font-black uppercase leading-[0.95] text-ink">
            DoorDash is doing
            <br />
            your <span className="text-crave">recovery.</span> Take it back.
          </h1>
          <div className="mt-5 h-1.5 w-20 rounded bg-gold" />
          <p className="mt-5 max-w-2xl text-[17px] text-ink-mid">
            A real Wingstop order went wrong. The DoorDash driver — not Wingstop — told the guest to ask for a refund. The
            1★ lands on your store. You paid the commission and still lost the guest. Here's the fix, end to end: own the
            moment that matters, and a better support experience and a better insights baseline follow.
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
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">The seam where you leak guests</div>
          <h2 className="mt-2 max-w-3xl font-display text-[clamp(20px,2.8vw,30px)] font-extrabold uppercase leading-[1.02]">
            At the moment loyalty is won or lost, the platform you pay owns the guest
          </h2>
          <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {[
              ["The driver does your recovery", "The DoorDash courier arrived knowing the order was wrong and told the guest to ask for a refund. In his words: “Wingstop can't really do much.”"],
              ["The 1★ hits your store", "A bad third-party delivery becomes a public review on your store's Google listing. You wear a failure the courier caused."],
              ["You pay to be disintermediated", "20–30% commission to the platform that has become the guest's point of contact at the exact moment loyalty is decided."],
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
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-lo">The fix, as one chain</div>
          <h2 className="mt-2 font-display text-[clamp(22px,3vw,32px)] font-extrabold uppercase text-ink">
            Own the moment → own the outcome → own the baseline
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

      {/* grounded in real research — denser editorial teardown */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1100px] px-5 py-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-lo">Grounded in a real order · TD R1</div>
          <h2 className="mt-2 font-display text-[clamp(20px,2.6vw,28px)] font-extrabold uppercase text-ink">
            What today actually looks like
          </h2>
          <ul className="mt-5 divide-y divide-line border-y border-line">
            {[
              ["Tracking dead-ends in a CAPTCHA", "The in-app DoorDash tracker spun, then demanded a Cloudflare “verify you are human” check — the whole delivery, including after it arrived."],
              ["The driver did the recovery", "He arrived knowing the order was wrong and told the guest to ask for a refund. Wingstop never owned it."],
              ["The brand moment was sold off", "A BetMGM $1,500 gambling ad was injected onto the order-confirmation screen, via Rokt."],
              ["Offers & points fought the guest", "“Applied” and “not valid” at once, a silent price shift, and points that post in 72 hours."],
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
