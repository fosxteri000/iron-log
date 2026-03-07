import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useSleepLog(date) {
  const { userId } = useAuth();
  const today = date || new Date().toISOString().split("T")[0];
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSleep = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await supabase
      .from("sleep_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();
    setLog(data || null);
    setLoading(false);
  }, [userId, today]);

  useEffect(() => { fetchSleep(); }, [fetchSleep]);

  const saveSleep = useCallback(async ({ duration_hours, quality }) => {
    if (!userId) return { error: "Not authenticated" };
    const payload = {
      user_id: userId,
      date: today,
      duration_hours: duration_hours != null ? parseFloat(duration_hours) : null,
      quality: quality || null,
    };
    const { data, error } = await supabase
      .from("sleep_logs")
      .upsert(payload, { onConflict: "user_id,date" })
      .select()
      .single();
    if (!error && data) setLog(data);
    return { data, error };
  }, [userId, today]);

  return { log, loading, saveSleep, refetch: fetchSleep };
}

// Hook for fetching all sleep logs for stats (all dates)
export function useSleepLogs() {
  const { userId } = useAuth();
  const [sleepLogs, setSleepLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("sleep_logs")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .limit(90);
      setSleepLogs(data || []);
      setLoading(false);
    })();
  }, [userId]);

  return { sleepLogs, loading };
}
