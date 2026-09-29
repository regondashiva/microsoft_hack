import { MemoryNode, MemoryType, MemoryQuery } from "@/types";

export interface MemoryCategoryCount {
  type: MemoryType;
  label: string;
  count: number;
}

export interface MemoryRetrievalTrace {
  query: MemoryQuery;
  retrievedNodes: MemoryNode[];
  similarityScores: Record<string, number>;
  latencyMs: number;
}
