import { getHindsightClient } from "./client";
import { HINDSIGHT_CONFIG, isHindsightConfigured } from "./config";
import { NORTHSTAR_SEED_MEMORIES } from "./seed-data";
import {
  MemoryStatusResponse,
  RecallResponsePayload,
  SafeMemoryResult,
} from "./types";

/**
 * Checks connection to Hindsight Cloud and retrieves bank status.
 * Never throws — always returns a sanitized MemoryStatusResponse.
 */
export async function getMemoryStatus(): Promise<MemoryStatusResponse> {
  if (!isHindsightConfigured()) {
    return {
      connected: false,
      status: "disconnected",
      bankId: HINDSIGHT_CONFIG.bankId,
      bankName: HINDSIGHT_CONFIG.bankName,
      message: "HINDSIGHT_API_KEY is not configured in server environment.",
    };
  }

  const client = getHindsightClient();
  if (!client) {
    return {
      connected: false,
      status: "disconnected",
      bankId: HINDSIGHT_CONFIG.bankId,
      bankName: HINDSIGHT_CONFIG.bankName,
      message: "Hindsight client could not be initialized.",
    };
  }

  try {
    // Attempt to verify bank profile and retrieve count
    let totalMemories = 0;
    let initialized = false;

    try {
      const bankConfig = await client.getBankConfig(HINDSIGHT_CONFIG.bankId);
      if (bankConfig) {
        initialized = true;
        const memoryList = await client.listMemories(HINDSIGHT_CONFIG.bankId, { limit: 1 });
        totalMemories = memoryList.total ?? 0;
      }
    } catch (err: unknown) {
      // 404 means bank doesn't exist yet, which is expected before initialization
      const status = (err as { statusCode?: number; status?: number })?.statusCode || (err as { status?: number })?.status;
      if (status === 404) {
        return {
          connected: true,
          status: "connected",
          bankId: HINDSIGHT_CONFIG.bankId,
          bankName: HINDSIGHT_CONFIG.bankName,
          totalMemories: 0,
          initialized: false,
          message: "Connected to Hindsight Cloud. Memory bank awaiting initialization.",
        };
      }
      throw err;
    }

    return {
      connected: true,
      status: "connected",
      bankId: HINDSIGHT_CONFIG.bankId,
      bankName: HINDSIGHT_CONFIG.bankName,
      totalMemories,
      initialized,
      message: "Persistent memory is connected.",
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error connecting to Hindsight";
    console.error("[Hindsight Service] Error verifying memory status:", errorMsg);

    return {
      connected: false,
      status: "error",
      bankId: HINDSIGHT_CONFIG.bankId,
      bankName: HINDSIGHT_CONFIG.bankName,
      message: "Unable to reach persistent memory.",
    };
  }
}

/**
 * Idempotently initializes the Northstar memory bank and retains seed memories.
 * Safe to run repeatedly; if the bank already contains memories, seeding is skipped.
 */
export async function initializeMemoryBank(): Promise<{
  success: boolean;
  message: string;
  bankId: string;
  totalMemories?: number;
  seededCount?: number;
}> {
  if (!isHindsightConfigured()) {
    throw new Error("Cannot initialize memory bank: HINDSIGHT_API_KEY is not configured.");
  }

  const client = getHindsightClient();
  if (!client) {
    throw new Error("Cannot initialize memory bank: client instance unavailable.");
  }

  try {
    // 1. Create or update the dedicated bank
    await client.createBank(HINDSIGHT_CONFIG.bankId, {
      name: HINDSIGHT_CONFIG.bankName,
      mission: HINDSIGHT_CONFIG.bankMission,
      reflectMission: HINDSIGHT_CONFIG.bankMission,
    });

    // 2. Check if memories are already present (Idempotency Guard)
    const existing = await client.listMemories(HINDSIGHT_CONFIG.bankId, { limit: 10 });
    const existingCount = existing.total ?? (existing.items ? existing.items.length : 0);

    if (existingCount > 0) {
      console.log(
        `[Hindsight Service] Bank ${HINDSIGHT_CONFIG.bankId} already populated with ${existingCount} memories. Skipping duplicate seed.`
      );
      return {
        success: true,
        message: "Memory bank verified. Existing memories retained without duplicates.",
        bankId: HINDSIGHT_CONFIG.bankId,
        totalMemories: existingCount,
        seededCount: 0,
      };
    }

    // 3. Retain each seed memory sequentially to preserve ordering and verify success
    let retainedCount = 0;
    for (const item of NORTHSTAR_SEED_MEMORIES) {
      try {
        await client.retain(HINDSIGHT_CONFIG.bankId, item.content, {
          context: item.context,
          metadata: {
            category: item.category,
            seedId: item.id,
          },
        });
        retainedCount++;
      } catch (retainError) {
        console.error(`[Hindsight Service] Failed to retain memory "${item.id}":`, retainError);
      }
    }

    console.log(
      `[Hindsight Service] Successfully initialized bank ${HINDSIGHT_CONFIG.bankId} and seeded ${retainedCount} memories.`
    );

    return {
      success: true,
      message: `Memory bank successfully initialized with ${retainedCount} strategic memories.`,
      bankId: HINDSIGHT_CONFIG.bankId,
      totalMemories: retainedCount,
      seededCount: retainedCount,
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to initialize memory bank";
    console.error("[Hindsight Service] Initialization failure:", errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Retains a single strategic memory in the Northstar bank.
 */
export async function retainMemory(
  content: string,
  context?: string,
  metadata?: Record<string, string>
): Promise<{ success: boolean; message: string }> {
  if (!isHindsightConfigured()) {
    throw new Error("Cannot retain memory: HINDSIGHT_API_KEY is not configured.");
  }

  const client = getHindsightClient();
  if (!client) {
    throw new Error("Hindsight client is unavailable.");
  }

  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error("Memory content cannot be empty.");
  }

  await client.retain(HINDSIGHT_CONFIG.bankId, trimmed, {
    context,
    metadata,
  });

  return {
    success: true,
    message: "Memory retained successfully in persistent brand storage.",
  };
}

/**
 * Recalls relevant memories for a natural language query.
 * Sanitizes and cleans the results before returning to caller.
 */
export async function recallMemories(query: string): Promise<RecallResponsePayload> {
  const trimmedQuery = query?.trim() ?? "";
  if (!trimmedQuery) {
    throw new Error("Query is required for memory recall.");
  }

  if (!isHindsightConfigured()) {
    throw new Error("Persistent memory is unavailable: HINDSIGHT_API_KEY is not configured.");
  }

  const client = getHindsightClient();
  if (!client) {
    throw new Error("Hindsight client is not available.");
  }

  try {
    const recallResponse = await client.recall(HINDSIGHT_CONFIG.bankId, trimmedQuery, {
      maxTokens: 2048,
    });

    const rawResults = recallResponse.results ?? [];

    const safeResults: SafeMemoryResult[] = rawResults.map((item, index) => {
      let category = item.metadata?.category;
      if (!category && item.context) {
        category = item.context;
      }

      // Extract genuine relevance score from Hindsight if provided by SDK
      const rawScore = item.scores?.final ?? item.scores?.reranker;
      const score = typeof rawScore === "number" && !isNaN(rawScore) ? rawScore : undefined;

      return {
        id: item.id || `mem-${index}`,
        text: item.text,
        type: item.type || "world",
        category,
        context: item.context || undefined,
        score,
        metadata: item.metadata || undefined,
      };
    });

    return {
      query: trimmedQuery,
      results: safeResults,
      count: safeResults.length,
      bankId: HINDSIGHT_CONFIG.bankId,
      timestamp: new Date().toISOString(),
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Recall failed";
    console.error(`[Hindsight Service] Error recalling memories for "${trimmedQuery}":`, errorMsg);
    throw new Error(`Memory recall error: ${errorMsg}`);
  }
}
