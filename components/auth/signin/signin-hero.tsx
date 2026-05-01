"use client";

import { motion } from "framer-motion";

export function SignInHero() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" as const }}
        className="text-xl sm:text-2xl font-bold text-foreground mb-3"
      >
        <span className="text-gradient">Setiap langkah punya cerita</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" as const }}
        className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs mx-auto"
      >
        Bergabung dengan komunitas pendaki yang berbagi cerita bermakna. Setiap
        perjalanan di alam layak untuk dikenang dan diceritakan.
      </motion.p>
    </>
  );
}
