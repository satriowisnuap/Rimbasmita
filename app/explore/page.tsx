'use client';

import { useState, useEffect, useMemo } from 'react';
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
  ArrowUp,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { TrailCard } from '@/components/trail-card';
import { supabase } from '@/lib/supabase';

interface Trail {
  id: string;
  name: string;
  location: string;
  region: string | null;
  elevation: number;
  difficulty: string;
  estimated_duration: string | null;
}

interface StoryCount {
  trail_id: string;
  count: number;
}

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';

const difficultyOptions: { key: DifficultyFilter; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'easy', label: 'Mudah' },
  { key: 'medium', label: 'Sedang' },
  { key: 'hard', label: 'Sulit' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function ExplorePage() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [storyCounts, setStoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch trails
  useEffect(() => {
    const fetchTrails = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching trails:', error);
      } else {
        setTrails(data || []);
      }

      setLoading(false);
    };

    fetchTrails();
  }, []);

  // Fetch story counts per trail
  useEffect(() => {
    const fetchStoryCounts = async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('trail_id')
        .eq('is_draft', false)
        .eq('is_private', false)
        .not('trail_id', 'is', null);

      if (error) {
        console.error('Error fetching story counts:', error);
      } else {
        const counts: Record<string, number> = {};
        (data || []).forEach((row: { trail_id: string }) => {
          counts[row.trail_id] = (counts[row.trail_id] || 0) + 1;
        });
        setStoryCounts(counts);
      }
    };

    fetchStoryCounts();
  }, []);

  // Filtered trails
  const filteredTrails = useMemo(() => {
    return trails.filter((trail) => {
      // Search by name
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!trail.name.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Filter by difficulty
      if (difficultyFilter !== 'all' && trail.difficulty !== difficultyFilter) {
        return false;
      }

      // Filter by location/region
      if (locationFilter) {
        const loc = locationFilter.toLowerCase();
        const matchesLocation = trail.location?.toLowerCase().includes(loc);
        const matchesRegion = trail.region?.toLowerCase().includes(loc);
        if (!matchesLocation && !matchesRegion) {
          return false;
        }
      }

      return true;
    });
  }, [trails, searchQuery, difficultyFilter, locationFilter]);

  const activeFilterCount = (difficultyFilter !== 'all' ? 1 : 0) + (locationFilter ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('all');
    setLocationFilter('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
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

      {/* Trails grid */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Results info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center justify-between mb-6"
          >
            <p className="text-sm text-muted-foreground">
              {loading ? (
                'Memuat jalur...'
              ) : (
                <>
                  Menampilkan <span className="font-semibold text-foreground">{filteredTrails.length}</span> jalur
                  {(searchQuery || difficultyFilter !== 'all' || locationFilter) && ' (dengan filter aktif)'}
                </>
              )}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" />
              <span>cerita per jalur</span>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-5 w-16 bg-muted rounded-full" />
                      <div className="h-4 w-14 bg-muted rounded" />
                    </div>
                    <div className="h-6 w-3/4 bg-muted rounded mb-3" />
                    <div className="flex items-center gap-1.5 mb-4">
                      <div className="h-4 w-4 bg-muted rounded-full" />
                      <div className="h-4 w-28 bg-muted rounded" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-4 w-20 bg-muted rounded" />
                      <div className="h-4 w-16 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : filteredTrails.length > 0 ? (
              <motion.div
                key="trails"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredTrails.map((trail) => (
                  <motion.div key={trail.id} variants={itemVariants}>
                    <TrailCard
                      id={trail.id}
                      name={trail.name}
                      location={trail.location}
                      region={trail.region || undefined}
                      elevation={trail.elevation}
                      difficulty={trail.difficulty}
                      estimatedDuration={trail.estimated_duration || undefined}
                      storyCount={storyCounts[trail.id] || 0}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-12 text-center"
              >
                <Compass className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Jalur tidak ditemukan
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Tidak ada jalur yang cocok dengan pencarianmu. Coba ubah filter atau kata kunci pencarian.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all duration-300"
                >
                  <X className="h-4 w-4" />
                  Hapus Semua Filter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
