import { NextRequest, NextResponse } from "next/server";
import { formulateStrategy } from "@/lib/strategist/service";
import { MAX_PROMPT_LENGTH } from "@/lib/ai/types";
import { StrategistApiResponse } from "@/lib/strategist/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/strategist
 * Primary endpoint for formulating brand-grounded content strategy recommendations.
 *
 * Request body:
 * { "query": "What should Northstar post next?" }
 */
export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json<StrategistApiResponse>(
        {
          success: false,
          error: "Invalid JSON request body.",
          code: "STRATEGIST_INVALID_REQUEST",
        },
        { status: 400 }
      );
    }

    const query = body?.query;

    // 1. Validate query
    if (typeof query !== "string" || !query.trim()) {
      return NextResponse.json<StrategistApiResponse>(
        {
          success: false,
          error: "Field 'query' is required and must be a non-empty string.",
          code: "STRATEGIST_INVALID_REQUEST",
        },
        { status: 400 }
      );
    }

    if (query.trim().length > MAX_PROMPT_LENGTH) {
      return NextResponse.json<StrategistApiResponse>(
        {
          success: false,
          error: `Query exceeds maximum allowed length of ${MAX_PROMPT_LENGTH} characters.`,
          code: "STRATEGIST_INVALID_REQUEST",
        },
        { status: 400 }
      );
    }

    // 2. Formulate strategy (Recall -> Ground -> Generate -> Validate)
    const result = await formulateStrategy(query.trim());

    if (!result.success) {
      const statusCode =
        result.code === "MEMORY_SERVICE_UNAVAILABLE" || result.code === "AI_SERVICE_UNAVAILABLE"
          ? 503
          : 500;

      return NextResponse.json<StrategistApiResponse>(
        {
          success: false,
          error: result.error || "Strategy formulation failed.",
          code: result.code || "STRATEGIST_ERROR",
          retrievedMemoryCount: result.retrievedMemoryCount,
          selectedMemoryCount: result.selectedMemoryCount,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json<StrategistApiResponse>(
      {
        success: true,
        strategy: result.strategy,
        query: query.trim(),
        retrievedMemoryCount: result.retrievedMemoryCount,
        selectedMemoryCount: result.selectedMemoryCount,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal strategist error";
    console.error("[API /api/strategist] Unexpected error:", message);

    return NextResponse.json<StrategistApiResponse>(
      {
        success: false,
        error: "Internal server error during strategy formulation.",
        code: "STRATEGIST_INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
