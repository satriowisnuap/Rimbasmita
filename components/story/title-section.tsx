"use client";

import { motion } from "framer-motion";
import { generateSlug } from "@/lib/utils";

interface TitleSectionProps {
  title: string;
  setTitle: (v: string) => void;
}

export function TitleSection({ title, setTitle }: TitleSectionProps) {
  return (
    <section className="glass rounded-2xl p-6">
      <label className="block text-sm font-medium text-foreground mb-2">
        Story Title
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Finding Peace on Rinjani's Summit"
        className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-lg font-semibold"
        maxLength={200}
      />
      {title && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground mt-2"
        >
          Slug preview:{" "}
          <span className="text-foreground/70 font-mono">
            {generateSlug(title)}
          </span>
        </motion.p>
      )}
    </section>
  );
}
