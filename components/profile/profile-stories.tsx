"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Bookmark, Mountain } from "lucide-react";
import { StoryCard, StoryCardSkeleton } from "@/components/story-card";
import type { Story, ProfileTab } from "@/hooks/profile/use-profile";

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

interface ProfileStoriesProps {
  activeTab: ProfileTab;
  currentStories: Story[];
  storiesLoading: boolean;
  isOwnProfile: boolean;
  profileName: string;
  getCoverImage: (story: Story) => string | undefined;
}

export function ProfileStories({
  activeTab,
  currentStories,
  storiesLoading,
  isOwnProfile,
  profileName,
  getCoverImage,
}: ProfileStoriesProps) {
  const renderStoryCard = (story: Story) => (
    <motion.div key={story.id} variants={itemVariants}>
      <StoryCard
        id={story.id}
        slug={story.slug}
        title={story.title}
        excerpt={story.excerpt || ""}
        coverImage={getCoverImage(story)}
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

  return (
    <AnimatePresence mode="wait">
      {storiesLoading ? (
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
      ) : currentStories.length > 0 ? (
        <motion.div
          key={`stories-${activeTab}`}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {currentStories.map((story) => renderStoryCard(story))}
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-12 text-center"
        >
          {activeTab === "cerita" ? (
            <>
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Belum ada cerita
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {isOwnProfile
                  ? "Kamu belum menulis cerita. Bagikan pengalaman mendakimu!"
                  : `${profileName} belum menerbitkan cerita.`}
              </p>
            </>
          ) : (
            <>
              <Bookmark className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Belum ada cerita disimpan
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {isOwnProfile
                  ? "Kamu belum menyimpan cerita apapun."
                  : `${profileName} belum menyimpan cerita apapun.`}
              </p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
