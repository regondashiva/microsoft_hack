import test from "node:test";
import assert from "node:assert";

import { buildStrategyExplanation } from "../src/lib/strategist/explainability/build-explanation";
import {
  strategyExplanationSchema,
  memoryEvidenceItemSchema,
  campaignEvidenceItemSchema,
} from "../src/lib/strategist/explainability/types";
import { SelectedMemory, strategyResponseSchema } from "../src/lib/strategist/types";
import { getAllCampaigns, getCampaignById } from "../src/lib/campaigns";
import { analyzeQuery } from "../src/lib/strategist/retrieval";

// Mock memories representing different authentic provenances
const mockMemories: SelectedMemory[] = [
  {
    id: "mem-01",
    text: "Northstar's brand voice is clear, confident, approachable, and evidence-aware.",
    category: "BRAND",
    citationLabel: "[BRAND: core-voice]",
    source: "seeded",
    memoryCategory: "BRAND",
    priority: 10,
    selectionReason: "Direct voice query match",
    context: "Brand Identity",
  },
  {
    id: "mem-02",
    text: "Northstar's LinkedIn audience prefers concrete workflow examples over generic productivity advice.",
    category: "AUDIENCE",
    citationLabel: "[AUDIENCE: young-professionals-workflow]",
    source: "user_taught",
    memoryCategory: "AUDIENCE",
    priority: 9,
    selectionReason: "Taught user preference match",
    context: "LinkedIn Audience Preferences",
  },
  {
    id: "mem-03",
    text: "Feedback indicated workflow teardowns with numbered steps drove superior engagement.",
    category: "CONTENT",
    citationLabel: "[CONTENT: feedback-numbered-steps]",
    source: "user_feedback",
    memoryCategory: "CONTENT",
    priority: 8,
    selectionReason: "User feedback approval",
    context: "Approved Strategy Feedback",
  },
];

const mockRecommendations = [
  {
    title: "Publish 5-Step Workflow Teardowns",
    description: "Break down daily task batching routines into numbered checklists on LinkedIn.",
  },
  {
    title: "Highlight Practical Utility Over Abstract Hype",
    description: "Emphasize concrete friction reduction rather than visionary marketing claims.",
  },
];

test("1. Explanation is generated from selected memory evidence", () => {
  const explanation = buildStrategyExplanation({
    query: "What should we post on LinkedIn?",
    summary: "Prioritize structured workflow teardowns.",
    recommendations: mockRecommendations,
    reasoning: "Aligns with user-taught preference for actionable workflows.",
    memoryUsed: ["[BRAND: core-voice]", "[AUDIENCE: young-professionals-workflow]"],
    selectedMemories: mockMemories,
    selectedCampaigns: [],
  });

  const parsed = strategyExplanationSchema.safeParse(explanation);
  assert.strictEqual(parsed.success, true, "Generated explanation must satisfy schema");
  assert.strictEqual(explanation.memoryEvidence.length, 3);
  assert.strictEqual(explanation.memoryEvidence[0].citationLabel, "[BRAND: core-voice]");
  assert.strictEqual(explanation.memoryEvidence[1].citationLabel, "[AUDIENCE: young-professionals-workflow]");
});

test("2. Explanation is generated from selected campaign evidence", () => {
  const campaign = getCampaignById("camp-01");
  assert.ok(campaign, "camp-01 must exist");

  const explanation = buildStrategyExplanation({
    query: "What worked in our previous LinkedIn campaigns?",
    summary: "Leverage carousel formats based on previous results.",
    recommendations: mockRecommendations,
    reasoning: "Previous LinkedIn campaigns demonstrated higher engagement on educational carousels.",
    memoryUsed: ["[BRAND: core-voice]"],
    selectedMemories: [mockMemories[0]],
    selectedCampaigns: [campaign],
  });

  assert.strictEqual(explanation.campaignEvidence.length, 1);
  const campEv = explanation.campaignEvidence[0];
  assert.strictEqual(campEv.id, "camp-01");
  assert.strictEqual(campEv.name, "Productivity Without the Noise");
  assert.strictEqual(campEv.channel, "linkedin");
  assert.strictEqual(campEv.isSynthetic, true);
  assert.ok(campEv.engagementRate > 0);
  assert.ok(campEv.clickThroughRate > 0);
});

test("3. Memory provenance is strictly preserved across all sources", () => {
  const explanation = buildStrategyExplanation({
    query: "What are our guidelines?",
    summary: "Summary test",
    recommendations: mockRecommendations,
    reasoning: "Reasoning test",
    memoryUsed: [],
    selectedMemories: mockMemories,
    selectedCampaigns: [],
  });

  const mem1 = explanation.memoryEvidence.find((m) => m.id === "mem-01");
  const mem2 = explanation.memoryEvidence.find((m) => m.id === "mem-02");
  const mem3 = explanation.memoryEvidence.find((m) => m.id === "mem-03");

  assert.strictEqual(mem1?.source, "seeded");
  assert.strictEqual(mem1?.sourceLabel, "Seeded Brand Knowledge");

  assert.strictEqual(mem2?.source, "user_taught");
  assert.strictEqual(mem2?.sourceLabel, "User Taught");

  assert.strictEqual(mem3?.source, "user_feedback");
  assert.strictEqual(mem3?.sourceLabel, "User Feedback");
});

test("4. Campaign synthetic disclosure is preserved in all evidence items", () => {
  const allCampaigns = getAllCampaigns();
  const explanation = buildStrategyExplanation({
    query: "Campaign review",
    summary: "Summary",
    recommendations: mockRecommendations,
    reasoning: "Reasoning",
    memoryUsed: [],
    selectedMemories: [],
    selectedCampaigns: allCampaigns,
  });

  for (const camp of explanation.campaignEvidence) {
    assert.strictEqual(camp.isSynthetic, true);
    assert.ok(
      camp.disclaimer.includes("Synthetic demo performance data"),
      "Must include synthetic demonstration disclosure"
    );
  }
});

test("5. Evidence counts are accurate and deterministic", () => {
  const allCampaigns = getAllCampaigns();
  const explanation = buildStrategyExplanation({
    query: "Full query",
    summary: "Summary",
    recommendations: mockRecommendations,
    reasoning: "Reasoning",
    memoryUsed: [],
    selectedMemories: mockMemories,
    selectedCampaigns: allCampaigns,
  });

  assert.strictEqual(explanation.evidenceCounts.memories, 3);
  assert.strictEqual(explanation.evidenceCounts.campaigns, 4);
  assert.strictEqual(
    explanation.evidenceCounts.label,
    "3 verified memories · 4 relevant campaigns"
  );
});

test("6. Missing memory evidence is honestly reported without fabrication", () => {
  const campaign = getCampaignById("camp-01")!;
  const explanation = buildStrategyExplanation({
    query: "Campaign only query",
    summary: "Summary",
    recommendations: mockRecommendations,
    reasoning: "Reasoning",
    memoryUsed: [],
    selectedMemories: [],
    selectedCampaigns: [campaign],
  });

  assert.strictEqual(explanation.missingEvidence.hasMissingMemory, true);
  assert.strictEqual(
    explanation.missingEvidence.memoryNote,
    "No directly supporting memory was retrieved for this recommendation."
  );
  assert.strictEqual(explanation.memoryEvidence.length, 0);
  assert.strictEqual(explanation.evidenceCounts.memories, 0);
});

test("7. Missing campaign evidence is honestly reported without fabrication", () => {
  const toneIntent = analyzeQuery("What tone should Northstar use?");
  const explanation = buildStrategyExplanation({
    query: "What tone should Northstar use?",
    summary: "Summary",
    recommendations: mockRecommendations,
    reasoning: "Reasoning",
    memoryUsed: ["[BRAND: core-voice]"],
    selectedMemories: [mockMemories[0]],
    selectedCampaigns: [],
    queryIntent: toneIntent,
  });

  assert.strictEqual(explanation.missingEvidence.hasMissingCampaign, true);
  assert.ok(
    explanation.missingEvidence.campaignNote?.includes("Brand voice and tone queries rely directly"),
    "Tone query must clearly state why campaign metrics were not selected"
  );
  assert.strictEqual(explanation.campaignEvidence.length, 0);
  assert.strictEqual(explanation.evidenceCounts.campaigns, 0);
});

test("8. Complete absence of evidence handles honestly without hallucinated records", () => {
  const explanation = buildStrategyExplanation({
    query: "Unrelated topic",
    summary: "Not enough context",
    recommendations: mockRecommendations,
    reasoning: "Reasoning",
    memoryUsed: [],
    selectedMemories: [],
    selectedCampaigns: [],
  });

  assert.strictEqual(explanation.hasEvidence, false);
  assert.strictEqual(explanation.evidenceCounts.memories, 0);
  assert.strictEqual(explanation.evidenceCounts.campaigns, 0);
  assert.strictEqual(explanation.missingEvidence.hasMissingMemory, true);
  assert.strictEqual(explanation.missingEvidence.hasMissingCampaign, true);
});

test("9. Visual evidence flow contains 4 coherent connected steps", () => {
  const campaign = getCampaignById("camp-01")!;
  const explanation = buildStrategyExplanation({
    query: "Workflow query",
    summary: "Summary",
    recommendations: mockRecommendations,
    reasoning: "Aligns with Northstar's mission to reduce digital friction.",
    memoryUsed: ["[AUDIENCE: young-professionals-workflow]"],
    selectedMemories: [mockMemories[1]],
    selectedCampaigns: [campaign],
  });

  assert.strictEqual(explanation.visualFlow.length, 4);
  assert.strictEqual(explanation.visualFlow[0].step, "memory");
  assert.strictEqual(explanation.visualFlow[1].step, "campaign");
  assert.strictEqual(explanation.visualFlow[2].step, "reasoning");
  assert.strictEqual(explanation.visualFlow[3].step, "recommendation");

  // Badges follow dark SaaS styling without futuristic buzzwords
  assert.strictEqual(explanation.visualFlow[0].badge, "PERSISTENT MEMORY");
  assert.strictEqual(explanation.visualFlow[1].badge, "CAMPAIGN EVIDENCE");
  assert.strictEqual(explanation.visualFlow[2].badge, "STRATEGIC REASONING");
  assert.strictEqual(explanation.visualFlow[3].badge, "ACTIONABLE OUTPUT");
});

test("10. Full strategy response schema validates with optional explanation object", () => {
  const strategyWithExplanation = {
    summary: "Focus on practical workflow teardowns on LinkedIn.",
    recommendations: mockRecommendations,
    reasoning: "Aligns with Northstar's core brand identity.",
    memoryUsed: ["[BRAND: core-voice]"],
    caveats: ["Ensure tone remains humble rather than prescriptive."],
    explanation: buildStrategyExplanation({
      query: "LinkedIn query",
      summary: "Focus on practical workflow teardowns.",
      recommendations: mockRecommendations,
      reasoning: "Aligns with core brand identity.",
      memoryUsed: ["[BRAND: core-voice]"],
      selectedMemories: [mockMemories[0]],
      selectedCampaigns: [],
    }),
  };

  const parsed = strategyResponseSchema.safeParse(strategyWithExplanation);
  assert.strictEqual(parsed.success, true);
  assert.ok(parsed.data.explanation !== undefined);
  assert.strictEqual(parsed.data.explanation?.evidenceCounts.memories, 1);
});
