import React from "react";
import { calcPercentChange } from "../lib/utils";

function Trend({ label, arrow, text, good, bad }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className={bad ? "calendar-cheat" : good ? "" : "text-gray-400"}>
        {arrow} {text}
      </span>
    </div>
  );
}

export default function SummaryCard({ thisWeek, lastWeek, weekRange }) {
  const volChange = calcPercentChange(thisWeek.volume, lastWeek.volume);
  const volNum = volChange !== null ? parseFloat(volChange) : null;

  const cardioMore = thisWeek.cardio > lastWeek.cardio;
  const cardioLess = thisWeek.cardio < lastWeek.cardio;
  const cheatMore = thisWeek.cheat > lastWeek.cheat;
  const cheatLess = thisWeek.cheat < lastWeek.cheat;

  return (
    <div className="border border-black p-4 mb-6 stagger-item">
      <p className="text-[11px] font-bold tracking-[0.12em]">THIS WEEK</p>
      <p className="text-[10px] text-gray-400 tracking-wide mb-3">{weekRange}</p>

      <div className="flex gap-4 border-t border-b border-gray-100 py-3 mb-3">
        <div className="text-center flex-1">
          <p className="text-lg font-bold">{thisWeek.sessions}</p>
          <p className="text-[9px] text-gray-400 tracking-widest">SESSIONS</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-lg font-bold">{thisWeek.cardio}</p>
          <p className="text-[9px] text-gray-400 tracking-widest">CARDIO</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-lg font-bold calendar-cheat">{thisWeek.cheat}</p>
          <p className="text-[9px] text-gray-400 tracking-widest">CHEAT</p>
        </div>
      </div>

      <div className="space-y-1.5 text-xs tracking-wide">
        <Trend
          label="Strength"
          arrow={volNum === null ? "—" : volNum > 0 ? "↑" : volNum < 0 ? "↓" : "→"}
          text={volNum === null ? "" : `${volNum > 0 ? "+" : ""}${volChange}% vs last week`}
          good={volNum > 0}
          bad={volNum < 0}
        />
        <Trend
          label="Cardio"
          arrow={cardioMore ? "↑" : cardioLess ? "↓" : "→"}
          text={cardioMore ? "more than last week" : cardioLess ? "less than last week" : "same as last week"}
          good={cardioMore}
          bad={cardioLess}
        />
        <Trend
          label="Cheat"
          arrow={cheatMore ? "↑" : cheatLess ? "↓" : "→"}
          text={cheatMore ? "more than last week" : cheatLess ? "fewer than last week" : "same as last week"}
          good={cheatLess}
          bad={cheatMore}
        />
      </div>
    </div>
  );
}
