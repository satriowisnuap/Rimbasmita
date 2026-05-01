"use client";

import { motion } from "framer-motion";

export function RegisterHero() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" as const }}
        className="text-xl sm:text-2xl font-bold text-foreground mb-3"
      >
        <span className="text-gradient">Buat Ceritamu Abadi</span>
      </motion.h1>

      <p className="text-sm text-muted-foreground mb-6">
        Mulai perjalananmu dan bagikan cerita pendakianmu
      </p>
    </>
  );
}
