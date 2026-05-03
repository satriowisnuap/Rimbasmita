"use client";

import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StoriesHero } from "@/components/stories/stories-hero-section";
import { StoriesGrid } from "@/components/stories/stories-grid-section";

export interface StoryCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  difficulty: string | null;
  duration: string | null;
  mood: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: {
    name: string;
    username: string;
    image?: string;
  } | null;
  trails: {
    name: string;
    location: string;
  } | null;
  story_images: { image_url: string }[];
  story_tags: { tag: string }[];
}

type MoodFilter =
  | "all"
  | "peaceful"
  | "adventurous"
  | "reflective"
  | "exhilarated"
  | "grateful"
  | "challenged";
type DifficultyFilter = "all" | "easy" | "moderate" | "hard" | "extreme";

export default function StoriesPage() {
  const [stories, setStories] = useState<StoryCard[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState<MoodFilter>("all");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/stories");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setStories(data.stories ?? []);
      } catch (err) {
        console.error("Error fetching stories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = story.title.toLowerCase().includes(q);
        const matchAuthor =
          story.profiles?.name?.toLowerCase().includes(q) ?? false;
        const matchTrail =
          story.trails?.name?.toLowerCase().includes(q) ?? false;
        if (!matchTitle && !matchAuthor && !matchTrail) return false;
      }
      if (moodFilter !== "all" && story.mood !== moodFilter) return false;
      if (difficultyFilter !== "all" && story.difficulty !== difficultyFilter)
        return false;
      return true;
    });
  }, [stories, searchQuery, moodFilter, difficultyFilter]);

  const hasActiveFilters =
    searchQuery !== "" || moodFilter !== "all" || difficultyFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setMoodFilter("all");
    setDifficultyFilter("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <StoriesHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        moodFilter={moodFilter}
        setMoodFilter={setMoodFilter}
        difficultyFilter={difficultyFilter}
        setDifficultyFilter={setDifficultyFilter}
        clearFilters={clearFilters}
      />

      <StoriesGrid
        stories={filteredStories}
        loading={loading}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />

      <Footer />
    </div>
  );
}
