import React, { useMemo, useState, useEffect, useRef } from "react";
import { useExercises, useWeekSets } from "../hooks/useExercises";
import { useProfile } from "../hooks/useProfile";
import { MOTIVATIONAL_PHRASES } from "../lib/seedData";
import { SPLIT_TYPES, DAY_NAMES } from "../lib/splitConfig";
import CategorySection from "../components/CategorySection";
import CardioSection from "../components/CardioSection";
import BodyWeightSection from "../components/BodyWeightSection";
import CheatDaySection from "../components/CheatDaySection";
import FoodSection from "../components/FoodSection";
import SleepSection from "../components/SleepSection";
import { DumbbellIcon } from "../components/Icons";

const NAME_FORMATS = [
  (name, msg) => `${name}, ${msg}`,
  (name, msg) => `${msg}, ${name}`,
  (name, msg) => `${msg} ${name}!`,
  (name, msg) => `${name} — ${msg}`,
];

function RotatingHeader({ name }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length));
  const [formatIdx, setFormatIdx] = useState(() => Math.floor(Math.random() * NAME_FORMATS.length));
  const [msgClass, setMsgClass] = useState("");
  const [iconPaused, setIconPaused] = useState(false);
  const [displayMsg, setDisplayMsg] = useState("");
  const timerRef  = useRef(null);
  const t1Ref     = useRef(null);
  const t2Ref     = useRef(null);

  // Build initial message
  useEffect(() => {
    setDisplayMsg(NAME_FORMATS[formatIdx](name, MOTIVATIONAL_PHRASES[index]));
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIconPaused(true);
      setMsgClass("msg-out");

      t1Ref.current = setTimeout(() => {
        const newIdx = (index + 1) % MOTIVATIONAL_PHRASES.length;
        const newFmt = Math.floor(Math.random() * NAME_FORMATS.length);
        setIndex(newIdx);
        setFormatIdx(newFmt);
        setDisplayMsg(NAME_FORMATS[newFmt](name, MOTIVATIONAL_PHRASES[newIdx]));
        setMsgClass("msg-in");
        setIconPaused(false);
      }, 400);

      t2Ref.current = setTimeout(() => {
        setMsgClass("");
      }, 800);
    }, 3300);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(t1Ref.current);
      clearTimeout(t2Ref.current);
    };
  }, [index, name]);

  return (
    <div className="flex flex-col items-center justify-center text-center w-full">
      <span className={`icon-float shrink-0 mb-1 ${iconPaused ? "paused" : ""}`} aria-hidden="true">
        <DumbbellIcon size={16} />
      </span>
      <h2
        className={`font-bold tracking-wide leading-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${msgClass}`}
        style={{ fontSize: "clamp(13px, 3.2vw, 17px)" }}
      >
        {displayMsg}
      </h2>
    </div>
  );
}

function formatHomeDate() {
  const now = new Date();
  return now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export default function Home() {
  const { exercises, loading } = useExercises();
  const { profile } = useProfile();
  const doneIds = useWeekSets();

  // Determine sections to show based on split
  const sections = useMemo(() => {
    if (!profile?.split) return [];
    const split = profile.split;

    if (split === "Day Split") {
      const todayFull = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const ids = profile?.daySplit?.[todayFull] || [];
      return [{
        title: todayFull.toUpperCase(),
        exercises: exercises.filter(ex => ids.includes(ex.id)),
        isDaySection: true,
      }];
    }

    if (split === "Custom") {
      const customDays = profile?.customDays || [];
      return customDays.map(day => ({
        title: day,
        exercises: exercises.filter(ex => ex.category === day),
      }));
    }

    const splitDef = SPLIT_TYPES.find(s => s.id === split);
    const splitSections = splitDef?.sections || [];
    return splitSections.map(section => ({
      title: section,
      exercises: exercises.filter(ex => ex.category === section),
    }));
  }, [profile, exercises]);

  // All exercises in all sections are checked off for this week
  const allDoneThisWeek = useMemo(() => {
    const exerciseSections = sections.filter(s => s.exercises.length > 0);
    if (!exerciseSections.length) return false;
    return exerciseSections.every(s => s.exercises.every(ex => doneIds.has(ex.id)));
  }, [sections, doneIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[10px] tracking-[0.3em] text-gray-300">
        LOADING...
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <RotatingHeader name={profile?.name?.toUpperCase() || ""} />
        <p className="text-[13px] text-gray-400 mt-1 font-normal tracking-[0.02em] font-sans">{formatHomeDate()}</p>
      </div>

      {/* All-done banner — shown when every exercise in every section is logged this week */}
      {allDoneThisWeek && (
        <div className="mb-6 border border-black p-4 text-center fade-in">
          <p className="text-xs font-bold tracking-[0.3em] mb-1">ALL DONE THIS WEEK ✓</p>
          <p className="text-[11px] text-gray-400 tracking-wide">Every session logged. Keep the streak going.</p>
        </div>
      )}

      {/* Body Weight */}
      <BodyWeightSection />

      {/* Split sections */}
      {sections.map((section, i) => (
        <div key={section.title} className="stagger-item" style={{ "--i": i }}>
          <CategorySection
            title={section.title}
            exercises={section.exercises}
            doneIds={doneIds}
          />
        </div>
      ))}

      {/* Cardio */}
      <div className="stagger-item" style={{ "--i": sections.length }}>
        <CardioSection />
      </div>

      {/* Food */}
      <div className="stagger-item" style={{ "--i": sections.length + 1 }}>
        <FoodSection />
      </div>

      {/* Sleep */}
      <div className="stagger-item" style={{ "--i": sections.length + 2 }}>
        <SleepSection />
      </div>

      {/* Cheat Day */}
      <div className="stagger-item" style={{ "--i": sections.length + 3 }}>
        <CheatDaySection />
      </div>
    </div>
  );
}
