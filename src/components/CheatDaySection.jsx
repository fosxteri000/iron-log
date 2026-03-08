import React, { useState, useEffect, useRef } from "react";
import { useCheatDays } from "../hooks/useCheatDays";
import { scrollSectionToCenter } from "../lib/utils";
import Collapse from "./Collapse";
import {
  DevilIcon,
  SkippedTrainingIcon,
  SkippedCardioIcon,
  BurgerIcon,
  LazyIcon,
  BeerIcon,
  CigaretteIcon,
  StayedUpLateIcon,
  ZeroWaterIcon,
} from "./Icons";

const OPTION_ROASTS = {
  skipped_training: [
    "Skipped training? We saw that 😏",
    "The iron misses you 🏋️",
    "Rest day... again? 🤔",
    "Your muscles filed a complaint 💪",
    "The gym called. No answer 📵",
    "We don't judge... ok we do 👀",
  ],
  skipped_cardio: [
    "The couch called. You answered 🛋️",
    "Cardio skipped. Regret loading... ⏳",
    "Heart rate stayed horizontal today 📉",
    "Lungs had a day off too 🫁",
    "Zero km logged. Max chill achieved 😌",
  ],
  junk_food: [
    "Junk food champion 🍔",
    "Fueled by chaos today 🍟",
    "Diet starts Monday... again 🍕",
    "Caloric chaos achieved 🌮",
    "The body is now 40% burger 🫠",
    "Nutritional disaster. Chef's kiss 👨‍🍳",
  ],
  too_lazy: [
    "Lazy mode activated 🛏️",
    "Horizontal excellence 💤",
    "The bed called. You answered 😴",
    "Strategic recovery. Sure 🛌",
    "Gravity won today 🌍",
    "Motion? Never heard of her 🦥",
  ],
  alcohol: [
    "Alcohol fueled decisions 🍺",
    "Living dangerously tonight 🥂",
    "Hydrated... differently 💧",
    "Your liver filed a complaint 📋",
    "Cheers to skipping the gains 🥃",
  ],
  smoking: [
    "Living dangerously 🚬",
    "Lungs said what? 😶‍🌫️",
    "Carbon monoxide cardio 💨",
    "Your VO2 max is crying 📉",
  ],
  late_night: [
    "Sleep is free recovery. You declined 😴",
    "3am and counting... 🌙",
    "Melatonin said come home 🌛",
    "Tomorrow's workout is already suffering 💤",
    "Night owl mode: gains bird mode: off 🦉",
  ],
  no_water: [
    "Your muscles are 70% water. Where is it? 💧",
    "Hydration? Never heard of her 🏜️",
    "Dry run. Literally 🚰",
    "Caffeine doesn't count 🫙",
    "Dehydrated gains are not gains 🧪",
  ],
};

const CHEAT_OPTIONS = [
  { id: "skipped_training", label: "SKIP TRAIN",  Icon: SkippedTrainingIcon },
  { id: "skipped_cardio",   label: "SKIP CARDIO", Icon: SkippedCardioIcon },
  { id: "junk_food",        label: "JUNK FOOD",   Icon: BurgerIcon },
  { id: "too_lazy",         label: "TOO LAZY",    Icon: LazyIcon },
  { id: "alcohol",          label: "ALCOHOL",     Icon: BeerIcon },
  { id: "smoking",          label: "SMOKING",     Icon: CigaretteIcon },
  { id: "late_night",       label: "LATE NIGHT",  Icon: StayedUpLateIcon },
  { id: "no_water",         label: "NO WATER",    Icon: ZeroWaterIcon },
];

function pickRoast(selected) {
  const pool = [];
  selected.forEach(id => pool.push(...(OPTION_ROASTS[id] || [])));
  if (!pool.length) return "Questionable choices today 💀";
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function CheatDaySection() {
  const sectionRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [confessed, setConfessed] = useState(new Set()); // saved to Supabase
  const [selected, setSelected] = useState(new Set());   // pending confession
  const [confessingMsg, setConfessingMsg] = useState(null); // roast showing
  const [confessDone, setConfessDone] = useState(false);    // "Confessed ✓"
  const { cheatDays, logCheatDay } = useCheatDays();

  // Load today's existing confessed selections on mount / data change
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayCheat = cheatDays.find(c => c.date === today);
    if (todayCheat?.selections?.length) {
      setConfessed(new Set(todayCheat.selections));
    }
  }, [cheatDays]);

  const toggle = (id) => {
    // Cannot toggle already-confessed options or while confession is animating
    if (confessed.has(id) || confessingMsg) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleConfess = async () => {
    if (!selected.size || confessingMsg || confessDone) return;
    const newOnes = [...selected];
    const roast = pickRoast(newOnes);

    // Step 1: immediate "CONFESSED ✓" for 300ms — closes the loop
    setConfessDone(true);
    await logCheatDay(newOnes);
    setConfessed(prev => new Set([...prev, ...newOnes]));
    setSelected(new Set());

    // Step 2: swap to roast
    setTimeout(() => {
      setConfessDone(false);
      setConfessingMsg(roast);

      // Step 3: clear roast after 4s
      setTimeout(() => setConfessingMsg(null), 4000);
    }, 300);
  };

  const totalConfessed = confessed.size;

  return (
    <div ref={sectionRef} className="mb-4">
      <button
        onClick={() => setOpen(o => { if (!o) scrollSectionToCenter(sectionRef); return !o; })}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <DevilIcon size={14} className="calendar-cheat" />
          <span className="text-xs font-bold tracking-[0.3em]">CHEAT</span>
          {totalConfessed > 0 && (
            <span className="text-[10px] tracking-widest calendar-cheat">{totalConfessed}</span>
          )}
        </div>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <Collapse open={open}>
        <div className="pt-3 pb-3">
          <div className="grid grid-cols-4 gap-1 mb-3">
            {CHEAT_OPTIONS.map(({ id, label, Icon }) => {
              const isConfessed = confessed.has(id);
              const isSelected  = selected.has(id);

              // Confessed = dark gray (permanent), Selected = cheat color, Neither = empty
              let btnStyle = {};
              let btnClass = `flex flex-col items-center gap-1 py-2 border text-[10px] tracking-wide transition-colors`;

              if (isConfessed) {
                btnClass += " text-white border-transparent";
                btnStyle = { backgroundColor: "#555", borderColor: "#555" };
              } else if (isSelected) {
                btnClass += " text-white border-transparent";
                btnStyle = { backgroundColor: "var(--t-cheat)", borderColor: "var(--t-cheat)" };
              } else {
                btnClass += " border-gray-200 text-gray-600 active:border-black";
              }

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(id)}
                  disabled={isConfessed}
                  className={btnClass}
                  style={btnStyle}
                >
                  <Icon size={14} />
                  {isConfessed ? "✓" : label}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleConfess}
            disabled={!selected.size || !!confessingMsg || confessDone}
            className={`w-full py-3 bg-black text-white text-xs tracking-widest disabled:opacity-40 transition-all
              ${confessingMsg ? "pulse-glow" : ""}`}
          >
            {confessingMsg
              ? confessingMsg
              : confessDone
                ? "CONFESSED ✓"
                : confessed.size > 0
                  ? "CONFESS MORE"
                  : "CONFESS"}
          </button>
        </div>
      </Collapse>
    </div>
  );
}
