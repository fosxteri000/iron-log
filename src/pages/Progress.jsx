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
  getWeekSummary, getCurrentStreak, getBalanceData,
  getSplitBreakdown, getWeeklySessions, getVolumeTrend, getBestSession,
  getFoodLast7Days, getSleepLast7Days,
} from "../lib/statsQueries";
import { getDonutMessage, getBarMessage, getVolumeMessage } from "../lib/statsInsights";
import { getFoodWeekStats } from "../lib/foodStats";
import { getSleepWeekStats } from "../lib/sleepStats";
import { TrophyIcon } from "../components/Icons";
import SummaryCard from "../components/SummaryCard";
import DonutChart from "../components/DonutChart";
import WeeklyBarChart from "../components/WeeklyBarChart";
import VolumeTrendChart from "../components/VolumeTrendChart";
import Collapse from "../components/Collapse";

// ── Collapsible section wrapper ──────────────────────────────
function Section({ title, subtitle, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <p className="text-xs font-bold tracking-[0.25em]">{title}</p>
          {subtitle && <p className="text-[10px] text-gray-400 tracking-wide mt-0.5">{subtitle}</p>}
        </div>
        <span className="text-xs text-gray-400 shrink-0 ml-4">{open ? "−" : "+"}</span>
      </button>
      <Collapse open={open}>
        <div className="pt-4 pb-2">{children}</div>
      </Collapse>
    </div>
  );
}

export default function Progress() {
  const { workoutLogs, cardioLogs, loading } = useProgressData();
  const { cheatDays } = useCheatDays();
  const { profile } = useProfile();
  const { foodLogs } = useFoodLogs();
  const { sleepLogs } = useSleepLogs();
  const [volumeMode, setVolumeMode] = useState("weekly");

  const userName = profile?.name?.toUpperCase() || "YOU";

  // Week range label
  const weekRange = useMemo(() => {
    const start = getStartOfWeek();
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const fmt = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    return `${fmt(start)} — ${fmt(end)}`;
  }, []);

  // Summary
  const thisWeek = useMemo(() => getWeekSummary(workoutLogs, cardioLogs, cheatDays, 0), [workoutLogs, cardioLogs, cheatDays]);
  const lastWeek = useMemo(() => getWeekSummary(workoutLogs, cardioLogs, cheatDays, 1), [workoutLogs, cardioLogs, cheatDays]);

  // Streak + consistency
  const streak = useMemo(() => getCurrentStreak(workoutLogs, cardioLogs), [workoutLogs, cardioLogs]);
  const activeDaysThisWeek = useMemo(() => {
    const start = getStartOfWeek();
    const startStr = start.toISOString().split("T")[0];
    return new Set([
      ...workoutLogs.filter(l => l.date >= startStr).map(l => l.date),
      ...cardioLogs.filter(l => l.date >= startStr).map(l => l.date),
    ]).size;
  }, [workoutLogs, cardioLogs]);

  // Donut
  const { segments: donutSegments, activeDays } = useMemo(
    () => getSplitBreakdown(workoutLogs, cardioLogs, cheatDays),
    [workoutLogs, cardioLogs, cheatDays]
  );
  const coloredSegments = useMemo(() => {
    let strengthIdx = 0;
    return donutSegments.map((seg) => {
      if (seg.name === "Rest") return { ...seg, color: "var(--t-border-mid)", opacity: 0.6 };
      if (seg.name === "Cardio") return { ...seg, color: "var(--t-accent)", opacity: 0.25 };
      const opacity = Math.max(0.3, 1 - strengthIdx * 0.2);
      strengthIdx++;
      return { ...seg, color: "var(--t-accent)", opacity };
    });
  }, [donutSegments]);
  const donutMessage = useMemo(() => getDonutMessage(donutSegments, userName), [donutSegments, userName]);

  // Weekly bar
  const weeklySessions = useMemo(
    () => getWeeklySessions(workoutLogs, cardioLogs, cheatDays),
    [workoutLogs, cardioLogs, cheatDays]
  );
  const barMessage = useMemo(
    () => getBarMessage(thisWeek.sessions + thisWeek.cardio, userName),
    [thisWeek, userName]
  );

  // Volume trend
  const volumeTrend = useMemo(() => getVolumeTrend(workoutLogs, volumeMode), [workoutLogs, volumeMode]);
  const volumeInsight = useMemo(
    () => getVolumeMessage(volumeTrend, userName, volumeMode),
    [volumeTrend, userName, volumeMode]
  );

  // Best lifts
  const bestLiftsByCategory = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    const filtered = workoutLogs.filter(l => l.date >= cutoffStr);
    const byCategory = {};
    filtered.forEach(l => {
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

  // Food + Sleep charts
  const foodChartData  = useMemo(() => getFoodLast7Days(foodLogs),   [foodLogs]);
  const sleepChartData = useMemo(() => getSleepLast7Days(sleepLogs), [sleepLogs]);

  const avgKcalDay = useMemo(() => {
    const active = foodChartData.filter(d => d.calories > 0);
    if (!active.length) return null;
    return Math.round(active.reduce((a, d) => a + d.calories, 0) / active.length);
  }, [foodChartData]);

  const mostCommonFoodQuality = useMemo(() => {
    const counts = {};
    foodChartData.forEach(d => { if (d.quality) counts[d.quality] = (counts[d.quality] || 0) + 1; });
    return Object.entries(counts).sort(([, a], [, b]) => b - a)[0]?.[0] || null;
  }, [foodChartData]);

  const avgSleepHours = useMemo(() => {
    const active = sleepChartData.filter(d => d.duration > 0);
    if (!active.length) return null;
    return (active.reduce((a, d) => a + d.duration, 0) / active.length).toFixed(1);
  }, [sleepChartData]);

  const hasNutritionData = foodChartData.some(d => d.calories > 0) || sleepChartData.some(d => d.duration > 0);

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
        <div className="border border-gray-200 p-6 mb-8 text-center">
          <p className="text-xs font-bold tracking-[0.3em] mb-2">NO DATA YET</p>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Log your first workout on the Today tab.<br />
            Your stats and charts will appear here.
          </p>
        </div>
      )}

      {/* This Week — always visible */}
      <SummaryCard thisWeek={thisWeek} lastWeek={lastWeek} weekRange={weekRange} />

      {/* Streak + active days — compact stat row */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        <div className="border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold leading-none">{streak}</p>
          <p className="text-[9px] tracking-widest text-gray-400 mt-1.5">DAY STREAK</p>
        </div>
        <div className="border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold leading-none">{activeDaysThisWeek}</p>
          <p className="text-[9px] tracking-widest text-gray-400 mt-1.5">ACTIVE DAYS</p>
        </div>
        <div className="border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold leading-none">{thisWeek.sessions + thisWeek.cardio}</p>
          <p className="text-[9px] tracking-widest text-gray-400 mt-1.5">SESSIONS</p>
        </div>
      </div>

      {/* ── Collapsible chart sections ── */}

      <Section title="TRAINING SPLIT" subtitle="Last 30 days">
        {donutMessage && <p className="text-xs italic text-gray-400 mb-3">{donutMessage}</p>}
        <DonutChart segments={coloredSegments} centerValue={activeDays} centerLabel="ACTIVE DAYS" />
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 justify-center">
          {coloredSegments.map(seg => (
            <div key={seg.name} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5" style={{ backgroundColor: seg.color, opacity: seg.opacity }} />
              <span className="text-[10px] text-gray-400 tracking-wide">{seg.name} {seg.value}d</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="WEEKLY SESSIONS" subtitle="Last 8 weeks">
        {barMessage && <p className="text-xs italic text-gray-400 mb-3">{barMessage}</p>}
        <div className="border border-gray-200 p-3">
          <WeeklyBarChart data={weeklySessions} />
        </div>
        <div className="flex items-center gap-3 mt-2 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-black" />
            <span className="text-[9px] text-gray-400">Strength</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-black opacity-30" />
            <span className="text-[9px] text-gray-400">Cardio</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--t-cheat)" }} />
            <span className="text-[9px] text-gray-400">Cheat</span>
          </div>
        </div>
      </Section>

      <Section title="VOLUME TREND" subtitle={volumeMode === "weekly" ? "Weekly" : "Monthly"}>
        <VolumeTrendChart
          data={volumeTrend}
          mode={volumeMode}
          onModeChange={setVolumeMode}
          insightText={volumeInsight}
        />
      </Section>

      {Object.keys(bestLiftsByCategory).length > 0 && (
        <Section title="BEST LIFTS" subtitle="Last 30 days">
          {Object.entries(bestLiftsByCategory).map(([category, lifts]) => (
            <div key={category} className="mb-4 border border-gray-200 p-3">
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
        </Section>
      )}

      {hasNutritionData && (
        <Section title="NUTRITION & SLEEP" subtitle="Last 7 days">
          <div className="grid grid-cols-2 gap-3">
            {/* Food */}
            <div style={{ border: "1px solid var(--t-border)" }}>
              <div className="p-2.5">
                <p className="text-[10px] font-bold tracking-[0.2em] mb-0.5">FOOD</p>
                {avgKcalDay && <p className="text-[9px] text-gray-400 tracking-wide">{avgKcalDay} avg kcal/day</p>}
                {mostCommonFoodQuality && (
                  <p className="text-[9px] text-gray-400 tracking-wide mb-2">Mostly {mostCommonFoodQuality}</p>
                )}
                {!avgKcalDay && <div className="mb-2" />}
                <ResponsiveContainer width="100%" height={70}>
                  <BarChart data={foodChartData} barSize={14} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fontSize: 8, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      cursor={false}
                      formatter={v => v > 0 ? [`${v} kcal`, "Calories"] : ["—", ""]}
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

            {/* Sleep */}
            <div style={{ border: "1px solid var(--t-border)" }}>
              <div className="p-2.5">
                <p className="text-[10px] font-bold tracking-[0.2em] mb-0.5">SLEEP</p>
                {avgSleepHours && (
                  <p className="text-[9px] text-gray-400 tracking-wide mb-2">{avgSleepHours}h avg / night</p>
                )}
                {!avgSleepHours && <div className="mb-2" />}
                <ResponsiveContainer width="100%" height={70}>
                  <BarChart data={sleepChartData} barSize={14} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fontSize: 8, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={[0, 12]} />
                    <Tooltip
                      cursor={false}
                      formatter={v => v > 0 ? [`${v}h`, "Sleep"] : ["—", ""]}
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
            <div className="flex items-center gap-1">
              <div className="w-2 h-2" style={{ backgroundColor: "#22c55e" }} />
              <span className="text-[9px] text-gray-400">Clean / Great</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2" style={{ backgroundColor: "#f59e0b" }} />
              <span className="text-[9px] text-gray-400">Mixed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2" style={{ backgroundColor: "#ef4444" }} />
              <span className="text-[9px] text-gray-400">Junk / Poor</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2" style={{ backgroundColor: "#d1d5db" }} />
              <span className="text-[9px] text-gray-400">No data</span>
            </div>
          </div>
        </Section>
      )}

      <div className="pb-8" />
    </div>
  );
}
