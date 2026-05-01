"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Compass, BookOpen, X } from "lucide-react";
import { TrailCard } from "@/components/trail-card";

interface Trail {
  id: string;
  name: string;
  location: string;
  region: string | null;
  elevation: number;
  difficulty: string;
  estimated_duration: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

interface ExploreTrailsGridProps {
  trails: Trail[];
  storyCounts: Record<string, number>;
  loading: boolean;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

export function ExploreTrailsGrid({
  trails,
  storyCounts,
  loading,
  hasActiveFilters,
  clearFilters,
}: ExploreTrailsGridProps) {
  return (
    <section className="pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Results info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-sm text-muted-foreground">
            {loading ? (
              "Memuat jalur..."
            ) : (
              <>
                Menampilkan{" "}
                <span className="font-semibold text-foreground">
                  {trails.length}
                </span>{" "}
                jalur
                {hasActiveFilters && " (dengan filter aktif)"}
              </>
            )}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>cerita per jalur</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                    <div className="h-4 w-14 bg-muted rounded" />
                  </div>
                  <div className="h-6 w-3/4 bg-muted rounded mb-3" />
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="h-4 w-4 bg-muted rounded-full" />
                    <div className="h-4 w-28 bg-muted rounded" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-20 bg-muted rounded" />
                    <div className="h-4 w-16 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : trails.length > 0 ? (
            <motion.div
              key="trails"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {trails.map((trail) => (
                <motion.div key={trail.id} variants={itemVariants}>
                  <TrailCard
                    id={trail.id}
                    name={trail.name}
                    location={trail.location}
                    region={trail.region || undefined}
                    elevation={trail.elevation}
                    difficulty={trail.difficulty}
                    estimatedDuration={trail.estimated_duration || undefined}
                    storyCount={storyCounts[trail.id] || 0}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-12 text-center"
            >
              <Compass className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Jalur tidak ditemukan
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Tidak ada jalur yang cocok dengan pencarianmu. Coba ubah filter
                atau kata kunci pencarian.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all duration-300"
              >
                <X className="h-4 w-4" />
                Hapus Semua Filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
