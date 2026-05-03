"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Heart,
  MessageCircle,
  MapPin,
  Clock,
  ChevronDown,
  X,
  Quote,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface StoryCard {
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

const difficultyColor: Record<string, string> = {
  easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  moderate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  hard: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  extreme: "bg-red-500/20 text-red-400 border-red-500/30",
};

const moodEmoji: Record<string, string> = {
  peaceful: "🌿",
  adventurous: "⚡",
  reflective: "🌙",
  exhilarated: "🔥",
  grateful: "🙏",
  challenged: "💪",
};

function formatTime(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), {
      addSuffix: true,
      locale: idLocale,
    });
  } catch {
    return "";
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

function StoryCardItem({ story }: { story: StoryCard }) {
  const router = useRouter();
  const coverImage = story.story_images?.[0]?.image_url;
  const authorInitial = story.profiles?.name?.[0]?.toUpperCase() ?? "A";

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onClick={() => router.push(`/story/${story.slug}`)}
      className="cursor-pointer group"
    >
      <div className="glass rounded-2xl overflow-hidden h-full flex flex-col hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 border border-border/30 hover:border-primary/20">
        {/* Cover */}
        <div className="relative h-48 flex-shrink-0 overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/15 via-primary/8 to-transparent flex items-center justify-center">
              <Quote className="h-12 w-12 text-primary/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {story.difficulty && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-sm ${difficultyColor[story.difficulty] ?? "bg-muted/80 text-muted-foreground border-border/50"}`}
              >
                {story.difficulty.charAt(0).toUpperCase() +
                  story.difficulty.slice(1)}
              </span>
            )}
            {story.mood && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/40 text-white border border-white/20 backdrop-blur-sm">
                {moodEmoji[story.mood] ?? ""}{" "}
                {story.mood.charAt(0).toUpperCase() + story.mood.slice(1)}
              </span>
            )}
          </div>

          {/* Trail info */}
          {story.trails && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/80 text-[11px]">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate max-w-[180px] font-medium">
                {story.trails.name}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Title */}
          <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {story.title}
          </h3>

          {/* Excerpt */}
          {story.excerpt && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
              {story.excerpt}
            </p>
          )}

          {/* Tags */}
          {story.story_tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {story.story_tags.map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
                >
                  #{t.tag}
                </span>
              ))}
            </div>
          )}

          {/* Duration */}
          {story.duration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {story.duration}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/30 mt-auto">
            {/* Author */}
            <div className="flex items-center gap-2 min-w-0">
              {story.profiles?.image ? (
                <img
                  src={story.profiles.image}
                  alt={story.profiles.name}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-primary/20 flex-shrink-0"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary">
                    {authorInitial}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {story.profiles?.name ?? "Anonim"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {formatTime(story.created_at)}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-muted-foreground flex-shrink-0">
              <span className="flex items-center gap-1 text-xs">
                <Heart className="h-3.5 w-3.5" />
                {story.likes_count ?? 0}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <MessageCircle className="h-3.5 w-3.5" />
                {story.comments_count ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface StoriesGridProps {
  stories: StoryCard[];
  loading: boolean;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

export function StoriesGrid({
  stories,
  loading,
  hasActiveFilters,
  clearFilters,
}: StoriesGridProps) {
  const [visibleCount, setVisibleCount] = useState(12);
  const visibleStories = stories.slice(0, visibleCount);
  const hasMore = visibleCount < stories.length;

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
              "Memuat cerita..."
            ) : (
              <>
                Menampilkan{" "}
                <span className="font-semibold text-foreground">
                  {Math.min(visibleCount, stories.length)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-foreground">
                  {stories.length}
                </span>{" "}
                cerita
                {hasActiveFilters && " (dengan filter aktif)"}
              </>
            )}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-accent/30 px-3 py-1.5 rounded-full border border-border/50">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span>cerita publik</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="glass rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-3/4 bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                    <div className="pt-3 border-t border-border/50 flex justify-between">
                      <div className="h-7 w-24 bg-muted rounded-full" />
                      <div className="h-4 w-16 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : stories.length > 0 ? (
            <div className="space-y-10">
              <motion.div
                key="stories"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {visibleStories.map((story) => (
                  <StoryCardItem key={story.id} story={story} />
                ))}
              </motion.div>

              {hasMore && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={() => setVisibleCount((p) => p + 12)}
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
                <BookOpen className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Cerita tidak ditemukan
              </h3>
              <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
                Tidak ada cerita yang cocok dengan pencarianmu. Coba kata kunci
                lain atau hapus filter aktif.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
                >
                  <X className="h-4 w-4" />
                  Hapus Semua Filter
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
