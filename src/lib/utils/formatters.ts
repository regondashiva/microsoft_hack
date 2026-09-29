/**
 * Utility formatters for metrics, dates, and currency values.
 */

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: num >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(num);
}

export function formatPercent(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}
