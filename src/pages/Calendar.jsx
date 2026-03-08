import React, { useState, useMemo } from "react";
import { useProgressData } from "../hooks/useExercises";
import { useCheatDays } from "../hooks/useCheatDays";
import { formatDate } from "../lib/utils";
import { BarbellIcon, HeartPulseIcon, DevilIcon } from "../components/Icons";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getMonthOffset(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  return (firstDay + 6) % 7;
}

export default function Calendar() {
  const { workoutLogs, cardioLogs, loading } = useProgressData();
  const { cheatDays } = useCheatDays();
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState(null);

  const year = current.getFullYear();
  const month = current.getMonth();
  const todayStr = new Date().toISOString().split("T")[0];

  const monthName = current.toLocaleDateString("en-GB", { month: "long", year: "numeric" }).toUpperCase();

  // Volume by date
  const volumeByDate = useMemo(() => {
    const map = {};
    workoutLogs.forEach(l => {
      const vol = l.sets.reduce((s, set) => s + set.weight * set.reps, 0);
      map[l.date] = (map[l.date] || 0) + vol;
    });
    return map;
  }, [workoutLogs]);

  const sortedWorkoutDates = useMemo(() =>
    Object.keys(volumeByDate).sort(), [volumeByDate]);

  const cardioDates = useMemo(() => new Set(cardioLogs.map(l => l.date)), [cardioLogs]);

  // Cheat day dates
  const cheatDateSet = useMemo(() => new Set(cheatDays.map(c => c.date)), [cheatDays]);

  function getVolumeIndicator(dateStr) {
    const idx = sortedWorkoutDates.indexOf(dateStr);
    if (idx <= 0) return "○";
    const prev = volumeByDate[sortedWorkoutDates[idx - 1]];
    const curr = volumeByDate[dateStr];
    if (curr > prev * 1.02) return "+";
    if (curr < prev * 0.98) return "−";
    return "○";
  }

  // Build calendar grid
  const offset = getMonthOffset(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const toDateStr = (day) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  // Selected day detail
  const selectedDate = selected ? toDateStr(selected) : null;
  const selectedWorkouts = selectedDate
    ? workoutLogs.filter(l => l.date === selectedDate)
    : [];
  const selectedCardio = selectedDate
    ? cardioLogs.filter(l => l.date === selectedDate)
    : [];
  const selectedCheats = selectedDate
    ? cheatDays.filter(c => c.date === selectedDate)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[10px] tracking-[0.3em] text-gray-300">
        LOADING...
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-wide">CALENDAR</h2>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="text-2xl text-gray-400 active:text-black px-5 py-4 -ml-5"
          aria-label="Previous month"
        >
          ←
        </button>
        <span className="text-xs font-bold tracking-[0.25em]">{monthName}</span>
        <button
          onClick={nextMonth}
          className="text-2xl text-gray-400 active:text-black px-5 py-4 -mr-5"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[9px] text-gray-400 tracking-widest py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100">
        {cells.map((day, i) => {
          if (!day) {
            return <div key={i} className="bg-white aspect-square" />;
          }

          const dateStr = toDateStr(day);
          const hasWorkout = !!volumeByDate[dateStr];
          const hasCardio = cardioDates.has(dateStr);
          const isCheat = cheatDateSet.has(dateStr);
          const indicator = hasWorkout ? getVolumeIndicator(dateStr) : null;
          const isSelected = selected === day;
          const isToday = dateStr === todayStr;
          const isPast = dateStr < todayStr;
          const noActivity = isPast && !hasWorkout && !hasCardio && !isCheat;

          let cellBg;
          if (isSelected) {
            cellBg = "bg-black";
          } else if (isPast && !isToday) {
            cellBg = "bg-gray-50";
          } else {
            cellBg = "bg-white";
          }

          return (
            <button
              key={i}
              onClick={() => setSelected(isSelected ? null : day)}
              className={`${cellBg} aspect-square flex flex-col items-center justify-center gap-0.5 transition-colors active:bg-gray-50
                ${isToday && !isSelected ? "border border-black" : ""}
              `}
            >
              <span className={`text-xs leading-none ${
                isSelected ? "text-white" :
                isToday ? "font-bold text-black" :
                isPast ? "text-gray-400" : "text-gray-600"
              }`}>
                {day}
              </span>

              {/* Past day with no activity: neutral dot */}
              {noActivity && !isSelected && (
                <span className="text-[8px] text-gray-200 leading-none">·</span>
              )}

              {/* Activity icons + cheat marker */}
              {(hasWorkout || hasCardio || isCheat) && (
                <div className="flex gap-0.5 items-center">
                  {hasWorkout && (
                    <BarbellIcon size={10} className={isSelected ? "text-white" : isPast ? "text-gray-400" : "text-black"} />
                  )}
                  {hasCardio && (
                    <HeartPulseIcon size={10} className={isSelected ? "text-white" : isPast ? "text-gray-400" : "text-black"} />
                  )}
                  {isCheat && (
                    <span className={`text-[9px] font-bold leading-none ${isSelected ? "text-white" : "calendar-cheat"}`}>
                      C
                    </span>
                  )}
                </div>
              )}

              {/* Volume indicator */}
              {indicator && (
                <span className={`text-[9px] font-bold leading-none ${
                  isSelected ? "text-white" : isPast ? "text-gray-400" : "text-black"
                }`}>
                  {indicator}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 mb-6">
        <div className="flex items-center gap-1">
          <BarbellIcon size={10} className="text-black" />
          <span className="text-[9px] tracking-widest text-gray-400">STRENGTH</span>
        </div>
        <div className="flex items-center gap-1">
          <HeartPulseIcon size={10} className="text-black" />
          <span className="text-[9px] tracking-widest text-gray-400">CARDIO</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="calendar-cheat text-[9px] font-bold">C</span>
          <span className="text-[9px] tracking-widest text-gray-400">CHEAT</span>
        </div>
        <span className="text-[9px] tracking-widest text-gray-400">+ UP</span>
        <span className="text-[9px] tracking-widest text-gray-400">− DOWN</span>
        <span className="text-[9px] tracking-widest text-gray-400">· REST</span>
      </div>

      {/* Selected day detail */}
      {selected && (
        <div className="border border-black p-4 fade-in">
          <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-3">
            {new Date(toDateStr(selected)).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}
          </p>

          {selectedWorkouts.length === 0 && selectedCardio.length === 0 && selectedCheats.length === 0 && (
            <p className="text-[10px] text-gray-300 tracking-widest text-center py-3">REST DAY</p>
          )}

          {selectedWorkouts.length > 0 && (
            <div className="mb-3">
              {selectedWorkouts.map(log => (
                <div key={log.id} className="mb-2 border-b border-gray-100 pb-2">
                  <p className="text-xs font-bold tracking-wide mb-1">{log.exercise_name}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {log.sets.map((s, i) => (
                      <span key={i} className="text-[10px] border border-gray-200 px-2 py-1">
                        {s.weight}kg×{s.reps}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedCardio.map(c => (
            <div key={c.id} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2">
                <HeartPulseIcon size={12} />
                <span className="text-xs tracking-wide">{c.type || "CARDIO"}</span>
                {c.distance_km && (
                  <span className="text-[10px] text-gray-400">{c.distance_km} km</span>
                )}
              </div>
              <span className="text-xs font-bold">{c.duration_minutes} min{c.calories ? ` · ${c.calories} kcal` : ""}</span>
            </div>
          ))}

          {selectedCheats.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <DevilIcon size={12} className="calendar-cheat" />
                <span className="text-xs tracking-wide calendar-cheat">CHEAT DAY</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedCheats[0].selections.map(s => (
                  <span key={s} className="text-[9px] border border-gray-200 px-2 py-0.5 calendar-cheat">
                    {s.replace(/_/g, " ").toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
