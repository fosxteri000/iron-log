import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExercises, useExerciseHistory } from "../hooks/useExercises";
import { formatDate } from "../lib/utils";
import LineChart from "../components/LineChart";
import { TrophyIcon } from "../components/Icons";

export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { exercises } = useExercises();
  const { history } = useExerciseHistory(id);

  const exercise = exercises.find(ex => ex.id === id);

  const volumeChartData = useMemo(() => {
    return [...history]
      .reverse()
      .slice(-12)
      .map(log => ({
        label: formatDate(log.date),
        value: log.sets.reduce((sum, s) => sum + s.weight * s.reps, 0),
      }));
  }, [history]);

  const maxWeightChartData = useMemo(() => {
    return [...history]
      .reverse()
      .slice(-12)
      .map(log => ({
        label: formatDate(log.date),
        value: Math.max(...log.sets.map(s => s.weight)),
      }));
  }, [history]);

  // Personal bests
  const personalBests = useMemo(() => {
    const bests = {};
    history.forEach(log => {
      log.sets.forEach(s => {
        if (!bests.maxWeight || s.weight > bests.maxWeight.weight) {
          bests.maxWeight = { ...s, date: log.date };
        }
        const vol = s.weight * s.reps;
        if (!bests.maxVolume || vol > bests.maxVolume.vol) {
          bests.maxVolume = { ...s, vol, date: log.date };
        }
      });
    });
    return bests;
  }, [history]);

  if (!exercise) {
    return (
      <div className="text-center py-20 text-[10px] tracking-widest text-gray-400">
        EXERCISE NOT FOUND
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-[10px] tracking-widest text-gray-400 active:text-black mb-6 flex items-center gap-2 py-2"
      >
        ← BACK
      </button>

      {/* Title */}
      <div className="mb-6">
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-1">{exercise.category.toUpperCase()}</p>
        <h2 className="text-xl font-bold tracking-wide">{exercise.name.toUpperCase()}</h2>
      </div>

      {/* Charts */}
      {volumeChartData.length >= 2 && (
        <div className="mb-4">
          <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-2">VOLUME TREND</p>
          <div className="border border-gray-100 p-2">
            <LineChart data={volumeChartData} />
          </div>
        </div>
      )}

      {maxWeightChartData.length >= 2 && (
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-2">MAX WEIGHT TREND</p>
          <div className="border border-gray-100 p-2">
            <LineChart data={maxWeightChartData} />
          </div>
        </div>
      )}

      {/* Personal Bests */}
      {(personalBests.maxWeight || personalBests.maxVolume) && (
        <div className="mb-6 border border-black p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrophyIcon size={12} className="text-gray-400" />
            <p className="text-[10px] tracking-[0.3em] text-gray-400">PERSONAL BESTS</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {personalBests.maxWeight && (
              <div>
                <p className="text-[10px] text-gray-400 tracking-widest mb-0.5">MAX WEIGHT</p>
                <p className="text-lg font-bold">{personalBests.maxWeight.weight}kg</p>
                <p className="text-[10px] text-gray-400">{formatDate(personalBests.maxWeight.date)}</p>
              </div>
            )}
            {personalBests.maxVolume && (
              <div>
                <p className="text-[10px] text-gray-400 tracking-widest mb-0.5">BEST SET</p>
                <p className="text-lg font-bold">{personalBests.maxVolume.weight}kg × {personalBests.maxVolume.reps}</p>
                <p className="text-[10px] text-gray-400">{formatDate(personalBests.maxVolume.date)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <p className="text-[10px] tracking-[0.3em] text-gray-400 mb-3">HISTORY</p>
        {history.length === 0 ? (
          <p className="text-[10px] text-gray-300 tracking-widest text-center py-6">NO HISTORY YET</p>
        ) : (
          history.slice(0, 20).map((log, i) => (
            <div key={log.id} className="mb-4 border-b border-gray-100 pb-3 stagger-item" style={{ "--i": i }}>
              <p className="text-[10px] text-gray-400 tracking-widest mb-2">{formatDate(log.date)}</p>
              <div className="flex flex-wrap gap-2">
                {log.sets.map((s, j) => (
                  <div key={j} className="border border-gray-200 px-2.5 py-1.5">
                    <span className="text-sm font-bold">{s.weight}</span>
                    <span className="text-[10px] text-gray-400"> kg × </span>
                    <span className="text-sm font-bold">{s.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
