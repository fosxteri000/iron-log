export function getWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

export function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export function formatFullDate(date = new Date()) {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).toUpperCase();
}

export function calcPercentChange(current, previous) {
  if (!previous || previous === 0) return null;
  return (((current - previous) / previous) * 100).toFixed(1);
}

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** "today" as a YYYY-MM-DD string */
export function todayStr() {
  return new Date().toISOString().split("T")[0];
}

/** Capitalise first character: "clean" → "Clean" */
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Filter an array of objects (with a .date string) to the current week */
export function filterCurrentWeek(logs) {
  const startStr = getStartOfWeek().toISOString().split("T")[0];
  return logs.filter(l => l.date >= startStr);
}

/**
 * Scroll a section into the vertical centre of the viewport.
 * Call when a section expands; delay matches the Collapse animation (≈300ms).
 */
export function scrollSectionToCenter(ref) {
  requestAnimationFrame(() => {
    setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = window.scrollY + center - window.innerHeight / 2;
      window.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
    }, 320);
  });
}

/**
 * Progressive overload suggestion based on category and last session best set.
 * Push/Pull: +2.5kg same reps. Leg: +5kg same reps.
 * If reps < 6 (low range), keep weight but suggest +1 rep.
 */
export function getOverloadSuggestion(category, lastSession) {
  if (!lastSession || !lastSession.sets || lastSession.sets.length === 0) return null;

  const best = lastSession.sets.reduce((acc, s) =>
    s.weight > acc.weight ? s : acc, lastSession.sets[0]);

  const minReps = 6;
  const increment = category === "Leg" ? 5 : 2.5;

  if (best.reps < minReps) {
    return { weight: best.weight, reps: best.reps + 1, type: "reps" };
  }

  return {
    weight: Math.round((best.weight + increment) * 10) / 10,
    reps: best.reps,
    type: "weight",
  };
}
