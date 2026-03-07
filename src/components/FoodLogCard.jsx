import React, { useState, useEffect } from "react";
import DrumPicker from "./DrumPicker";
import {
  BreakfastIcon,
  LunchIcon,
  DinnerIcon,
  SnackIcon,
  OtherFoodIcon,
  CleanFoodIcon,
  MixedFoodIcon,
  JunkFoodIcon,
  FlameIcon,
  MacrosBarsIcon,
} from "../icons/FoodIcons";

// ─── Constants ────────────────────────────────────────────────

const MEAL_TYPES = [
  { key: "breakfast", label: "BREAKFAST", Icon: BreakfastIcon },
  { key: "lunch",     label: "LUNCH",     Icon: LunchIcon     },
  { key: "dinner",    label: "DINNER",    Icon: DinnerIcon    },
  { key: "snack",     label: "SNACK",     Icon: SnackIcon     },
  { key: "other",     label: "OTHER",     Icon: OtherFoodIcon },
];

const QUALITY_OPTIONS = [
  { key: "clean", label: "CLEAN", sub: "Whole foods",    Icon: CleanFoodIcon },
  { key: "mixed", label: "MIXED", sub: "Some processed", Icon: MixedFoodIcon },
  { key: "junk",  label: "JUNK",  sub: "Full chaos",     Icon: JunkFoodIcon  },
];

const CAL_RANGES = [
  { label: "<400",    value: 200  },
  { label: "400–600", value: 500  },
  { label: "600–800", value: 700  },
  { label: "800+",    value: 900  },
  { label: "IDK",     value: null },
];

// Generate macro drum items: 0g, 5g, ..., 200g
const MACRO_ITEMS = Array.from({ length: 41 }, (_, i) => ({
  value: i * 5,
  label: `${i * 5}g`,
}));

// ─── Helper ───────────────────────────────────────────────────

function buildInitialMacros(meal) {
  return {
    carbs:   { val: meal?.carbs_g   ?? 45, included: meal?.carbs_g   != null },
    protein: { val: meal?.protein_g ?? 30, included: meal?.protein_g != null },
    fat:     { val: meal?.fat_g     ?? 15, included: meal?.fat_g     != null },
  };
}

// ─── Step Dots ────────────────────────────────────────────────

function StepDots({ current, total, onJump }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => i < current - 1 && onJump(i + 1)}
          style={{
            width: i === current - 1 ? 20 : 6,
            height: 6,
            borderRadius: 3,
            background: i === current - 1 ? "var(--t-text)" : "var(--t-border-mid)",
            border: "none",
            padding: 0,
            cursor: i < current - 1 ? "pointer" : "default",
            transition: "width 0.2s ease, background 0.2s ease",
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────

export default function FoodLogCard({ onClose, meal, onSave }) {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState("forward");

  // Form state
  const [mealType, setMealType] = useState("");
  const [calories, setCalories] = useState(null);   // null = IDK
  const [calInput, setCalInput] = useState("");
  const [calRange, setCalRange] = useState(null);
  const [macros, setMacros] = useState(buildInitialMacros(null));
  const [quality, setQuality] = useState("");
  const [saving, setSaving] = useState(false);

  // Reset / prefill whenever the meal prop changes
  useEffect(() => {
    setStep(1);
    setDir("forward");
    setMealType(meal?.meal_type || "");
    setCalories(meal?.calories ?? null);
    setCalInput(meal?.calories != null ? String(meal.calories) : "");
    setCalRange(null);
    setMacros(buildInitialMacros(meal));
    setQuality(meal?.quality || "");
    setSaving(false);
  }, [meal]);

  const goNext = () => { setDir("forward"); setStep(s => s + 1); };
  const goBack = () => { setDir("back");    setStep(s => s - 1); };
  const jumpTo = (s) => { setDir("back"); setStep(s); };

  const handleSave = async (overrideQuality) => {
    setSaving(true);
    await onSave({
      meal_type:  mealType,
      calories:   calories != null ? parseInt(calories) : null,
      protein_g:  macros.protein.included ? macros.protein.val : null,
      carbs_g:    macros.carbs.included   ? macros.carbs.val   : null,
      fat_g:      macros.fat.included     ? macros.fat.val     : null,
      quality:    overrideQuality !== undefined ? overrideQuality : (quality || null),
    });
    setSaving(false);
    onClose();
  };

  const selectMealType = (key) => {
    setMealType(key);
    setTimeout(goNext, 150);
  };

  const animClass = dir === "forward" ? "step-in" : "step-back";

  // ── Step 1: Meal Type ──────────────────────────────────────
  const step1 = (
    <div>
      <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--t-muted)", marginBottom: 20 }}>
        WHAT MEAL?
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        {MEAL_TYPES.slice(0, 4).map(({ key, label, Icon }) => {
          const selected = mealType === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => selectMealType(key)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "20px 12px",
                border: `1px solid ${selected ? "var(--t-border)" : "var(--t-border-mid)"}`,
                borderRadius: 12,
                background: selected ? "var(--t-accent)" : "transparent",
                color: selected ? "var(--t-accent-text)" : "var(--t-text)",
                transition: "background 0.15s ease, color 0.15s ease, transform 0.15s ease",
                cursor: "pointer",
              }}
            >
              <Icon size={26} />
              <span style={{ fontSize: 10, letterSpacing: "0.2em", fontWeight: 700 }}>{label}</span>
            </button>
          );
        })}
      </div>
      {/* Other — full width */}
      {(() => {
        const { key, label, Icon } = MEAL_TYPES[4];
        const selected = mealType === key;
        return (
          <button
            type="button"
            onClick={() => selectMealType(key)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "16px",
              border: `1px solid ${selected ? "var(--t-border)" : "var(--t-border-mid)"}`,
              borderRadius: 12,
              background: selected ? "var(--t-accent)" : "transparent",
              color: selected ? "var(--t-accent-text)" : "var(--t-text)",
              transition: "background 0.15s ease, color 0.15s ease",
              cursor: "pointer",
            }}
          >
            <Icon size={20} />
            <span style={{ fontSize: 10, letterSpacing: "0.2em", fontWeight: 700 }}>{label}</span>
          </button>
        );
      })()}
    </div>
  );

  // ── Step 2: Calories ──────────────────────────────────────
  const step2 = (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <FlameIcon size={16} style={{ color: "var(--t-muted)" }} />
        <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--t-muted)", margin: 0 }}>
          CALORIES?
        </p>
      </div>

      {/* Range pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {CAL_RANGES.map(r => {
          const selected = calRange === r.label;
          return (
            <button
              key={r.label}
              type="button"
              onClick={() => {
                setCalRange(r.label);
                setCalories(r.value);
                setCalInput(r.value != null ? String(r.value) : "");
              }}
              style={{
                padding: "7px 14px",
                border: `1px solid ${selected ? "var(--t-border)" : "var(--t-border-mid)"}`,
                background: selected ? "var(--t-accent)" : "transparent",
                color: selected ? "var(--t-accent-text)" : r.label === "IDK" ? "var(--t-muted)" : "var(--t-text)",
                fontSize: 10,
                letterSpacing: "0.15em",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Large number input */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ position: "relative", display: "inline-flex", alignItems: "baseline", gap: 6 }}>
          <input
            type="number"
            inputMode="numeric"
            value={calInput}
            placeholder="—"
            onChange={e => {
              setCalInput(e.target.value);
              setCalories(e.target.value ? parseInt(e.target.value) : null);
              setCalRange(null);
            }}
            style={{
              fontSize: 40,
              fontWeight: 300,
              color: "var(--t-text)",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid var(--t-border)",
              outline: "none",
              width: 140,
              textAlign: "center",
              padding: "4px 0",
            }}
          />
          <span style={{ fontSize: 13, color: "var(--t-muted)", letterSpacing: "0.1em" }}>kcal</span>
        </div>
      </div>

      <button
        type="button"
        onClick={goNext}
        className="w-full py-3 bg-black text-white text-xs tracking-widest"
      >
        NEXT →
      </button>
    </div>
  );

  // ── Step 3: Macros ────────────────────────────────────────
  const step3 = (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <MacrosBarsIcon size={16} style={{ color: "var(--t-muted)" }} />
        <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--t-muted)", margin: 0 }}>
          MACROS
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { key: "carbs",   label: "CARBS"   },
          { key: "protein", label: "PROTEIN" },
          { key: "fat",     label: "FAT"     },
        ].map(({ key, label }) => (
          <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <DrumPicker
              key={`${key}-${meal?.id ?? "new"}`}
              items={MACRO_ITEMS}
              initialValue={macros[key].val}
              dim={!macros[key].included}
              label={label}
              onChange={(val) =>
                setMacros(m => ({ ...m, [key]: { val, included: true } }))
              }
            />
            <button
              type="button"
              onClick={() =>
                setMacros(m => ({ ...m, [key]: { ...m[key], included: !m[key].included } }))
              }
              style={{
                fontSize: 9,
                letterSpacing: "0.15em",
                color: macros[key].included ? "var(--t-muted)" : "var(--t-text)",
                background: "transparent",
                border: `1px solid ${macros[key].included ? "var(--t-border-mid)" : "var(--t-border)"}`,
                padding: "4px 10px",
                cursor: "pointer",
                transition: "color 0.15s ease, border-color 0.15s ease",
              }}
            >
              {macros[key].included ? "IDK" : "SET"}
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={goNext}
        className="w-full py-3 bg-black text-white text-xs tracking-widest"
      >
        NEXT →
      </button>
    </div>
  );

  // ── Step 4: Quality ────────────────────────────────────────
  const step4 = (
    <div>
      <p style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--t-muted)", marginBottom: 20 }}>
        HOW CLEAN?
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        {QUALITY_OPTIONS.map(({ key, label, sub, Icon }) => {
          const selected = quality === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setQuality(q => q === key ? "" : key)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "16px 8px",
                border: `1px solid ${selected ? "var(--t-border)" : "var(--t-border-mid)"}`,
                borderRadius: 12,
                background: selected ? "var(--t-accent)" : "transparent",
                color: selected ? "var(--t-accent-text)" : "var(--t-text)",
                transition: "background 0.15s ease, color 0.15s ease",
                cursor: "pointer",
              }}
            >
              <Icon size={22} />
              <span style={{ fontSize: 9, letterSpacing: "0.15em", fontWeight: 700 }}>{label}</span>
              <span style={{ fontSize: 9, color: selected ? "var(--t-accent-text)" : "var(--t-muted)", opacity: 0.8 }}>
                {sub}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={() => handleSave()}
        className="w-full py-3 bg-black text-white text-xs tracking-widest disabled:opacity-50"
      >
        {saving ? "SAVING..." : meal ? "UPDATE MEAL" : "DONE"}
      </button>
    </div>
  );

  const steps = [step1, step2, step3, step4];

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px 20px" }}>
        {/* Header: back + dots */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <button
            type="button"
            onClick={step > 1 ? goBack : onClose}
            style={{
              fontSize: 18,
              color: "var(--t-text)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px 4px 0",
              lineHeight: 1,
            }}
          >
            ←
          </button>

          <StepDots current={step} total={4} onJump={jumpTo} />

          {/* Spacer to center dots */}
          <div style={{ width: 32 }} />
        </div>

        {/* Step content — key forces remount for animation */}
        <div key={`${step}-${dir}`} className={animClass}>
          {steps[step - 1]}
        </div>
      </div>
    </div>
  );
}
