'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, ArrowUp, Clock, Mountain } from 'lucide-react';

interface TrailCardProps {
  id: string;
  name: string;
  location: string;
  region?: string;
  elevation: number;
  difficulty: string;
  estimatedDuration?: string;
  storyCount?: number;
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
  name,
  location,
  elevation,
  difficulty,
  estimatedDuration,
  storyCount = 0,
}: TrailCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
      <div className="glass rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
        {/* Difficulty badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${difficultyColors[difficulty] || ''}`}>
            {difficultyLabels[difficulty] || difficulty}
          </span>
          {storyCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {storyCount} cerita
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
          {name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="h-3.5 w-3.5" />
          <span>{location}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ArrowUp className="h-3.5 w-3.5" />
            {elevation.toLocaleString()} mdpl
          </span>
          {estimatedDuration && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {estimatedDuration}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
