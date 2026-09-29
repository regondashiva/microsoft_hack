import test from "node:test";
import assert from "node:assert";

import {
  calculateCTR,
  calculateConversionRate,
  calculateEngagementRate,
  deriveCampaignMetrics,
  getAllCampaigns,
  getCampaignById,
  getCampaignsByChannel,
  calculateCampaignInsights,
  selectRelevantCampaignContext,
} from "../src/lib/campaigns";
import { analyzeQuery } from "../src/lib/strategist/retrieval";
import { buildStrategistSystemPrompt, buildStrategistUserPrompt } from "../src/lib/strategist/prompt";
import { NORTHSTAR_SEED_MEMORIES } from "../src/lib/hindsight/seed-data";
import { teachMemoryRequestSchema } from "../src/lib/memory/types";

test("1. Campaign data loads successfully", () => {
  const campaigns = getAllCampaigns();
  assert.ok(Array.isArray(campaigns), "Campaigns should be an array");
  assert.strictEqual(campaigns.length, 4, "Should load all 4 Northstar campaigns");
});

test("2. Campaign IDs are unique", () => {
  const campaigns = getAllCampaigns();
  const ids = campaigns.map((c) => c.id);
  const uniqueIds = new Set(ids);
  assert.strictEqual(uniqueIds.size, ids.length, "All campaign IDs must be unique");
});

test("3. Required campaign fields exist across all records", () => {
  const campaigns = getAllCampaigns();
  for (const c of campaigns) {
    assert.ok(c.id, "Campaign must have an id");
    assert.ok(c.name, "Campaign must have a name");
    assert.ok(c.channel === "linkedin" || c.channel === "instagram", "Channel must be linkedin or instagram");
    assert.ok(c.status, "Campaign must have a status");
    assert.ok(c.dateRange?.label, "Campaign must have a dateRange label");
    assert.ok(c.objective, "Campaign must have an objective");
    assert.ok(c.audience, "Campaign must have target audience");
    assert.ok(c.contentTheme, "Campaign must have a content theme");
    assert.ok(c.format, "Campaign must have a format");
    assert.ok(c.summary, "Campaign must have a summary");
    assert.ok(c.performance, "Campaign must have performance data");
    assert.ok(c.keyTakeaway, "Campaign must have a keyTakeaway");
  }
});

test("4. Metrics calculate correctly with deterministic formulas", () => {
  // engagementRate = (engagements / reach) * 100
  const engRate = calculateEngagementRate(680, 14200);
  assert.strictEqual(engRate, 4.79);

  // CTR = (clicks / impressions) * 100
  const ctr = calculateCTR(420, 18500);
  assert.strictEqual(ctr, 2.27);

  // conversionRate = (conversions / clicks) * 100
  const convRate = calculateConversionRate(48, 420);
  assert.strictEqual(convRate, 11.43);

  // Full derivation helper
  const derived = deriveCampaignMetrics({
    impressions: 10000,
    reach: 5000,
    engagements: 250,
    clicks: 150,
    conversions: 15,
  });
  assert.strictEqual(derived.engagementRate, 5.0);
  assert.strictEqual(derived.clickThroughRate, 1.5);
  assert.strictEqual(derived.conversionRate, 10.0);
});

test("5. Division by zero is handled safely in metric calculations", () => {
  // Reach is 0
  assert.strictEqual(calculateEngagementRate(100, 0), 0);
  assert.strictEqual(calculateEngagementRate(100, -10), 0);

  // Impressions is 0
  assert.strictEqual(calculateCTR(50, 0), 0);
  assert.strictEqual(calculateCTR(50, -5), 0);

  // Clicks is 0
  assert.strictEqual(calculateConversionRate(10, 0), 0);
  assert.strictEqual(calculateConversionRate(undefined, 100), undefined);
});

test("6. Synthetic data labels and disclaimers are preserved", () => {
  const campaigns = getAllCampaigns();
  for (const c of campaigns) {
    assert.strictEqual(c.performance.isSynthetic, true, "isSynthetic flag must be true");
    assert.ok(
      c.performance.disclaimer.includes("Synthetic demo performance data"),
      "Must include standard synthetic disclaimer"
    );
  }

  const insights = calculateCampaignInsights(campaigns);
  for (const ins of insights) {
    assert.strictEqual(ins.isSynthetic, true, "Insight must have isSynthetic: true");
    assert.ok(
      ins.observation.includes("sample") || ins.observation.includes("demo") || ins.observation.includes("demonstration"),
      "Insight observation must clearly frame itself as demo/sample findings"
    );
  }
});

test("7. LinkedIn filtering works as expected", () => {
  const linkedinCampaigns = getCampaignsByChannel("linkedin");
  assert.strictEqual(linkedinCampaigns.length, 2);
  for (const c of linkedinCampaigns) {
    assert.strictEqual(c.channel, "linkedin");
  }
  const names = linkedinCampaigns.map((c) => c.name);
  assert.ok(names.includes("Productivity Without the Noise"));
  assert.ok(names.includes("The Practical Tech Guide"));
});

test("8. Instagram filtering works as expected", () => {
  const instagramCampaigns = getCampaignsByChannel("instagram");
  assert.strictEqual(instagramCampaigns.length, 2);
  for (const c of instagramCampaigns) {
    assert.strictEqual(c.channel, "instagram");
  }
  const names = instagramCampaigns.map((c) => c.name);
  assert.ok(names.includes("Work Smarter, Not Louder"));
  assert.ok(names.includes("Behind the Workflow"));
});

test("9. Relevant campaigns are selected query-aware for channel and campaign queries", () => {
  // Query 1: LinkedIn specific
  const liIntent = analyzeQuery("What worked in our previous LinkedIn campaigns?");
  const liResult = selectRelevantCampaignContext("What worked in our previous LinkedIn campaigns?", liIntent);
  assert.strictEqual(liResult.hasContext, true);
  assert.strictEqual(liResult.selectedCampaigns.length, 2);
  for (const c of liResult.selectedCampaigns) {
    assert.strictEqual(c.channel, "linkedin");
  }
  assert.ok(liResult.formattedContext.includes("<campaign_performance>"));
  assert.ok(liResult.formattedContext.includes("Productivity Without the Noise"));
  assert.ok(liResult.formattedContext.includes("The Practical Tech Guide"));

  // Query 2: Instagram specific
  const igIntent = analyzeQuery("What worked in our Instagram campaigns?");
  const igResult = selectRelevantCampaignContext("What worked in our Instagram campaigns?", igIntent);
  assert.strictEqual(igResult.hasContext, true);
  assert.strictEqual(igResult.selectedCampaigns.length, 2);
  for (const c of igResult.selectedCampaigns) {
    assert.strictEqual(c.channel, "instagram");
  }
  assert.ok(igResult.formattedContext.includes("Work Smarter, Not Louder"));
  assert.ok(igResult.formattedContext.includes("Behind the Workflow"));

  // Query 3: Multi-channel / What should we test next
  const testIntent = analyzeQuery("What should we test next based on previous campaigns?");
  const testResult = selectRelevantCampaignContext("What should we test next based on previous campaigns?", testIntent);
  assert.strictEqual(testResult.hasContext, true);
  assert.ok(testResult.selectedCampaigns.length >= 2);
});

test("10. Irrelevant campaign data is excluded for tone and financial queries", () => {
  // Query 4: Pure tone query with no campaign mention
  const toneIntent = analyzeQuery("What tone should Northstar use?");
  const toneResult = selectRelevantCampaignContext("What tone should Northstar use?", toneIntent);
  assert.strictEqual(toneResult.hasContext, false, "Tone query must NOT inject campaign performance data");
  assert.strictEqual(toneResult.selectedCampaigns.length, 0);

  // Query 5: Financial query
  const revIntent = analyzeQuery("Give me a 2027 revenue forecast.");
  const revResult = selectRelevantCampaignContext("Give me a 2027 revenue forecast.", revIntent);
  assert.strictEqual(revResult.hasContext, false, "Financial/revenue query must NOT inject campaign performance data");
  assert.strictEqual(revResult.selectedCampaigns.length, 0);
});

test("11. Historical campaign records remain intact with Northstar brand context", () => {
  const p1 = getCampaignById("camp-01");
  const p2 = getCampaignById("camp-02");
  const p3 = getCampaignById("camp-03");
  const p4 = getCampaignById("camp-04");

  assert.ok(p1 && p1.name === "Productivity Without the Noise");
  assert.ok(p2 && p2.name === "Work Smarter, Not Louder");
  assert.ok(p3 && p3.name === "The Practical Tech Guide");
  assert.ok(p4 && p4.name === "Behind the Workflow");

  // Check matching seed memories in Hindsight
  const seedCampaignMemories = NORTHSTAR_SEED_MEMORIES.filter(
    (m) => m.category === "campaign_history"
  );
  assert.strictEqual(seedCampaignMemories.length, 4);
});

test("12. Task 5 retrieval architecture remains intact", () => {
  const intent = analyzeQuery("What are our content themes for young professionals?");
  assert.strictEqual(intent.audienceTarget, "young_professionals");
  assert.strictEqual(intent.isContentIdeaQuery, true);
  assert.ok(intent.targetCategories.includes("CONTENT"));
  assert.ok(intent.targetCategories.includes("AUDIENCE"));
});

test("13. Task 6 taught memories validation remains intact", () => {
  const payload = {
    content: "Northstar prefers actionable workflow teardowns over theoretical discussions.",
    category: "CONTENT",
    source: "user_taught",
    context: "Content Strategy Preferences",
  };
  const result = teachMemoryRequestSchema.safeParse(payload);
  assert.strictEqual(result.success, true);
});

test("14. Strategist prompt enforces synthetic boundaries and rejects real business claims", () => {
  const sysPrompt = buildStrategistSystemPrompt();

  // Guardrails verification
  assert.ok(sysPrompt.includes("SYNTHETIC DEMONSTRATION PERFORMANCE DATA"));
  assert.ok(sysPrompt.includes("NEVER convert synthetic demonstration metrics into absolute claims of actual Northstar business performance"));
  assert.ok(sysPrompt.includes("Do NOT invent facts about Northstar, its products, customers, roadmap, financials, or revenue"));
  assert.ok(sysPrompt.includes("Do NOT fabricate engagement rates"));

  // Check user prompt assembly with and without campaign context
  const mockMem = "<northstar_memory>\n[Brand Voice]\nClear, confident.\n</northstar_memory>";
  const promptWithoutCamp = buildStrategistUserPrompt("What tone should we use?", mockMem);
  assert.strictEqual(promptWithoutCamp.includes("<campaign_performance>"), false);

  const promptWithCamp = buildStrategistUserPrompt(
    "What worked in previous campaigns?",
    mockMem,
    "<campaign_performance>\n<campaign>Productivity Without the Noise</campaign>\n</campaign_performance>"
  );
  assert.strictEqual(promptWithCamp.includes("<campaign_performance>"), true);
  assert.strictEqual(promptWithCamp.includes("Productivity Without the Noise"), true);
});
