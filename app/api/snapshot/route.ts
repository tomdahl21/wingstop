/** Live read of the GX data spine — polled by the dashboard + queue so the closed loop is visible in real time. */

import { NextResponse } from "next/server";
import {
  dashboardKpis,
  issuesByCategory,
  listRefunds,
  listSentiment,
  listSurveys,
  listTickets,
} from "@/lib/domain/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    kpis: dashboardKpis(),
    issuesByCategory: issuesByCategory(),
    sentiment: listSentiment(),
    tickets: listTickets(),
    refunds: listRefunds(),
    surveys: listSurveys(),
    ts: Date.now(),
  });
}
