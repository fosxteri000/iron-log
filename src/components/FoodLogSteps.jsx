import React, { useState, useEffect } from "react";
import DrumPicker from "./DrumPicker";
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

const MACRO_ITEMS = Array.from({ length: 61 }, (_, i) => ({
  value: i * 5,
  label: `${i * 5}g`,
}));

function buildInitialMacros(meal) {
  return {
    carbs:   { val: meal?.carbs_g   ?? 45, included: meal?.carbs_g   != null },
    protein: { val: meal?.protein_g ?? 30, included: meal?.protein_g != null },
    fat:     { val: meal?.fat_g     ?? 15, included: meal?.fat_g     != null },
  };
}

// ─── Step dots — 6×6 squares, no border-radius ─────────────

function StepDots({ current, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            background: i === current - 1 ? "var(--t-accent)" : "transparent",
            border: "1px solid var(--t-border)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Navigation row ────────────────────────────────────────

function NavRow({ onBack, onNext, nextLabel = "NEXT →", backLabel = "← BACK", nextDisabled }) {
  return (
    <div className="flex justify-between items-center mt-5">
      <button
        type="button"
        onClick={onBack}
        className="text-[10px] tracking-widest text-gray-400 active:text-black transition-colors"
      >
        {backLabel}
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="text-[10px] tracking-widest disabled:opacity-30 active:opacity-60 transition-opacity"
      >
        {nextLabel}
      </button>
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
  const [macros,   setMacros]   = useState(() => buildInitialMacros(meal));
  const [quality,  setQuality]  = useState(meal?.quality   || "");
  const [saving,   setSaving]   = useState(false);

  // Re-init when editing a different meal
  useEffect(() => {
    setStep(1); setDir("fwd");
    setMealType(meal?.meal_type || "");
    setCalories(meal?.calories  ?? null);
    setCalInput(meal?.calories  != null ? String(meal.calories) : "");
    setCalRange(null);
    setMacros(buildInitialMacros(meal));
    setQuality(meal?.quality || "");
    setSaving(false);
  }, [meal]);

  const goNext = () => { setDir("fwd");  setStep(s => s + 1); };
  const goBack = () => { setDir("back"); setStep(s => s - 1); };

  const handleSave = async () => {
    if (!mealType) return;
    setSaving(true);
    await onSave({
      meal_type:  mealType,
      calories:   calories != null ? parseInt(calories) : null,
      carbs_g:    macros.carbs.included   ? macros.carbs.val   : null,
      protein_g:  macros.protein.included ? macros.protein.val : null,
      fat_g:      macros.fat.included     ? macros.fat.val     : null,
      quality:    quality || null,
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

      {/* 2×2 grid */}
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

      {/* Back / cancel */}
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

  // ── Step 2: Calories ──────────────────────────────────────
  const step2 = (
    <div>
      <p className="text-[10px] tracking-widest text-gray-400 mb-4">CALORIES</p>

      {/* Range pills */}
      <div className="flex flex-wrap gap-1.5 mb-5">
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

      {/* Large underline input */}
      <div className="flex items-baseline justify-center gap-2">
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
          className="w-28 border-b border-black py-1 text-center focus:outline-none bg-transparent"
          style={{ fontSize: 28, fontWeight: 300 }}
        />
        <span className="text-[11px] text-gray-400 tracking-widest">kcal</span>
      </div>

      <NavRow onBack={goBack} onNext={goNext} />
    </div>
  );

  // ── Step 3: Macros ────────────────────────────────────────
  const step3 = (
    <div>
      <p className="text-[10px] tracking-widest text-gray-400 mb-4">MACROS</p>

      <div className="grid grid-cols-3 gap-3">
        {[
          { key: "carbs",   label: "CARBS"   },
          { key: "protein", label: "PROTEIN" },
          { key: "fat",     label: "FAT"     },
        ].map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <DrumPicker
              key={`${key}-${meal?.id ?? "new"}`}
              items={MACRO_ITEMS}
              initialValue={macros[key].val}
              dim={!macros[key].included}
              label={label}
              onChange={val => setMacros(m => ({ ...m, [key]: { val, included: true } }))}
            />
            <button
              type="button"
              onClick={() => setMacros(m => ({ ...m, [key]: { ...m[key], included: !m[key].included } }))}
              className={`text-[9px] tracking-widest py-1 px-2 border transition-colors
                ${!macros[key].included
                  ? "border-black text-black"
                  : "border-gray-200 text-gray-400"}`}
            >
              IDK
            </button>
          </div>
        ))}
      </div>

      <NavRow onBack={goBack} onNext={goNext} />
    </div>
  );

  // ── Step 4: Quality ────────────────────────────────────────
  const step4 = (
    <div>
      <p className="text-[10px] tracking-widest text-gray-400 mb-4">HOW CLEAN?</p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {QUALITY_OPTIONS.map(({ key, label, sub, Icon }) => {
          const active = quality === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setQuality(q => q === key ? "" : key)}
              className={`flex flex-col items-center gap-2 py-4 border text-[9px] tracking-widest font-bold transition-colors
                ${active
                  ? "bg-black text-white border-black"
                  : "border-gray-200 active:border-black"}`}
            >
              <Icon size={20} />
              <span>{label}</span>
              <span
                className="text-[9px] font-normal"
                style={{ opacity: active ? 0.7 : undefined }}
              >
                {sub}
              </span>
            </button>
          );
        })}
      </div>

      {/* DONE full-width */}
      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="w-full py-3 bg-black text-white text-xs tracking-widest disabled:opacity-50"
      >
        {saving ? "SAVING..." : meal ? "UPDATE MEAL" : "DONE"}
      </button>

      <div className="flex justify-start mt-3">
        <button
          type="button"
          onClick={goBack}
          className="text-[10px] tracking-widest text-gray-400 active:text-black transition-colors"
        >
          ← BACK
        </button>
      </div>
    </div>
  );

  const steps = [step1, step2, step3, step4];

  return (
    <div className="p-4">
      {/* Header: dots */}
      <div className="flex items-center justify-between mb-5">
        <StepDots current={step} total={4} />
      </div>

      {/* Step content — overflow hidden for slide animation */}
      <div className="food-steps-container">
        <div key={`${step}-${dir}`} className={animClass}>
          {steps[step - 1]}
        </div>
      </div>
    </div>
  );
}
