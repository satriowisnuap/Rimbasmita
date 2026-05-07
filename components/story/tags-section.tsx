"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus, Tag, X } from "lucide-react";

interface Props {
  tags: string[];
  tagInput: string;
  setTagInput: (v: string) => void;
  handleAddTag: () => void;
  handleTagKeyDown: (e: React.KeyboardEvent) => void;
  removeTag: (tag: string) => void;
}

export function TagsSection({
  tags,
  tagInput,
  setTagInput,
  handleAddTag,
  handleTagKeyDown,
  removeTag,
}: Props) {
  return (
    <section className="glass rounded-2xl p-6">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
        <Tag className="h-4 w-4 text-primary" />
        Tag
      </label>

      <div className="flex flex-wrap gap-2 mb-3">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium"
            >
              {tag}

              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Tambahkan tag lalu tekan Enter..."
          className="flex-1 bg-card/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          maxLength={30}
        />

        <button
          type="button"
          onClick={handleAddTag}
          disabled={
            !tagInput.trim() ||
            tags.includes(tagInput.trim().toLowerCase()) ||
            tags.length >= 10
          }
          className="px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Maksimal 10 tag. Tekan Enter atau koma untuk menambahkan.
      </p>
    </section>
  );
}
