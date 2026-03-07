import React, { useMemo, useState } from "react";
import { useProgressData } from "../hooks/useExercises";
import { useCheatDays } from "../hooks/useCheatDays";
import { useProfile } from "../hooks/useProfile";
import { useFoodLogs } from "../hooks/useFoodLog";
import { useSleepLogs } from "../hooks/useSleepLog";
import { formatFullDate, getStartOfWeek } from "../lib/utils";
import {
  getWeekSummary, getCurrentStreak, getBalanceData,
  getSplitBreakdown, getWeeklySessions, getVolumeTrend, getBestSession,
} from "../lib/statsQueries";
import { getDonutMessage, getBarMessage, getVolumeMessage } from "../lib/statsInsights";
import { getFoodWeekStats } from "../lib/foodStats";
import { getSleepWeekStats } from "../lib/sleepStats";
import { TrophyIcon } from "../components/Icons";
import SummaryCard from "../components/SummaryCard";
import InsightStrip from "../components/InsightStrip";
import DonutChart from "../components/DonutChart";
import WeeklyBarChart from "../components/WeeklyBarChart";
import VolumeTrendChart from "../components/VolumeTrendChart";

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

  // Section 1: Summary
  const thisWeek = useMemo(() => getWeekSummary(workoutLogs, cardioLogs, cheatDays, 0), [workoutLogs, cardioLogs, cheatDays]);
  const lastWeek = useMemo(() => getWeekSummary(workoutLogs, cardioLogs, cheatDays, 1), [workoutLogs, cardioLogs, cheatDays]);

  // Section 2: Insights
  const streak = useMemo(() => getCurrentStreak(workoutLogs, cardioLogs), [workoutLogs, cardioLogs]);
  const balance = useMemo(() => getBalanceData(workoutLogs, 30), [workoutLogs]);
  const bestSession = useMemo(() => getBestSession(workoutLogs), [workoutLogs]);

  const consistency = useMemo(() => {
    const start = getStartOfWeek();
    const startStr = start.toISOString().split("T")[0];
    const activeDates = new Set([
      ...workoutLogs.filter(l => l.date >= startStr).map(l => l.date),
      ...cardioLogs.filter(l => l.date >= startStr).map(l => l.date),
    ]);
    return { activeDays: activeDates.size, streak };
  }, [workoutLogs, cardioLogs, streak]);

  // Section 3: Donut
  const { segments: donutSegments, activeDays } = useMemo(
    () => getSplitBreakdown(workoutLogs, cardioLogs, cheatDays),
    [workoutLogs, cardioLogs, cheatDays]
  );

  const coloredSegments = useMemo(() => {
    let strengthIdx = 0;
    return donutSegments.map((seg) => {
      if (seg.name === "Rest") {
        return { ...seg, color: "var(--t-border-mid)", opacity: 0.6 };
      }
      if (seg.name === "Cardio") {
        return { ...seg, color: "var(--t-accent)", opacity: 0.25 };
      }
      const opacity = Math.max(0.3, 1 - strengthIdx * 0.2);
      strengthIdx++;
      return { ...seg, color: "var(--t-accent)", opacity };
    });
  }, [donutSegments]);

  const donutMessage = useMemo(() => getDonutMessage(donutSegments, userName), [donutSegments, userName]);

  // Section 4: Bar
  const weeklySessions = useMemo(
    () => getWeeklySessions(workoutLogs, cardioLogs, cheatDays),
    [workoutLogs, cardioLogs, cheatDays]
  );
  const barMessage = useMemo(
    () => getBarMessage(thisWeek.sessions + thisWeek.cardio, userName),
    [thisWeek, userName]
  );

  // Section 5: Volume trend
  const volumeTrend = useMemo(() => getVolumeTrend(workoutLogs, volumeMode), [workoutLogs, volumeMode]);
  const volumeInsight = useMemo(
    () => getVolumeMessage(volumeTrend, userName, volumeMode),
    [volumeTrend, userName, volumeMode]
  );

  // Section 2b: Food + Sleep insight cards
  const foodStats = useMemo(() => getFoodWeekStats(foodLogs), [foodLogs]);
  const sleepStats = useMemo(() => getSleepWeekStats(sleepLogs), [sleepLogs]);

  // Section 6: Best lifts (last 30 days, grouped by category)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[10px] tracking-[0.3em] text-gray-300">
        LOADING...
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-wide">PROGRESS</h2>
        <p className="text-[10px] tracking-[0.2em] text-gray-400 mt-1">{formatFullDate()}</p>
      </div>

      {/* 1. Summary Card */}
      <SummaryCard thisWeek={thisWeek} lastWeek={lastWeek} weekRange={weekRange} />

      {/* 2. Insight Strip */}
      <InsightStrip
        consistency={consistency}
        balance={balance}
        bestSession={bestSession}
        food={foodStats}
        sleep={sleepStats}
      />

      {/* 3. Donut — Training Split Breakdown */}
      <div className="mb-6">
        <p className="text-[11px] font-bold tracking-[0.12em] mb-0.5">HOW YOU SPLIT YOUR TIME</p>
        <p className="text-[10px] text-gray-400 tracking-wide mb-1">Last 30 days</p>
        {donutMessage && <p className="text-xs italic text-gray-400 mb-3">{donutMessage}</p>}

        <DonutChart
          segments={coloredSegments}
          centerValue={activeDays}
          centerLabel="ACTIVE DAYS"
        />

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 justify-center">
          {coloredSegments.map(seg => (
            <div key={seg.name} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5"
                style={{ backgroundColor: seg.color, opacity: seg.opacity }}
              />
              <span className="text-[10px] text-gray-400 tracking-wide">
                {seg.name} {seg.value}d
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Weekly Bar Chart */}
      <div className="mb-6">
        <p className="text-[11px] font-bold tracking-[0.12em] mb-0.5">WEEKLY SESSIONS</p>
        <p className="text-[10px] text-gray-400 tracking-wide mb-1">Last 8 weeks</p>
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
      </div>

      {/* 5. Volume Trend */}
      <VolumeTrendChart
        data={volumeTrend}
        mode={volumeMode}
        onModeChange={setVolumeMode}
        insightText={volumeInsight}
      />

      {/* 6. Best Lifts */}
      {Object.keys(bestLiftsByCategory).length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4 border-b border-black pb-2">
            <TrophyIcon size={12} className="text-gray-400" />
            <p className="text-xs font-bold tracking-[0.3em]">BEST LIFTS</p>
          </div>
          <p className="text-[10px] text-gray-400 tracking-wide mb-3">Last 30 days</p>

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
        </div>
      )}
    </div>
  );
}
