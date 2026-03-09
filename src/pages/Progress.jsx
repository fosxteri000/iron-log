import React, { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { useProgressData } from "../hooks/useExercises";
import { useCheatDays } from "../hooks/useCheatDays";
import { useProfile } from "../hooks/useProfile";
import { useFoodLogs } from "../hooks/useFoodLog";
import { useSleepLogs } from "../hooks/useSleepLog";
import { formatFullDate, getStartOfWeek } from "../lib/utils";
import {
  getWeekSummary, getCurrentStreak,
  getSplitBreakdown, getWeeklySessions, getVolumeTrend,
  getFoodLast7Days, getSleepLast7Days,
} from "../lib/statsQueries";
import { getVolumeMessage } from "../lib/statsInsights";
import { TrophyIcon } from "../components/Icons";
import SummaryCard from "../components/SummaryCard";
import DonutChart from "../components/DonutChart";
import WeeklyBarChart from "../components/WeeklyBarChart";
import VolumeTrendChart from "../components/VolumeTrendChart";
import Collapse from "../components/Collapse";

export default function Progress() {
  const { workoutLogs, cardioLogs, loading } = useProgressData();
  const { cheatDays } = useCheatDays();
  const { profile } = useProfile();
  const { foodLogs } = useFoodLogs();
  const { sleepLogs } = useSleepLogs();
  const [volumeMode, setVolumeMode] = useState("weekly");
  const [moreOpen, setMoreOpen] = useState(false);

  const userName = profile?.name?.toUpperCase() || "YOU";

  // Week range
  const weekRange = useMemo(() => {
    const start = getStartOfWeek();
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const fmt = d => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    return `${fmt(start)} — ${fmt(end)}`;
  }, []);

  // Summary
  const thisWeek = useMemo(() => getWeekSummary(workoutLogs, cardioLogs, cheatDays, 0), [workoutLogs, cardioLogs, cheatDays]);
  const lastWeek = useMemo(() => getWeekSummary(workoutLogs, cardioLogs, cheatDays, 1), [workoutLogs, cardioLogs, cheatDays]);

  // Streak + active days
  const streak = useMemo(() => getCurrentStreak(workoutLogs, cardioLogs), [workoutLogs, cardioLogs]);
  const activeDaysThisWeek = useMemo(() => {
    const startStr = getStartOfWeek().toISOString().split("T")[0];
    return new Set([
      ...workoutLogs.filter(l => l.date >= startStr).map(l => l.date),
      ...cardioLogs.filter(l => l.date >= startStr).map(l => l.date),
    ]).size;
  }, [workoutLogs, cardioLogs]);

  // Donut — training split
  const { segments: donutSegments, activeDays } = useMemo(
    () => getSplitBreakdown(workoutLogs, cardioLogs, cheatDays),
    [workoutLogs, cardioLogs, cheatDays]
  );
  const coloredSegments = useMemo(() => {
    let idx = 0;
    return donutSegments.map(seg => {
      if (seg.name === "Rest") return { ...seg, color: "var(--t-border-mid)", opacity: 0.6 };
      if (seg.name === "Cardio") return { ...seg, color: "var(--t-accent)", opacity: 0.25 };
      const opacity = Math.max(0.3, 1 - idx * 0.2);
      idx++;
      return { ...seg, color: "var(--t-accent)", opacity };
    });
  }, [donutSegments]);

  // Weekly bar
  const weeklySessions = useMemo(
    () => getWeeklySessions(workoutLogs, cardioLogs, cheatDays),
    [workoutLogs, cardioLogs, cheatDays]
  );

  // Volume trend
  const volumeTrend = useMemo(() => getVolumeTrend(workoutLogs, volumeMode), [workoutLogs, volumeMode]);
  const volumeInsight = useMemo(
    () => getVolumeMessage(volumeTrend, userName, volumeMode),
    [volumeTrend, userName, volumeMode]
  );

  // Best lifts (inside MORE STATS)
  const bestLiftsByCategory = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    const byCategory = {};
    workoutLogs.filter(l => l.date >= cutoffStr).forEach(l => {
      if (!l.category) return;
      if (!byCategory[l.category]) byCategory[l.category] = {};
      l.sets.forEach(s => {
        const name = l.exercise_name;
        if (!byCategory[l.category][name] || s.weight > byCategory[l.category][name].weight) {
          byCategory[l.category][name] = s;
        }
      });
    });
    return byCategory;
  }, [workoutLogs]);

  // Nutrition & sleep (inside MORE STATS)
  const foodChartData  = useMemo(() => getFoodLast7Days(foodLogs),   [foodLogs]);
  const sleepChartData = useMemo(() => getSleepLast7Days(sleepLogs), [sleepLogs]);

  const avgKcalDay = useMemo(() => {
    const active = foodChartData.filter(d => d.calories > 0);
    return active.length ? Math.round(active.reduce((a, d) => a + d.calories, 0) / active.length) : null;
  }, [foodChartData]);

  const mostCommonFoodQuality = useMemo(() => {
    const counts = {};
    foodChartData.forEach(d => { if (d.quality) counts[d.quality] = (counts[d.quality] || 0) + 1; });
    return Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] || null;
  }, [foodChartData]);

  const avgSleepHours = useMemo(() => {
    const active = sleepChartData.filter(d => d.duration > 0);
    return active.length ? (active.reduce((a, d) => a + d.duration, 0) / active.length).toFixed(1) : null;
  }, [sleepChartData]);

  const hasNutritionData = foodChartData.some(d => d.calories > 0) || sleepChartData.some(d => d.duration > 0);
  const hasBestLifts = Object.keys(bestLiftsByCategory).length > 0;
  const hasMoreStats = hasBestLifts || hasNutritionData;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[10px] tracking-[0.3em] text-gray-300">
        LOADING...
      </div>
    );
  }

  const hasAnyData = workoutLogs.length > 0 || cardioLogs.length > 0;

  return (
    <div className="fade-in">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-wide">PROGRESS</h2>
        <p className="text-[10px] tracking-[0.2em] text-gray-400 mt-1">{formatFullDate()}</p>
      </div>

      {/* Zero-data state */}
      {!hasAnyData && (
        <div className="border border-gray-200 p-6 mb-6 text-center">
          <p className="text-xs font-bold tracking-[0.3em] mb-2">NO DATA YET</p>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Log your first workout on the Today tab.<br />
            Your stats and charts will appear here.
          </p>
        </div>
      )}

      {/* ── 1. Summary card ───────────────────────────────────── */}
      <SummaryCard thisWeek={thisWeek} lastWeek={lastWeek} weekRange={weekRange} />

      {/* ── 2. Stat badges ────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold leading-none">{streak}</p>
          <p className="text-[10px] tracking-widest text-gray-400 mt-1.5">STREAK</p>
        </div>
        <div className="border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold leading-none">{activeDaysThisWeek}</p>
          <p className="text-[10px] tracking-widest text-gray-400 mt-1.5">ACTIVE</p>
        </div>
        <div className="border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold leading-none">{thisWeek.sessions + thisWeek.cardio}</p>
          <p className="text-[10px] tracking-widest text-gray-400 mt-1.5">SESSIONS</p>
        </div>
      </div>

      {/* ── 3. Two-column charts ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">

        {/* Left: Training split donut */}
        <div className="border border-gray-200 p-3">
          <p className="text-[10px] font-bold tracking-[0.2em] mb-0.5">SPLIT</p>
          <p className="text-[10px] text-gray-400 tracking-wide mb-2">30 days</p>
          <DonutChart segments={coloredSegments} centerValue={activeDays} centerLabel="ACTIVE" size={160} />
          <div className="mt-2 space-y-0.5">
            {coloredSegments.slice(0, 4).map(seg => (
              <div key={seg.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 shrink-0" style={{ backgroundColor: seg.color, opacity: seg.opacity }} />
                <span className="text-[10px] text-gray-400 truncate">{seg.name} {seg.value}d</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Weekly sessions bar */}
        <div className="border border-gray-200 p-3">
          <p className="text-[10px] font-bold tracking-[0.2em] mb-0.5">SESSIONS</p>
          <p className="text-[10px] text-gray-400 tracking-wide mb-2">8 weeks</p>
          <div className="relative -mx-2 -mb-2 overflow-x-auto">
            <div style={{ minWidth: "350px" }}>
              <WeeklyBarChart data={weeklySessions} height={140} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-black" />
              <span className="text-[10px] text-gray-400">Strength</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-black opacity-30" />
              <span className="text-[10px] text-gray-400">Cardio</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--t-cheat)" }} />
              <span className="text-[10px] text-gray-400">Cheat</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── 4. Volume trend — full width ─────────────────────── */}
      <div className="border border-gray-200 p-3 mb-5">
        <p className="text-[10px] font-bold tracking-[0.2em] mb-2">VOLUME TREND</p>
        <VolumeTrendChart
          data={volumeTrend}
          mode={volumeMode}
          onModeChange={setVolumeMode}
          insightText={volumeInsight}
        />
      </div>

      {/* ── 5. More stats toggle ──────────────────────────────── */}
      {hasMoreStats && (
        <>
          <button
            onClick={() => setMoreOpen(o => !o)}
            className="w-full py-3.5 border border-black text-[10px] tracking-[0.3em] font-bold flex items-center justify-center gap-2 mb-2 active:bg-black active:text-white transition-colors"
          >
            {moreOpen ? "LESS STATS −" : "MORE STATS +"}
          </button>

          <Collapse open={moreOpen}>
            <div className="pt-2 pb-4 space-y-5">

              {/* Best lifts */}
              {hasBestLifts && (
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black">
                    <TrophyIcon size={12} className="text-gray-400" />
                    <p className="text-xs font-bold tracking-[0.3em]">BEST LIFTS</p>
                    <span className="text-[10px] text-gray-400">· last 30 days</span>
                  </div>
                  {Object.entries(bestLiftsByCategory).map(([category, lifts]) => (
                    <div key={category} className="mb-3 border border-gray-200 p-3">
                      <p className="text-[10px] font-bold tracking-[0.2em] mb-2">{category.toUpperCase()}</p>
                      <div className="space-y-1.5">
                        {Object.entries(lifts)
                          .sort(([, a], [, b]) => b.weight - a.weight)
                          .slice(0, 5)
                          .map(([name, s]) => (
                            <div key={name} className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 truncate flex-1">{name}</span>
                              <span className="text-xs font-bold ml-3">{s.weight}kg × {s.reps}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Nutrition & sleep */}
              {hasNutritionData && (
                <div>
                  <p className="text-xs font-bold tracking-[0.3em] mb-3 pb-2 border-b border-black">NUTRITION & SLEEP</p>
                  <div className="grid grid-cols-2 gap-3">

                    <div style={{ border: "1px solid var(--t-border)" }}>
                      <div className="p-2.5">
                        <p className="text-[10px] font-bold tracking-[0.2em] mb-0.5">FOOD</p>
                        {avgKcalDay && <p className="text-[10px] text-gray-400">{avgKcalDay} avg kcal</p>}
                        {mostCommonFoodQuality && <p className="text-[10px] text-gray-400 mb-1">Mostly {mostCommonFoodQuality}</p>}
                        {!avgKcalDay && <div className="mb-1" />}
                        <ResponsiveContainer width="100%" height={60}>
                          <BarChart data={foodChartData} barSize={12} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                            <XAxis dataKey="day" tick={{ fontSize: 8, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis hide />
                            <Tooltip cursor={false}
                              formatter={v => v > 0 ? [`${v} kcal`, ""] : ["—", ""]}
                              contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 0, fontSize: 9, padding: "2px 6px" }}
                            />
                            <Bar dataKey="calories" radius={0}>
                              {foodChartData.map((d, i) => (
                                <Cell key={i} fill={
                                  d.quality === "clean" ? "#22c55e"
                                  : d.quality === "junk"  ? "#ef4444"
                                  : d.quality === "mixed" ? "#f59e0b"
                                  : "#d1d5db"
                                } />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div style={{ border: "1px solid var(--t-border)" }}>
                      <div className="p-2.5">
                        <p className="text-[10px] font-bold tracking-[0.2em] mb-0.5">SLEEP</p>
                        {avgSleepHours && <p className="text-[10px] text-gray-400 mb-1">{avgSleepHours}h avg</p>}
                        {!avgSleepHours && <div className="mb-1" />}
                        <ResponsiveContainer width="100%" height={60}>
                          <BarChart data={sleepChartData} barSize={12} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                            <XAxis dataKey="day" tick={{ fontSize: 8, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis hide domain={[0, 12]} />
                            <Tooltip cursor={false}
                              formatter={v => v > 0 ? [`${v}h`, ""] : ["—", ""]}
                              contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 0, fontSize: 9, padding: "2px 6px" }}
                            />
                            <Bar dataKey="duration" radius={0}>
                              {sleepChartData.map((d, i) => (
                                <Cell key={i} fill={
                                  d.quality === "great" ? "#22c55e"
                                  : d.quality === "ok"   ? "#6b7280"
                                  : d.quality === "poor" ? "#ef4444"
                                  : "#e5e7eb"
                                } />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                    {[["#22c55e","Clean/Great"],["#f59e0b","Mixed"],["#ef4444","Junk/Poor"],["#d1d5db","No data"]].map(([c,l]) => (
                      <div key={l} className="flex items-center gap-1">
                        <div className="w-2 h-2" style={{ backgroundColor: c }} />
                        <span className="text-[10px] text-gray-400">{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </Collapse>
        </>
      )}

      <div className="pb-8" />
    </div>
  );
}
