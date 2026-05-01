"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, MapPin, ArrowUp, ArrowRight } from "lucide-react";
import { trails } from "@/data/page/trails";

export default function TrailsSection({ fadeInUp, stagger }: any) {
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
          {trails.map((trail, i) => (
            <motion.div
              key={trail.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="glass rounded-2xl overflow-hidden group cursor-pointer">
                <div className="relative h-56 overflow-hidden">
                  {/* <img
                    src={trail.image}
                    alt={trail.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-foreground">
                      {trail.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-foreground/70">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {trail.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <ArrowUp className="h-3.5 w-3.5" />
                        {trail.elevation.toLocaleString("id-ID")} mdpl
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
