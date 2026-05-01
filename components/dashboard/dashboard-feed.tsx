"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, Mountain, Clock, Heart, Flame } from "lucide-react";
import { StoryCard, StoryCardSkeleton } from "@/components/story-card";

type SortTab = "terbaru" | "populer" | "trending";

interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  difficulty: string | null;
  duration: string | null;
  mood: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles:
    | {
        name: string;
        username: string;
        image: string | null;
      }[]
    | null;
  trails:
    | {
        name: string;
        location: string;
      }[]
    | null;
  story_images: {
    image_url: string;
    display_order: number;
  }[];
}

const sortTabs: { key: SortTab; label: string; icon: React.ElementType }[] = [
  { key: "terbaru", label: "Terbaru", icon: Clock },
  { key: "populer", label: "Populer", icon: Heart },
  { key: "trending", label: "Trending", icon: Flame },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

interface DashboardFeedProps {
  stories: Story[];
  loading: boolean;
  activeTab: SortTab;
  setActiveTab: (tab: SortTab) => void;
}

export function DashboardFeed({
  stories,
  loading,
  activeTab,
  setActiveTab,
}: DashboardFeedProps) {
  return (
    <div className="flex-1 order-1 lg:order-2">
      {/* Header and tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
          Feed Cerita
        </h1>
        <p className="text-sm text-muted-foreground">
          Cerita terbaru dari komunitas pendaki Rimbasmita
        </p>
      </motion.div>

      {/* Sort tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-1 p-1 glass rounded-xl mb-8 w-fit"
      >
        {sortTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Stories grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <StoryCardSkeleton key={i} />
            ))}
          </motion.div>
        ) : stories.length > 0 ? (
          <motion.div
            key={`stories-${activeTab}`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {stories.map((story) => {
              const coverImage = story.story_images?.sort(
                (a, b) => a.display_order - b.display_order,
              )[0]?.image_url;

              return (
                <motion.div key={story.id} variants={itemVariants}>
                  <StoryCard
                    id={story.id}
                    slug={story.slug}
                    title={story.title}
                    excerpt={story.excerpt || ""}
                    coverImage={coverImage}
                    author={{
                      name: story.profiles?.[0]?.name || "Anonim",
                      username: story.profiles?.[0]?.username || "",
                      image: story.profiles?.[0]?.image || undefined,
                    }}
                    trail={
                      story.trails?.[0]
                        ? {
                            name: story.trails[0].name,
                            location: story.trails[0].location,
                          }
                        : undefined
                    }
                    difficulty={story.difficulty || undefined}
                    duration={story.duration || undefined}
                    mood={story.mood || undefined}
                    likesCount={story.likes_count}
                    commentsCount={story.comments_count}
                    createdAt={story.created_at}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <Mountain className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Belum ada cerita
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Belum ada cerita yang ditemukan. Jadilah yang pertama berbagi
              pengalaman mendakimu!
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all duration-300"
            >
              <PenLine className="h-4 w-4" />
              Tulis Cerita Pertama
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
