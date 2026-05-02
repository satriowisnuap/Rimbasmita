"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import {
  TreePine,
  Mountain,
  CloudFog,
  Sunrise,
  ArrowRight,
  Compass,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/hero-background.jpg"
          alt="Mountain landscape"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      <div className="absolute top-1/4 left-[10%] animate-float opacity-20">
        <TreePine className="h-16 w-16 text-primary" />
      </div>

      <div
        className="absolute top-1/3 right-[15%] animate-float opacity-15"
        style={{ animationDelay: "2s" }}
      >
        <Mountain className="h-20 w-20 text-primary" />
      </div>

      <div
        className="absolute bottom-1/3 left-[20%] animate-float opacity-10"
        style={{ animationDelay: "4s" }}
      >
        <CloudFog className="h-14 w-14 text-primary" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Sunrise className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Ruang Cerita Pendaki Indonesia
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" as const }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="text-foreground">Setiap langkah</span>
          <br />
          <span className="text-gradient">punya cerita</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" as const }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Rimbasmita adalah tempat berbagi pengalaman mendaki yang bermakna.
          Bukan sekadar dokumentasi, tapi narasi yang menginspirasi dan
          merefleksikan pertumbuhanmu di alam.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" as const }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {session ? (
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2"
            >
              Buka Feed
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              onClick={() => {
                if (!session) {
                  router.push("/auth/signin"); // 🔥 arahkan ke halaman login dulu
                } else {
                  router.push("/dashboard"); // atau halaman setelah login
                }
              }}
              className="px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2"
            >
              Mulai Cerita
            </button>
          )}

          <Link
            href="/explore"
            className="px-8 py-3.5 rounded-2xl glass font-semibold text-base text-foreground hover:bg-accent/50 transition-all duration-300 flex items-center gap-2"
          >
            Jelajahi Cerita
            <Compass className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-foreground/20 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-foreground/40"
          />
        </div>
      </motion.div>
    </section>
  );
}
