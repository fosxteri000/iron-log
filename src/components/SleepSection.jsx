import React, { useState } from "react";
import { useSleepLog } from "../hooks/useSleepLog";
import Collapse from "./Collapse";
import { MoonIcon, EditIcon } from "./Icons";

const DURATION_OPTIONS = [
  { label: "<6h",  hours: 5   },
  { label: "6-7h", hours: 6.5 },
  { label: "7-8h", hours: 7.5 },
  { label: "8h+",  hours: 8.5 },
];
const QUALITY_OPTIONS = ["Poor", "OK", "Great"];

function formatDuration(hours) {
  if (hours == null) return null;
  if (hours === 5) return "<6h";
  if (hours === 6.5) return "6-7h";
  if (hours === 7.5) return "7-8h";
  if (hours === 8.5) return "8h+";
  return `${hours}h`;
}

function buildSummary(log) {
  const parts = [];
  if (log.duration_hours != null) parts.push(formatDuration(log.duration_hours));
  if (log.quality) parts.push(log.quality.charAt(0).toUpperCase() + log.quality.slice(1));
  return parts.join(" · ");
}

export default function SleepSection() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [duration, setDuration] = useState(null);  // hours value
  const [quality, setQuality] = useState("");
  const [validationErr, setValidationErr] = useState("");
  const [saving, setSaving] = useState(false);

  const { log, saveSleep } = useSleepLog();

  const resetForm = () => {
    setDuration(null);
    setQuality("");
    setValidationErr("");
  };

  const startEdit = () => {
    setDuration(log?.duration_hours ?? null);
    setQuality(log?.quality ?? "");
    setValidationErr("");
    setEditing(true);
  };

  const handleSave = async () => {
    if (duration == null && !quality) {
      setValidationErr("Select at least duration or quality");
      return;
    }
    setSaving(true);
    const { error } = await saveSleep({
      duration_hours: duration,
      quality: quality.toLowerCase() || null,
    });
    setSaving(false);
    if (!error) {
      resetForm();
      setEditing(false);
    }
  };

  const showForm = !log || editing;

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <MoonIcon size={14} className="text-gray-500" />
          <span className="text-xs font-bold tracking-[0.3em] uppercase">SLEEP</span>
          {log && !editing && (
            <span className="text-[10px] text-gray-400 tracking-widest">{buildSummary(log)}</span>
          )}
        </div>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <Collapse open={open}>
        <div className="pt-3 pb-2">
          {/* Summary row with edit — shown only when saved and not editing */}
          {log && !editing && (
            <div className="flex justify-between items-center py-2.5 border-b border-gray-100 mb-3">
              <div>
                <p className="text-[10px] text-gray-400 tracking-widest mb-0.5">LAST SAVED</p>
                <p className="text-sm font-bold">{buildSummary(log)}</p>
              </div>
              <button
                type="button"
                onClick={startEdit}
                className="text-gray-300 active:text-black transition-colors p-1"
                aria-label="Edit sleep log"
              >
                <EditIcon size={14} />
              </button>
            </div>
          )}

          {/* Form — shown when no log today or when editing */}
          {showForm && (
            <div className="space-y-4 fade-in">
              {/* Duration */}
              <div>
                <label className="text-[10px] tracking-widest text-gray-400 block mb-2">DURATION</label>
                <div className="flex gap-1 flex-wrap">
                  {DURATION_OPTIONS.map(opt => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => { setDuration(duration === opt.hours ? null : opt.hours); setValidationErr(""); }}
                      className={`py-1.5 px-3 border text-[10px] tracking-wide transition-colors
                        ${duration === opt.hours
                          ? "bg-black text-white border-black"
                          : "border-gray-200 active:border-black"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div>
                <label className="text-[10px] tracking-widest text-gray-400 block mb-2">QUALITY</label>
                <div className="flex gap-1">
                  {QUALITY_OPTIONS.map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => { setQuality(quality === q ? "" : q); setValidationErr(""); }}
                      className={`py-1.5 px-3 border text-[10px] tracking-wide transition-colors
                        ${quality === q
                          ? "bg-black text-white border-black"
                          : "border-gray-200 active:border-black"}`}
                    >
                      {q.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {validationErr && (
                <p className="text-[10px] text-red-500">{validationErr}</p>
              )}

              <div className="flex gap-2">
                {editing && (
                  <button
                    type="button"
                    onClick={() => { resetForm(); setEditing(false); }}
                    className="flex-1 py-3 border border-black text-xs tracking-widest active:bg-gray-100 transition-colors"
                  >
                    CANCEL
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-black text-white text-xs tracking-widest disabled:opacity-50"
                >
                  {saving ? "SAVING..." : "SAVE SLEEP"}
                </button>
              </div>
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
}
