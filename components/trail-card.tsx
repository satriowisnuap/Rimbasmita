'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowUp, Clock, Mountain, BookOpen } from 'lucide-react';

interface TrailCardProps {
  id: string;
  name: string;
  location: string;
  region?: string;
  elevation: number;
  difficulty: string;
  estimatedDuration?: string;
  storyCount?: number;
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
  image,
}: TrailCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
      <Link href={`/trails/${id}`} className="block group">
        <div className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          {/* Preview Image */}
          <div className="relative h-40 overflow-hidden bg-muted">
            {image ? (
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/5">
                <Mountain className="h-10 w-10 text-primary/20" />
              </div>
            )}
            {/* Difficulty badge overlay */}
            <div className="absolute top-3 right-3">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${difficultyColors[difficulty] || ''}`}>
                {difficultyLabels[difficulty] || difficulty}
              </span>
            </div>
          </div>

          <div className="p-5">
            {/* Stats row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="line-clamp-1">{location}</span>
              </div>
              {storyCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  <BookOpen className="h-3 w-3" />
                  {storyCount}
                </span>
              )}
            </div>

            {/* Name */}
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-1">
              {name}
            </h3>

            {/* Bottom info */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-4">
              <span className="flex items-center gap-1.5">
                <ArrowUp className="h-3.5 w-3.5 text-primary" />
                {elevation.toLocaleString()} mdpl
              </span>
              {estimatedDuration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {estimatedDuration}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
