import React, { useState, useEffect } from "react";
import BottomSheet from "./BottomSheet";
import DrumPicker from "./DrumPicker";
import { HourglassIcon, SparkleIcon } from "../icons/SleepIcons";

// Duration: 1h … 12h in 0.5h steps
const DURATION_ITEMS = Array.from({ length: 23 }, (_, i) => {
  const h = 1 + i * 0.5;
  return { value: h, label: `${h}h` };
});

const QUALITY_ITEMS = [
  { value: "poor",  label: "Poor"  },
  { value: "ok",    label: "OK"    },
  { value: "great", label: "Great" },
];

const DEFAULT_DUR = 7;
const DEFAULT_QUAL = "ok";

export default function SleepLogCard({ open, onClose, log, onSave }) {
  const [durVal,  setDurVal]  = useState(log?.duration_hours ?? DEFAULT_DUR);
  const [qualVal, setQualVal] = useState(log?.quality        ?? DEFAULT_QUAL);
  const [durTouched,  setDurTouched]  = useState(false);
  const [qualTouched, setQualTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  // Re-init when log prop changes (edit vs new)
  useEffect(() => {
    setDurVal(log?.duration_hours ?? DEFAULT_DUR);
    setQualVal(log?.quality       ?? DEFAULT_QUAL);
    setDurTouched(log?.duration_hours != null);
    setQualTouched(log?.quality != null);
    setSaving(false);
  }, [log]);

  const untouched = !durTouched && !qualTouched;

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      duration_hours: durTouched  ? durVal  : null,
      quality:        qualTouched ? qualVal : null,
    });
    setSaving(false);
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div style={{ padding: "16px 24px 40px" }}>
        {/* Title */}
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.3em",
            color: "var(--t-muted)",
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          SLEEP
        </p>

        {/* Dual drums */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {/* Duration drum */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <HourglassIcon size={16} style={{ color: "var(--t-muted)" }} />
            <DrumPicker
              key={`dur-${log?.id ?? "new"}`}
              items={DURATION_ITEMS}
              initialValue={log?.duration_hours ?? DEFAULT_DUR}
              label="DURATION"
              onChange={(val) => {
                setDurVal(val);
                setDurTouched(true);
              }}
            />
          </div>

          {/* Quality drum */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <SparkleIcon size={16} style={{ color: "var(--t-muted)" }} />
            <DrumPicker
              key={`qual-${log?.id ?? "new"}`}
              items={QUALITY_ITEMS}
              initialValue={log?.quality ?? DEFAULT_QUAL}
              label="QUALITY"
              onChange={(val) => {
                setQualVal(val);
                setQualTouched(true);
              }}
            />
          </div>
        </div>

        {/* Save / Skip button */}
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="w-full py-3 bg-black text-white text-xs tracking-widest disabled:opacity-50"
        >
          {saving
            ? "SAVING..."
            : untouched
              ? "SKIP"
              : log
                ? "UPDATE SLEEP"
                : "SAVE SLEEP"}
        </button>
      </div>
    </BottomSheet>
  );
}
