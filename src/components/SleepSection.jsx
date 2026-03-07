import React, { useState } from "react";
import { useSleepLog } from "../hooks/useSleepLog";
import Collapse from "./Collapse";
import SleepLogCard from "./SleepLogCard";
import { MoonIcon, EditIcon } from "./Icons";

// ─── Helpers ──────────────────────────────────────────────────

function formatDur(hours) {
  if (hours == null) return null;
  return `${hours}h`;
}

function cap(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildSummary(log) {
  const parts = [];
  if (log.duration_hours != null) parts.push(formatDur(log.duration_hours));
  if (log.quality)                parts.push(cap(log.quality));
  return parts.join(" · ") || "Logged";
}

// ─── Component ────────────────────────────────────────────────

export default function SleepSection() {
  const [open, setOpen]         = useState(false);
  const [cardOpen, setCardOpen] = useState(false);

  const { log, saveSleep } = useSleepLog();

  const openCard  = () => setCardOpen(true);
  const closeCard = () => setCardOpen(false);

  const handleSave = async (data) => {
    await saveSleep(data);
  };

  return (
    <div className="mb-4">
      {/* Section header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <MoonIcon size={14} className="text-gray-500" />
          <span className="text-xs font-bold tracking-[0.3em] uppercase">SLEEP</span>
          {log && (
            <span className="text-[10px] text-gray-400 tracking-widest">
              {buildSummary(log)}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <Collapse open={open}>
        <div className="pt-2 pb-2">
          {log ? (
            /* Saved sleep row */
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100 mb-3">
              <div>
                <p className="text-[10px] text-gray-400 tracking-widest mb-0.5">LAST NIGHT</p>
                <p className="text-sm font-bold">{buildSummary(log)}</p>
              </div>
              <button
                type="button"
                onClick={openCard}
                className="text-gray-300 active:text-black transition-colors p-1"
                aria-label="Edit sleep log"
              >
                <EditIcon size={14} />
              </button>
            </div>
          ) : (
            /* Log sleep button */
            <button
              onClick={openCard}
              className="w-full py-3.5 border border-black text-xs tracking-widest active:bg-black active:text-white transition-colors mb-3"
            >
              + LOG SLEEP
            </button>
          )}
        </div>
      </Collapse>

      {/* Bottom sheet card */}
      <SleepLogCard
        key={log?.id ?? "new-sleep"}
        open={cardOpen}
        onClose={closeCard}
        log={log}
        onSave={handleSave}
      />
    </div>
  );
}
