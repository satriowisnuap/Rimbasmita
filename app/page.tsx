"use client";

import HeroSection from "@/components/sections/hero-section";
import FeaturesSection from "@/components/sections/features-section";
import TrailsSection from "@/components/sections/trails-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Mountain,
  BookOpen,
  Compass,
  Heart,
  PenLine,
  Users,
  ArrowRight,
  Quote,
  TreePine,
  Sunrise,
  CloudFog,
  MapPin,
  ArrowUp,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const testimonials = [
  {
    quote:
      "Rimbasmita membantu saya melihat mendaki bukan hanya sebagai aktivitas fisik, tapi sebagai perjalanan spiritual.",
    name: "Ayu Rahmawati",
    role: "Pendaki Gunung Rinjani",
  },
  {
    quote:
      "Saya akhirnya punya tempat untuk menulis cerita-cerita panjatanku. Bukan di media sosial yang bising, tapi di sini yang tenang.",
    name: "Budi Santoso",
    role: "Pendaki Gunung Semeru",
  },
  {
    quote:
      "Setiap cerita yang saya baca di sini terasa autentik dan penuh makna. Berbeda sekali dengan konten pendakian biasa.",
    name: "Dewi Lestari",
    role: "Penulis & Traveler",
  },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Section */}
      <FeaturesSection fadeInUp={fadeInUp} stagger={stagger} />

      {/* Trails Section */}
      <TrailsSection fadeInUp={fadeInUp} stagger={stagger} />

      {/* Testimonials Section */}
      <TestimonialsSection fadeInUp={fadeInUp} stagger={stagger} />

      {/* Final CTA Section */}
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

      <Footer />
    </div>
  );
}
