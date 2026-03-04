import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExercises } from "../hooks/useExercises";
import { useProfile } from "../hooks/useProfile";
import { EXERCISE_LIBRARY } from "../lib/exerciseLibrary";
import { SPLIT_TYPES, DAY_NAMES, suggestCategory } from "../lib/splitConfig";
import Collapse from "../components/Collapse";

const toTitleCase = (str) =>
  str.replace(/\w\S*/g, (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

function CategoryPicker({ split, profile, muscleGroup, value, onChange }) {
  if (split === "Day Split") {
    return (
      <div>
        <label className="text-[10px] tracking-widest text-gray-400 block mb-2">ASSIGN TO DAY</label>
        <div className="grid grid-cols-4 gap-1.5">
          {DAY_NAMES.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => onChange(day)}
              className={`py-2 border text-[10px] tracking-wide transition-colors
                ${value === day ? "bg-black text-white border-black" : "border-gray-200 active:border-black"}`}
            >
              {day.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const splitDef = SPLIT_TYPES.find(s => s.id === split);
  let options = splitDef?.sections || [];

  if (split === "Custom") {
    options = profile?.customDays || [];
  }

  if (options.length === 0) {
    return (
      <div>
        <label className="text-[10px] tracking-widest text-gray-400 block mb-2">CATEGORY</label>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="e.g. Push, Pull, Leg..."
          className="w-full border-b border-black py-2 text-base focus:outline-none bg-transparent"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="text-[10px] tracking-widest text-gray-400 block mb-2">ASSIGN TO</label>
      <div className="grid grid-cols-3 gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`py-2.5 border text-[10px] tracking-wide transition-colors
              ${value === opt ? "bg-black text-white border-black" : "border-gray-200 active:border-black"}`}
          >
            {opt.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AddExercise() {
  const navigate = useNavigate();
  const { addExercise, addExercises } = useExercises();
  const { profile, assignExerciseToDay } = useProfile();

  const split = profile?.split || "PPL";

  const [tab, setTab] = useState("library"); // "library" | "custom"
  const [openGroup, setOpenGroup] = useState(null);

  // Multi-select: { name, group }[]
  const [selected, setSelected] = useState([]);

  const [category, setCategory] = useState(() => {
    const splitDef = SPLIT_TYPES.find(s => s.id === split);
    return splitDef?.sections?.[0] || "";
  });
  const [customName, setCustomName] = useState("");
  const [saving, setSaving] = useState(false);

  const isSelected = (name) => selected.some(s => s.name === name);

  const toggleExercise = (group, name) => {
    if (isSelected(name)) {
      setSelected(prev => prev.filter(s => s.name !== name));
    } else {
      setSelected(prev => {
        const newSelected = [...prev, { name, group }];
        // Auto-suggest category from the first selected item's group
        if (prev.length === 0) {
          const suggested = suggestCategory(split, group);
          setCategory(suggested);
        }
        return newSelected;
      });
    }
  };

  const clearSelection = () => setSelected([]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (tab === "library" && selected.length > 0) {
      const exerciseList = selected.map(({ name, group }) => {
        const dbCategory = split === "Day Split" ? group : category;
        return { name, category: dbCategory };
      });

      const { data, error } = await addExercises(exerciseList);

      if (!error && data && split === "Day Split" && category) {
        data.forEach(ex => assignExerciseToDay(category, ex.id));
      }
      if (!error) navigate("/");

    } else if (tab === "custom" && customName.trim()) {
      const dbCategory = split === "Day Split" ? customName.trim() : category;
      const { data, error } = await addExercise({ name: customName.trim(), category: dbCategory });
      if (!error && data && split === "Day Split" && category) {
        assignExerciseToDay(category, data.id);
      }
      if (!error) navigate("/");
    }

    setSaving(false);
  };

  const canSubmit = tab === "library"
    ? (selected.length > 0 && category)
    : (customName.trim() && category);

  return (
    <div className="fade-in">
      <button
        onClick={() => navigate(-1)}
        className="text-[10px] tracking-widest text-gray-400 active:text-black mb-6 flex items-center gap-2 py-2"
      >
        ← BACK
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-wide">ADD EXERCISE</h2>
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mt-1">
          SPLIT: {split.toUpperCase()}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black mb-6">
        {["library", "custom"].map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setSelected([]); setCustomName(""); }}
            className={`flex-1 py-2.5 text-xs tracking-widest transition-colors
              ${tab === t ? "border-b-2 border-black font-bold" : "text-gray-400"}`}
          >
            {t === "library" ? "FROM LIBRARY" : "CUSTOM NAME"}
          </button>
        ))}
      </div>

      <form onSubmit={handleAdd} className="space-y-6">
        {/* Library multi-picker */}
        {tab === "library" && (
          <div>
            {/* Selected count badge */}
            {selected.length > 0 && (
              <div className="flex items-center justify-between mb-3 p-3 border border-black bg-gray-50 stagger-item">
                <span className="text-xs font-bold tracking-wide">
                  {selected.length} SELECTED
                </span>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-[10px] tracking-widest text-gray-400 active:text-black"
                >
                  CLEAR ALL
                </button>
              </div>
            )}

            {/* Selected pills */}
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {selected.map(({ name }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleExercise("", name)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-black text-white text-[10px] tracking-wide select-pulse"
                  >
                    {name}
                    <span className="opacity-60">×</span>
                  </button>
                ))}
              </div>
            )}

            {/* Muscle group accordion */}
            <label className="text-[10px] tracking-widest text-gray-400 block mb-3">
              {selected.length === 0 ? "SELECT EXERCISES" : "ADD MORE"}
            </label>
            {EXERCISE_LIBRARY.map(({ group, exercises }) => {
              const groupSelectedCount = exercises.filter(n => isSelected(n)).length;
              return (
                <div key={group} className="border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() => setOpenGroup(openGroup === group ? null : group)}
                    className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tracking-[0.2em]">{group.toUpperCase()}</span>
                      {groupSelectedCount > 0 && (
                        <span className="text-[9px] bg-black text-white px-1.5 py-0.5 tracking-wide">
                          {groupSelectedCount}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{openGroup === group ? "−" : "+"}</span>
                  </button>
                  <Collapse open={openGroup === group}>
                    <div className="pb-2">
                      {exercises.map(name => {
                        const checked = isSelected(name);
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => toggleExercise(group, name)}
                            className={`w-full flex items-center gap-3 py-2.5 pl-3 text-sm tracking-wide border-b border-gray-50 transition-colors
                              ${checked ? "bg-gray-50" : "active:bg-gray-50"}`}
                          >
                            <div className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors
                              ${checked ? "bg-black border-black" : "border-gray-300"}`}>
                              {checked && (
                                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                  <polyline points="1.5,5 4,7.5 8.5,2" className="check-draw" strokeDasharray="20" strokeDashoffset="0" />
                                </svg>
                              )}
                            </div>
                            <span className={checked ? "font-medium" : ""}>{name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </Collapse>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom name */}
        {tab === "custom" && (
          <div>
            <label className="text-[10px] tracking-widest text-gray-400 block mb-2">EXERCISE NAME</label>
            <input
              type="text"
              value={customName}
              onChange={e => setCustomName(toTitleCase(e.target.value))}
              placeholder="e.g. Incline Dumbbell Press"
              autoFocus
              className="w-full border-b-2 border-black py-2.5 text-base focus:outline-none bg-transparent"
            />
          </div>
        )}

        {/* Category / Day picker */}
        {(selected.length > 0 || customName.trim()) && (
          <CategoryPicker
            split={split}
            profile={profile}
            muscleGroup={selected[0]?.group || ""}
            value={category}
            onChange={setCategory}
          />
        )}

        <button
          type="submit"
          disabled={saving || !canSubmit}
          className="w-full py-3.5 bg-black text-white text-xs tracking-[0.3em] disabled:opacity-40"
        >
          {saving
            ? "ADDING..."
            : tab === "library" && selected.length > 1
              ? `ADD ${selected.length} EXERCISES`
              : "ADD EXERCISE"}
        </button>
      </form>
    </div>
  );
}
