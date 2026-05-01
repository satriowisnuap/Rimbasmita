'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Search,
  Filter,
  Mountain,
  MapPin,
  X,
  TreePine,
  CloudFog,
} from 'lucide-react';

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';

const difficultyOptions: { key: DifficultyFilter; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'easy', label: 'Mudah' },
  { key: 'medium', label: 'Sedang' },
  { key: 'hard', label: 'Sulit' },
];

interface ExploreHeroProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  difficultyFilter: DifficultyFilter;
  setDifficultyFilter: (v: DifficultyFilter) => void;
  locationFilter: string;
  setLocationFilter: (v: string) => void;
  clearFilters: () => void;
}

export function ExploreHero({
  searchQuery,
  setSearchQuery,
  difficultyFilter,
  setDifficultyFilter,
  locationFilter,
  setLocationFilter,
  clearFilters,
}: ExploreHeroProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = (difficultyFilter !== 'all' ? 1 : 0) + (locationFilter ? 1 : 0);

  return (
    <section className="relative pt-24 pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="absolute top-28 left-[8%] animate-float opacity-15">
        <TreePine className="h-14 w-14 text-primary" />
      </div>
      <div className="absolute top-36 right-[12%] animate-float opacity-10" style={{ animationDelay: '3s' }}>
        <Mountain className="h-16 w-16 text-primary" />
      </div>
      <div className="absolute bottom-4 left-[25%] animate-float opacity-8" style={{ animationDelay: '5s' }}>
        <CloudFog className="h-12 w-12 text-primary" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Compass className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Jelajahi Jalur</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Temukan Jalur <span className="text-gradient">Pendakianmu</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Jelajahi jalur-jalur pendakian dengan cerita nyata dari komunitas. Setiap jalur punya kisah yang menunggu untuk ditemukan.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass rounded-2xl p-3 flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
            <input
              type="text"
              placeholder="Cari nama jalur pendakian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm sm:text-base"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                showFilters
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {(searchQuery || difficultyFilter !== 'all' || locationFilter) && (
              <button
                onClick={clearFilters}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto overflow-hidden"
            >
              <div className="glass rounded-2xl p-4 mt-3 space-y-4">
                {/* Difficulty filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Mountain className="h-3.5 w-3.5 text-primary" />
                    Tingkat Kesulitan
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {difficultyOptions.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => setDifficultyFilter(option.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          difficultyFilter === option.key
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'glass text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    Lokasi / Wilayah
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: Jawa Timur, Lombok..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl glass bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
                    />
                    {locationFilter && (
                      <button
                        onClick={() => setLocationFilter('')}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}