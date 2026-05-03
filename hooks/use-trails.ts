"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Trail {
  id: string;
  name: string;
  location: string;
  elevation: number;
  image?: string | null;
  estimated_duration?: string | null;
}

export function useTrails(limit = 100) {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrails = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("trails")
        .select("*")
        .limit(limit);

      if (error) {
        console.error("Error fetching trails:", error);
        setTrails([]);
      } else {
        // 🔥 sanitize data biar aman untuk <Image />
        const cleaned = (data || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          location: t.location,
          elevation: t.elevation,
          image: typeof t.image === "string" ? t.image.trim() : null,
          estimated_duration: t.estimated_duration || null,
        }));

        setTrails(cleaned);
      }

      setLoading(false);
    };

    fetchTrails();
  }, [limit]);

  return { trails, loading };
}
