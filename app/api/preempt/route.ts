/** Trigger a live pre-emptive recovery from the order experience — the forward loop,
 * landing in the dashboards within seconds. */

import { NextResponse } from "next/server";
import { recordPreemptiveRecovery } from "@/lib/domain/store";

export async function POST(req: Request) {
  let loyaltyId = "WR-100145";
  try {
    const body = (await req.json()) as { loyaltyId?: string };
    if (body?.loyaltyId) loyaltyId = body.loyaltyId;
  } catch {
    /* default guest */
  }
  const { ticket, refund } = recordPreemptiveRecovery(loyaltyId);
  return NextResponse.json({ ticket, refund });
}
