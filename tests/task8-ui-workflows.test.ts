import test from "node:test";
import assert from "node:assert";

import { siteConfig } from "../src/lib/config/site";
import { getAllCampaigns, getCampaignById } from "../src/lib/campaigns";
import {
  teachMemoryRequestSchema,
} from "../src/lib/memory/types";
import {
  strategyResponseSchema,
  strategyRecommendationSchema,
} from "../src/lib/strategist/types";
import { analyzeQuery } from "../src/lib/strategist/retrieval";

test("1. Site navigation contains expected primary product routes in order", () => {
  const routes = siteConfig.navigation;
  assert.strictEqual(routes.length, 5, "Must have exactly 5 primary navigation routes");

  const expectedHrefs = [
    "/dashboard",
    "/campaigns",
    "/audience",
    "/memory",
    "/strategist",
  ];

  for (let i = 0; i < expectedHrefs.length; i++) {
    assert.strictEqual(
      routes[i].href,
      expectedHrefs[i],
      `Route at index ${i} should be ${expectedHrefs[i]}`
    );
  }

  // Ensure no internal development jargon is exposed to users
  for (const route of routes) {
    assert.doesNotMatch(route.title, /task/i, "Route title must not contain 'Task'");
    assert.doesNotMatch(route.title, /hackathon/i, "Route title must not contain 'Hackathon'");
    assert.doesNotMatch(route.title, /dev/i, "Route title must not contain 'Dev'");
  }
});

test("2. Workspace branding and positioning align with Northstar identity", () => {
  assert.strictEqual(siteConfig.name, "MemoryAI");
  assert.strictEqual(siteConfig.defaultWorkspace.organization, "Northstar Brand Co.");
  assert.strictEqual(siteConfig.defaultWorkspace.industry, "Consumer Technology");
  assert.strictEqual(siteConfig.defaultWorkspace.brandName, "Northstar");
});

test("3. Campaign navigation and detail data resolution work correctly", () => {
  const campaigns = getAllCampaigns();
  assert.ok(campaigns.length >= 4, "Should have all standard Northstar campaign records");

  // Valid campaign ID resolves
  const validCampaign = getCampaignById("camp-01");
  assert.ok(validCampaign, "Valid ID 'camp-01' must resolve");
  assert.strictEqual(validCampaign.id, "camp-01");
  assert.ok(validCampaign.name.length > 0);
  assert.ok(validCampaign.performance.raw.impressions > 0);

  // Unknown campaign ID returns undefined without throwing
  const unknownCampaign = getCampaignById("nonexistent-campaign-id");
  assert.strictEqual(
    unknownCampaign,
    undefined,
    "Unknown campaign ID must return undefined gracefully"
  );
});

test("4. Campaign records enforce synthetic data disclosure", () => {
  const campaigns = getAllCampaigns();
  for (const camp of campaigns) {
    assert.strictEqual(camp.performance.isSynthetic, true);
    assert.ok(camp.performance.disclaimer.includes("Synthetic demo performance data"));
  }
});

test("5. Teach Memory schema validates required fields and bounds", () => {
  // Valid payload
  const validPayload = {
    content: "Northstar always avoids patronizing tone when addressing young professionals.",
    category: "AUDIENCE",
    source: "user_taught",
    context: "Tone Guidance for Young Professionals",
  };
  const validResult = teachMemoryRequestSchema.safeParse(validPayload);
  assert.strictEqual(validResult.success, true);

  // Invalid: empty content
  const emptyContentResult = teachMemoryRequestSchema.safeParse({
    content: "",
    category: "AUDIENCE",
    source: "user_taught",
  });
  assert.strictEqual(emptyContentResult.success, false);

  // Invalid: invalid category
  const invalidCategoryResult = teachMemoryRequestSchema.safeParse({
    content: "Valid memory content here.",
    category: "UNKNOWN_CATEGORY",
    source: "user_taught",
  });
  assert.strictEqual(invalidCategoryResult.success, false);

  // Invalid: too short
  const tooShortResult = teachMemoryRequestSchema.safeParse({
    content: "Hi",
    category: "BRAND",
    source: "user_taught",
  });
  assert.strictEqual(tooShortResult.success, false);
});

test("6. Feedback learning flow generates valid memory payloads", () => {
  // Positive feedback remembered
  const posPayload = {
    content: 'Northstar content strategy recommendation for "What should we post next?" was effective: Focus on practical workflow improvements.',
    category: "CONTENT",
    source: "user_feedback",
    context: "Approved Strategy Feedback",
  };
  const posResult = teachMemoryRequestSchema.safeParse(posPayload);
  assert.strictEqual(posResult.success, true);

  // Negative corrective feedback remembered
  const negPayload = {
    content: "Make recommendations more specific to LinkedIn workflow teardowns and avoid generic tips.",
    category: "CONTENT",
    source: "user_feedback",
    context: "Strategic Correction & Feedback",
  };
  const negResult = teachMemoryRequestSchema.safeParse(negPayload);
  assert.strictEqual(negResult.success, true);
});

test("7. Strategy response schema validates structured strategist outputs", () => {
  const validStrategy = {
    summary: "Prioritize clear, step-by-step workflow teardowns on LinkedIn.",
    recommendations: [
      {
        title: "Focus on friction reduction",
        description: "Highlight small, compound habits that eliminate daily distraction.",
      },
      {
        title: "Avoid promotional hype",
        description: "Deliver value first before referencing any product offerings.",
      },
    ],
    reasoning: "Aligns with Northstar's core brand identity and young professional preferences.",
    memoryUsed: ["[BRAND: core-identity]", "[AUDIENCE: young-professionals]"],
    caveats: ["Ensure tone remains humble rather than prescriptive."],
  };

  const parseResult = strategyResponseSchema.safeParse(validStrategy);
  assert.strictEqual(parseResult.success, true);

  // Invalid recommendation without description
  const invalidRec = strategyRecommendationSchema.safeParse({
    title: "Title only",
  });
  assert.strictEqual(invalidRec.success, false);
});

test("8. Query intent categorization accurately maps user workflows", () => {
  // Audience workflow query
  const audienceIntent = analyzeQuery("What should we post for young professionals?");
  assert.strictEqual(audienceIntent.audienceTarget, "young_professionals");
  assert.strictEqual(audienceIntent.isAudienceQuery, true);

  // Campaign workflow query
  const campaignIntent = analyzeQuery("What worked in our previous LinkedIn campaigns?");
  assert.strictEqual(campaignIntent.channel, "linkedin");
  assert.strictEqual(campaignIntent.isCampaignQuery, true);

  // Brand voice workflow query
  const voiceIntent = analyzeQuery("What is Northstar's tone of voice?");
  assert.strictEqual(voiceIntent.isVoiceOrToneQuery, true);
});

test("9. Memory sources adhere strictly to verified provenance labels", () => {
  const allowedUserSources = ["user_taught", "user_feedback"];

  for (const src of allowedUserSources) {
    const payload = {
      content: "Sample content memory test for persistence.",
      category: "BRAND",
      source: src,
      context: "Validation Test",
    };
    const res = teachMemoryRequestSchema.safeParse(payload);
    assert.strictEqual(res.success, true, `Source '${src}' must be accepted`);
  }

  // Reject invalid or fabricated sources
  const fabricatedPayload = {
    content: "Sample content memory test for persistence.",
    category: "BRAND",
    source: "fabricated_external_api",
  };
  const resFab = teachMemoryRequestSchema.safeParse(fabricatedPayload);
  assert.strictEqual(resFab.success, false, "Fabricated source must be rejected");
});
