"use client";

import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Save,
  SendHorizontal as SendHorizonal,
  Loader as Loader2,
} from "lucide-react";

interface Props {
  isPrivate: boolean;
  setIsPrivate: (v: boolean) => void;
  isSubmitting: boolean;
  isDraft: boolean;
  title: string;
  content: string;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function PrivacyActionsSection({
  isPrivate,
  setIsPrivate,
  isSubmitting,
  isDraft,
  title,
  content,
  onSaveDraft,
  onPublish,
}: Props) {
  const disabled = isSubmitting || !title.trim() || !content.trim();

  return (
    <section className="glass rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Privacy Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
              isPrivate ? "bg-primary" : "bg-muted"
            }`}
          >
            <motion.div
              className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center"
              animate={{
                left: isPrivate ? "auto" : 2,
                right: isPrivate ? 2 : "auto",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {isPrivate ? (
                <EyeOff className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </motion.div>
          </button>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isPrivate ? "Private" : "Public"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isPrivate
                ? "Only you can see this story"
                : "Visible to the community"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={disabled}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl glass text-sm font-medium text-foreground hover:bg-accent/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex-1 sm:flex-none"
          >
            {isSubmitting && isDraft ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Draft
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={disabled}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex-1 sm:flex-none"
          >
            {isSubmitting && !isDraft ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
            Publish
          </button>
        </div>
      </div>
    </section>
  );
}
