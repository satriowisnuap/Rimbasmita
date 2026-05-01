"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mountain, CloudFog, TreePine } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Registrasi berhasil! Silakan login.");
      router.push("/auth/signin");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.08, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-[15%] left-[8%]"
        >
          <CloudFog className="h-20 w-20 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.06, y: 0 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute top-[25%] right-[12%]"
        >
          <CloudFog className="h-16 w-16 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-[20%] left-[5%]"
        >
          <TreePine className="h-24 w-24 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.07 }}
          transition={{ duration: 2, delay: 0.8 }}
          className="absolute bottom-[25%] right-[8%]"
        >
          <TreePine className="h-20 w-20 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.06, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2 }}
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
          transition={{ duration: 0.8 }}
          className="glass-strong rounded-3xl p-8 sm:p-10 text-center"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Mountain className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">Rimbasmita</span>
          </div>

          {/* Title */}
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

          {/* Form */}
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass bg-transparent text-sm outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass bg-transparent text-sm outline-none"
            />

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">atau</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl glass font-medium text-sm"
          >
            <span>Daftar dengan Google</span>
          </button>

          {/* Login link */}
          <p className="text-xs text-muted-foreground mt-4">
            Sudah punya akun?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Masuk
            </Link>
          </p>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-muted-foreground/40 flex items-center justify-center gap-1.5">
            <Mountain className="h-3 w-3" />
            Dibuat untuk pecinta alam Indonesia
          </p>
        </motion.div>
      </div>
    </div>
  );
}
