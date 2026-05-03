'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowUp, Clock, Mountain, BookOpen, Star } from 'lucide-react';

interface TrailCardProps {
  id: string;
  name: string;
  location: string;
  region?: string;
  elevation: number;
  difficulty: string;
  estimatedDuration?: string;
  storyCount?: number;
  avgRating?: number;
  image?: string;
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  hard: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

const difficultyLabels: Record<string, string> = {
  easy: 'Mudah',
  medium: 'Sedang',
  hard: 'Sulit',
};

export function TrailCard({
  id,
  name,
  location,
  elevation,
  difficulty,
  estimatedDuration,
  storyCount = 0,
  avgRating = 0,
  image,
}: TrailCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group h-full"
    >
      <Link href={`/trails/${id}`} className="block h-full">
        <div className="glass rounded-[32px] overflow-hidden border-primary/5 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 h-full flex flex-col relative">
          {/* Image Section */}
          <div className="relative h-56 overflow-hidden bg-muted">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/5">
                <Mountain className="h-12 w-12 text-primary/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            
            {/* Badges Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {avgRating > 0 && (
                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 flex items-center gap-1.5 shadow-lg">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-bold text-white">{avgRating}</span>
                </div>
              )}
              <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 flex items-center gap-1.5 shadow-lg">
                <BookOpen className="h-3.5 w-3.5 text-white" />
                <span className="text-sm font-bold text-white">{storyCount}</span>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${difficultyColors[difficulty] || difficultyColors.medium}`}>
                {difficultyLabels[difficulty] || difficulty}
              </span>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-widest mb-2">
              <MapPin className="h-3.5 w-3.5" />
              {location}
            </div>
            <h3 className="text-2xl font-black text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
            
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ArrowUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter leading-none mb-1">Ketinggian</p>
                  <p className="text-sm font-black text-foreground">{elevation.toLocaleString("id-ID")} mdpl</p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <ArrowRight className="h-5 w-5 text-current" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

import { ArrowRight } from 'lucide-react';
