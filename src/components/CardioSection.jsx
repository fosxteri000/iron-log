import React, { useState, useMemo, useRef } from "react";
import { useCardio } from "../hooks/useExercises";
import { formatDate, scrollSectionToCenter } from "../lib/utils";
import Collapse from "./Collapse";
import LineChart from "./LineChart";
import { HeartPulseIcon, CARDIO_TYPE_ICONS, CARDIO_TYPES, EditIcon } from "./Icons";

function LevelPicker({ label, value, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] tracking-widest text-gray-400">{label}</label>
        <span className="text-xs font-bold tabular-nums">{value || "—"}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-gray-400">1</span>
        <input
          type="range"
          min="1"
          max="20"
          step="0.5"
          value={value || 1}
          onChange={e => onChange(e.target.value)}
          className="flex-1 accent-black h-1 cursor-pointer"
        />
        <span className="text-[9px] text-gray-400">20</span>
      </div>
    </div>
  );
}

const emptyForm = { type: "Run", custom_type: "", duration_minutes: "", distance_km: "", calories: "", incline_level: "", speed_level: "" };

export default function CardioSection() {
  const sectionRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [done, setDone] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const { sessions, logCardio, updateCardio } = useCardio();

  const chartData = useMemo(() => {
    return [...sessions]
      .reverse()
      .slice(-7)
      .map(s => ({ label: formatDate(s.date), value: s.duration_minutes }));
  }, [sessions]);

  const isTreadmill = form.type === "Run" || form.type === "Walk";

  const handleSubmit = (e) => {
    e.preventDefault();
    const resolvedType = form.type === "Other" ? (form.custom_type.trim() || "Other") : form.type;
    logCardio({
      type: resolvedType,
      duration_minutes: parseInt(form.duration_minutes),
      distance_km: form.distance_km ? parseFloat(form.distance_km) : null,
      calories: form.calories ? parseInt(form.calories) : null,
      incline_level: isTreadmill && form.incline_level ? parseFloat(form.incline_level) : null,
      speed_level: isTreadmill && form.speed_level ? parseFloat(form.speed_level) : null,
    });
    setDone(true);
    setForm(emptyForm);
    setTimeout(() => { setDone(false); setLogOpen(false); }, 1200);
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditForm({
      type: s.type || "Run",
      duration_minutes: String(s.duration_minutes || ""),
      distance_km: s.distance_km != null ? String(s.distance_km) : "",
      calories: s.calories != null ? String(s.calories) : "",
    });
  };

  const handleEditSave = async () => {
    setEditSaving(true);
    await updateCardio(editingId, {
      type: editForm.type,
      duration_minutes: editForm.duration_minutes ? parseInt(editForm.duration_minutes) : null,
      distance_km: editForm.distance_km ? parseFloat(editForm.distance_km) : null,
      calories: editForm.calories ? parseInt(editForm.calories) : null,
    });
    setEditSaving(false);
    setEditingId(null);
  };

  return (
    <div ref={sectionRef} className="mb-4">
      <button
        onClick={() => setOpen(o => { if (!o) scrollSectionToCenter(sectionRef); return !o; })}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <HeartPulseIcon size={14} className="text-gray-500" />
          <span className="text-xs font-bold tracking-[0.3em] uppercase">CARDIO</span>
        </div>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <Collapse open={open}>
        <div className="pt-2 pb-2">
          <button
            onClick={() => setLogOpen(o => !o)}
            className="w-full py-3.5 border border-black text-xs tracking-widest active:bg-black active:text-white transition-colors mb-3"
          >
            + LOG CARDIO
          </button>

          <Collapse open={logOpen}>
            <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-200 fade-in space-y-4">
              {/* Type picker */}
              <div>
                <label className="text-[10px] tracking-widest text-gray-400 block mb-2">TYPE</label>
                <div className="grid grid-cols-5 gap-1">
                  {CARDIO_TYPES.map(t => {
                    const Icon = CARDIO_TYPE_ICONS[t] || HeartPulseIcon;
                    const active = form.type === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, type: t, incline_level: "", speed_level: "" }))}
                        className={`flex flex-col items-center gap-1 py-2 border text-[9px] tracking-wide transition-colors
                          ${active ? "bg-black text-white border-black" : "border-gray-200 active:border-black"}`}
                      >
                        <Icon size={14} />
                        {t.toUpperCase()}
                      </button>
                    );
                  })}
                </div>

                {form.type === "Other" && (
                  <input
                    type="text"
                    value={form.custom_type}
                    onChange={e => setForm(f => ({ ...f, custom_type: e.target.value }))}
                    placeholder="Activity name..."
                    className="w-full border-b border-black py-2 text-sm focus:outline-none bg-transparent mt-3"
                  />
                )}
              </div>

              {/* Incline + Speed — Run/Walk only */}
              {isTreadmill && (
                <div className="space-y-4 p-3 border border-gray-100 bg-gray-50">
                  <p className="text-[9px] tracking-widest text-gray-400 uppercase">Treadmill Settings (opt.)</p>
                  <LevelPicker
                    label="INCLINE LEVEL"
                    value={form.incline_level}
                    onChange={v => setForm(f => ({ ...f, incline_level: v }))}
                  />
                  <LevelPicker
                    label="SPEED LEVEL"
                    value={form.speed_level}
                    onChange={v => setForm(f => ({ ...f, speed_level: v }))}
                  />
                </div>
              )}

              {/* Duration + Distance */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] tracking-widest text-gray-400 block mb-1">MINUTES</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={form.duration_minutes}
                    onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))}
                    placeholder="30"
                    required
                    className="w-full border-b border-black py-2 text-base focus:outline-none bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-widest text-gray-400 block mb-1">KM (OPT.)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={form.distance_km}
                    onChange={e => setForm(f => ({ ...f, distance_km: e.target.value }))}
                    placeholder="5.0"
                    className="w-full border-b border-black py-2 text-base focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Calories */}
              <div>
                <label className="text-[10px] tracking-widest text-gray-400 block mb-1">CALORIES (OPT.)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={form.calories}
                  onChange={e => setForm(f => ({ ...f, calories: e.target.value }))}
                  placeholder="300"
                  className="w-full border-b border-black py-2 text-base focus:outline-none bg-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={done || !form.duration_minutes}
                className={`w-full py-3 bg-black text-white text-xs tracking-widest disabled:opacity-50 ${done ? "pulse-glow" : ""}`}
              >
                {done ? "LOGGED ✓" : "SAVE"}
              </button>
            </form>
          </Collapse>

          {chartData.length >= 2 && (
            <div className="border border-gray-100 p-2 mb-3">
              <p className="text-[10px] tracking-widest text-gray-400 mb-1">DURATION TREND</p>
              <LineChart data={chartData} height={60} />
            </div>
          )}

          {sessions.slice(0, 6).map(s => {
            const TypeIcon = CARDIO_TYPE_ICONS[s.type] || HeartPulseIcon;
            const isEditing = editingId === s.id;
            const hasTreadmill = s.incline_level || s.speed_level;

            return (
              <div key={s.id}>
                {/* Session summary row */}
                <div className="flex items-start justify-between py-2.5 border-b border-gray-100">
                  <div className="flex items-start gap-2 flex-1">
                    <TypeIcon size={12} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] tracking-widest text-gray-400">
                        {s.type || "CARDIO"} · {formatDate(s.date)}
                      </span>
                      {s.distance_km && (
                        <span className="text-[10px] text-gray-300 ml-2">{s.distance_km} km</span>
                      )}
                      {hasTreadmill && (
                        <div className="flex gap-2 mt-0.5">
                          {s.incline_level && <span className="text-[9px] text-gray-300">↑ {s.incline_level}</span>}
                          {s.speed_level && <span className="text-[9px] text-gray-300">→ {s.speed_level}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-bold tracking-wide">{s.duration_minutes} min</span>
                      {s.calories && <span className="text-[10px] text-gray-400 block">{s.calories} kcal</span>}
                    </div>
                    <button
                      type="button"
                      onClick={() => isEditing ? setEditingId(null) : startEdit(s)}
                      className="text-gray-300 active:text-black transition-colors p-1"
                      aria-label="Edit session"
                    >
                      <EditIcon size={14} />
                    </button>
                  </div>
                </div>

                {/* Inline edit form */}
                <Collapse open={isEditing}>
                  <div className="px-3 py-3 border-b border-gray-100 bg-gray-50 space-y-3 fade-in">
                    <div>
                      <label className="text-[10px] tracking-widest text-gray-400 block mb-1.5">TYPE</label>
                      <div className="flex flex-wrap gap-1">
                        {CARDIO_TYPES.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setEditForm(f => ({ ...f, type: t }))}
                            className={`py-1 px-2 border text-[9px] tracking-wide transition-colors
                              ${editForm.type === t ? "bg-black text-white border-black" : "border-gray-200 active:border-black"}`}
                          >
                            {t.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] tracking-widest text-gray-400 block mb-1">MIN</label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={editForm.duration_minutes}
                          onChange={e => setEditForm(f => ({ ...f, duration_minutes: e.target.value }))}
                          className="w-full border-b border-black py-1.5 text-sm focus:outline-none bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-widest text-gray-400 block mb-1">KM</label>
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.1"
                          value={editForm.distance_km}
                          onChange={e => setEditForm(f => ({ ...f, distance_km: e.target.value }))}
                          className="w-full border-b border-gray-300 py-1.5 text-sm focus:outline-none bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-widest text-gray-400 block mb-1">KCAL</label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={editForm.calories}
                          onChange={e => setEditForm(f => ({ ...f, calories: e.target.value }))}
                          className="w-full border-b border-gray-300 py-1.5 text-sm focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-2 border border-black text-[10px] tracking-widest active:bg-gray-100 transition-colors"
                      >
                        CANCEL
                      </button>
                      <button
                        type="button"
                        onClick={handleEditSave}
                        disabled={editSaving}
                        className="flex-1 py-2 bg-black text-white text-[10px] tracking-widest disabled:opacity-50"
                      >
                        {editSaving ? "SAVING..." : "SAVE"}
                      </button>
                    </div>
                  </div>
                </Collapse>
              </div>
            );
          })}
        </div>
      </Collapse>
    </div>
  );
}
