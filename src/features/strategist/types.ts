export interface StrategySessionInput {
  brandId: string;
  topicOrFocus: string;
  targetChannels: string[];
  targetAudienceId?: string;
  strategicObjective: string;
  customConstraints?: string[];
}

export interface StrategyRecommendation {
  id: string;
  sessionId: string;
  campaignTitle: string;
  coreNarrative: string;
  channelPlaybooks: {
    channel: string;
    format: string;
    headlineAngle: string;
    pacingNotes: string;
  }[];
  memoryCitations: {
    memoryNodeId: string;
    rationale: string;
  }[];
  confidenceScore: number;
  createdAt: string;
}
