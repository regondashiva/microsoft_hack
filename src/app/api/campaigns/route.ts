import { NextRequest, NextResponse } from "next/server";
import {
  getAllCampaigns,
  getCampaignsByChannel,
  SYNTHETIC_DATA_DISCLAIMER,
} from "@/lib/campaigns";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelParam = searchParams.get("channel");
    const statusParam = searchParams.get("status");

    let campaigns = getAllCampaigns();

    if (channelParam && channelParam !== "all") {
      if (channelParam === "linkedin" || channelParam === "instagram") {
        campaigns = getCampaignsByChannel(channelParam);
      }
    }

    if (statusParam && statusParam !== "all") {
      campaigns = campaigns.filter((c) => c.status === statusParam);
    }

    return NextResponse.json({
      success: true,
      campaigns,
      count: campaigns.length,
      isSynthetic: true,
      disclaimer: SYNTHETIC_DATA_DISCLAIMER,
    });
  } catch (error) {
    console.error("[API /api/campaigns] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve campaign data.",
        isSynthetic: true,
      },
      { status: 500 }
    );
  }
}
