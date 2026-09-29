import { NextResponse } from "next/server";
import { initializeMemoryBank } from "@/lib/hindsight/memory";

export const dynamic = "force-dynamic";

/**
 * POST /api/memory/initialize
 * Idempotently initializes the Northstar memory bank and populates baseline seed memories.
 * Safe to call repeatedly; avoids duplicate memory entries if already seeded.
 */
export async function POST() {
  try {
    const result = await initializeMemoryBank();
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Initialization failed";
    console.error("[API /api/memory/initialize] Error:", message);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
