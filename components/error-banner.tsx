"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, TriangleAlert as AlertTriangle } from "lucide-react";

interface ErrorBannerProps {
  error: string;
  onClose: () => void;
}

export function ErrorBanner({ error, onClose }: ErrorBannerProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className="mb-6 rounded-2xl bg-destructive/10 border border-destructive/20 px-5 py-4 flex items-start gap-3"
        >
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive leading-relaxed">{error}</p>
          <button onClick={onClose} className="ml-auto shrink-0">
            <X className="h-4 w-4 text-destructive/60 hover:text-destructive transition-colors" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
