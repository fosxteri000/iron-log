import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { SPLIT_TYPES } from "../lib/splitConfig";
import { FlameIcon, SPLIT_ICONS } from "../components/Icons";

export default function Setup() {
  const { saveProfile } = useProfile();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [split, setSplit] = useState(null);
  const [customDays, setCustomDays] = useState(["Day A", "Day B", "Day C"]);
  const [newDay, setNewDay] = useState("");

  const handleNameNext = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep(2);
  };

  const handleSplitSelect = (splitId) => {
    setSplit(splitId);
    if (splitId === "Custom") {
      setStep(3);
    } else {
      finalize(splitId, null);
    }
  };

  const finalize = (selectedSplit, days) => {
    const profile = {
      name: name.trim().toUpperCase(),
      split: selectedSplit,
      daySplit: {},
      customDays: days || [],
    };
    saveProfile(profile);
    navigate("/");
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    finalize("Custom", customDays.filter(d => d.trim()));
  };

  const addCustomDay = () => {
    if (!newDay.trim() || customDays.length >= 7) return;
    setCustomDays(d => [...d, newDay.trim().toUpperCase()]);
    setNewDay("");
  };

  const removeCustomDay = (i) => setCustomDays(d => d.filter((_, idx) => idx !== i));

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 select-none">
      {/* Step 1: Name */}
      {step === 1 && (
        <div className="w-full max-w-sm fade-in">
          <div className="mb-12 text-center">
            <FlameIcon size={24} className="mx-auto mb-4 opacity-60" />
            <h1 className="text-2xl font-bold tracking-[0.4em] mb-2">WELCOME</h1>
            <p className="text-[10px] text-gray-400 tracking-[0.3em]">FYT FYN FYN</p>
          </div>

          <form onSubmit={handleNameNext}>
            <label className="text-[10px] tracking-widest text-gray-400 block mb-2">YOUR NAME</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name..."
              autoFocus
              className="w-full border-b-2 border-black py-3 text-lg focus:outline-none bg-transparent tracking-wide mb-8"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-4 bg-black text-white text-xs tracking-[0.3em] disabled:opacity-40"
            >
              CONTINUE →
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Split */}
      {step === 2 && (
        <div className="w-full max-w-sm fade-in">
          <button
            onClick={() => setStep(1)}
            className="text-[10px] tracking-widest text-gray-400 mb-8 flex items-center gap-2"
          >
            ← BACK
          </button>

          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-wide mb-1">CHOOSE YOUR SPLIT</h2>
            <p className="text-[10px] text-gray-400 tracking-[0.3em]">YOU CAN CHANGE THIS ANYTIME IN SETTINGS</p>
          </div>

          <div className="space-y-2 stagger-children">
            {SPLIT_TYPES.map(s => {
              const SplitIcon = SPLIT_ICONS[s.id];
              return (
                <button
                  key={s.id}
                  onClick={() => handleSplitSelect(s.id)}
                  className="w-full flex items-center gap-4 py-4 px-4 border border-black active:bg-black active:text-white transition-colors r-card hover-lift"
                >
                  {SplitIcon && <SplitIcon size={40} className="shrink-0 opacity-70" />}
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-xs font-bold tracking-[0.2em]">{s.label}</p>
                    {s.sublabel && (
                      <p className="text-[11px] tracking-wide mt-0.5">{s.sublabel}</p>
                    )}
                    <p className="text-[10px] text-gray-400 tracking-wide mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                  <span className="text-gray-400 text-sm shrink-0">→</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Custom days */}
      {step === 3 && (
        <div className="w-full max-w-sm fade-in">
          <button
            onClick={() => setStep(2)}
            className="text-[10px] tracking-widest text-gray-400 mb-8 flex items-center gap-2"
          >
            ← BACK
          </button>

          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-wide mb-1">DEFINE YOUR DAYS</h2>
            <p className="text-[10px] text-gray-400 tracking-[0.3em]">NAME EACH TRAINING DAY</p>
          </div>

          <form onSubmit={handleCustomSubmit}>
            {customDays.map((day, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="text-sm tracking-wide">{day}</span>
                <button
                  type="button"
                  onClick={() => removeCustomDay(i)}
                  className="text-gray-300 active:text-black text-base w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}

            {customDays.length < 7 && (
              <div className="flex gap-2 mt-3 mb-6">
                <input
                  type="text"
                  value={newDay}
                  onChange={e => setNewDay(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomDay())}
                  placeholder="e.g. PUSH A"
                  className="flex-1 border-b border-black py-2 text-sm focus:outline-none bg-transparent uppercase"
                />
                <button
                  type="button"
                  onClick={addCustomDay}
                  className="px-4 py-2 border border-black text-xs tracking-widest active:bg-black active:text-white transition-colors"
                >
                  ADD
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={customDays.length === 0}
              className="w-full py-4 bg-black text-white text-xs tracking-[0.3em] disabled:opacity-40 mt-4"
            >
              START TRAINING →
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
