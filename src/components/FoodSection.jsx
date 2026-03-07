import React, { useState } from "react";
import { useFoodLog } from "../hooks/useFoodLog";
import Collapse from "./Collapse";
import FoodLogCard from "./FoodLogCard";
import { ForkKnifeIcon, EditIcon } from "./Icons";
import {
  BreakfastIcon,
  LunchIcon,
  DinnerIcon,
  SnackIcon,
  OtherFoodIcon,
  CleanFoodIcon,
  MixedFoodIcon,
  JunkFoodIcon,
} from "../icons/FoodIcons";

// ─── Helpers ──────────────────────────────────────────────────

const MEAL_ICONS = {
  breakfast: BreakfastIcon,
  lunch:     LunchIcon,
  dinner:    DinnerIcon,
  snack:     SnackIcon,
  other:     OtherFoodIcon,
};

const QUALITY_ICONS = {
  clean: CleanFoodIcon,
  mixed: MixedFoodIcon,
  junk:  JunkFoodIcon,
};

function cap(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function buildSummary(meal) {
  const parts = [cap(meal.meal_type)];
  if (meal.calories != null)  parts.push(`${meal.calories} kcal`);
  if (meal.protein_g != null) parts.push(`${meal.protein_g}g P`);
  if (meal.carbs_g != null)   parts.push(`${meal.carbs_g}g C`);
  if (meal.fat_g != null)     parts.push(`${meal.fat_g}g F`);
  return parts.join(" · ");
}

// ─── Component ────────────────────────────────────────────────

export default function FoodSection() {
  const [open, setOpen]               = useState(false);
  const [cardOpen, setCardOpen]       = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  const { meals, addMeal, updateMeal } = useFoodLog();

  const openNew  = () => { setEditingMeal(null);  setCardOpen(true); };
  const openEdit = (meal) => { setEditingMeal(meal); setCardOpen(true); };
  const closeCard = () => { setCardOpen(false); setEditingMeal(null); };

  const handleSave = async (data) => {
    if (editingMeal) {
      await updateMeal(editingMeal.id, data);
    } else {
      await addMeal(data);
    }
  };

  return (
    <div className="mb-4">
      {/* Section header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ForkKnifeIcon size={14} className="text-gray-500" />
          <span className="text-xs font-bold tracking-[0.3em] uppercase">FOOD</span>
          {meals.length > 0 && (
            <span className="text-[10px] text-gray-400 tracking-widest">
              {meals.length} MEAL{meals.length !== 1 ? "S" : ""}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <Collapse open={open}>
        <div className="pt-2 pb-2">
          {/* Log food button */}
          <button
            onClick={openNew}
            className="w-full py-3.5 border border-black text-xs tracking-widest active:bg-black active:text-white transition-colors mb-3"
          >
            + LOG FOOD
          </button>

          {/* Saved meal rows */}
          {meals.map(meal => {
            const TypeIcon = MEAL_ICONS[meal.meal_type] || OtherFoodIcon;
            const QualIcon = meal.quality ? QUALITY_ICONS[meal.quality] : null;
            return (
              <div
                key={meal.id}
                className="flex items-center justify-between py-2.5 border-b border-gray-100"
              >
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <TypeIcon size={13} className="text-gray-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug truncate">{buildSummary(meal)}</p>
                    {QualIcon && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <QualIcon size={10} className="text-gray-300" />
                        <span className="text-[10px] text-gray-400 tracking-wide">
                          {cap(meal.quality)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(meal)}
                  className="text-gray-300 active:text-black transition-colors shrink-0 p-1 ml-2"
                  aria-label="Edit meal"
                >
                  <EditIcon size={14} />
                </button>
              </div>
            );
          })}

          {meals.length === 0 && (
            <p className="text-[10px] text-gray-300 tracking-widest text-center py-4">
              NO MEALS LOGGED TODAY
            </p>
          )}
        </div>
      </Collapse>

      {/* Bottom sheet card */}
      <FoodLogCard
        key={editingMeal?.id ?? "new-food"}
        open={cardOpen}
        onClose={closeCard}
        meal={editingMeal}
        onSave={handleSave}
      />
    </div>
  );
}
