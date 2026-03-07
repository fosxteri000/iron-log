import React from "react";
import LineChart from "./LineChart";

export default function VolumeTrendChart({ data, mode, onModeChange, insightText }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[11px] font-bold tracking-[0.12em]">VOLUME TREND</p>
        <div className="flex border border-gray-200 overflow-hidden">
          {["weekly", "monthly"].map(m => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`px-2 py-0.5 text-[9px] tracking-widest transition-colors
                ${mode === m ? "bg-black text-white" : "text-gray-400 active:bg-gray-50"}`}
            >
              {m === "weekly" ? "WEEKLY" : "MONTHLY"}
            </button>
          ))}
        </div>
      </div>

      {data.length >= 2 ? (
        <>
          <div className="border border-gray-200 p-3 mt-2">
            <LineChart data={data} height={90} />
          </div>
          {insightText && (
            <p className="text-xs italic text-gray-400 mt-2">{insightText}</p>
          )}
        </>
      ) : (
        <div className="text-center py-6 border border-gray-200 mt-2">
          <p className="text-[10px] tracking-[0.3em] text-gray-300">NOT ENOUGH DATA</p>
        </div>
      )}
    </div>
  );
}
