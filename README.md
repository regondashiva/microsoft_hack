# MemoryAI — AI Content Strategist

> **Current Status: Task 5 — Hindsight Memory Retrieval & Contextual Reasoning (COMPLETE)**  
> *The retrieval layer implements query-aware analysis, deterministic relevance filtering, deduplication, strategic categorization, and bounded context budgeting before LLM reasoning.*

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
- **AI Content Strategist**: Reasoning engine grounded in persistent brand memory.

---

## 3. High-Level Architecture (Task 5 Pipeline)

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
          ┌─────────────────────┴─────────────────────┐
          │ Step 1: RECALL                            │ Step 2: REASON
          ▼                                           ▼
   Hindsight Service                              AI Service
  (src/lib/hindsight)                            (src/lib/ai)
          │                                           │
          ▼                                           ▼
   Hindsight Cloud                                 LLM API
 (Vector + BM25 Recall)                         (OpenAI / Compatible)
          │                                           │
          ▼                                           ▼
 Persistent Memory Bank                         Zod Schema Validation
(northstar-content-strategist)                 (Summary, Recs, Reason, Memory)
```

The strategist coordinates **Query-Aware Retrieval and Bounded Reasoning**:
1. **Query Analysis**: Extracts channel (LinkedIn/Instagram), audience targets, topic keywords, and prioritizes target memory categories.
2. **Hindsight Recall**: Queries the persistent Northstar memory bank (`northstar-content-strategist`) via Hindsight Recall.
3. **Relevance Filtering & Deduplication**: Normalizes items, removes duplicates, and filters out contradictory channels/audiences.
4. **Context Categorization**: Maps candidate memories into BRAND, AUDIENCE, CONTENT, CAMPAIGN, STRATEGIC categories.
5. **Context Budgeting**: Enforces strict limit (`MAX_CONTEXT_MEMORIES = 6`), prioritizing memories based on query intent and authentic Hindsight scores.
6. **Structured Prompt**: Delivers categorized XML blocks (`<brand_context>`, `<audience_context>`, etc.) to the LLM.
7. **LLM Generation & Schema Validation**: Validates the output against the strict Zod schema; derives `memoryUsed` citations exclusively from selected memories.

---

## 4. Complete Project Roadmap

We are constructing **ONE production-level application incrementally** across distinct roadmap tasks:

| Phase | Milestone | Status | Description |
|---|---|---|---|
| **Task 1** | **Production Foundation & Product Shell** | **COMPLETE** | Production Next.js App Router shell, design tokens, typography, responsive layout, brand & campaign contracts, zero-error CI/CD baseline. |
| **Task 2** | **Hindsight Memory Layer** | **COMPLETE** | Real Hindsight Cloud integration, server-only client, dedicated memory bank, idempotent seeding, secure Recall/Retain API, interactive Memory Explorer UI. |
| **Task 3** | **LLM Service Foundation** | **COMPLETE** | Production-quality server-side LLM abstraction, model-agnostic provider configuration, normalized response interface, timeout & error normalization, `/api/ai/status` & `/api/ai/test` endpoints. |
| **Task 4** | **Core AI Content Strategist Agent** | **COMPLETE** | Brand-grounded strategy formulation engine combining Hindsight memory recall with LLM reasoning, strict Zod output validation, prompt injection defense, and focused workspace UI. |
| **Task 5** | **Hindsight Retrieval & Contextual Reasoning** | *Next Up* | Advanced multi-source retrieval, multi-hop citations, and constraint enforcement across channels. |
| **Task 6** | **Teach → Remember → Recall → Improve Loop** | *Scheduled* | Feedback loops where user critiques and performance data update persistent memory nodes. |
| **Task 7** | **Realistic Brand, Campaign & Performance Data** | *Scheduled* | Realistic enterprise brand fixtures, multi-channel metrics, and authentic feedback seeds. |
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

## 7. Example Strategist Queries

Use the interactive Strategist workspace (`/strategist`) to query:
- *"What should Northstar post next?"*
- *"How should we speak to young professionals?"*
- *"What content themes fit our brand?"*
- *"How should we approach LinkedIn?"*
- *"What should Northstar avoid in its messaging?"*
- *"What campaigns has Northstar run?"*

---

## 8. Verification & QA Commands

```bash
# 1. Strict TypeScript Check
npx tsc --noEmit

# 2. ESLint Check
npm run lint

# 3. Production Build Compilation
npm run build
```
