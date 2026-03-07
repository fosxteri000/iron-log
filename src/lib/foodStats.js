import { getStartOfWeek } from "./utils";

/**
 * Compute this week's food summary from food_logs array.
 * Returns: { meals, avgCalories, qualityBreakdown, topProtein, hasData }
 */
export function getFoodWeekStats(foodLogs) {
  const start = getStartOfWeek();
  const startStr = start.toISOString().split("T")[0];

  const weekLogs = foodLogs.filter(l => l.date >= startStr);

  if (weekLogs.length === 0) return null;

  const meals = weekLogs.length;

  const logsWithCal = weekLogs.filter(l => l.calories != null);
  const avgCalories = logsWithCal.length > 0
    ? Math.round(logsWithCal.reduce((sum, l) => sum + l.calories, 0) / logsWithCal.length)
    : null;

  const logsWithProt = weekLogs.filter(l => l.protein_g != null);
  const avgProtein = logsWithProt.length > 0
    ? Math.round(logsWithProt.reduce((sum, l) => sum + l.protein_g, 0) / logsWithProt.length)
    : null;

  const quality = { clean: 0, mixed: 0, junk: 0 };
  weekLogs.forEach(l => {
    if (l.quality && quality[l.quality] !== undefined) quality[l.quality]++;
  });
  const totalQual = quality.clean + quality.mixed + quality.junk;
  const qualityBreakdown = totalQual > 0 ? {
    clean: Math.round((quality.clean / totalQual) * 100),
    mixed: Math.round((quality.mixed / totalQual) * 100),
    junk: Math.round((quality.junk / totalQual) * 100),
  } : null;

  return { meals, avgCalories, avgProtein, qualityBreakdown };
}
