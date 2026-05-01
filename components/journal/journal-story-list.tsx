"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  JournalStory,
  TabKey,
  containerVariants,
} from "@/constans/journal-config";
import { JournalStoryCard } from "./journal-story-card";
import { JournalEmptyState } from "./journal-empty-state";

interface Props {
  loading: boolean;
  activeTab: TabKey;
  stories: JournalStory[];
  deletingId: string | null;
  onDeleteClick: (id: string) => void;
}

export function JournalStoryList({
  loading,
  activeTab,
  stories,
  deletingId,
  onDeleteClick,
}: Props) {
  return (
    <section className="pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-5 w-20 bg-muted rounded-full" />
                    <div className="h-4 w-24 bg-muted rounded" />
                  </div>
                  <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                  <div className="h-4 w-full bg-muted rounded mb-1" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
              ))}
            </motion.div>
          ) : stories.length > 0 ? (
            <motion.div
              key={`stories-${activeTab}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {stories.map((story) => (
                <JournalStoryCard
                  key={story.id}
                  story={story}
                  deletingId={deletingId}
                  onDeleteClick={onDeleteClick}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`empty-${activeTab}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <JournalEmptyState activeTab={activeTab} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
