import React from "react";
import { formatDate } from "../lib/utils";

function getBalanceVerdict(balance) {
  const values = Object.values(balance);
  if (values.length <= 1) return "";
  const max = Math.max(...values);
  const min = Math.min(...values);
  if (max - min <= 10) return "Well balanced this month ✓";
  const weakest = Object.entries(balance).sort(([, a], [, b]) => a - b)[0][0];
  return `${weakest} day calling 👀`;
}

export default function InsightStrip({ consistency, balance, bestSession, food, sleep }) {
  return (
    <div className="relative mb-6">
      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
      {/* Consistency */}
      <div className="min-w-[160px] border border-gray-200 p-3 flex-shrink-0">
        <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 mb-2">CONSISTENCY</p>
        <p className="text-xs leading-relaxed mb-1">
          You showed up <span className="font-bold">{consistency.activeDays} of 7</span> days
        </p>
        {consistency.streak > 0 && (
          <p className="text-[10px] text-gray-400">
            Streak: {consistency.streak} day{consistency.streak !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Balance */}
      {Object.keys(balance).length > 1 && (
        <div className="min-w-[160px] border border-gray-200 p-3 flex-shrink-0">
          <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 mb-2">BALANCE</p>
          <p className="text-xs leading-relaxed mb-1">
            {Object.entries(balance).map(([cat, pct], i) => (
              <span key={cat}>{i > 0 && " · "}{cat} {pct}%</span>
            ))}
          </p>
          <p className="text-[10px] text-gray-400">{getBalanceVerdict(balance)}</p>
        </div>
      )}

      {/* Best Session */}
      {bestSession && (
        <div className="min-w-[160px] border border-gray-200 p-3 flex-shrink-0">
          <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 mb-2">BEST SESSION</p>
          <p className="text-xs leading-relaxed mb-1">
            <span className="font-bold">{formatDate(bestSession.date)}</span> — {bestSession.volume.toLocaleString()} kg
          </p>
          <p className="text-[10px] text-gray-400">Your strongest session this month</p>
        </div>
      )}

      {/* Food — This Week */}
      {food && (
        <div className="min-w-[160px] border border-gray-200 p-3 flex-shrink-0">
          <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 mb-2">NUTRITION (THIS WEEK)</p>
          <p className="text-xs leading-relaxed mb-1">
            <span className="font-bold">{food.meals}</span> meal{food.meals !== 1 ? "s" : ""} logged
          </p>
          {food.avgCalories && (
            <p className="text-[10px] text-gray-400">Avg ~{food.avgCalories} kcal/meal</p>
          )}
          {food.avgProtein && (
            <p className="text-[10px] text-gray-400">Protein avg {food.avgProtein}g 💪</p>
          )}
          {food.qualityBreakdown && (
            <p className="text-[10px] text-gray-400 mt-0.5">
              {food.qualityBreakdown.clean > 0 && `Clean ${food.qualityBreakdown.clean}%`}
              {food.qualityBreakdown.mixed > 0 && ` · Mixed ${food.qualityBreakdown.mixed}%`}
              {food.qualityBreakdown.junk > 0 && ` · Junk ${food.qualityBreakdown.junk}%`}
            </p>
          )}
        </div>
      )}

      {/* Sleep — This Week */}
      {sleep && (
        <div className="min-w-[160px] border border-gray-200 p-3 flex-shrink-0">
          <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 mb-2">SLEEP (THIS WEEK)</p>
          {sleep.avgHours != null && (
            <p className="text-xs leading-relaxed mb-1">
              Avg <span className="font-bold">{sleep.avgHours}h</span> per night
            </p>
          )}
          {sleep.qualityLabel && (
            <p className="text-[10px] text-gray-400">
              Quality: {sleep.qualityLabel}{sleep.qualityTrend ? ` ${sleep.qualityTrend}` : ""}
            </p>
          )}
          {sleep.bestNight && (
            <p className="text-[10px] text-gray-400 mt-0.5">
              Best: {sleep.bestNight.duration_hours}h
              {sleep.bestNight.quality && ` · ${sleep.bestNight.quality.charAt(0).toUpperCase() + sleep.bestNight.quality.slice(1)}`}
              {` (${formatDate(sleep.bestNight.date)})`}
            </p>
          )}
        </div>
      )}
      </div>
      {/* Right-edge gradient: hints horizontal scroll */}
      <div
        className="absolute right-0 top-0 bottom-2 w-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, var(--t-bg, white))" }}
      />
    </div>
  );
}
