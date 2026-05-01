"use client";

import { motion } from "framer-motion";
import { BookOpen, TreePine, CloudFog } from "lucide-react";
import { TabKey, tabOptions } from "@/constans/journal-config";

interface Props {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  privateCount: number;
  draftCount: number;
}

export function JournalHeroSection({
  activeTab,
  setActiveTab,
  privateCount,
  draftCount,
}: Props) {
  const counts: Record<TabKey, number> = {
    private: privateCount,
    draft: draftCount,
  };

  return (
    <section className="relative pt-24 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="absolute top-28 left-[10%] animate-float opacity-12">
        <TreePine className="h-12 w-12 text-primary" />
      </div>
      <div
        className="absolute top-32 right-[8%] animate-float opacity-8"
        style={{ animationDelay: "4s" }}
      >
        <CloudFog className="h-10 w-10 text-primary" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Ruang Pribadi
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Jurnal <span className="text-gradient">Pribadimu</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Ruang tenang untuk merefleksikan perjalananmu. Cerita pribadi dan
            draf yang hanya bisa kamu lihat.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center justify-center gap-1 p-1 glass rounded-xl w-fit mx-auto"
        >
          {tabOptions.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = counts[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="journalTab"
                    className="absolute inset-0 bg-primary rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
