"use client";

import Link from "next/link";

/**
 * The causal spine, always visible: the customer experience could look like THIS →
 * which means chat could look like THAT → which means this is your insights baseline.
 */

const STEPS = [
  { href: "/order", key: "experience", label: "The experience", sub: "could look like this" },
  { href: "/ranchie", key: "chat", label: "…so Ranchie", sub: "could look like that" },
  { href: "/insights", key: "insights", label: "…so your baseline", sub: "could look like this" },
] as const;

export function ChainRail({ active }: { active: "experience" | "chat" | "insights" }) {
  return (
    <div className="border-b border-line bg-bg-warm">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-stretch gap-2 px-5 py-3">
        {STEPS.map((s, i) => {
          const isActive = s.key === active;
          return (
            <div key={s.key} className="flex items-stretch gap-2">
              <Link
                href={s.href}
                className={`flex flex-col rounded-lg border px-3.5 py-2 transition-colors ${
                  isActive
                    ? "border-hunter bg-hunter text-white"
                    : "border-line bg-white text-ink-mid hover:border-hunter hover:text-hunter"
                }`}
              >
                <span className="font-display text-[13px] font-extrabold uppercase">{s.label}</span>
                <span className={`text-[11px] ${isActive ? "text-white/75" : "text-ink-lo"}`}>{s.sub}</span>
              </Link>
              {i < STEPS.length - 1 && (
                <span className="self-center font-display text-lg font-black text-crave">→</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
