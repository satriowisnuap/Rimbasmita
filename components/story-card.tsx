'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, MapPin, Clock, Mountain } from 'lucide-react';

interface StoryCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  author: {
    name: string;
    username: string;
    image?: string;
  };
  trail?: {
    name: string;
    location: string;
  };
  difficulty?: string;
  duration?: string;
  mood?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

const moodColors: Record<string, string> = {
  calm: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  challenging: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  reflective: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
};

const moodLabels: Record<string, string> = {
  calm: 'Tenang',
  challenging: 'Menantang',
  reflective: 'Reflektif',
};

const difficultyLabels: Record<string, string> = {
  easy: 'Mudah',
  medium: 'Sedang',
  hard: 'Sulit',
};

export function StoryCard({
  slug,
  title,
  excerpt,
  coverImage,
  author,
  trail,
  difficulty,
  duration,
  mood,
  likesCount,
  commentsCount,
  createdAt,
}: StoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/story/${slug}`} className="block group">
        <article className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          {/* Cover Image */}
          <div className="relative h-48 overflow-hidden bg-muted">
            {coverImage ? (
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Mountain className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
            {/* Overlay badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {mood && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${moodColors[mood] || ''}`}>
                  {moodLabels[mood] || mood}
                </span>
              )}
              {difficulty && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-background/70 text-foreground backdrop-blur-sm">
                  {difficultyLabels[difficulty] || difficulty}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Trail info */}
            {trail && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />
                <span>{trail.name}, {trail.location}</span>
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
              {excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between">
              {/* Author */}
              <div className="flex items-center gap-2">
                {author.image ? (
                  <img src={author.image} alt={author.name} className="h-6 w-6 rounded-full object-cover" />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">{author.name?.[0] || '?'}</span>
                  </div>
                )}
                <span className="text-xs font-medium text-foreground">{author.name}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {duration}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {likesCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  {commentsCount}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

export function StoryCardSkeleton() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="h-48 bg-muted animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
        <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="flex justify-between">
          <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
