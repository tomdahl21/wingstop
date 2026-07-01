"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/order", label: "Order Experience" },
  { href: "/ranchie", label: "Lil Ranchie" },
  { href: "/insights", label: "Insights" },
  { href: "/dashboard", label: "Command Center" },
  { href: "/queue", label: "Refund Queue" },
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-hunter-deep bg-hunter text-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo height={26} variant="white" />
          <span className="font-mono text-[10px] tracking-[0.08em] text-white/55">GX</span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                  active ? "bg-white text-hunter font-semibold" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
