/**
 * Brand representation and foundational guidelines.
 * Will interface with the persistent memory layer in upcoming tasks.
 */

export interface BrandVoiceGuideline {
  trait: string;
  description: string;
  doExample: string;
  dontExample: string;
}

export interface BrandGuardrail {
  id: string;
  rule: string;
  category: "compliance" | "reputation" | "tone" | "terminology";
  severity: "strict" | "guideline";
}

export interface Brand {
  id: string;
  name: string;
  tagline: string;
  industry: string;
  website?: string;
  targetMarket: string;
  currentObjective: string;
  voice: {
    archetype: string;
    toneKeywords: string[];
    guidelines: BrandVoiceGuideline[];
  };
  contentPreferences: {
    primaryFormats: string[];
    preferredPillars: string[];
    dislikedTopics: string[];
    targetReadingLevel: string;
  };
  guardrails: BrandGuardrail[];
  createdAt: string;
  updatedAt: string;
}
