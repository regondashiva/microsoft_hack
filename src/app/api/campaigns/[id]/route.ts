import { NextRequest, NextResponse } from "next/server";
import { getCampaignById, SYNTHETIC_DATA_DISCLAIMER } from "@/lib/campaigns";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const campaign = getCampaignById(id);

    if (!campaign) {
      return NextResponse.json(
        {
          success: false,
          error: `Campaign with ID '${id}' not found.`,
          isSynthetic: true,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      campaign,
      isSynthetic: true,
      disclaimer: SYNTHETIC_DATA_DISCLAIMER,
    });
  } catch (error) {
    console.error("[API /api/campaigns/[id]] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve campaign details.",
        isSynthetic: true,
      },
      { status: 500 }
    );
  }
}
