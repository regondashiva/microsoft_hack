import { SeedMemoryItem } from "./types";

/**
 * Authentic brand context memories for Northstar Brand Co.
 * Used exclusively for initial idempotent seeding of the Hindsight memory bank.
 *
 * NOTE: These are seed memories representing established brand and campaign context.
 * They do not contain fabricated user engagement metrics or clinical/health data.
 */
export const NORTHSTAR_SEED_MEMORIES: SeedMemoryItem[] = [
  // MEMORY 1 — BRAND IDENTITY
  {
    id: "seed-brand-identity",
    category: "brand_identity",
    content: "Northstar is a consumer technology brand focused on practical technology for focused work and living.",
    context: "Brand Identity and Core Mission",
  },
  // MEMORY 2 — TARGET AUDIENCE
  {
    id: "seed-target-audience",
    category: "target_audience",
    content: "Northstar's primary audience consists of young professionals and digitally engaged consumers.",
    context: "Audience Strategy",
  },
  // MEMORY 3 — BRAND POSITIONING
  {
    id: "seed-brand-positioning",
    category: "brand_positioning",
    content: "Northstar positions its products around practical technology that helps people work and live more effectively.",
    context: "Market Positioning",
  },
  // MEMORY 4 — BRAND VOICE
  {
    id: "seed-brand-voice",
    category: "brand_voice",
    content: "Northstar's preferred communication style is clear, confident, approachable and evidence-aware.",
    context: "Brand Voice Guidelines",
  },
  // MEMORY 5 — CONTENT PREFERENCE
  {
    id: "seed-content-preference",
    category: "content_preference",
    content: "Northstar prefers practical, educational and concise content rather than overly promotional messaging.",
    context: "Content Strategy Principles",
  },
  // MEMORY 6 — CONTENT THEMES
  {
    id: "seed-content-themes",
    category: "content_themes",
    content: "Northstar's primary content themes include practical education, product use cases, industry insights and customer stories.",
    context: "Editorial Pillars",
  },
  // MEMORY 7 — AUDIENCE SEGMENT
  {
    id: "seed-audience-segment",
    category: "audience_segment",
    content: "Northstar's young professional audience is approximately 22–34 years old and is interested in productivity, technology and career growth.",
    context: "Demographics and Interests",
  },
  // MEMORY 8 — SECONDARY AUDIENCE
  {
    id: "seed-secondary-audience",
    category: "secondary_audience",
    content: "Northstar's secondary audience includes small business owners interested in automation, business software and growth.",
    context: "Audience Expansion",
  },
  // MEMORY 9 — CAMPAIGN: Productivity Without the Noise
  {
    id: "seed-campaign-productivity",
    category: "campaign_history",
    content: "Northstar ran a LinkedIn campaign called Productivity Without the Noise focused on practical productivity workflows and reducing digital distractions.",
    context: "Campaign History (LinkedIn)",
  },
  // MEMORY 10 — CAMPAIGN: Work Smarter, Not Louder
  {
    id: "seed-campaign-work-smarter",
    category: "campaign_history",
    content: "Northstar has an Instagram campaign called Work Smarter, Not Louder focused on practical ways professionals can improve everyday workflows.",
    context: "Campaign History (Instagram)",
  },
  // MEMORY 11 — CAMPAIGN: The Practical Tech Guide
  {
    id: "seed-campaign-tech-guide",
    category: "campaign_history",
    content: "Northstar has a LinkedIn campaign called The Practical Tech Guide focused on actionable breakdowns of everyday software workflows, tools and productivity practices.",
    context: "Campaign History (LinkedIn)",
  },
  // MEMORY 12 — CAMPAIGN: Behind the Workflow
  {
    id: "seed-campaign-behind-workflow",
    category: "campaign_history",
    content: "Northstar has an Instagram campaign called Behind the Workflow focused on practical technology and everyday user efficiency workflows.",
    context: "Campaign History (Instagram)",
  },
];
