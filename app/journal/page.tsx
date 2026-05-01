'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Lock, FileText, Trash2, CreditCard as Edit, Mountain, PenLine, Clock, CloudFog, TreePine, TriangleAlert as AlertTriangle, X } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { supabase } from '@/lib/supabase';

type TabKey = 'private' | 'draft';

interface JournalStory {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  mood: string | null;
  is_draft: boolean;
  is_private: boolean;
  created_at: string;
}

const moodColors: Record<string, string> = {
  calm: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  challenging: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  reflective: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  inspired: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  grateful: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

const moodLabels: Record<string, string> = {
  calm: 'Tenang',
  challenging: 'Menantang',
  reflective: 'Reflektif',
  inspired: 'Terinspirasi',
  grateful: 'Bersyukur',
};

const tabOptions: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'private', label: 'Jurnal Pribadi', icon: Lock },
  { key: 'draft', label: 'Draf', icon: FileText },
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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function JournalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>('private');
  const [privateStories, setPrivateStories] = useState<JournalStory[]>([]);
  const [drafts, setDrafts] = useState<JournalStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const userId = (session?.user as any)?.id;

  // Fetch private stories
  const fetchPrivateStories = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('stories')
      .select('id, title, slug, excerpt, mood, is_draft, is_private, created_at')
      .eq('user_id', userId)
      .eq('is_private', true)
      .eq('is_draft', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching private stories:', error);
    } else {
      setPrivateStories(data || []);
    }
  }, [userId]);

  // Fetch drafts
  const fetchDrafts = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('stories')
      .select('id, title, slug, excerpt, mood, is_draft, is_private, created_at')
      .eq('user_id', userId)
      .eq('is_draft', true)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching drafts:', error);
    } else {
      setDrafts(data || []);
    }
  }, [userId]);

  // Load data
  useEffect(() => {
    if (status !== 'authenticated' || !userId) return;

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchPrivateStories(), fetchDrafts()]);
      setLoading(false);
    };

    fetchAll();
  }, [status, userId, fetchPrivateStories, fetchDrafts]);

  // Delete handler
  const handleDelete = async (storyId: string) => {
    setDeletingId(storyId);
    setConfirmDeleteId(null);

    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyId);

    if (error) {
      console.error('Error deleting story:', error);
    } else {
      setPrivateStories((prev) => prev.filter((s) => s.id !== storyId));
      setDrafts((prev) => prev.filter((s) => s.id !== storyId));
    }

    setDeletingId(null);
  };

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

  const currentStories = activeTab === 'private' ? privateStories : drafts;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero / Header */}
      <section className="relative pt-24 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

        <div className="absolute top-28 left-[10%] animate-float opacity-12">
          <TreePine className="h-12 w-12 text-primary" />
        </div>
        <div className="absolute top-32 right-[8%] animate-float opacity-8" style={{ animationDelay: '4s' }}>
          <CloudFog className="h-10 w-10 text-primary" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Ruang Pribadi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Jurnal <span className="text-gradient">Pribadimu</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Ruang tenang untuk merefleksikan perjalananmu. Cerita pribadi dan draf yang hanya bisa kamu lihat.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex items-center justify-center gap-1 p-1 glass rounded-xl w-fit mx-auto"
          >
            {tabOptions.map((tab) => {
              const isActive = activeTab === tab.key;
              const count = tab.key === 'private' ? privateStories.length : drafts.length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="journalTab"
                      className="absolute inset-0 bg-primary rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                    {count > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {count}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-5 w-20 bg-muted rounded-full" />
                      <div className="h-4 w-24 bg-muted rounded" />
                    </div>
                    <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                    <div className="h-4 w-full bg-muted rounded mb-1" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                  </div>
                ))}
              </motion.div>
            ) : currentStories.length > 0 ? (
              <motion.div
                key={`stories-${activeTab}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {currentStories.map((story) => (
                  <motion.div key={story.id} variants={itemVariants}>
                    <div className="glass rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 group">
                      {/* Top row: badges + date */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {story.mood && (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${moodColors[story.mood] || ''}`}>
                              {moodLabels[story.mood] || story.mood}
                            </span>
                          )}
                          {story.is_draft && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-muted text-muted-foreground border-border">
                              Draf
                            </span>
                          )}
                          {story.is_private && !story.is_draft && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border bg-muted text-muted-foreground border-border">
                              <Lock className="h-3 w-3" />
                              Pribadi
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(story.created_at)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {story.title}
                      </h3>

                      {/* Excerpt */}
                      {story.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                          {story.excerpt}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <Link
                          href={story.is_draft ? `/create?edit=${story.id}` : `/story/${story.slug}`}
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          {story.is_draft ? (
                            <>
                              <Edit className="h-3.5 w-3.5" />
                              Lanjutkan Menulis
                            </>
                          ) : (
                            <>
                              <BookOpen className="h-3.5 w-3.5" />
                              Baca
                            </>
                          )}
                        </Link>

                        <div className="flex items-center gap-1">
                          {/* Edit button */}
                          <Link
                            href={`/create?edit=${story.id}`}
                            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          {/* Delete button */}
                          <button
                            onClick={() => setConfirmDeleteId(story.id)}
                            disabled={deletingId === story.id}
                            className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 disabled:opacity-50"
                            title="Hapus"
                          >
                            {deletingId === story.id ? (
                              <div className="h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`empty-${activeTab}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-12 text-center"
              >
                {activeTab === 'private' ? (
                  <>
                    <Lock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Belum ada jurnal pribadi
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                      Cerita pribadimu yang hanya bisa dilihat olehmu akan muncul di sini. Tandai cerita sebagai pribadi saat menulis.
                    </p>
                    <Link
                      href="/create"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all duration-300"
                    >
                      <PenLine className="h-4 w-4" />
                      Tulis Cerita Pribadi
                    </Link>
                  </>
                ) : (
                  <>
                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Belum ada draf
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                      Draf ceritamu yang belum diterbitkan akan muncul di sini. Simpan cerita sebagai draf untuk melanjutkannya nanti.
                    </p>
                    <Link
                      href="/create"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all duration-300"
                    >
                      <PenLine className="h-4 w-4" />
                      Mulai Menulis
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setConfirmDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="glass rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <h3 className="text-lg font-semibold text-foreground">Hapus Cerita?</h3>
                </div>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Cerita ini akan dihapus secara permanen dan tidak dapat dikembalikan. Yakin ingin menghapus?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl glass text-sm font-medium text-foreground hover:bg-accent/50 transition-all duration-300"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-all duration-300"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
