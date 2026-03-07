export function getDonutMessage(segments, name) {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  if (total === 0) return null;
  const rest = segments.find(s => s.name === "Rest");
  const restPct = rest ? (rest.value / total * 100) : 0;
  const active = segments.filter(s => s.name !== "Rest");
  if (active.length === 0) return `Recovery is training too, ${name}`;
  const biggest = active[0];
  const biggestPct = (biggest.value / total * 100);
  if (restPct > 40) return `Recovery is training too, ${name}`;
  if (biggestPct > 60) return `Going heavy on ${biggest.name} lately 👀`;
  return "Balanced training = balanced body ✓";
}

export function getBarMessage(sessionsThisWeek, name) {
  if (sessionsThisWeek >= 5) return `Showing up is 80% of it, ${name} 🔥`;
  if (sessionsThisWeek >= 3) return `Solid week, ${name} 💪`;
  if (sessionsThisWeek >= 1) return `Something > nothing, ${name}`;
  return `The gym misses you, ${name} 👀`;
}

export function getVolumeMessage(trend, name, mode = "weekly") {
  if (trend.length < 2) return null;
  if (mode === "monthly") {
    const best = trend.reduce((b, p) => p.value > b.value ? p : b, trend[0]);
    return best.value > 0 ? `Your best month: ${best.label} · ${best.value.toLocaleString()} kg` : null;
  }
  const last = trend[trend.length - 1].value;
  const prev = trend[trend.length - 2].value;
  if (prev === 0 && last === 0) return null;
  if (prev === 0) return `Numbers going up. Keep pushing, ${name} 📈`;
  const change = (last - prev) / prev * 100;
  const pct = Math.abs(change).toFixed(0);
  if (change > 5) return `↑ ${pct}% vs last week — Keep pushing, ${name} 📈`;
  if (change < -5) return `↓ ${pct}% vs last week — come back stronger 💪`;
  return `Holding strong, ${name} →`;
}
