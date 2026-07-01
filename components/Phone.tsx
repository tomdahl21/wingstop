/** Reusable phone frame (the in-app guest surface). */

import { Ranchie } from "./Wing";

export function Phone({
  appBar,
  online = "Ranch is in · here for your order",
  children,
  bodyClass,
}: {
  appBar: string;
  online?: string;
  children: React.ReactNode;
  bodyClass?: string;
}) {
  return (
    <div className="w-[340px] overflow-hidden rounded-[38px] border-[9px] border-[#0E1A12] bg-white shadow-[var(--sh3)]">
      <div className="h-[30px] bg-hunter" />
      <div className="flex items-center gap-2.5 border-b border-line bg-white px-3.5 py-3">
        <Ranchie size={32} />
        <div>
          <div className="font-display text-sm font-bold uppercase tracking-[0.02em] text-ink">{appBar}</div>
          <div className="font-mono text-[10px] text-pos">● {online}</div>
        </div>
      </div>
      <div className={`flex h-[520px] flex-col gap-2.5 overflow-y-auto bg-[#FAFBFA] p-3.5 ${bodyClass ?? ""}`}>
        {children}
      </div>
    </div>
  );
}
