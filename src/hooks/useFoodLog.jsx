import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useFoodLog(date) {
  const { userId } = useAuth();
  const today = date || new Date().toISOString().split("T")[0];
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeals = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from("food_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .order("created_at", { ascending: true });
    setMeals(data || []);
    setLoading(false);
  }, [userId, today]);

  useEffect(() => { fetchMeals(); }, [fetchMeals]);

  const addMeal = useCallback(async ({ meal_type, calories, protein_g, carbs_g, fat_g, quality }) => {
    if (!userId) return { error: "Not authenticated" };
    const payload = {
      user_id: userId,
      date: today,
      meal_type,
      calories: calories ? parseInt(calories) : null,
      protein_g: protein_g ? parseInt(protein_g) : null,
      carbs_g: carbs_g ? parseInt(carbs_g) : null,
      fat_g: fat_g ? parseInt(fat_g) : null,
      quality: quality || null,
    };
    const { data, error } = await supabase.from("food_logs").insert(payload).select().single();
    if (!error && data) setMeals(prev => [...prev, data]);
    return { data, error };
  }, [userId, today]);

  const updateMeal = useCallback(async (id, { meal_type, calories, protein_g, carbs_g, fat_g, quality }) => {
    if (!userId) return { error: "Not authenticated" };
    const payload = {
      meal_type,
      calories: calories ? parseInt(calories) : null,
      protein_g: protein_g ? parseInt(protein_g) : null,
      carbs_g: carbs_g ? parseInt(carbs_g) : null,
      fat_g: fat_g ? parseInt(fat_g) : null,
      quality: quality || null,
    };
    const { data, error } = await supabase
      .from("food_logs")
      .update(payload)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (!error && data) setMeals(prev => prev.map(m => m.id === id ? data : m));
    return { data, error };
  }, [userId]);

  return { meals, loading, addMeal, updateMeal, refetch: fetchMeals };
}

// Hook for fetching all food logs for stats (all dates)
export function useFoodLogs() {
  const { userId } = useAuth();
  const [foodLogs, setFoodLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("food_logs")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(200);
      setFoodLogs(data || []);
      setLoading(false);
    })();
  }, [userId]);

  return { foodLogs, loading };
}
