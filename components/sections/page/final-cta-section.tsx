"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { Mountain, PenLine, ArrowRight } from "lucide-react";

export default function FinalCTASection() {
  const { data: session } = useSession();

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <Mountain className="h-12 w-12 text-primary mx-auto mb-6" />

            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Mulai perjalananmu hari ini
            </h2>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Setiap gunung menanti ceritamu. Setiap langkah layak untuk
              dikenang dan dibagikan.
            </p>

            {session ? (
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                Tulis Cerita Pertamamu
                <PenLine className="h-4 w-4" />
              </Link>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                Bergabung Sekarang
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
