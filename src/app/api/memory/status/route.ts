import { NextResponse } from "next/server";
import { getMemoryStatus } from "@/lib/hindsight/memory";

export const dynamic = "force-dynamic";

/**
 * GET /api/memory/status
 * Returns safe connection status and memory bank metadata.
 * Never exposes secrets or internal authentication headers.
 */
export async function GET() {
  try {
    const status = await getMemoryStatus();
    return NextResponse.json(status, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal status check failure";
    console.error("[API /api/memory/status] Error:", message);

    return NextResponse.json(
      {
        connected: false,
        status: "error",
        bankId: "northstar-content-strategist",
        bankName: "Northstar Content Strategist",
        message: "Unable to verify persistent memory status.",
      },
      { status: 500 }
    );
  }
}
