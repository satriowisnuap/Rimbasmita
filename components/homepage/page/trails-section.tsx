"use client";

import { Compass, MapPin, ArrowUp, ArrowRight, Star, BookOpen } from "lucide-react";
import { useTopTrails } from "@/hooks/use-trails";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function TrailsSection({ fadeInUp, stagger }: any) {
  const { trails, loading } = useTopTrails();

  // ✅ state untuk semua image
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  if (loading) return null;

  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <Compass className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Jalur Populer
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
          >
            Mulai dari jalur yang sudah dikenal
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Temukan cerita nyata dari pendaki yang sudah menjelajahi jalur-jalur
            ikonik Indonesia.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trails.map((trail, i) => {
            const isLoaded = loadedImages[trail.id];

            return (
              <motion.div
                key={trail.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="glass rounded-2xl overflow-hidden group cursor-pointer">
                  <div className="relative h-56 overflow-hidden">
                    {/* ✅ SKELETON */}
                    {!isLoaded && (
                      <div className="absolute inset-0 animate-pulse bg-muted" />
                    )}

                    {/* ✅ IMAGE */}
                    {trail.image && (
                      <Image
                        src={trail.image}
                        alt={trail.name}
                        fill
                        onLoad={() =>
                          setLoadedImages((prev) => ({
                            ...prev,
                            [trail.id]: true,
                          }))
                        }
                        className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                          isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {trail.avgRating && trail.avgRating > 0 && (
                        <div className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-lg">
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold text-white">{trail.avgRating}</span>
                        </div>
                      )}
                      {(trail.storiesCount ?? 0) > 0 && (
                        <div className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-lg">
                          <BookOpen className="h-3 w-3 text-white" />
                          <span className="text-xs font-bold text-white">{trail.storiesCount}</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">
                        {trail.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/80">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {trail.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <ArrowUp className="h-3 w-3" />
                          {trail.elevation.toLocaleString("id-ID")} mdpl
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass font-medium text-foreground hover:bg-accent/50 transition-all duration-300"
          >
            Lihat semua jalur
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
