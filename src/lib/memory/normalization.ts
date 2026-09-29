/**
 * Normalizes user-taught memory content before persistence.
 *
 * Rules:
 * - Strips unsafe HTML and XML tags to prevent tag spoofing.
 * - Removes script and style blocks completely.
 * - Collapses consecutive whitespace and newline characters.
 * - Preserves authentic strategic intent without unsupported rewrites.
 */
export function normalizeTeachContent(raw: string): string {
  if (!raw) return "";

  let cleaned = raw
    // Strip script and style tags along with their inner content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    // Strip remaining XML/HTML tags
    .replace(/<[^>]*>/g, " ")
    // Remove control characters (except standard newlines/tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize unicode whitespace
    .replace(/\s+/g, " ")
    .trim();

  // Ensure initial character is capitalized for consistent knowledge representation
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Normalizes user-supplied context label or generates an appropriate default.
 */
export function normalizeTeachContext(
  context: string | undefined,
  category: string,
  source: string = "user_taught"
): string {
  if (context && context.trim().length > 0) {
    return context
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  const sourceLabel = source === "user_feedback" ? "Feedback" : "Strategic Preference";

  return `User Taught ${categoryLabel} ${sourceLabel}`;
}
