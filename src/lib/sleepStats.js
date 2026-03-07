import { getStartOfWeek, formatDate } from "./utils";

/**
 * Compute this week's sleep summary from sleep_logs array.
 * Returns: { avgHours, qualityTrend, bestNight } or null if no data
 */
export function getSleepWeekStats(sleepLogs) {
  const start = getStartOfWeek();
  const startStr = start.toISOString().split("T")[0];

  const weekLogs = sleepLogs.filter(l => l.date >= startStr);

  if (weekLogs.length === 0) return null;

  const logsWithDuration = weekLogs.filter(l => l.duration_hours != null);
  const avgHours = logsWithDuration.length > 0
    ? Math.round((logsWithDuration.reduce((sum, l) => sum + parseFloat(l.duration_hours), 0) / logsWithDuration.length) * 10) / 10
    : null;

  // Quality trend: last 2 nights
  const sorted = [...weekLogs].sort((a, b) => a.date.localeCompare(b.date));
  const qualityMap = { poor: 1, ok: 2, great: 3 };
  let qualityTrend = null;
  if (sorted.length >= 2) {
    const last = qualityMap[sorted[sorted.length - 1]?.quality] || 0;
    const prev = qualityMap[sorted[sorted.length - 2]?.quality] || 0;
    if (last > prev) qualityTrend = "↑";
    else if (last < prev) qualityTrend = "↓";
    else qualityTrend = "→";
  }

  const latestQuality = sorted.length > 0
    ? sorted[sorted.length - 1]?.quality
    : null;
  const qualityLabel = latestQuality
    ? latestQuality.charAt(0).toUpperCase() + latestQuality.slice(1)
    : null;

  // Best night this week
  const bestNight = logsWithDuration.reduce((best, l) => {
    return !best || parseFloat(l.duration_hours) > parseFloat(best.duration_hours) ? l : best;
  }, null);

  return { avgHours, qualityTrend, qualityLabel, bestNight };
}
