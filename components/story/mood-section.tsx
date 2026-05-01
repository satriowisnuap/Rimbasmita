"use client";

import { motion } from "framer-motion";
import { moodOptions } from "@/constans/options-story";

interface Props {
  mood: string;
  setMood: (v: string) => void;
}

export function MoodSection({ mood, setMood }: Props) {
  return (
    <section className="glass rounded-2xl p-6">
      <label className="block text-sm font-medium text-foreground mb-4">
        How did this journey feel?
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {moodOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = mood === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMood(isActive ? "" : opt.value)}
              className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all duration-300 ${
                isActive ? opt.activeBg : `${opt.bg} hover:scale-[1.02]`
              }`}
            >
              <Icon className={`h-6 w-6 ${opt.color}`} />
              <span
                className={`text-sm font-semibold ${isActive ? opt.color : "text-foreground"}`}
              >
                {opt.label}
              </span>
              <span
                className={`text-xs ${isActive ? opt.color : "text-muted-foreground"}`}
              >
                {opt.description}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mood-indicator"
                  className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-current"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
