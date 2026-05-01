'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, BookOpen, Mountain, Clock, Heart, TrendingUp, ChartBar as BarChart3, Flame, User, FileText, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { StoryCard, StoryCardSkeleton } from '@/components/story-card';
import { supabase } from '@/lib/supabase';

type SortTab = 'terbaru' | 'populer' | 'trending';

interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  difficulty: string | null;
  duration: string | null;
  mood: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: {
    name: string;
    username: string;
    image: string | null;
  }[] | null;
  trails: {
    name: string;
    location: string;
  }[] | null;
  story_images: {
    image_url: string;
    display_order: number;
  }[];
}

const sortTabs: { key: SortTab; label: string; icon: React.ElementType }[] = [
  { key: 'terbaru', label: 'Terbaru', icon: Clock },
  { key: 'populer', label: 'Populer', icon: Heart },
  { key: 'trending', label: 'Trending', icon: Flame },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SortTab>('terbaru');

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Fetch stories
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchStories = async () => {
      setLoading(true);

      let query = supabase
        .from('stories')
        .select(`
          id, title, slug, excerpt, difficulty, duration, mood, likes_count, comments_count, created_at,
          profiles:user_id (name, username, image ),
          trails:trail_id (name, location),
          story_images (image_url, display_order)
        `)
        .eq('is_private', false)
        .eq('is_draft', false);

      if (activeTab === 'terbaru') {
        query = query.order('created_at', { ascending: false });
      } else if (activeTab === 'populer') {
        query = query.order('likes_count', { ascending: false });
      } else if (activeTab === 'trending') {
        query = query.order('likes_count', { ascending: false });
      }

      query = query.limit(20);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching stories:', error);
      } else {
        setStories(data || []);
      }

      setLoading(false);
    };

    fetchStories();
  }, [status, activeTab]);

  // Show nothing while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Mountain className="h-10 w-10 text-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const userName = (session.user as any)?.name || 'Pendaki';
  const userImage = (session.user as any)?.image;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* User greeting */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {userImage ? (
                      <img
                        src={userImage}
                        alt={userName}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Selamat datang</p>
                      <p className="text-lg font-semibold text-foreground">{userName}</p>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="space-y-2">
                    <Link
                      href="/create"
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all duration-300 group"
                    >
                      <PenLine className="h-4 w-4" />
                      <span>Tulis Cerita</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/journal"
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl glass font-medium text-sm text-foreground hover:bg-accent/50 transition-all duration-300 group"
                    >
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>Jurnal Pribadi</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Statistikmu
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5" />
                        Cerita ditulis
                      </span>
                      <span className="text-sm font-semibold text-foreground">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Heart className="h-3.5 w-3.5" />
                        Total suka
                      </span>
                      <span className="text-sm font-semibold text-foreground">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mountain className="h-3.5 w-3.5" />
                        Jalur dijelajahi
                      </span>
                      <span className="text-sm font-semibold text-foreground">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Hari berturut
                      </span>
                      <span className="text-sm font-semibold text-foreground">0</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </aside>

            {/* Main feed */}
            <div className="flex-1 order-1 lg:order-2">
              {/* Header and tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  Feed Cerita
                </h1>
                <p className="text-sm text-muted-foreground">
                  Cerita terbaru dari komunitas pendaki Rimbasmita
                </p>
              </motion.div>

              {/* Sort tabs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center gap-1 p-1 glass rounded-xl mb-8 w-fit"
              >
                {sortTabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary rounded-lg"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <tab.icon className="h-3.5 w-3.5" />
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </motion.div>

              {/* Stories grid */}
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <StoryCardSkeleton key={i} />
                    ))}
                  </motion.div>
                ) : stories.length > 0 ? (
                  <motion.div
                    key={`stories-${activeTab}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {stories.map((story) => {
                      const coverImage = story.story_images?.sort(
                        (a, b) => a.display_order - b.display_order
                      )[0]?.image_url;

                      return (
                        <motion.div key={story.id} variants={itemVariants}>
                          <StoryCard
                            id={story.id}
                            slug={story.slug}
                            title={story.title}
                            excerpt={story.excerpt || ''}
                            coverImage={coverImage}
                            author={{
                              name: story.profiles?.[0]?.name || 'Anonim',
                              username: story.profiles?.[0]?.username || '',
                              image: story.profiles?.[0]?.image || undefined,
                            }}
                            trail={
                              story.trails?.[0]
                                ? {
                                    name: story.trails[0].name,
                                    location: story.trails[0].location,
                                  }
                                : undefined
                            }
                            difficulty={story.difficulty || undefined}
                            duration={story.duration || undefined}
                            mood={story.mood || undefined}
                            likesCount={story.likes_count}
                            commentsCount={story.comments_count}
                            createdAt={story.created_at}
                          />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-12 text-center"
                  >
                    <Mountain className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Belum ada cerita
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                      Belum ada cerita yang ditemukan. Jadilah yang pertama berbagi pengalaman mendakimu!
                    </p>
                    <Link
                      href="/create"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all duration-300"
                    >
                      <PenLine className="h-4 w-4" />
                      Tulis Cerita Pertama
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
