"use client";

import { motion } from "framer-motion";
import { Mountain } from "lucide-react";

export function SignInLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
      className="flex items-center justify-center gap-3 mb-6"
    >
      <Mountain className="h-10 w-10 text-primary" />
      <span className="text-2xl font-bold tracking-tight text-foreground">
        Rimbasmita
      </span>
    </motion.div>
  );
}
