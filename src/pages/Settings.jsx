import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, USERS } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { useTheme, THEMES } from "../hooks/useTheme";
import { useExercises } from "../hooks/useExercises";
import { supabase } from "../lib/supabase";
import { SPLIT_TYPES, DAY_NAMES } from "../lib/splitConfig";
import { EXERCISE_LIBRARY } from "../lib/exerciseLibrary";
import Collapse from "../components/Collapse";
import { TrashIcon, UserIcon, PaletteIcon, EyeIcon, EyeOffIcon, SPLIT_ICONS } from "../components/Icons";

function SplitPicker({ current, onSelect }) {
  return (
    <div className="space-y-2 mt-3">
      {SPLIT_TYPES.map(s => {
        const SplitIcon = SPLIT_ICONS[s.id];
        const isActive = s.id === current;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`w-full flex items-center gap-3 py-3 px-3 border transition-colors r-card
              ${isActive ? "border-black bg-black text-white" : "border-gray-200 active:border-black"}`}
          >
            {SplitIcon && (
              <span className={isActive ? "icon-bounce" : ""}>
                <SplitIcon size={32} className={`shrink-0 ${isActive ? "opacity-100" : "opacity-50"}`} />
              </span>
            )}
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-bold tracking-[0.2em]">{s.label}</p>
              {s.sublabel && (
                <p className={`text-[11px] tracking-wide mt-0.5 ${isActive ? "opacity-80" : ""}`}>{s.sublabel}</p>
              )}
              <p className={`text-[10px] tracking-wide mt-0.5 ${isActive ? "text-gray-300" : "text-gray-400"}`}>{s.desc}</p>
            </div>
            {isActive && <span className="text-xs shrink-0">✓</span>}
          </button>
        );
      })}
    </div>
  );
}

function DaySplitConfig() {
  const { profile, assignExerciseToDay, removeExerciseFromDay } = useProfile();
  const { exercises } = useExercises();
  const [openDay, setOpenDay] = useState(null);
  const [adding, setAdding] = useState(null);
  const [openGroup, setOpenGroup] = useState(null);

  const daySplit = profile?.daySplit || {};

  const handleAddExercise = (day, exerciseId) => {
    assignExerciseToDay(day, exerciseId);
    setAdding(null);
    setOpenGroup(null);
  };

  return (
    <div className="mt-3">
      {DAY_NAMES.map(day => {
        const assigned = (daySplit[day] || [])
          .map(id => exercises.find(e => e.id === id))
          .filter(Boolean);
        const isOpen = openDay === day;

        return (
          <div key={day} className="border-b border-gray-100">
            <button
              onClick={() => setOpenDay(isOpen ? null : day)}
              className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-[0.2em]">{day.toUpperCase().slice(0, 3)}</span>
                <span className="text-[10px] text-gray-400 tracking-widest">
                  {assigned.length === 0 ? "REST" : `${assigned.length} EXERCISES`}
                </span>
              </div>
              <span className="text-xs text-gray-400">{isOpen ? "−" : "+"}</span>
            </button>

            <Collapse open={isOpen}>
              <div className="pb-3">
                {assigned.map(ex => (
                  <div key={ex.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm tracking-wide">{ex.name}</span>
                    <button
                      onClick={() => removeExerciseFromDay(day, ex.id)}
                      className="text-gray-300 active:text-black p-1"
                    >
                      <TrashIcon size={12} />
                    </button>
                  </div>
                ))}

                {adding === day ? (
                  <div className="mt-2">
                    {EXERCISE_LIBRARY.map(group => (
                      <div key={group.group} className="border-b border-gray-50">
                        <button
                          onClick={() => setOpenGroup(openGroup === group.group ? null : group.group)}
                          className="w-full flex items-center justify-between py-2 text-left"
                        >
                          <span className="text-[10px] tracking-widest text-gray-500">{group.group.toUpperCase()}</span>
                          <span className="text-[10px] text-gray-300">{openGroup === group.group ? "−" : "+"}</span>
                        </button>
                        {openGroup === group.group && (
                          <div className="pb-2">
                            {group.exercises.map(name => {
                              const alreadyAdded = assigned.some(e => e.name === name);
                              return (
                                <button
                                  key={name}
                                  onClick={() => {
                                    const existing = exercises.find(e => e.name === name);
                                    if (existing) handleAddExercise(day, existing.id);
                                  }}
                                  disabled={alreadyAdded}
                                  className="w-full text-left py-2 pl-3 text-sm tracking-wide border-b border-gray-50 disabled:text-gray-300 active:bg-gray-50"
                                >
                                  {name}
                                  {alreadyAdded && <span className="text-[10px] text-gray-300 ml-2">ADDED</span>}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => { setAdding(null); setOpenGroup(null); }}
                      className="w-full py-2 text-[10px] tracking-widest text-gray-400 mt-2"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAdding(day)}
                    className="w-full py-2.5 border border-dashed border-gray-300 text-[10px] tracking-widest text-gray-400 active:border-black active:text-black transition-colors mt-2"
                  >
                    + ADD EXERCISE
                  </button>
                )}
              </div>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
}

function CustomSplitConfig() {
  const { profile, addCustomDay, removeCustomDay } = useProfile();
  const [newDay, setNewDay] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const customDays = profile?.customDays || [];

  const handleAdd = () => {
    if (!newDay.trim()) return;
    addCustomDay(newDay.trim());
    setNewDay("");
  };

  const handleDelete = (day) => {
    removeCustomDay(day);
    setConfirmDelete(null);
  };

  return (
    <div className="mt-3">
      {customDays.length === 0 && (
        <p className="text-[10px] text-gray-300 tracking-widest py-3 text-center">
          NO CUSTOM DAYS YET
        </p>
      )}

      {customDays.map(day => (
        <div key={day} className="border-b border-gray-100">
          {confirmDelete === day ? (
            <div className="flex items-center justify-between py-3 gap-3">
              <span className="text-xs text-gray-500 tracking-wide truncate">DELETE {day.toUpperCase()}?</span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleDelete(day)}
                  className="text-[10px] tracking-widest bg-black text-white px-3 py-1.5"
                >
                  YES
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="text-[10px] tracking-widest border border-gray-300 px-3 py-1.5"
                >
                  NO
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-bold tracking-wide">{day}</span>
              <button
                onClick={() => setConfirmDelete(day)}
                className="text-gray-300 active:text-black p-1 transition-colors"
              >
                <TrashIcon size={13} />
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={newDay}
          onChange={e => setNewDay(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          placeholder="e.g. Push A, Pull B..."
          className="flex-1 border-b border-black py-2 text-sm focus:outline-none bg-transparent"
        />
        <button
          onClick={handleAdd}
          disabled={!newDay.trim()}
          className="px-4 py-2 bg-black text-white text-[10px] tracking-widest disabled:opacity-40"
        >
          ADD
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { userId, lock } = useAuth();
  const { profile, updateName, updateSplit, resetProfile } = useProfile();
  const { theme, setTheme } = useTheme();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.name || "");
  const [changingSplit, setChangingSplit] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);

  const currentUser = USERS.find(u => u.id === userId);

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    updateName(nameInput.trim());
    setEditingName(false);
  };

  const handleChangeSplit = (splitId) => {
    updateSplit(splitId);
    setChangingSplit(false);
  };

  const handleReset = async () => {
    setResetting(true);
    await supabase.from("workout_sets").delete().eq("user_id", userId);
    await supabase.from("workout_sessions").delete().eq("user_id", userId);
    await supabase.from("cardio_sessions").delete().eq("user_id", userId);
    await supabase.from("body_weight_logs").delete().eq("user_id", userId);
    await supabase.from("cheat_days").delete().eq("user_id", userId);
    await supabase.from("exercises").delete().eq("user_id", userId);
    resetProfile();
    lock();
    navigate("/login");
  };

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-wide">SETTINGS</h2>
      </div>

      {/* Profile */}
      <section className="mb-8">
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
          <UserIcon size={10} /> PROFILE
        </p>

        <div className="mb-4">
          <p className="text-[10px] tracking-widest text-gray-400 mb-1">NAME</p>
          {editingName ? (
            <div className="flex gap-2 items-end">
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                autoFocus
                className="flex-1 border-b-2 border-black py-2 text-base focus:outline-none bg-transparent"
              />
              <button
                onClick={handleSaveName}
                className="px-4 py-2 bg-black text-white text-xs tracking-widest"
              >
                SAVE
              </button>
              <button
                onClick={() => setEditingName(false)}
                className="px-3 py-2 border border-gray-300 text-xs tracking-widest"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between py-2">
              <span className="text-base font-bold">{profile?.name?.toUpperCase()}</span>
              <button
                onClick={() => { setEditingName(true); setNameInput(profile?.name || ""); }}
                className="text-[10px] tracking-widest text-gray-400 active:text-black"
              >
                EDIT
              </button>
            </div>
          )}
        </div>

        {currentUser && (
          <div className="mb-4">
            <p className="text-[10px] tracking-widest text-gray-400 mb-1">YOUR PASSCODE</p>
            <div className="flex items-center justify-between py-2">
              <span className="text-base font-bold tracking-[0.3em]">
                {showPasscode ? currentUser.code : "••••"}
              </span>
              <button
                onClick={() => setShowPasscode(p => !p)}
                className="text-gray-400 active:text-black p-1 transition-colors"
              >
                {showPasscode ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Training Split */}
      <section className="mb-8">
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-3 border-b border-gray-100 pb-2">
          TRAINING SPLIT
        </p>

        <div className="flex items-center justify-between py-2 mb-2">
          <div>
            <p className="text-xs font-bold tracking-[0.2em]">
              {SPLIT_TYPES.find(s => s.id === profile?.split)?.label || profile?.split}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {SPLIT_TYPES.find(s => s.id === profile?.split)?.desc}
            </p>
          </div>
          <button
            onClick={() => setChangingSplit(o => !o)}
            className="text-[10px] tracking-widest text-gray-400 active:text-black"
          >
            {changingSplit ? "CANCEL" : "CHANGE"}
          </button>
        </div>

        {changingSplit && <SplitPicker current={profile?.split} onSelect={handleChangeSplit} />}
      </section>

      {/* Day Split Config */}
      {profile?.split === "Day Split" && (
        <section className="mb-8">
          <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-3 border-b border-gray-100 pb-2">
            WEEKLY SCHEDULE
          </p>
          <DaySplitConfig />
        </section>
      )}

      {/* Custom Split Config */}
      {profile?.split === "Custom" && (
        <section className="mb-8">
          <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-3 border-b border-gray-100 pb-2">
            CUSTOM SPLIT DAYS
          </p>
          <CustomSplitConfig />
        </section>
      )}

      {/* Theme */}
      <section className="mb-8">
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
          <PaletteIcon size={10} /> THEME
        </p>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`py-3 px-3 border text-left transition-colors
                ${theme === t.id ? "bg-black text-white border-black" : "border-gray-200 active:border-black"}`}
            >
              <p className="text-[10px] font-bold tracking-widest">{t.label}</p>
              <p className={`text-[9px] mt-0.5 ${theme === t.id ? "text-gray-300" : "text-gray-400"}`}>{t.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="mb-8">
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-3 border-b border-gray-100 pb-2">
          DANGER ZONE
        </p>

        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="w-full py-3 border border-gray-300 text-xs tracking-widest text-gray-400 active:border-black active:text-black transition-colors"
          >
            RESET ALL MY DATA
          </button>
        ) : (
          <div className="border border-black p-4">
            <p className="text-xs tracking-wide mb-4 leading-relaxed">
              THIS WILL DELETE ALL YOUR EXERCISES, WORKOUT HISTORY, AND PROFILE. THIS CANNOT BE UNDONE.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                disabled={resetting}
                className="flex-1 py-3 bg-black text-white text-xs tracking-widest disabled:opacity-50"
              >
                {resetting ? "DELETING..." : "CONFIRM DELETE"}
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-3 border border-black text-xs tracking-widest"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
