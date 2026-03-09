import React from "react";
import LineChart from "./LineChart";

export default function VolumeTrendChart({ data, mode, onModeChange, insightText }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <p className="text-[11px] font-bold tracking-[0.12em]">VOLUME TREND</p>
        <div className="flex border border-gray-200 overflow-hidden w-fit">
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
          <div className="border border-gray-200 p-3 overflow-x-auto -mx-3">
            <div style={{ minWidth: "350px" }}>
              <LineChart data={data} height={100} />
            </div>
          </div>
          {insightText && (
            <p className="text-[11px] italic text-gray-400 mt-2 leading-relaxed">{insightText}</p>
          )}
        </>
      ) : (
        <div className="text-center py-8 border border-gray-200">
          <p className="text-[10px] tracking-[0.3em] text-gray-300">NOT ENOUGH DATA</p>
        </div>
      )}
    </div>
  );
}
