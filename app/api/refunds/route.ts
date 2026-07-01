/** Refund Queue agent action — approve & issue, or decline. The policy path is enforced upstream;
 * the agent confirms the engine's decision, never improvises one (REF-03..05). */

import { NextResponse } from "next/server";
import { approveRefund, declineRefund } from "@/lib/domain/store";

export async function POST(req: Request) {
  const { id, action, approver } = (await req.json()) as {
    id: string;
    action: "approve" | "decline";
    approver?: string;
  };
  const who = approver || "MCI · A. Reyes";
  const refund = action === "approve" ? approveRefund(id, who) : declineRefund(id, who);
  if (!refund) return NextResponse.json({ error: "refund not found" }, { status: 404 });
  return NextResponse.json({ refund });
}
