import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai/generate";
import { AIServiceError } from "@/lib/ai/errors";

import { MAX_PROMPT_LENGTH } from "@/lib/ai/types";

export const dynamic = "force-dynamic";

const SYSTEM_INSTRUCTION = "You are a concise assistant for Northstar Brand Co.";

/**
 * POST /api/ai/test
 * Development and verification endpoint for the server-side LLM service.
 *
 * Request body:
 * { "prompt": "In one sentence, explain what Northstar is." }
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
          error: "Invalid JSON request body.",
          code: "AI_INVALID_REQUEST",
        },
        { status: 400 }
      );
    }

    const prompt = body?.prompt;

    // 1. Validate prompt
    if (typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Field 'prompt' is required and must be a non-empty string.",
          code: "AI_INVALID_REQUEST",
        },
        { status: 400 }
      );
    }

    if (prompt.trim().length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `Prompt exceeds maximum allowed length of ${MAX_PROMPT_LENGTH} characters.`,
          code: "AI_INVALID_REQUEST",
        },
        { status: 400 }
      );
    }

    // 2. Invoke AI service with deterministic test system prompt
    const result = await generateText({
      system: SYSTEM_INSTRUCTION,
      prompt: prompt.trim(),
      temperature: 0.3,
    });

    return NextResponse.json(
      {
        success: true,
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof AIServiceError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
        },
        { status: error.statusCode }
      );
    }

    const message = error instanceof Error ? error.message : "AI test execution failed";
    console.error("[API /api/ai/test] Unexpected error:", message);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during AI test execution.",
        code: "AI_REQUEST_FAILED",
      },
      { status: 500 }
    );
  }
}
