"use client";

import { motion } from "framer-motion";
import { Mountain, CloudFog, TreePine } from "lucide-react";

export function SignInBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Gradient sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/10" />

      {/* Cloud top-left */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.08, y: 0 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-[15%] left-[8%]"
      >
        <CloudFog className="h-20 w-20 text-primary" />
      </motion.div>

      {/* Cloud top-right */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.06, y: 0 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute top-[25%] right-[12%]"
      >
        <CloudFog className="h-16 w-16 text-primary" />
      </motion.div>

      {/* Tree bottom-left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute bottom-[20%] left-[5%]"
      >
        <TreePine className="h-24 w-24 text-primary" />
      </motion.div>

      {/* Tree bottom-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute bottom-[25%] right-[8%]"
      >
        <TreePine className="h-20 w-20 text-primary" />
      </motion.div>

      {/* Mountain silhouette bottom */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 0.06, y: 0 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0"
      >
        <Mountain className="h-48 w-full text-primary" />
      </motion.div>

      {/* Floating mountain left */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
        className="absolute top-[35%] left-[20%] opacity-[0.04]"
      >
        <Mountain className="h-32 w-32 text-primary" />
      </motion.div>

      {/* Floating mountain right */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: 1,
        }}
        className="absolute top-[40%] right-[25%] opacity-[0.03]"
      >
        <Mountain className="h-24 w-24 text-primary" />
      </motion.div>
    </div>
  );
}
