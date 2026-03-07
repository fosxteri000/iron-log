import { getStartOfWeek } from "./utils";

function dateStr(d) {
  return d.toISOString().split("T")[0];
}

function volumeInRange(logs, startStr, endStr) {
  return logs
    .filter(l => l.date >= startStr && l.date < endStr)
    .reduce((acc, l) => acc + l.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0);
}

export function getWeekSummary(workoutLogs, cardioLogs, cheatDays, weekOffset = 0) {
  const start = getStartOfWeek();
  start.setDate(start.getDate() - weekOffset * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  const s = dateStr(start), e = dateStr(end);

  const sessionDates = new Set(workoutLogs.filter(l => l.date >= s && l.date < e).map(l => l.date));
  const cardioCount = new Set(cardioLogs.filter(l => l.date >= s && l.date < e).map(l => l.date)).size;
  const cheatCount = cheatDays.filter(c => c.date >= s && c.date < e).length;
  const volume = volumeInRange(workoutLogs, s, e);

  return { sessions: sessionDates.size, cardio: cardioCount, cheat: cheatCount, volume };
}

export function getCurrentStreak(workoutLogs, cardioLogs) {
  const allDates = new Set([
    ...workoutLogs.map(l => l.date),
    ...cardioLogs.map(l => l.date),
  ]);
  const today = new Date();
  const todayStr = dateStr(today);
  const startOffset = allDates.has(todayStr) ? 0 : 1;
  let streak = 0;
  for (let i = startOffset; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (allDates.has(dateStr(d))) streak++;
    else break;
  }
  return streak;
}

export function getBalanceData(workoutLogs, days = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = dateStr(cutoff);
  const filtered = workoutLogs.filter(l => l.date >= cutoffStr);
  const volByCat = {};
  filtered.forEach(l => {
    if (!l.category) return;
    const vol = l.sets.reduce((s, set) => s + set.weight * set.reps, 0);
    volByCat[l.category] = (volByCat[l.category] || 0) + vol;
  });
  const total = Object.values(volByCat).reduce((a, b) => a + b, 0);
  if (total === 0) return {};
  const result = {};
  Object.entries(volByCat).forEach(([cat, vol]) => {
    result[cat] = Math.round((vol / total) * 100);
  });
  return result;
}

export function getSplitBreakdown(workoutLogs, cardioLogs, cheatDays) {
  const counts = {};
  const today = new Date();
  let activeDays = 0;

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    const dayLogs = workoutLogs.filter(l => l.date === ds);
    const dayCardio = cardioLogs.filter(l => l.date === ds);

    if (dayLogs.length > 0) {
      const volByCat = {};
      dayLogs.forEach(l => {
        const vol = l.sets.reduce((s, set) => s + set.weight * set.reps, 0);
        volByCat[l.category] = (volByCat[l.category] || 0) + vol;
      });
      const dominant = Object.entries(volByCat).sort(([, a], [, b]) => b - a)[0][0];
      counts[dominant] = (counts[dominant] || 0) + 1;
      activeDays++;
    } else if (dayCardio.length > 0) {
      counts["Cardio"] = (counts["Cardio"] || 0) + 1;
      activeDays++;
    } else {
      counts["Rest"] = (counts["Rest"] || 0) + 1;
    }
  }

  const segments = Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      if (a.name === "Rest") return 1;
      if (b.name === "Rest") return -1;
      return b.value - a.value;
    });

  return { segments, activeDays };
}

export function getWeeklySessions(workoutLogs, cardioLogs, cheatDays) {
  const weeks = [];
  for (let w = 7; w >= 0; w--) {
    const start = getStartOfWeek();
    start.setDate(start.getDate() - w * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const s = dateStr(start), e = dateStr(end);

    const strength = new Set(workoutLogs.filter(l => l.date >= s && l.date < e).map(l => l.date)).size;
    const cardio = new Set(cardioLogs.filter(l => l.date >= s && l.date < e).map(l => l.date)).size;
    const cheat = cheatDays.some(c => c.date >= s && c.date < e);

    const monthShort = start.toLocaleDateString("en-GB", { month: "short" });
    const weekNum = Math.ceil(start.getDate() / 7);
    weeks.push({ label: `${monthShort} W${weekNum}`, strength, cardio, cheat });
  }
  return weeks;
}

export function getVolumeTrend(workoutLogs, mode = "weekly") {
  if (mode === "weekly") {
    const points = [];
    for (let w = 7; w >= 0; w--) {
      const start = getStartOfWeek();
      start.setDate(start.getDate() - w * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      const vol = volumeInRange(workoutLogs, dateStr(start), dateStr(end));
      points.push({ label: start.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), value: vol });
    }
    return points;
  }

  const points = [];
  const today = new Date();
  for (let m = 5; m >= 0; m--) {
    const start = new Date(today.getFullYear(), today.getMonth() - m, 1);
    const end = new Date(today.getFullYear(), today.getMonth() - m + 1, 1);
    const vol = volumeInRange(workoutLogs, dateStr(start), dateStr(end));
    points.push({ label: start.toLocaleDateString("en-GB", { month: "short" }), value: vol });
  }
  return points;
}

export function getBestSession(workoutLogs) {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const startStr = dateStr(monthStart);
  const filtered = workoutLogs.filter(l => l.date >= startStr);
  if (filtered.length === 0) return null;

  const byDate = {};
  filtered.forEach(l => {
    const vol = l.sets.reduce((s, set) => s + set.weight * set.reps, 0);
    byDate[l.date] = (byDate[l.date] || 0) + vol;
  });

  const [bestDate, bestVol] = Object.entries(byDate).sort(([, a], [, b]) => b - a)[0];
  return { date: bestDate, volume: bestVol };
}
