import { NextRequest, NextResponse } from "next/server";
import { recallMemories } from "@/lib/hindsight/memory";

export const dynamic = "force-dynamic";

/**
 * POST /api/memory/recall
 * Recalls relevant memories for a query from the Northstar persistent memory bank.
 *
 * Request body:
 * { "query": "What is Northstar's target audience?" }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body?.query;

    if (typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { error: "Query must be a non-empty string." },
        { status: 400 }
      );
    }

    const payload = await recallMemories(query.trim());
    return NextResponse.json(payload, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Recall error";
    console.error("[API /api/memory/recall] Error:", message);

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}
