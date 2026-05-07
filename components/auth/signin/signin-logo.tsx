"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mountain } from "lucide-react";
import Link from "next/link";

export function SignInLogo() {
  return (
    <>
      {/* Back to home */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kembali ke Rimbasmita
      </Link>

      {/* Logo */}
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
    </>
  );
}
