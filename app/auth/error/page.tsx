"use client";

import { motion } from "framer-motion";
import { Mountain, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "OAuthAccountNotLinked":
        return "Akun ini sudah terdaftar dengan metode lain.";
      case "AccessDenied":
        return "Akses ditolak.";
      case "Configuration":
        return "Terjadi kesalahan konfigurasi server.";
      case "Verification":
        return "Link verifikasi tidak valid atau sudah kadaluarsa.";
      default:
        return "Terjadi kesalahan saat proses login.";
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.08, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute bottom-0 left-0 right-0"
        >
          <Mountain className="h-48 w-full text-primary" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-8 text-center"
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-foreground mb-2">
            Oops, terjadi kesalahan
          </h1>

          {/* Message */}
          <p className="text-sm text-muted-foreground mb-6">
            {getErrorMessage(error)}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
            >
              Coba lagi
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass text-sm font-medium text-foreground hover:bg-accent/50 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke beranda
            </Link>
          </div>

          {/* Footer */}
          <p className="text-xs text-muted-foreground/50 mt-6">
            Jika masalah terus terjadi, coba gunakan metode login lain.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
