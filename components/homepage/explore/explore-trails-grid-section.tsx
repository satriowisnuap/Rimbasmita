import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, BookOpen, X, ChevronDown } from "lucide-react";
import { TrailCard } from "@/components/trail-card";

interface Trail {
  id: string;
  name: string;
  location: string;
  region: string | null;
  elevation: number;
  difficulty: string;
  estimated_duration: string | null;
  image?: string | null;
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
  avgRatings: Record<string, number>;
  loading: boolean;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

export function ExploreTrailsGrid({
  trails,
  storyCounts,
  avgRatings,
  loading,
  hasActiveFilters,
  clearFilters,
}: ExploreTrailsGridProps) {
  const [visibleCount, setVisibleCount] = useState(9);
  const visibleTrails = trails.slice(0, visibleCount);
  const hasMore = visibleCount < trails.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  return (
    <section className="pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Results info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-between mb-8"
        >
          <p className="text-sm text-muted-foreground">
            {loading ? (
              "Memuat jalur..."
            ) : (
              <>
                Menampilkan{" "}
                <span className="font-semibold text-foreground">
                  {Math.min(visibleCount, trails.length)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-foreground">
                  {trails.length}
                </span>{" "}
                jalur
                {hasActiveFilters && " (dengan filter aktif)"}
              </>
            )}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-accent/30 px-3 py-1.5 rounded-full border border-border/50">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-40 bg-muted" />
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between">
                      <div className="h-4 w-16 bg-muted rounded-full" />
                      <div className="h-4 w-12 bg-muted rounded-full" />
                    </div>
                    <div className="h-6 w-3/4 bg-muted rounded" />
                    <div className="pt-4 border-t border-border/50 flex gap-4">
                      <div className="h-4 w-20 bg-muted rounded" />
                      <div className="h-4 w-16 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : trails.length > 0 ? (
            <div className="space-y-12">
              <motion.div
                key="trails"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {visibleTrails.map((trail) => (
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
                      avgRating={avgRatings[trail.id] || 0}
                      image={trail.image || undefined}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {hasMore && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={handleShowMore}
                    className="group flex items-center gap-2 px-8 py-3 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 hover:shadow-lg transition-all duration-300"
                  >
                    Lihat Lebih Banyak
                    <ChevronDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-16 text-center border-dashed border-2"
            >
              <div className="h-20 w-20 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
                <Compass className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Jalur tidak ditemukan
              </h3>
              <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
                Tidak ada jalur yang cocok dengan kriteria pencarianmu. Cobalah kata kunci lain atau hapus filter aktif.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
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
