"use client";

import { moodOptions } from "@/constans/options-story";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Props {
  mood: string;
  setMood: (v: string) => void;
}

export function MoodSection({ mood, setMood }: Props) {
  return (
    <section className="glass rounded-2xl p-6">
      <label className="block text-sm font-medium text-foreground mb-4">
        Bagaimana perasaanmu selama perjalanan ini?
      </label>

      {/* Tailwind safelist */}
      <div className="hidden bg-emerald-500/20 bg-orange-500/20 bg-blue-500/20 border-blue-500 ring-blue-500"></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {moodOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = mood === opt.value;

          const dotColor = opt.color.replace("text-", "bg-");

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMood(isActive ? "" : opt.value)}
              className={`relative flex flex-col items-center text-center gap-3 p-6 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? `${opt.activeBg} ring-2 ring-offset-2 ring-offset-background ${opt.color.replace(
                      "text-",
                      "ring-",
                    )}`
                  : "bg-card/50 border-border hover:border-foreground/20 hover:scale-[1.02]"
              }`}
            >
              <div
                className={`p-3 rounded-xl ${
                  isActive ? "bg-background/50" : "bg-muted/50"
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${
                    isActive ? opt.color : "text-muted-foreground"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <span
                  className={`block text-sm font-bold ${
                    isActive ? opt.color : "text-foreground"
                  }`}
                >
                  {opt.label}
                </span>

                <p
                  className={`text-xs leading-tight ${
                    isActive ? "text-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {opt.description}
                </p>
              </div>

              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute -top-2 -right-2 w-7 h-7 rounded-full border-2 border-background flex items-center justify-center shadow-lg ${
                    mood === "calm"
                      ? "bg-emerald-500"
                      : mood === "challenging"
                        ? "bg-orange-500"
                        : "bg-sky-500"
                  }`}
                >
                  <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
