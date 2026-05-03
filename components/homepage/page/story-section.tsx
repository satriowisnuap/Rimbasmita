"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/page/testimonials";
import { useState } from "react";

export default function TestimonialsSection({ fadeInUp, stagger }: any) {
  const [isHovered, setIsHovered] = useState(false);

  // 🔥 duplicate banyak supaya seamless
  const loopData = Array(6).fill(testimonials).flat();

  return (
    <section className="py-24 px-4">
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
            <Quote className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Suara Komunitas
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
          >
            Cerita mereka, inspirasi kita
          </motion.h2>
        </motion.div>

        <div
          className="relative overflow-hidden py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex gap-6 w-max"
            style={{
              animation: "scrollX 30s linear infinite",
              animationPlayState: isHovered ? "paused" : "running",
            }}
          >
            {loopData.map((testimonial, i) => (
              <div key={i} className="px-2">
                <div className="min-w-[300px] max-w-[300px]">
                  <div className="glass rounded-2xl p-6 h-[260px] flex flex-col justify-between transition-all duration-500 ease-out hover:scale-[1.06] hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10">
                    <div>
                      <Quote className="h-8 w-8 text-primary/30 mb-4" />

                      <p className="text-foreground leading-relaxed italic line-clamp-4">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {testimonial.name[0]}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* fade kiri */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent" />

          {/* fade kanan */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes scrollX {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
