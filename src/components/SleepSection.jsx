import React, { useState } from "react";
import { useSleepLog } from "../hooks/useSleepLog";
import Collapse from "./Collapse";
import DrumPicker from "./DrumPicker";
import { MoonIcon, EditIcon } from "./Icons";

// ─── Drum data ────────────────────────────────────────────────

// 1.0h … 12.0h in 0.5h steps
const DURATION_ITEMS = Array.from({ length: 23 }, (_, i) => {
  const h = 1 + i * 0.5;
  return { value: h, label: `${h}h` };
});

const QUALITY_ITEMS = [
  { value: "poor",  label: "POOR"  },
  { value: "ok",    label: "OK"    },
  { value: "great", label: "GREAT" },
];

const DEFAULT_DUR  = 7;
const DEFAULT_QUAL = "ok";

// ─── Helpers ──────────────────────────────────────────────────

function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

function buildSummary(log) {
  const parts = [];
  if (log.duration_hours != null) parts.push(`${log.duration_hours}h`);
  if (log.quality)                parts.push(cap(log.quality));
  return parts.join(" · ") || "Logged";
}

// ─── Component ────────────────────────────────────────────────

export default function SleepSection() {
  const [open,    setOpen]    = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const [durVal,      setDurVal]      = useState(DEFAULT_DUR);
  const [qualVal,     setQualVal]     = useState(DEFAULT_QUAL);
  const [durTouched,  setDurTouched]  = useState(false);
  const [qualTouched, setQualTouched] = useState(false);
  const [saving,      setSaving]      = useState(false);

  const { log, saveSleep } = useSleepLog();

  const openLog = () => {
    // Pre-fill drums from saved log if editing
    setDurVal(log?.duration_hours   ?? DEFAULT_DUR);
    setQualVal(log?.quality         ?? DEFAULT_QUAL);
    setDurTouched(log?.duration_hours != null);
    setQualTouched(log?.quality       != null);
    setLogOpen(true);
  };

  const closeLog = () => setLogOpen(false);

  const untouched = !durTouched && !qualTouched;

  const handleSave = async () => {
    setSaving(true);
    await saveSleep({
      duration_hours: durTouched  ? durVal  : null,
      quality:        qualTouched ? qualVal : null,
    });
    setSaving(false);
    closeLog();
  };

  return (
    <div className="mb-4">
      {/* Section header — identical to Cardio */}
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

          {/* Saved row — shown when logged and form is closed */}
          {log && !logOpen && (
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100 mb-3">
              <div>
                <p className="text-[10px] text-gray-400 tracking-widest mb-0.5">LAST NIGHT</p>
                <p className="text-sm font-bold">{buildSummary(log)}</p>
              </div>
              <button
                type="button"
                onClick={openLog}
                className="text-gray-300 active:text-black transition-colors p-1"
                aria-label="Edit sleep log"
              >
                <EditIcon size={14} />
              </button>
            </div>
          )}

          {/* + LOG SLEEP button — only shown when no log yet */}
          {!log && (
            <button
              onClick={openLog}
              className="w-full py-3.5 border border-black text-xs tracking-widest active:bg-black active:text-white transition-colors mb-3"
            >
              + LOG SLEEP
            </button>
          )}

          {/* Inline drum form — Collapse same as Cardio log form */}
          <Collapse open={logOpen}>
            <div className="mb-4 border border-gray-200 fade-in">
              <div className="p-4">

                {/* Two drum columns side by side, sharp border divider */}
                <div className="grid grid-cols-2" style={{ borderBottom: "1px solid var(--t-border-mid)" }}>
                  {/* Duration */}
                  <div className="py-2 pr-3" style={{ borderRight: "1px solid var(--t-border-mid)" }}>
                    <DrumPicker
                      key={`dur-${logOpen}`}
                      items={DURATION_ITEMS}
                      initialValue={durVal}
                      label="DURATION"
                      onChange={val => { setDurVal(val); setDurTouched(true); }}
                    />
                  </div>

                  {/* Quality */}
                  <div className="py-2 pl-3">
                    <DrumPicker
                      key={`qual-${logOpen}`}
                      items={QUALITY_ITEMS}
                      initialValue={qualVal}
                      label="QUALITY"
                      onChange={val => { setQualVal(val); setQualTouched(true); }}
                    />
                  </div>
                </div>

                {/* Save / Skip button — full width, same as Cardio SAVE */}
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="w-full py-3 bg-black text-white text-xs tracking-widest disabled:opacity-50 mt-4"
                >
                  {saving
                    ? "SAVING..."
                    : untouched
                      ? "SKIP"
                      : log
                        ? "UPDATE SLEEP"
                        : "SAVE SLEEP"}
                </button>

                {/* Cancel */}
                <div className="flex justify-start mt-3">
                  <button
                    type="button"
                    onClick={closeLog}
                    className="text-[10px] tracking-widest text-gray-400 active:text-black transition-colors"
                  >
                    ← CANCEL
                  </button>
                </div>

              </div>
            </div>
          </Collapse>

        </div>
      </Collapse>
    </div>
  );
}
