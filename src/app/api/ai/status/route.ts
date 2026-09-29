import { NextResponse } from "next/server";
import { getAIConfig } from "@/lib/ai/config";
import { AIStatusResponse } from "@/lib/ai/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/ai/status
 * Returns sanitized health and configuration status for the server-side AI service.
 * Never exposes API keys, authorization headers, or sensitive credentials.
 */
export async function GET() {
  try {
    const config = getAIConfig();

    const response: AIStatusResponse = {
      configured: config.configured,
      provider: config.provider,
      model: config.model,
      message: config.configured
        ? `AI service configured with ${config.provider} (${config.model}).`
        : "AI service is unconfigured. Set LLM_API_KEY in the server environment.",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to determine AI service status";
    console.error("[API /api/ai/status] Error:", message);

    return NextResponse.json(
      {
        configured: false,
        provider: "unknown",
        model: "unknown",
        message: "Internal error checking AI status.",
      },
      { status: 500 }
    );
  }
}
