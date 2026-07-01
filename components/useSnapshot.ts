"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  Refund,
  SentimentRecord,
  SurveyResponse,
  Ticket,
} from "@/lib/domain/types";
import type { CategoryBar, DashboardKpis } from "@/lib/domain/store";

export interface Snapshot {
  kpis: DashboardKpis;
  issuesByCategory: CategoryBar[];
  sentiment: SentimentRecord[];
  tickets: Ticket[];
  refunds: Refund[];
  surveys: SurveyResponse[];
  ts: number;
}

/** Polls the GX data spine so a resolution made in Lil Ranchie surfaces here within seconds. */
export function useSnapshot(intervalMs = 4000) {
  const [data, setData] = useState<Snapshot | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/snapshot", { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } catch {
      /* ignore transient poll errors */
    }
  }, []);

  useEffect(() => {
    refresh();
    timer.current = setInterval(refresh, intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [refresh, intervalMs]);

  return { data, refresh };
}
