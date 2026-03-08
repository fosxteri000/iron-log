import React, { useState, useEffect } from "react";
import {
  BreakfastIcon, LunchIcon, DinnerIcon, SnackIcon, OtherFoodIcon,
  CleanFoodIcon, MixedFoodIcon, JunkFoodIcon,
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

// ─── Step dots ───────────────────────────────────────────────

function StepDots({ current, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: 6, height: 6,
            background: i === current - 1 ? "var(--t-accent)" : "transparent",
            border: "1px solid var(--t-border)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────

export default function FoodLogSteps({ meal, onSave, onClose }) {
  const [step, setStep] = useState(1);
  const [dir,  setDir]  = useState("fwd");

  const [mealType, setMealType] = useState(meal?.meal_type || "");
  const [calories, setCalories] = useState(meal?.calories  ?? null);
  const [calInput, setCalInput] = useState(meal?.calories  != null ? String(meal.calories) : "");
  const [calRange, setCalRange] = useState(null);
  const [quality,  setQuality]  = useState(meal?.quality   || "");
  const [saving,   setSaving]   = useState(false);

  // Re-init when editing a different meal
  useEffect(() => {
    setStep(1); setDir("fwd");
    setMealType(meal?.meal_type || "");
    setCalories(meal?.calories  ?? null);
    setCalInput(meal?.calories  != null ? String(meal.calories) : "");
    setCalRange(null);
    setQuality(meal?.quality || "");
    setSaving(false);
  }, [meal]);

  const goNext = () => { setDir("fwd");  setStep(s => s + 1); };
  const goBack = () => { setDir("back"); setStep(s => s - 1); };

  const handleSave = async () => {
    if (!mealType) return;
    setSaving(true);
    await onSave({
      meal_type: mealType,
      calories:  calories != null ? parseInt(calories) : null,
      quality:   quality || null,
    });
    setSaving(false);
    onClose();
  };

  const selectMealType = (key) => {
    setMealType(key);
    setTimeout(goNext, 120);
  };

  const animClass = dir === "fwd" ? "food-step-fwd" : "food-step-back";

  // ── Step 1: Meal Type ──────────────────────────────────────
  const step1 = (
    <div>
      <p className="text-[10px] tracking-widest text-gray-400 mb-4">WHAT MEAL?</p>

      <div className="grid grid-cols-2 gap-2 mb-2">
        {MEAL_TYPES.slice(0, 4).map(({ key, label, Icon }) => {
          const active = mealType === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => selectMealType(key)}
              className={`flex flex-col items-center gap-2.5 py-5 border text-[10px] tracking-widest font-bold transition-colors
                ${active
                  ? "bg-black text-white border-black"
                  : "border-gray-200 active:border-black"}`}
            >
              <Icon size={22} />
              {label}
            </button>
          );
        })}
      </div>

      {/* OTHER — full width */}
      {(() => {
        const { key, label, Icon } = MEAL_TYPES[4];
        const active = mealType === key;
        return (
          <button
            type="button"
            onClick={() => selectMealType(key)}
            className={`w-full flex items-center justify-center gap-3 py-3.5 border text-[10px] tracking-widest font-bold transition-colors
              ${active
                ? "bg-black text-white border-black"
                : "border-gray-200 active:border-black"}`}
          >
            <Icon size={18} />
            {label}
          </button>
        );
      })()}

      <div className="flex justify-start mt-4">
        <button
          type="button"
          onClick={onClose}
          className="text-[10px] tracking-widest text-gray-400 active:text-black transition-colors"
        >
          ← CANCEL
        </button>
      </div>
    </div>
  );

  // ── Step 2: Calories + Quality (combined) ──────────────────
  const step2 = (
    <div>
      {/* Calories */}
      <p className="text-[10px] tracking-widest text-gray-400 mb-3">CALORIES</p>

      <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
        {CAL_RANGES.map(r => {
          const active = calRange === r.label;
          return (
            <button
              key={r.label}
              type="button"
              onClick={() => {
                setCalRange(r.label);
                setCalories(r.value);
                setCalInput(r.value != null ? String(r.value) : "");
              }}
              className={`py-1 px-3 border text-[10px] tracking-wide font-medium transition-colors
                ${active
                  ? "bg-black text-white border-black"
                  : r.label === "IDK"
                    ? "border-gray-200 text-gray-400"
                    : "border-gray-200 active:border-black"}`}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-1 mb-5">
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
          className="w-32 border-b border-black py-1 text-center focus:outline-none bg-transparent"
          style={{ fontSize: 40, fontWeight: 300, lineHeight: 1 }}
        />
        <span className="text-[10px] text-gray-400 tracking-widest">kcal</span>
      </div>

      {/* Quality */}
      <div className="border-t border-gray-100 pt-4 mb-4">
        <p className="text-[10px] tracking-widest text-gray-400 mb-3">HOW CLEAN?</p>
        <div className="grid grid-cols-3 gap-2">
          {QUALITY_OPTIONS.map(({ key, label, sub, Icon }) => {
            const active = quality === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setQuality(q => q === key ? "" : key)}
                className={`flex flex-col items-center gap-2 py-4 border text-[10px] tracking-widest font-bold transition-colors
                  ${active
                    ? "bg-black text-white border-black"
                    : "border-gray-200 active:border-black"}`}
              >
                <Icon size={20} />
                <span>{label}</span>
                <span className="text-[10px] font-normal" style={{ opacity: active ? 0.6 : undefined, color: active ? undefined : "#9ca3af" }}>
                  {sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="w-full py-3 bg-black text-white text-xs tracking-widest disabled:opacity-50 mb-3"
      >
        {saving ? "SAVING..." : meal ? "UPDATE MEAL" : "DONE"}
      </button>

      <button
        type="button"
        onClick={goBack}
        className="text-[10px] tracking-widest text-gray-400 active:text-black transition-colors"
      >
        ← BACK
      </button>
    </div>
  );

  const steps = [step1, step2];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-5">
        <StepDots current={step} total={2} />
      </div>

      <div className="food-steps-container">
        <div key={`${step}-${dir}`} className={animClass}>
          {steps[step - 1]}
        </div>
      </div>
    </div>
  );
}
