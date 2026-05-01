"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Lock,
  CreditCard as Edit,
  Trash2,
  Clock,
} from "lucide-react";
import {
  JournalStory,
  moodColors,
  moodLabels,
  itemVariants,
  formatDate,
} from "@/constans/journal-config";

interface Props {
  story: JournalStory;
  deletingId: string | null;
  onDeleteClick: (id: string) => void;
}

export function JournalStoryCard({ story, deletingId, onDeleteClick }: Props) {
  return (
    <motion.div variants={itemVariants}>
      <div className="glass rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 group">
        {/* Top row: badges + date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {story.mood && (
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${moodColors[story.mood] || ""}`}
              >
                {moodLabels[story.mood] || story.mood}
              </span>
            )}
            {story.is_draft && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-muted text-muted-foreground border-border">
                Draf
              </span>
            )}
            {story.is_private && !story.is_draft && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border bg-muted text-muted-foreground border-border">
                <Lock className="h-3 w-3" />
                Pribadi
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(story.created_at)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
          {story.title}
        </h3>

        {/* Excerpt */}
        {story.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {story.excerpt}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <Link
            href={
              story.is_draft
                ? `/create?edit=${story.id}`
                : `/story/${story.slug}`
            }
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {story.is_draft ? (
              <>
                <Edit className="h-3.5 w-3.5" />
                Lanjutkan Menulis
              </>
            ) : (
              <>
                <BookOpen className="h-3.5 w-3.5" />
                Baca
              </>
            )}
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href={`/create?edit=${story.id}`}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Link>

            <button
              onClick={() => onDeleteClick(story.id)}
              disabled={deletingId === story.id}
              className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 disabled:opacity-50"
              title="Hapus"
            >
              {deletingId === story.id ? (
                <div className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
