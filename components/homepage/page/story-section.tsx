"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Heart,
  MapPin,
  MessageCircle,
  Quote,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  easy: "bg-emerald-500/20 text-emerald-400",
  moderate: "bg-amber-500/20 text-amber-400",
  hard: "bg-orange-500/20 text-orange-400",
  extreme: "bg-red-500/20 text-red-400",
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function StoryCardSkeleton() {
  return (
    <div className="min-w-[300px] max-w-[300px]">
      <div className="glass rounded-2xl overflow-hidden h-[340px] flex flex-col">
        {/* Cover image placeholder */}
        <div className="relative h-[130px] flex-shrink-0 overflow-hidden bg-muted/20">
          <div className="skeleton absolute inset-0" />

          {/* Difficulty badge placeholder */}
          <div className="absolute top-3 right-3">
            <div className="skeleton h-4 w-14 rounded-full" />
          </div>

          {/* Trail name placeholder */}
          <div className="absolute bottom-2 left-3 flex items-center gap-1">
            <div className="skeleton h-3 w-3 rounded-full" />
            <div className="skeleton h-3 w-24 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col flex-1 p-4 gap-2">
          {/* Title */}
          <div className="space-y-1.5">
            <div className="skeleton h-3.5 w-full rounded-md" />
            <div className="skeleton h-3.5 w-4/5 rounded-md" />
          </div>

          {/* Excerpt */}
          <div className="space-y-1 mt-1">
            <div className="skeleton h-2.5 w-full rounded-md" />
            <div className="skeleton h-2.5 w-3/4 rounded-md" />
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 mt-1">
            <div className="skeleton h-4 w-12 rounded-full" />
            <div className="skeleton h-4 w-16 rounded-full" />
            <div className="skeleton h-4 w-10 rounded-full" />
          </div>

          {/* Author + stats */}
          <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-1.5">
              <div className="skeleton h-6 w-6 rounded-full flex-shrink-0" />
              <div className="skeleton h-2.5 w-20 rounded-md" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="skeleton h-3 w-8 rounded-md" />
              <div className="skeleton h-3 w-8 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Story Card ───────────────────────────────────────────────────────────────
function StoryCardItem({ story }: { story: StoryCard }) {
  const router = useRouter();
  const coverImage = story.story_images?.[0]?.image_url;
  const authorInitial = story.profiles?.name?.[0]?.toUpperCase() ?? "A";

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => router.push(`/story/${story.slug}`)}
      className="cursor-pointer min-w-[300px] max-w-[300px]"
    >
      <div className="glass rounded-2xl overflow-hidden h-[340px] flex flex-col group hover:shadow-xl hover:shadow-primary/10 transition-shadow duration-500">
        <div className="relative h-[130px] flex-shrink-0 overflow-hidden">
          {coverImage ? (
            <img
              src={coverImage}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
              <Quote className="h-10 w-10 text-primary/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {story.difficulty && (
            <span
              className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm ${difficultyColor[story.difficulty] ?? "bg-muted/80 text-muted-foreground"}`}
            >
              {story.difficulty.charAt(0).toUpperCase() +
                story.difficulty.slice(1)}
            </span>
          )}

          {story.trails && (
            <div className="absolute bottom-2 left-3 flex items-center gap-1 text-white/80 text-[10px]">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[160px]">
                {story.trails.name}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-4 gap-2">
          <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {story.title}
          </h3>

          {story.excerpt && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {story.excerpt}
            </p>
          )}

          {(story.story_tags ?? []).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {(story.story_tags ?? []).map((t, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-medium"
                >
                  #{t.tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-1.5 min-w-0">
              {story.profiles?.image ? (
                <img
                  src={story.profiles.image}
                  alt={story.profiles.name}
                  className="h-6 w-6 rounded-full object-cover ring-1 ring-primary/20 flex-shrink-0"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-bold text-primary">
                    {authorInitial}
                  </span>
                </div>
              )}
              <span className="text-[10px] text-muted-foreground truncate">
                {story.profiles?.name ?? "Anonim"}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-muted-foreground flex-shrink-0">
              <span className="flex items-center gap-0.5 text-[10px]">
                <Heart className="h-3 w-3" />
                {story.likes_count ?? 0}
              </span>
              <span className="flex items-center gap-0.5 text-[10px]">
                <MessageCircle className="h-3 w-3" />
                {story.comments_count ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function StorySection({
  fadeInUp,
  stagger,
  stories,
  loading,
}: {
  fadeInUp: any;
  stagger: any;
  stories: StoryCard[];
  loading: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const safeStories = Array.isArray(stories) ? stories : [];
  const loopData =
    safeStories.length > 0
      ? [...safeStories, ...safeStories, ...safeStories]
      : [];

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Cerita dari Komunitas
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
          >
            Kisah nyata para pendaki
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground text-base max-w-xl mx-auto"
          >
            Baca cerita inspiratif dari sesama petualang. Setiap jalur menyimpan
            sebuah kisah yang layak dibagikan.
          </motion.p>
        </motion.div>

        {/* ── Loading skeleton ── */}
        {loading ? (
          <div className="relative overflow-hidden py-4">
            <div className="flex gap-6 w-max">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-1">
                  <StoryCardSkeleton />
                </div>
              ))}
            </div>
            {/* fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-28 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-background to-transparent z-10" />
          </div>
        ) : safeStories.length === 0 ? (
          /* ── Empty state ── */
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada cerita yang dipublikasikan.</p>
          </div>
        ) : (
          /* ── Marquee scroll ── */
          <div
            className="relative overflow-hidden py-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="flex gap-6 w-max"
              style={{
                animation: "storyScrollX 40s linear infinite",
                animationPlayState: isHovered ? "paused" : "running",
              }}
            >
              {loopData.map((story, i) => (
                <div key={`${story.id}-${i}`} className="px-1">
                  <StoryCardItem story={story} />
                </div>
              ))}
            </div>

            <div className="pointer-events-none absolute left-0 top-0 h-full w-28 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-background to-transparent z-10" />
          </div>
        )}

        {!loading && safeStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/stories")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-sm font-semibold text-foreground hover:text-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border border-border/40"
            >
              Lihat semua cerita
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        /* ── Marquee animation ── */
        @keyframes storyScrollX {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        /* ── Skeleton shimmer ── */
        @keyframes skeletonShimmer {
          0% {
            background-position: -400px 0;
          }
          100% {
            background-position: 400px 0;
          }
        }

        .skeleton {
          border-radius: 4px;
          background: linear-gradient(
            90deg,
            hsl(var(--muted) / 0.3) 25%,
            hsl(var(--muted) / 0.6) 50%,
            hsl(var(--muted) / 0.3) 75%
          );
          background-size: 800px 100%;
          animation: skeletonShimmer 1.6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
