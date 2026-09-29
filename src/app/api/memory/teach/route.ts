import { NextRequest, NextResponse } from "next/server";
import { teachMemory } from "@/lib/memory/teach";

export const dynamic = "force-dynamic";

/**
 * POST /api/memory/teach
 * Dedicated endpoint for explicitly teaching Northstar a persistent strategic preference.
 *
 * Payload:
 * {
 *   "content": "Northstar's LinkedIn audience prefers concrete workflow examples over generic productivity advice.",
 *   "category": "CONTENT",
 *   "context": "LinkedIn Strategy",
 *   "source": "user_taught"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request payload.",
          code: "INVALID_REQUEST_PAYLOAD",
        },
        { status: 400 }
      );
    }

    const result = await teachMemory(body);

    if (!result.success) {
      let statusCode = 400;
      if (result.code === "MEMORY_SERVICE_UNAVAILABLE") {
        statusCode = 503;
      } else if (result.code === "HINDSIGHT_RETAIN_FAILED") {
        statusCode = 500;
      }

      return NextResponse.json(
        {
          success: false,
          error: result.error || result.message,
          code: result.code || "TEACH_FAILED",
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        action: result.action,
        memory: result.memory,
        warning: result.warning,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal teach memory error";
    console.error("[API /api/memory/teach] Unexpected error:", message);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error while processing strategic memory.",
        code: "INTERNAL_TEACH_ERROR",
      },
      { status: 500 }
    );
  }
}
