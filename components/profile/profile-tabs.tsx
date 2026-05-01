"use client";

import { motion } from "framer-motion";
import { BookOpen, Bookmark } from "lucide-react";
import type { ProfileTab } from "@/hooks/use-profile";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
}

export function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex items-center gap-1 p-1 glass rounded-xl mb-8 w-fit"
    >
      <button
        onClick={() => setActiveTab("cerita")}
        className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          activeTab === "cerita"
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {activeTab === "cerita" && (
          <motion.div
            layoutId="profileTab"
            className="absolute inset-0 bg-primary rounded-lg"
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          Cerita
        </span>
      </button>

      <button
        onClick={() => setActiveTab("disimpan")}
        className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          activeTab === "disimpan"
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {activeTab === "disimpan" && (
          <motion.div
            layoutId="profileTab"
            className="absolute inset-0 bg-primary rounded-lg"
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <Bookmark className="h-3.5 w-3.5" />
          Disimpan
        </span>
      </button>
    </motion.div>
  );
}
