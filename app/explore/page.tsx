"use client";

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ExploreHero } from "@/components/homepage/explore/explore-hero-section";
import { ExploreTrailsGrid } from "@/components/homepage/explore/explore-trails-grid-section";
import { supabase } from "@/lib/supabase";

interface Trail {
  id: string;
  name: string;
  location: string;
  region: string | null;
  elevation: number;
  difficulty: string;
  estimated_duration: string | null;
}

type DifficultyFilter = "all" | "easy" | "medium" | "hard";

export default function ExplorePage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [storyCounts, setStoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");
  const [locationFilter, setLocationFilter] = useState("");

  // Fetch trails
  useEffect(() => {
    const fetchTrails = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("trails")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching trails:", error);
      } else {
        setTrails(data || []);
      }

      setLoading(false);
    };

    fetchTrails();
  }, []);

  // Fetch story counts per trail
  useEffect(() => {
    const fetchStoryCounts = async () => {
      const { data, error } = await supabase
        .from("stories")
        .select("trail_id")
        .eq("is_draft", false)
        .eq("is_private", false)
        .not("trail_id", "is", null);

      if (error) {
        console.error("Error fetching story counts:", error);
      } else {
        const counts: Record<string, number> = {};
        (data || []).forEach((row: { trail_id: string }) => {
          counts[row.trail_id] = (counts[row.trail_id] || 0) + 1;
        });
        setStoryCounts(counts);
      }
    };

    fetchStoryCounts();
  }, []);

  // Filtered trails
  const filteredTrails = useMemo(() => {
    return trails.filter((trail) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!trail.name.toLowerCase().includes(query)) {
          return false;
        }
      }

      if (difficultyFilter !== "all" && trail.difficulty !== difficultyFilter) {
        return false;
      }

      if (locationFilter) {
        const loc = locationFilter.toLowerCase();
        const matchesLocation = trail.location?.toLowerCase().includes(loc);
        const matchesRegion = trail.region?.toLowerCase().includes(loc);
        if (!matchesLocation && !matchesRegion) {
          return false;
        }
      }

      return true;
    });
  }, [trails, searchQuery, difficultyFilter, locationFilter]);

  const hasActiveFilters =
    searchQuery !== "" || difficultyFilter !== "all" || locationFilter !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setDifficultyFilter("all");
    setLocationFilter("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <ExploreHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        difficultyFilter={difficultyFilter}
        setDifficultyFilter={setDifficultyFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        clearFilters={clearFilters}
      />

      <ExploreTrailsGrid
        trails={filteredTrails}
        storyCounts={storyCounts}
        loading={loading}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />

      <Footer />
    </div>
  );
}
