import { useState, useEffect } from "react";
import { apiGet } from "../lib/api";

export function useMainStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const result = await apiGet("/api/v1/statistics/main");

    if (!result) {
      // ✅ fallback dummy data
      setData({
        users: 3500,
        lessons: 20000,
        certificates: 156
      });
    } else {
      setData({
        users: result.users,
        lessons: result.lessons,
        certificates: result.certificates
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return { data, loading };
}


