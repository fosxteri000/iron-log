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

export default function InsightStrip({ consistency, balance, bestSession }) {
  return (
    <div
      className="flex gap-3 overflow-x-auto pb-2 mb-6"
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
    </div>
  );
}
