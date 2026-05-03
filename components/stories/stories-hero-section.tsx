"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  Filter,
  X,
  Smile,
  Mountain,
  Feather,
  Wind,
} from "lucide-react";

type MoodFilter =
  | "all"
  | "peaceful"
  | "adventurous"
  | "reflective"
  | "exhilarated"
  | "grateful"
  | "challenged";
type DifficultyFilter = "all" | "easy" | "moderate" | "hard" | "extreme";

const moodOptions: { key: MoodFilter; label: string; emoji: string }[] = [
  { key: "all", label: "All", emoji: "✨" },
  { key: "peaceful", label: "Damai", emoji: "🌿" },
  { key: "adventurous", label: "Petualang", emoji: "⚡" },
  { key: "reflective", label: "Reflektif", emoji: "🌙" },
  { key: "exhilarated", label: "Menggebu", emoji: "🔥" },
  { key: "grateful", label: "Bersyukur", emoji: "🙏" },
  { key: "challenged", label: "Penuh Tantangan", emoji: "💪" },
];

const difficultyOptions: { key: DifficultyFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "easy", label: "Easy" },
  { key: "moderate", label: "Medium" },
  { key: "hard", label: "Hard" },
];

interface StoriesHeroProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  moodFilter: MoodFilter;
  setMoodFilter: (v: MoodFilter) => void;
  difficultyFilter: DifficultyFilter;
  setDifficultyFilter: (v: DifficultyFilter) => void;
  clearFilters: () => void;
}

export function StoriesHero({
  searchQuery,
  setSearchQuery,
  moodFilter,
  setMoodFilter,
  difficultyFilter,
  setDifficultyFilter,
  clearFilters,
}: StoriesHeroProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount =
    (moodFilter !== "all" ? 1 : 0) + (difficultyFilter !== "all" ? 1 : 0);

  return (
    <section className="relative pt-24 pb-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent" />

      {/* Floating decorations */}
      <div className="absolute top-28 left-[8%] animate-float opacity-15">
        <Feather className="h-12 w-12 text-primary" />
      </div>
      <div
        className="absolute top-36 right-[12%] animate-float opacity-10"
        style={{ animationDelay: "2s" }}
      >
        <BookOpen className="h-16 w-16 text-primary" />
      </div>
      <div
        className="absolute bottom-6 left-[28%] animate-float opacity-8"
        style={{ animationDelay: "4s" }}
      >
        <Wind className="h-10 w-10 text-primary" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Cerita Komunitas
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Kisah Nyata <span className="text-gradient">Para Pendaki</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Jelajahi ratusan cerita dari komunitas pendaki Indonesia. Temukan
            inspirasi, tips, dan pengalaman dari setiap puncak yang pernah
            ditaklukkan.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass rounded-2xl p-3 flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
            <input
              type="text"
              placeholder="Cari judul, penulis, atau jalur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm sm:text-base"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                showFilters
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {(searchQuery ||
              moodFilter !== "all" ||
              difficultyFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto overflow-hidden"
            >
              <div className="glass rounded-2xl p-4 mt-3 space-y-4">
                {/* Mood filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Smile className="h-3.5 w-3.5 text-primary" />
                    Suasana Cerita
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {moodOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setMoodFilter(opt.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                          moodFilter === opt.key
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "glass text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        <span>{opt.emoji}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Mountain className="h-3.5 w-3.5 text-primary" />
                    Tingkat Kesulitan
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {difficultyOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setDifficultyFilter(opt.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          difficultyFilter === opt.key
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "glass text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
