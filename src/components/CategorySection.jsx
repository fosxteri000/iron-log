import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExercises } from "../hooks/useExercises";
import { useProfile } from "../hooks/useProfile";
import Collapse from "./Collapse";
import ExerciseInlineForm from "./ExerciseInlineForm";
import { CATEGORY_ICONS, TrashIcon } from "./Icons";

function Chevron({ open }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      className={`transition-transform duration-200 text-gray-400 ${open ? "rotate-180" : ""}`}
    >
      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CategorySection({ title, exercises, doneIds }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();
  const { deleteExercise } = useExercises();
  const { removeExerciseFromAllDays } = useProfile();

  const doneCount = exercises.filter(ex => doneIds.has(ex.id)).length;
  const Icon = CATEGORY_ICONS[title];

  const handleDelete = async (id) => {
    await deleteExercise(id);
    removeExerciseFromAllDays(id);
    setConfirmId(null);
    if (expandedId === id) setExpandedId(null);
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="mb-4">
      {/* Section header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 border-b border-black active:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={14} className="text-gray-500" />}
          <span className="text-xs font-bold tracking-[0.3em] uppercase">{title}</span>
          <span className="text-[10px] text-gray-400 tracking-widest">
            {doneCount}/{exercises.length}
          </span>
        </div>
        <span className="text-xs text-gray-400">{open ? "−" : "+"}</span>
      </button>

      <Collapse open={open}>
        <div className="pt-1 pb-2">
          {exercises.length === 0 ? (
            <p className="text-[10px] text-gray-300 tracking-widest py-6 text-center">
              NO EXERCISES — USE + TO ADD
            </p>
          ) : (
            <>
              {exercises.map((ex, i) => {
                const done = doneIds.has(ex.id);
                const isExpanded = expandedId === ex.id;
                const isConfirming = confirmId === ex.id;

                return (
                  <div
                    key={ex.id}
                    className="border-b border-gray-100 stagger-item"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    {isConfirming ? (
                      <div className="flex items-center justify-between py-3 gap-3">
                        <span className="text-xs text-gray-500 tracking-wide truncate">DELETE {ex.name.toUpperCase()}?</span>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleDelete(ex.id)}
                            className="text-[10px] tracking-widest bg-black text-white px-3 py-1.5"
                          >YES</button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="text-[10px] tracking-widest border border-gray-300 px-3 py-1.5"
                          >NO</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Exercise row */}
                        <div className="flex items-center">
                          {/* Main tap area → inline expand */}
                          <button
                            onClick={() => !editing && toggleExpand(ex.id)}
                            className="flex-1 flex items-center gap-3 py-3.5 active:bg-gray-50 transition-colors"
                          >
                            <div className={`w-2.5 h-2.5 border border-black transition-colors shrink-0 ${done ? "bg-black" : "bg-white"}`} />
                            <span className="text-sm tracking-wide text-left">{ex.name}</span>
                          </button>

                          {/* Right side: History link + chevron (or trash in edit mode) */}
                          {editing ? (
                            <button
                              onClick={() => setConfirmId(ex.id)}
                              className="p-3 text-gray-300 active:text-black transition-colors shrink-0"
                            >
                              <TrashIcon size={13} />
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 shrink-0 pr-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); navigate(`/exercise/${ex.id}`); }}
                                className="text-[9px] tracking-wide text-gray-300 active:text-black transition-colors px-1.5 py-1"
                              >
                                History ↗
                              </button>
                              <button
                                onClick={() => toggleExpand(ex.id)}
                                className="p-2 text-gray-400 active:text-black transition-colors"
                              >
                                <Chevron open={isExpanded} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Inline log form */}
                        <Collapse open={isExpanded}>
                          <ExerciseInlineForm
                            exerciseId={ex.id}
                            exercise={ex}
                            onSaved={() => setExpandedId(null)}
                          />
                        </Collapse>
                      </>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => { setEditing(o => !o); setConfirmId(null); }}
                className="w-full py-2 mt-2 text-[10px] tracking-widest text-gray-400 active:text-black transition-colors"
              >
                {editing ? "DONE EDITING" : "EDIT"}
              </button>
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
}
