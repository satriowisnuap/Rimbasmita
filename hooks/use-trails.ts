import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Trail {
  id: string;
  name: string;
  location?: string;
}

export function useTrails() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loadingTrails, setLoadingTrails] = useState(true);

  useEffect(() => {
    async function fetchTrails() {
      try {
        const { data, error } = await supabase
          .from("trails")
          .select("id, name, location")
          .order("name");

        if (error) {
          console.error("Error fetching trails:", error);
        } else {
          setTrails(data || []);
        }
      } catch (err) {
        console.error("Error fetching trails:", err);
      } finally {
        setLoadingTrails(false);
      }
    }

    fetchTrails();
  }, []);

  return { trails, loadingTrails };
}
