# MemoryAI — AI Content Strategist

> **Current Status: Task 9 — Explainable Memory-Driven Recommendations / WOW Demo (COMPLETE)**  
> *Factual explainability layer, visual evidence flow chain, authentic memory provenance, deterministic campaign evidence, and transparent strategic reasoning.*

---

## 1. Problem Statement

Modern marketing and content teams face severe cognitive friction with existing AI tooling:

1. **Amnesia Across Iterations**: AI tools treat every conversation as a blank slate. Marketing leads repeatedly re-explain brand guidelines, tone restrictions, audience segments, and approved messaging.
2. **Repeating Strategic Mistakes**: Standard AI generators cannot recall why a previous campaign underperformed (e.g., promotional hype causing fatigue) or why an earlier campaign succeeded (e.g., practical workflow breakdowns).
3. **Disconnected Workflows**: Content strategy, audience context, and historical campaign outcomes live in disconnected silos.

---

## 2. Product Concept

**MemoryAI** is an AI-powered content strategy platform engineered specifically for brands and marketing teams.

Rather than acting as a generic prompt-to-text generator, MemoryAI implements an iterative, memory-augmented cognitive loop:

$$\text{Teach} \longrightarrow \text{Remember} \longrightarrow \text{Recall} \longrightarrow \text{Reason} \longrightarrow \text{Recommend} \longrightarrow \text{Learn} \longrightarrow \text{Improve}$$

The platform accumulates and maintains strategic brand context:
- **Brand Context & Guidelines**: Brand positioning, audience focus, tone principles, and content guardrails.
- **Audience Understanding**: Segments, pain points, and format preferences.
- **Campaign History**: Past, active, and upcoming campaign records with documented takeaways.
- **Persistent Memory Layer**: Long-term organizational knowledge powered by Hindsight Cloud.
- **Campaign Intelligence Layer**: Structured campaign records, synthetic demonstration metrics, and deterministic performance observations.
- **AI Content Strategist**: Reasoning engine grounded in persistent brand memory and campaign performance context.

---

## 3. High-Level Architecture (Task 5 & Task 7 Pipeline)

```
                    Browser (Strategist Workspace)
                                │
                                ▼
                       Next.js Route Handlers
                                │
                                ▼
                        Strategist Service
                     (src/lib/strategist/)
                                │
          ┌─────────────────────┼─────────────────────┐
          │ Step 1: RECALL      │ Step 2: CAMPAIGNS   │ Step 3: REASON
          ▼                     ▼                     ▼
   Hindsight Service     Campaign Layer          AI Service
  (src/lib/hindsight)  (src/lib/campaigns)      (src/lib/ai)
          │                     │                     │
          ▼                     ▼                     ▼
   Hindsight Cloud       Query Selection           LLM API
 (Vector + BM25 Recall) (Filter & Disclaimers) (OpenAI / Compatible)
          │                     │                     │
          ▼                     ▼                     ▼
 Persistent Memory Bank   <campaign_performance>  Zod Validation
(northstar-content-...)   (Synthetic Demo Data) (Summary, Recs, Reason)
```

The strategist coordinates **Query-Aware Retrieval and Bounded Reasoning**:
1. **Query Analysis**: Extracts channel (LinkedIn/Instagram), audience targets, topic keywords, and prioritizes target memory categories.
2. **Hindsight Recall**: Queries the persistent Northstar memory bank (`northstar-content-strategist`) via Hindsight Recall.
3. **Relevance Filtering & Deduplication**: Normalizes items, removes duplicates, and filters out contradictory channels/audiences.
4. **Context Categorization**: Maps candidate memories into BRAND, AUDIENCE, CONTENT, CAMPAIGN, STRATEGIC categories.
5. **Context Budgeting**: Enforces strict limit (`MAX_CONTEXT_MEMORIES = 6`), prioritizing memories based on query intent and authentic Hindsight scores.
6. **Query-Aware Campaign Context**: Evaluates whether the query requires campaign performance context (e.g. LinkedIn vs Instagram performance, what worked, what to test next). Formats structured, disclaimed `<campaign_performance>` XML block. Excludes performance metrics from pure tone/voice or financial queries.
7. **Structured Prompt**: Delivers categorized memory XML and synthetic campaign blocks to the LLM with strict anti-hallucination and data honesty rules.
8. **LLM Generation & Schema Validation**: Validates the output against the strict Zod schema; derives citations exclusively from selected memories; ensures synthetic observations are never presented as verified business claims.

---

## 4. Complete Project Roadmap

We are constructing **ONE production-level application incrementally** across distinct roadmap tasks:

| Phase | Milestone | Status | Description |
|---|---|---|---|
| **Task 1** | **Production Foundation & Product Shell** | **COMPLETE** | Production Next.js App Router shell, design tokens, typography, responsive layout, brand & campaign contracts, zero-error CI/CD baseline. |
| **Task 2** | **Hindsight Memory Layer** | **COMPLETE** | Real Hindsight Cloud integration, server-only client, dedicated memory bank, idempotent seeding, secure Recall/Retain API, interactive Memory Explorer UI. |
| **Task 3** | **LLM Service Foundation** | **COMPLETE** | Production-quality server-side LLM abstraction, model-agnostic provider configuration, normalized response interface, timeout & error normalization, `/api/ai/status` & `/api/ai/test` endpoints. |
| **Task 4** | **Core AI Content Strategist Agent** | **COMPLETE** | Brand-grounded strategy formulation engine combining Hindsight memory recall with LLM reasoning, strict Zod output validation, prompt injection defense, and focused workspace UI. |
| **Task 5** | **Hindsight Retrieval & Contextual Reasoning** | **COMPLETE** | Query-aware retrieval, deterministic relevance filtering, deduplication, strategic categorization, and bounded context budgeting. |
| **Task 6** | **Teach → Remember → Recall → Improve Loop** | **COMPLETE** | Controlled persistent learning loop: explicit teaching, secret detection, deduplication, conflict preservation, and future strategy grounding. |
| **Task 7** | **Realistic Campaign & Performance Intelligence** | **COMPLETE** | Structured campaign model, synthetic demo dataset, deterministic metrics, channel filtering, campaign detail view, and query-aware strategist reasoning. |
| **Task 8** | **Production UI & Complete User Workflows** | *Scheduled* | Full interactive strategy canvas, campaign formulation workflows, memory inspection drawer. |
| **Task 9** | **Explainable Memory Recommendations & WOW Demo**| *Scheduled* | Visual memory recall attribution ("Why this was recommended"), before/after learning proof. |
| **Task 10** | **Testing, Security, Deployment & Documentation** | *Scheduled* | Production hardening, security sanitization, automated test suite, Vercel/Azure deployment. |
| **Task 11** | **Hackathon Article, Social Content & Video** | *Scheduled* | Technical write-up, architecture diagrams, demo video walkthrough. |
| **Task 12** | **Final Submission Preparation** | *Scheduled* | Submission review, final verification, repository cleanliness audit. |

---

## 5. Task 4: AI Content Strategist Implementation

### Service Architecture
The strategist logic lives under [`src/lib/strategist/`](file:///c:/Users/shiva/OneDrive/Desktop/microsoft_hack/src/lib/strategist/):
- **[`src/lib/strategist/types.ts`](file:///c:/Users/shiva/OneDrive/Desktop/microsoft_hack/src/lib/strategist/types.ts)**: Strict Zod validation schema (`strategyResponseSchema`) for output structure.
- **[`src/lib/strategist/prompt.ts`](file:///c:/Users/shiva/OneDrive/Desktop/microsoft_hack/src/lib/strategist/prompt.ts)**: Authoritative system instructions with grounding rules, anti-hallucination constraints, and injection boundaries.
- **[`src/lib/strategist/service.ts`](file:///c:/Users/shiva/OneDrive/Desktop/microsoft_hack/src/lib/strategist/service.ts)**: Orchestrator executing the sequential flow: Validate $\rightarrow$ Check Hindsight $\rightarrow$ Recall Memory $\rightarrow$ Build Context $\rightarrow$ LLM Generation $\rightarrow$ Zod Validation.

### Grounding & Anti-Hallucination Guardrails
- **Strict Evidence Grounding**: The LLM must base recommendations on retrieved `<northstar_memory>` records.
- **No Fake Metrics**: The system forbids inventing engagement rates, ROI percentages, follower counts, or unsubstantiated performance claims.
- **Insufficient Context Handling**: If Hindsight returns 0 memories for a query (e.g. revenue forecasts, clinical medical questions), the strategist refuses to fabricate answers and clearly reports that Northstar memory lacks relevant context.
- **Memory Citation Tracking**: Displayed memory tags are derived directly from the verified Hindsight memory units retrieved for that request.

### Prompt Injection Defense
- User input and memory records are enclosed in explicit data delimiters:
  ```
  <northstar_memory>
  ...
  </northstar_memory>

  <user_query>
  ...
  </user_query>
  ```
- The model is instructed to treat all enclosed content as **untrusted data**, not executable instructions.
- System instructions strictly prohibit revealing internal prompts, credentials, or following "ignore previous instructions" directives.

### Structured Response Schema (Zod)
```typescript
interface StrategyResponse {
  summary: string;
  recommendations: Array<{
    title: string;
    description: string;
  }>;
  reasoning: string;
  memoryUsed: string[];
  caveats: string[];
}
```

---

## 6. Strategist API: `POST /api/strategist`

Primary endpoint for formulating brand-grounded content strategy.

```json
// Request
POST /api/strategist
Content-Type: application/json

{
  "query": "What should Northstar post next?"
}

// Success Response (HTTP 200)
{
  "success": true,
  "strategy": {
    "summary": "Northstar should prioritize practical, educational workflow teardowns focusing on everyday software efficiency.",
    "recommendations": [
      {
        "title": "Actionable Workflow Teardowns",
        "description": "Produce step-by-step guides demonstrating how young professionals can eliminate digital distractions and optimize desktop workflows."
      },
      {
        "title": "Behind the Workflow Spotlight",
        "description": "Highlight real user setup habits and focused work routines without promotional hype."
      }
    ],
    "reasoning": "This direction directly leverages Northstar's core positioning around practical utility and respects the brand voice preference for concise, evidence-aware education.",
    "memoryUsed": [
      "Brand Positioning",
      "Content Strategy Principles",
      "Target Audience Strategy"
    ],
    "caveats": [
      "Avoid hyperbolic productivity claims or forced urgency; focus strictly on verifiable utility."
    ]
  },
  "query": "What should Northstar post next?",
  "retrievedMemoryCount": 4
}
```

---

## 7. Task 6: Teach → Remember → Recall → Improve Learning Loop

The learning loop enables users to teach the strategist durable preferences and campaign corrections without blindly storing conversational noise:

$$\text{Teach} \longrightarrow \text{Validate} \longrightarrow \text{Retain} \longrightarrow \text{Recall} \longrightarrow \text{Reason} \longrightarrow \text{Improve}$$

1. **Explicit User Control**: Memories are never saved silently. Users must explicitly click "Teach Northstar" or provide recommendation feedback ("Was this recommendation useful?") and confirm saving.
2. **Preview Before Persistence**: The UI renders a transparent preview of the record before sending to the server.
3. **Server-Side Validation**: `POST /api/memory/teach` enforces strict Zod schemas, bounds content length (5–600 chars), validates strategic categories, and scans for credentials/secrets.
4. **Deduplication & Conflict Detection**: Existing memories are checked before writing to avoid duplicate items. Conflicting preferences are labeled as current strategic guidance while preserving the historical archive.
5. **Persistent Hindsight Grounding**: Taught memories are retained in the `northstar-content-strategist` bank and recalled dynamically by the Task 5 retrieval layer to guide future LLM recommendations.

---

## 8. Task 7: Realistic Campaign & Performance Intelligence

Task 7 introduces a structured campaign and performance intelligence layer designed to enable the strategist to reason about historical campaign outcomes without fabricating business metrics.

### 1. Data Honesty & Synthetic Demonstration Framing
- **Strict Honesty Rule**: All metric numbers (impressions, reach, engagements, clicks, conversions) are **synthetic demo records**. They are never claimed as actual business performance, revenue, or customer growth.
- **Explicit Labeling**: Both the UI and LLM prompt explicitly label the records:
  > *"Synthetic demo performance data — used to demonstrate campaign intelligence, not verified real-world business performance."*
- **Separation of Concerns**: Structured campaign data lives in the dedicated campaign service (`src/lib/campaigns/`). It is **never automatically written into Hindsight** as permanent strategic memory unless explicitly taught by the user.

### 2. Preserved Northstar Campaigns
The synthetic dataset builds around Northstar's 4 authentic historical campaigns:
1. **Productivity Without the Noise** (LinkedIn, Completed): Focuses on digital minimalism and focus. Higher engagement rate (4.79%) and CTR (2.27%) on multi-slide workflow checklists.
2. **Work Smarter, Not Louder** (Instagram, Active): Actionable daily habits. Broad audience reach (26.5k accounts) via short-form video reels with moderate interaction (2.79% ER).
3. **The Practical Tech Guide** (LinkedIn, Completed): Utility software and automation. Highest engagement rate (5.30%) and strongest CTR (2.64%) on step-by-step guides.
4. **Behind the Workflow** (Instagram, Active): Desktop setups and user efficiency walkthroughs. Visual setup carousels drove higher engagement (3.90% ER) than short video reels.

### 3. Deterministic Performance Calculations
Derived metrics are calculated deterministically with safe division-by-zero guards:
- **Engagement Rate**: $\text{ER} = (\text{engagements} / \text{reach}) \times 100$
- **Click-Through Rate**: $\text{CTR} = (\text{clicks} / \text{impressions}) \times 100$
- **Conversion Rate**: $\text{CR} = (\text{conversions} / \text{clicks}) \times 100$

### 4. Query-Aware Campaign Context Retrieval
Campaign performance is injected into the LLM prompt **only when relevant**:
- **LinkedIn Queries** (e.g. *"What worked in our previous LinkedIn campaigns?"*): Retrieves exclusively LinkedIn campaigns.
- **Instagram Queries** (e.g. *"What worked in our Instagram campaigns?"*): Retrieves exclusively Instagram campaigns.
- **Testing & Next-Step Queries** (e.g. *"What should we test next based on previous campaigns?"*): Delivers cross-channel representative campaigns to ground recommendations.
- **Tone & Voice Queries** (e.g. *"What tone should Northstar use?"*): Excludes campaign metrics so verified brand memory remains primary.
- **Financial / Revenue Queries** (e.g. *"Give me a 2027 revenue forecast."*): Excludes campaign data and strictly refuses speculative claims.

### 5. Dedicated API & Detail Experience
- `GET /api/campaigns`: Filter by channel (`linkedin`, `instagram`) and status (`active`, `completed`).
- `GET /api/campaigns/[id]`: Full breakdown of raw metrics, derived metrics, and qualitative signals.
- `GET /api/campaigns/insights`: Deterministic observations comparing channels, themes, and formats.
- `/campaigns`: Clean table overview with status/channel tabs and demo disclosure banner.
- `/campaigns/[id]`: Deep-dive view showing campaign strategy and performance metrics.

---

## 8. Task 8: Production UI & Complete User Workflows

Task 8 delivers product completeness, unifying all intelligence layers into a coherent, production-grade application shell and end-to-end user workflows:

### 1. Unified Navigation Shell & Information Hierarchy
- **Coherent Navigation**: Primary routes follow the natural marketing strategy workflow:
  $$\text{Overview} \longrightarrow \text{Campaigns} \longrightarrow \text{Audience} \longrightarrow \text{Memory} \longrightarrow \text{Strategist}$$
- **Zero Developer Jargon**: Internal task identifiers, hackathon labels, and raw technical metrics are strictly omitted.
- **Active State Clarity**: Navigation links clearly indicate active product sections on desktop and mobile.

### 2. Complete End-to-End User Journeys
1. **Overview (`/dashboard`)**: Factual product introduction, recent campaign performance highlights, target audience context, content direction, and direct workflow action triggers.
2. **Campaigns (`/campaigns` & `/campaigns/[id]`)**: Filter campaigns by status and channel, inspect deterministic metrics (impressions, reach, engagement rate, CTR, conversion rate), review qualitative signals, and launch query-grounded strategies directly into the Strategist workspace.
3. **Audience (`/audience`)**: Clear tier designation between Primary Audience (Young Professionals, 22–34) and Secondary Audience (Small Business Owners, 28–48), detailing content preferences and strategic relevance for AI prompt construction.
4. **Memory (`/memory`)**: Inspect persistent knowledge records with authentic provenance badges (`Source: User Taught`, `Source: User Feedback`, `Source: Campaign History`, `Source: Seeded Brand Knowledge`).
5. **Strategist (`/strategist`)**: Strategic workspace featuring a calm starter empty state with 4 quick question cards, calm loading indicators, error recovery actions (`Try Again`), and separated campaign context with synthetic demonstration disclaimers.
6. **Teach & Feedback Learning Loops**: Explicit modal preview and confirmation before writing to Hindsight memory; prevents double submission and provides full user control.

### 3. Responsive Design & Accessibility (a11y)
- **Fluid Layout**: Validated across Desktop (1280px+), Tablet (768px), and Mobile (390px).
- **Keyboard Navigation**: Full Tab/Shift+Tab accessibility, visible focus rings, semantic buttons, semantic links, and Escape-key listeners to dismiss the mobile drawer and modals.
- **Double-Submission Protection**: Form buttons and modals disable during network requests.

---

## 9. Task 9: Explainable Memory-Driven Recommendations & WOW Demo

Task 9 delivers transparency and visible intelligence, proving that MemoryAI is not a generic LLM wrapper by demonstrating how verified memories and campaign benchmarks directly guide every recommendation:

### 1. Architectural Principle: Separation of Facts from Interpretation
- **Application Controls Facts**:
  - Selected Hindsight memories, text, categories, and verified provenance labels.
  - Selected campaign records, deterministic calculations (reach, engagement rate, CTR), and synthetic disclosures.
  - Accurate evidence counts (e.g. `4 verified memories · 2 relevant campaigns`).
- **LLM Provides Strategic Reasoning**:
  - Connecting brand guidelines with campaign format observations.
  - Articulating why a given strategy fits Northstar Brand Co.

### 2. Explainability Layer Components
- **Visual Evidence Flow Chain**:
  $$\text{[ Persistent Memory ]} \longrightarrow \text{[ Campaign Evidence ]} \longrightarrow \text{[ Strategic Reasoning ]} \longrightarrow \text{[ Actionable Recommendation ]}$$
  Implemented using restrained dark SaaS surfaces, subtle borders, and clear step hierarchy (no futuristic neon or animated AI brains).
- **Supporting Memory Cards**:
  Displays verified knowledge with true provenance badges:
  - `Source: User Taught` (green)
  - `Source: User Feedback` (sky blue)
  - `Source: Campaign History` (amber)
  - `Source: Seeded Brand Knowledge` (violet)
  Includes citation labels (e.g. `[AUDIENCE: young-professionals-workflow]`) and direct links to inspect the memory bank.
- **Relevant Campaign Evidence Cards**:
  Displays objective, format, key takeaway, impressions, reach, engagement rate, and CTR alongside the mandatory synthetic demonstration disclosure.
- **Honest Missing-Evidence Handling**:
  If a query does not select campaign records (e.g. tone/voice queries), the system honestly reports:
  > *"Brand voice and tone queries rely directly on core brand memory; campaign metrics were intentionally not selected."*
  Zero hallucinated or manufactured evidence.

### 3. Complete WOW Cognitive Loop
```
Northstar Teaches Preference
            ↓
Hindsight Cloud Retains & Indexes
            ↓
User Queries Strategist
            ↓
Query-Aware Retrieval Recalls Memory
            ↓
Campaign Layer Selects Relevant Historical Data
            ↓
LLM Formulates Grounded Recommendations
            ↓
Explainability Layer Exposes Full Provenance & Evidence Chain
            ↓
User Provides Feedback / Teaches Strategic Correction
            ↓
Northstar Learns for Future Formulations
```

---

## 10. Example Strategist Queries

Use the interactive Strategist workspace (`/strategist`) to query:
- *"What should Northstar post next?"*
- *"What worked in our previous LinkedIn campaigns?"*
- *"What worked in our Instagram campaigns?"*
- *"What should we test next based on previous campaigns?"*
- *"What tone should Northstar use?"*
- *"Give me a 2027 revenue forecast."* (Demonstrates anti-hallucination refusal)

---

## 11. Verification & QA Commands

```bash
# 1. Strict TypeScript Check
npx tsc --noEmit

# 2. ESLint Check
npm run lint

# 3. Production Build Compilation
npm run build
```
