import { NextResponse } from "next/server";
import {
  calculateCampaignInsights,
  getAllCampaigns,
  SYNTHETIC_DATA_DISCLAIMER,
} from "@/lib/campaigns";

export async function GET() {
  try {
    const campaigns = getAllCampaigns();
    const insights = calculateCampaignInsights(campaigns);

    return NextResponse.json({
      success: true,
      insights,
      count: insights.length,
      isSynthetic: true,
      disclaimer: SYNTHETIC_DATA_DISCLAIMER,
    });
  } catch (error) {
    console.error("[API /api/campaigns/insights] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate campaign insights.",
        isSynthetic: true,
      },
      { status: 500 }
    );
  }
}
