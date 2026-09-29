/**
 * Core product configuration and metadata for MemoryAI.
 */

export interface NavItem {
  title: string;
  href: string;
  description: string;
  iconName: "LayoutDashboard" | "Sparkles" | "Layers" | "Users2" | "BrainCircuit";
}

export const siteConfig = {
  name: "MemoryAI",
  title: "MemoryAI — AI Content Strategist",
  description:
    "AI content strategist that combines brand context, audience understanding, campaign history, and persistent memory to guide content decisions.",
  version: "1.0.0",

  navigation: [
    {
      title: "Overview",
      href: "/dashboard",
      description: "Brand context, recent campaigns, audience summary, and content direction",
      iconName: "LayoutDashboard",
    },
    {
      title: "Campaigns",
      href: "/campaigns",
      description: "Archive and status of past, active, and upcoming campaigns",
      iconName: "Layers",
    },
    {
      title: "Audience",
      href: "/audience",
      description: "Audience segments, content preferences, and focus areas",
      iconName: "Users2",
    },
    {
      title: "Memory",
      href: "/memory",
      description: "Long-term brand memory and persistent knowledge base",
      iconName: "BrainCircuit",
    },
    {
      title: "Strategist",
      href: "/strategist",
      description: "Strategy formulation and content planning workspace",
      iconName: "Sparkles",
    },
  ] as NavItem[],

  defaultWorkspace: {
    id: "ws-northstar-01",
    organization: "Northstar Brand Co.",
    brandName: "Northstar",
    industry: "Consumer Technology",
    targetAudience: "Young professionals and digitally engaged consumers",
    positioning: "Practical technology that helps people work and live more effectively.",
    objective: "Build trust through useful, clear and practical content.",
  },
};
