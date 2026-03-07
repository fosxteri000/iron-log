import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { getStartOfWeek } from "../lib/utils";
import { useAuth } from "./useAuth";

// ── Exercises (per-user) ─────────────────────────────────────
export function useExercises() {
  const { userId } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (userId) fetchExercises(); }, [userId]);

  async function fetchExercises() {
    setLoading(true);
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("user_id", userId)
      .order("category")
      .order("name");
    if (!error) setExercises(data || []);
    setLoading(false);
  }

  async function addExercise(exercise) {
    const { data, error } = await supabase
      .from("exercises")
      .insert({ ...exercise, user_id: userId })
      .select()
      .single();
    if (!error) setExercises(prev => [...prev, data]);
    return { data, error };
  }

  async function addExercises(exerciseList) {
    const rows = exerciseList.map(ex => ({ ...ex, user_id: userId }));
    const { data, error } = await supabase
      .from("exercises")
      .insert(rows)
      .select();
    if (!error && data) setExercises(prev => [...prev, ...data]);
    return { data, error };
  }

  async function deleteExercise(id) {
    const { error } = await supabase
      .from("exercises")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (!error) setExercises(prev => prev.filter(ex => ex.id !== id));
    return { error };
  }

  return { exercises, loading, refetch: fetchExercises, addExercise, addExercises, deleteExercise };
}

// ── Exercise History ─────────────────────────────────────────
export function useExerciseHistory(exerciseId) {
  const { userId } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!exerciseId || !userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("workout_sets")
      .select("*, workout_sessions(date)")
      .eq("exercise_id", exerciseId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (!error && data) {
      const grouped = {};
      data.forEach(s => {
        const date = s.workout_sessions?.date || s.created_at?.split("T")[0];
        if (!grouped[date]) grouped[date] = { id: s.id, date, sets: [] };
        grouped[date].sets.push({ id: s.id, weight: s.weight_kg, reps: s.reps });
      });
      setHistory(
        Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date))
      );
    }
    setLoading(false);
  }, [exerciseId, userId]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const logSets = useCallback(async (sets, targetWeight, targetReps) => {
    if (!userId) return { error: "Not authenticated" };
    const validSets = sets
      .filter(s => s.weight && s.reps)
      .map(s => ({ weight: parseFloat(s.weight), reps: parseInt(s.reps) }));
    if (!validSets.length) return { error: "No valid sets" };

    const today = new Date().toISOString().split("T")[0];

    let sessionId;
    const { data: existing } = await supabase
      .from("workout_sessions")
      .select("id")
      .eq("date", today)
      .eq("user_id", userId)
      .single();

    if (existing) {
      sessionId = existing.id;
    } else {
      const { data: newSession, error } = await supabase
        .from("workout_sessions")
        .insert({ date: today, user_id: userId })
        .select()
        .single();
      if (error) return { error };
      sessionId = newSession.id;
    }

    const setsToInsert = validSets.map((s, i) => ({
      exercise_id: exerciseId,
      session_id: sessionId,
      user_id: userId,
      set_number: i + 1,
      weight_kg: s.weight,
      reps: s.reps,
      target_weight_kg: targetWeight ? parseFloat(targetWeight) : null,
      target_reps: targetReps ? parseInt(targetReps) : null,
    }));

    const { error } = await supabase.from("workout_sets").insert(setsToInsert);
    if (!error) fetchHistory();
    return { error };
  }, [exerciseId, userId, fetchHistory]);

  const updateSet = useCallback(async (setId, { weight_kg, reps }) => {
    if (!userId) return { error: "Not authenticated" };
    const { error } = await supabase
      .from("workout_sets")
      .update({ weight_kg: parseFloat(weight_kg), reps: parseInt(reps) })
      .eq("id", setId)
      .eq("user_id", userId);
    if (!error) fetchHistory();
    return { error };
  }, [userId, fetchHistory]);

  return { history, loading, logSets, updateSet, refetch: fetchHistory };
}

// ── Week Sets (done indicators) ──────────────────────────────
export function useWeekSets() {
  const { userId } = useAuth();
  const [doneIds, setDoneIds] = useState(new Set());

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const startOfWeek = getStartOfWeek().toISOString().split("T")[0];
      const { data } = await supabase
        .from("workout_sets")
        .select("exercise_id")
        .eq("user_id", userId)
        .gte("created_at", startOfWeek);
      if (data) setDoneIds(new Set(data.map(s => s.exercise_id)));
    })();
  }, [userId]);

  return doneIds;
}

// ── Progress Data ────────────────────────────────────────────
export function useProgressData() {
  const { userId } = useAuth();
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [cardioLogs, setCardioLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      const { data: sets } = await supabase
        .from("workout_sets")
        .select("*, exercises(name, category), workout_sessions(date)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (sets) {
        const grouped = {};
        sets.forEach(s => {
          const date = s.workout_sessions?.date || s.created_at?.split("T")[0];
          const key = `${s.exercise_id}_${date}`;
          if (!grouped[key]) {
            grouped[key] = {
              id: key,
              exercise_id: s.exercise_id,
              exercise_name: s.exercises?.name,
              category: s.exercises?.category,
              date,
              sets: [],
            };
          }
          grouped[key].sets.push({ weight: s.weight_kg, reps: s.reps });
        });
        setWorkoutLogs(Object.values(grouped));
      }

      const { data: cardio } = await supabase
        .from("cardio_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(50);
      setCardioLogs(cardio || []);

      setLoading(false);
    })();
  }, [userId]);

  return { workoutLogs, cardioLogs, loading };
}

// ── Cardio ───────────────────────────────────────────────────
export function useCardio() {
  const { userId } = useAuth();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data } = await supabase
        .from("cardio_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(20);
      setSessions(data || []);
    })();
  }, [userId]);

  const logCardio = useCallback(async ({ duration_minutes, calories, type, distance_km, incline_level, speed_level }) => {
    if (!userId) return { error: "Not authenticated" };
    const today = new Date().toISOString().split("T")[0];
    const payload = {
      date: today,
      duration_minutes,
      calories: calories || null,
      user_id: userId,
      type: type || "Run",
      distance_km: distance_km ? parseFloat(distance_km) : null,
      incline_level: incline_level ? parseFloat(incline_level) : null,
      speed_level: speed_level ? parseFloat(speed_level) : null,
    };
    const { data, error } = await supabase
      .from("cardio_sessions")
      .insert(payload)
      .select()
      .single();
    if (!error) setSessions(prev => [data, ...prev]);
    return { error };
  }, [userId]);

  const updateCardio = useCallback(async (id, data) => {
    if (!userId) return { error: "Not authenticated" };
    const { error } = await supabase
      .from("cardio_sessions")
      .update(data)
      .eq("id", id)
      .eq("user_id", userId);
    if (!error) setSessions(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    return { error };
  }, [userId]);

  return { sessions, logCardio, updateCardio };
}

// ── Body Weight ──────────────────────────────────────────────
export function useBodyWeight() {
  const { userId } = useAuth();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data } = await supabase
        .from("body_weight_logs")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: true })
        .limit(100);
      setLogs(data || []);
    })();
  }, [userId]);

  const logWeight = useCallback(async (weight_kg, body_fat_percent) => {
    if (!userId) return;
    const today = new Date().toISOString().split("T")[0];

    const { data: existing } = await supabase
      .from("body_weight_logs")
      .select("id")
      .eq("date", today)
      .eq("user_id", userId)
      .single();

    const payload = { weight_kg };
    if (body_fat_percent !== undefined && body_fat_percent !== null && body_fat_percent !== "") {
      payload.body_fat_percent = parseFloat(body_fat_percent);
    }

    if (existing) {
      await supabase.from("body_weight_logs").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("body_weight_logs").insert({ date: today, user_id: userId, ...payload });
    }

    const { data } = await supabase
      .from("body_weight_logs")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });
    setLogs(data || []);
  }, [userId]);

  const updateWeight = useCallback(async (id, data) => {
    if (!userId) return { error: "Not authenticated" };
    const { error } = await supabase
      .from("body_weight_logs")
      .update(data)
      .eq("id", id)
      .eq("user_id", userId);
    if (!error) setLogs(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
    return { error };
  }, [userId]);

  return { logs, logWeight, updateWeight };
}
