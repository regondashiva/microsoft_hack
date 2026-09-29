import { NextRequest, NextResponse } from "next/server";
import { recallMemories } from "@/lib/hindsight/memory";

export const dynamic = "force-dynamic";

const MAX_RECALL_QUERY_LENGTH = 1000;

/**
 * POST /api/memory/recall
 * Recalls relevant memories for a query from the Northstar persistent memory bank.
 *
 * Request body:
 * { "query": "What is Northstar's target audience?" }
 */
export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const query = body?.query;

    if (typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { error: "Field 'query' must be a non-empty string." },
        { status: 400 }
      );
    }

    if (query.trim().length > MAX_RECALL_QUERY_LENGTH) {
      return NextResponse.json(
        {
          error: `Query exceeds maximum allowed length of ${MAX_RECALL_QUERY_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    const payload = await recallMemories(query.trim());
    return NextResponse.json(payload, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to recall memories from persistent storage.";

    // If persistent memory is unavailable, return 503 instead of 500
    const statusCode = message.includes("unavailable") || message.includes("not configured") ? 503 : 500;

    return NextResponse.json(
      {
        error: statusCode === 503 ? "Persistent memory is temporarily unavailable." : "Internal error recalling memories.",
      },
      { status: statusCode }
    );
  }
}
