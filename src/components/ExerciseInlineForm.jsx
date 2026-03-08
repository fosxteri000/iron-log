import React, { useState, useMemo } from "react";
import { useExerciseHistory } from "../hooks/useExercises";
import { getOverloadSuggestion, randomFrom } from "../lib/utils";
import { FUNNY_MESSAGES } from "../lib/seedData";
import Collapse from "./Collapse";
import { LightbulbIcon } from "./Icons";

function SetRow({ index, set, onChange, onRemove }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
      <span className="text-[10px] text-gray-400 w-5 text-center">{index + 1}</span>
      <div className="flex-1">
        <input
          type="number"
          inputMode="decimal"
          step="0.5"
          value={set.weight}
          onChange={e => onChange(index, "weight", e.target.value)}
          placeholder="kg"
          className="w-full border-b border-gray-300 py-1.5 text-base focus:outline-none focus:border-black bg-transparent text-center"
        />
        <p className="text-[10px] text-center text-gray-300 tracking-widest mt-0.5">KG</p>
      </div>
      <div className="flex-1">
        <input
          type="number"
          inputMode="numeric"
          value={set.reps}
          onChange={e => onChange(index, "reps", e.target.value)}
          placeholder="reps"
          className="w-full border-b border-gray-300 py-1.5 text-base focus:outline-none focus:border-black bg-transparent text-center"
        />
        <p className="text-[10px] text-center text-gray-300 tracking-widest mt-0.5">REPS</p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-gray-300 active:text-black text-base w-8 h-8 flex items-center justify-center"
      >
        ×
      </button>
    </div>
  );
}

export default function ExerciseInlineForm({ exerciseId, exercise, onSaved }) {
  const { history, logSets } = useExerciseHistory(exerciseId);

  const [targetWeight, setTargetWeight] = useState("");
  const [targetReps, setTargetReps]     = useState("");
  const [sets, setSets]                 = useState([{ weight: "", reps: "" }]);

  const allTimeMax = useMemo(() => {
    let max = 0;
    history.forEach(log => log.sets.forEach(s => { if (s.weight > max) max = s.weight; }));
    return max;
  }, [history]);
  const [showSets, setShowSets]         = useState(false);
  const [saving, setSaving]             = useState(false);
  const [savedMsg, setSavedMsg]         = useState("");
  const [saveError, setSaveError]       = useState("");
  const [selectedPill, setSelectedPill] = useState(null);
  const [prOverlay, setPrOverlay]       = useState(null); // { weight, name }

  const lastSession = history[0] || null;
  const lastBest = useMemo(() => {
    if (!lastSession) return null;
    return lastSession.sets.reduce((acc, s) => s.weight > acc.weight ? s : acc, lastSession.sets[0]);
  }, [lastSession]);

  const overloadA = useMemo(() => {
    if (!exercise || !lastSession) return null;
    return getOverloadSuggestion(exercise.category, lastSession);
  }, [exercise, lastSession]);

  const overloadB = useMemo(() => {
    if (!lastBest) return null;
    return { weight: lastBest.weight, reps: lastBest.reps + 1, type: "reps" };
  }, [lastBest]);

  const handleUsePill = (pill, overload) => {
    if (!overload || !lastSession) return;
    setSelectedPill(pill);
    setTargetWeight(String(overload.weight));
    setTargetReps(String(overload.reps));
    setSets(lastSession.sets.map(() => ({ weight: String(overload.weight), reps: String(overload.reps) })));
    setShowSets(true);
  };

  const handleUseLastSession = () => {
    if (!lastSession || !lastBest) return;
    setSelectedPill(null);
    setTargetWeight(String(lastBest.weight));
    setTargetReps(String(lastBest.reps));
    setSets(lastSession.sets.map(s => ({ weight: String(s.weight), reps: String(s.reps) })));
    setShowSets(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    const prevMax = allTimeMax;
    const { error } = await logSets(sets, targetWeight, targetReps);
    setSaving(false);
    if (!error) {
      const validSets = sets.filter(s => s.weight && s.reps);
      const maxSaved = validSets.length > 0 ? Math.max(...validSets.map(s => parseFloat(s.weight))) : 0;
      if (prevMax > 0 && maxSaved > prevMax) {
        setPrOverlay({ weight: maxSaved, name: exercise.name });
        setTimeout(() => {
          setPrOverlay(null);
          onSaved();
        }, 2500);
      } else {
        setSavedMsg(randomFrom(FUNNY_MESSAGES));
        setTimeout(() => {
          setSavedMsg("");
          onSaved();
        }, 1400);
      }
    } else {
      setSaveError("Failed to save. Check your connection and try again.");
    }
  };

  if (prOverlay) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white fade-in"
        onClick={() => { setPrOverlay(null); onSaved(); }}
      >
        <p className="text-[10px] tracking-[0.5em] text-gray-500 mb-6">NEW PERSONAL RECORD</p>
        <p className="font-bold mb-3" style={{ fontSize: "clamp(56px, 18vw, 80px)" }}>{prOverlay.weight}KG</p>
        <p className="text-lg font-bold tracking-[0.15em] text-center px-8">{prOverlay.name.toUpperCase()}</p>
        <p className="text-[10px] tracking-widest text-gray-700 mt-12">TAP TO DISMISS</p>
      </div>
    );
  }

  if (savedMsg) {
    return (
      <div className="p-4 border-t border-gray-100 fade-in">
        <p className="text-xs tracking-wide leading-relaxed font-mono text-center pulse-glow py-2">{savedMsg}</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 px-4 pt-4 pb-3">

      {/* Last session */}
      {lastBest ? (
        <>
          <div className="mb-3">
            <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-1">LAST SESSION</p>
            <p className="text-sm font-bold tracking-wide">
              {lastBest.weight}kg × {lastBest.reps} reps × {lastSession.sets.length} sets
            </p>
          </div>

          {/* Suggestion */}
          {(overloadA || overloadB) && (
            <div className="mb-3 border-t border-gray-200 pt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <LightbulbIcon size={11} className="text-gray-400" />
                <p className="text-[10px] tracking-[0.3em] text-gray-400">SUGGESTION</p>
              </div>
              <div className="flex gap-2 mb-1">
                {overloadA && (
                  <button
                    type="button"
                    onClick={() => handleUsePill("A", overloadA)}
                    className={`pill-btn flex-1 py-2 px-2 border text-center transition-all
                      ${selectedPill === "A" ? "active" : "border-gray-200 bg-white"}`}
                  >
                    <span className="text-[10px] tracking-widest block opacity-60">A</span>
                    <span className="text-sm font-bold block">{overloadA.weight}kg × {overloadA.reps}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {overloadA.type === "weight" ? "Increase weight" : "Add 1 rep"}
                    </span>
                  </button>
                )}
                {overloadB && (
                  <button
                    type="button"
                    onClick={() => handleUsePill("B", overloadB)}
                    className={`pill-btn flex-1 py-2 px-2 border text-center transition-all
                      ${selectedPill === "B" ? "active" : "border-gray-200 bg-white"}`}
                  >
                    <span className="text-[10px] tracking-widest block opacity-60">B</span>
                    <span className="text-sm font-bold block">{overloadB.weight}kg × {overloadB.reps}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Add 1 rep</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-gray-400 text-center">Based on progressive overload</p>
            </div>
          )}

          {/* Use last session */}
          <button
            type="button"
            onClick={handleUseLastSession}
            className="w-full flex items-center justify-between py-2.5 border-t border-gray-200 active:bg-gray-100 transition-colors mb-3"
          >
            <span className="text-[10px] text-gray-500 tracking-widest">USE LAST SESSION</span>
            <span className="text-xs font-bold">{lastBest.weight}kg × {lastBest.reps}</span>
          </button>
        </>
      ) : (
        <p className="text-xs tracking-wide text-gray-400 mb-3">First session — set your baseline 🎯</p>
      )}

      {/* Log sets toggle */}
      <button
        type="button"
        onClick={() => setShowSets(o => !o)}
        className="w-full py-2.5 border border-black text-[10px] tracking-[0.3em] active:bg-black active:text-white transition-colors mb-2"
      >
        {showSets ? "HIDE SETS" : "LOG SETS"}
      </button>

      {/* Set rows */}
      <Collapse open={showSets}>
        <form onSubmit={handleSubmit} className="pt-1">
          {sets.map((set, i) => (
            <SetRow
              key={i}
              index={i}
              set={set}
              onChange={(idx, field, val) =>
                setSets(s => s.map((r, j) => j === idx ? { ...r, [field]: val } : r))
              }
              onRemove={(idx) =>
                setSets(s => s.length > 1 ? s.filter((_, j) => j !== idx) : s)
              }
            />
          ))}
          <button
            type="button"
            onClick={() => setSets(s => [...s, { weight: s[s.length - 1]?.weight || "", reps: "" }])}
            className="w-full py-2.5 border border-dashed border-gray-300 text-[10px] tracking-widest text-gray-400 active:border-black active:text-black transition-colors mt-2 mb-3"
          >
            + ADD SET
          </button>
          {saveError && (
            <p className="text-[10px] text-red-500 text-center mb-2 tracking-wide">{saveError}</p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-black text-white text-[10px] tracking-[0.3em] disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE SESSION"}
          </button>
        </form>
      </Collapse>
    </div>
  );
}
