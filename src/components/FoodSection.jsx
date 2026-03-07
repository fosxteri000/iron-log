import React, { useState } from "react";
import { useFoodLog } from "../hooks/useFoodLog";
import Collapse from "./Collapse";
import { ForkKnifeIcon, EditIcon } from "./Icons";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

const CAL_RANGES = [
  { label: "<400",     midpoint: 200 },
  { label: "400-600",  midpoint: 500 },
  { label: "600-800",  midpoint: 700 },
  { label: "800+",     midpoint: 850 },
];
const PROT_RANGES = [
  { label: "<20g",   midpoint: 10 },
  { label: "20-40g", midpoint: 30 },
  { label: "40g+",   midpoint: 45 },
];
const CARB_RANGES = [
  { label: "<50g",    midpoint: 25  },
  { label: "50-100g", midpoint: 75  },
  { label: "100g+",   midpoint: 120 },
];
const FAT_RANGES = [
  { label: "<15g",   midpoint: 8  },
  { label: "15-30g", midpoint: 22 },
  { label: "30g+",   midpoint: 40 },
];
const QUALITY_OPTIONS = ["Clean", "Mixed", "Junk"];

const emptyForm = { meal_type: "", calories: "", protein_g: "", carbs_g: "", fat_g: "", quality: "" };

function buildSummary(meal) {
  const parts = [meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)];
  if (meal.calories) parts.push(`${meal.calories} kcal`);
  if (meal.protein_g) parts.push(`${meal.protein_g}g protein`);
  if (meal.quality) parts.push(meal.quality.charAt(0).toUpperCase() + meal.quality.slice(1));
  return parts.join(" · ");
}

function RangeGroup({ label, ranges, selected, onSelect, value, onChange }) {
  return (
    <div>
      <label className="text-[10px] tracking-widest text-gray-400 block mb-1">{label}</label>
      <div className="flex gap-1 mb-1.5 flex-wrap">
        {ranges.map(r => (
          <button
            key={r.label}
            type="button"
            onClick={() => onSelect(r)}
            className={`py-1 px-2.5 border text-[10px] tracking-wide transition-colors
              ${selected === r.label
                ? "bg-black text-white border-black"
                : "border-gray-200 active:border-black"}`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="—"
        className="w-full border-b border-black py-1.5 text-base focus:outline-none bg-transparent"
      />
    </div>
  );
}

export default function FoodSection() {
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [calRange, setCalRange] = useState(null);
  const [protRange, setProtRange] = useState(null);
  const [carbRange, setCarbRange] = useState(null);
  const [fatRange, setFatRange] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const { meals, addMeal, updateMeal } = useFoodLog();

  const resetForm = () => {
    setForm(emptyForm);
    setCalRange(null); setProtRange(null);
    setCarbRange(null); setFatRange(null);
    setError(""); setEditId(null);
  };

  const openAdd = () => {
    resetForm();
    setAddOpen(true);
  };

  const openEdit = (meal) => {
    setForm({
      meal_type: meal.meal_type,
      calories: meal.calories != null ? String(meal.calories) : "",
      protein_g: meal.protein_g != null ? String(meal.protein_g) : "",
      carbs_g: meal.carbs_g != null ? String(meal.carbs_g) : "",
      fat_g: meal.fat_g != null ? String(meal.fat_g) : "",
      quality: meal.quality || "",
    });
    setCalRange(null); setProtRange(null);
    setCarbRange(null); setFatRange(null);
    setError(""); setEditId(meal.id);
    setAddOpen(true);
  };

  const handleRangeSelect = (setter, rangeSetter, range) => {
    rangeSetter(range.label);
    setter(prev => ({ ...prev })); // trigger re-render
    return range.midpoint;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.meal_type) { setError("Select a meal type"); return; }
    setSaving(true);
    const payload = {
      meal_type: form.meal_type.toLowerCase(),
      calories: form.calories,
      protein_g: form.protein_g,
      carbs_g: form.carbs_g,
      fat_g: form.fat_g,
      quality: form.quality.toLowerCase() || "",
    };
    const { error: err } = editId
      ? await updateMeal(editId, payload)
      : await addMeal(payload);
    setSaving(false);
    if (!err) {
      resetForm();
      setAddOpen(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ForkKnifeIcon size={14} className="text-gray-500" />
          <span className="text-xs font-bold tracking-[0.3em] uppercase">FOOD</span>
          {meals.length > 0 && (
            <span className="text-[10px] text-gray-400 tracking-widest">{meals.length} MEAL{meals.length !== 1 ? "S" : ""}</span>
          )}
        </div>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <Collapse open={open}>
        <div className="pt-2 pb-2">
          {/* Add meal button */}
          <button
            onClick={openAdd}
            className="w-full py-3.5 border border-black text-xs tracking-widest active:bg-black active:text-white transition-colors mb-3"
          >
            + ADD MEAL
          </button>

          {/* Add / Edit form */}
          <Collapse open={addOpen}>
            <form onSubmit={handleSave} className="mb-4 p-4 border border-gray-200 fade-in space-y-4">
              {/* Meal type */}
              <div>
                <label className="text-[10px] tracking-widest text-gray-400 block mb-2">MEAL TYPE</label>
                <div className="flex gap-1 flex-wrap">
                  {MEAL_TYPES.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setForm(f => ({ ...f, meal_type: t })); setError(""); }}
                      className={`py-1.5 px-3 border text-[10px] tracking-wide transition-colors
                        ${form.meal_type === t
                          ? "bg-black text-white border-black"
                          : "border-gray-200 active:border-black"}`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
                {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
              </div>

              {/* Calories */}
              <RangeGroup
                label="CALORIES (OPT.)"
                ranges={CAL_RANGES}
                selected={calRange}
                onSelect={r => { setCalRange(r.label); setForm(f => ({ ...f, calories: String(r.midpoint) })); }}
                value={form.calories}
                onChange={v => { setCalRange(null); setForm(f => ({ ...f, calories: v })); }}
              />

              {/* Protein */}
              <RangeGroup
                label="PROTEIN (OPT.)"
                ranges={PROT_RANGES}
                selected={protRange}
                onSelect={r => { setProtRange(r.label); setForm(f => ({ ...f, protein_g: String(r.midpoint) })); }}
                value={form.protein_g}
                onChange={v => { setProtRange(null); setForm(f => ({ ...f, protein_g: v })); }}
              />

              {/* Carbs */}
              <RangeGroup
                label="CARBS (OPT.)"
                ranges={CARB_RANGES}
                selected={carbRange}
                onSelect={r => { setCarbRange(r.label); setForm(f => ({ ...f, carbs_g: String(r.midpoint) })); }}
                value={form.carbs_g}
                onChange={v => { setCarbRange(null); setForm(f => ({ ...f, carbs_g: v })); }}
              />

              {/* Fat */}
              <RangeGroup
                label="FAT (OPT.)"
                ranges={FAT_RANGES}
                selected={fatRange}
                onSelect={r => { setFatRange(r.label); setForm(f => ({ ...f, fat_g: String(r.midpoint) })); }}
                value={form.fat_g}
                onChange={v => { setFatRange(null); setForm(f => ({ ...f, fat_g: v })); }}
              />

              {/* Quality */}
              <div>
                <label className="text-[10px] tracking-widest text-gray-400 block mb-2">QUALITY (OPT.)</label>
                <div className="flex gap-1">
                  {QUALITY_OPTIONS.map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, quality: f.quality === q ? "" : q }))}
                      className={`py-1.5 px-3 border text-[10px] tracking-wide transition-colors
                        ${form.quality === q
                          ? "bg-black text-white border-black"
                          : "border-gray-200 active:border-black"}`}
                    >
                      {q.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { resetForm(); setAddOpen(false); }}
                  className="flex-1 py-3 border border-black text-xs tracking-widest active:bg-gray-100 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-black text-white text-xs tracking-widest disabled:opacity-50"
                >
                  {saving ? "SAVING..." : "SAVE MEAL"}
                </button>
              </div>
            </form>
          </Collapse>

          {/* Saved meal rows */}
          {meals.map(meal => (
            <div key={meal.id} className="flex justify-between items-center py-2.5 border-b border-gray-100">
              <span className="text-sm text-gray-700 leading-snug flex-1 pr-2">{buildSummary(meal)}</span>
              <button
                type="button"
                onClick={() => openEdit(meal)}
                className="text-gray-300 active:text-black transition-colors shrink-0 p-1"
                aria-label="Edit meal"
              >
                <EditIcon size={14} />
              </button>
            </div>
          ))}

          {meals.length === 0 && !addOpen && (
            <p className="text-[10px] text-gray-300 tracking-widest text-center py-4">NO MEALS LOGGED TODAY</p>
          )}
        </div>
      </Collapse>
    </div>
  );
}
