'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Heart, Bookmark, MessageCircle, ArrowUp, MapPin, Clock, Smile, Tag, Lightbulb, TriangleAlert as AlertTriangle, ChevronLeft, Send, User, Image as ImageIcon } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { supabase } from '@/lib/supabase';

interface StoryImage {
  id: string;
  image_url: string;
  caption?: string;
}

interface StoryTag {
  id: string;
  tag: string;
}

interface Profile {
  id: string;
  name: string;
  username: string;
  image?: string;
}

interface Trail {
  id: string;
  name: string;
  location: string;
  elevation: number;
}

interface Story {
  id: string;
  slug: string;
  title: string;
  content: string;
  difficulty: string;
  duration: string;
  mood: string;
  tips: string;
  warnings: string;
  likes_count: number;
  bookmarks_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  trail_id: string;
  profiles: Profile;
  trails: Trail;
  story_images: StoryImage[];
  story_tags: StoryTag[];
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    name: string;
    username: string;
    image?: string;
  };
}

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const difficultyColor: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  moderate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  hard: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  extreme: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const moodEmoji: Record<string, string> = {
  peaceful: 'Serene',
  adventurous: 'Adventurous',
  reflective: 'Reflective',
  exhilarated: 'Exhilarated',
  grateful: 'Grateful',
  challenged: 'Challenged',
};

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const slug = params.slug as string;

  const fetchStory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*, profiles:user_id(*), trails:trail_id(*), story_images(*), story_tags(*)')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setStory(data);
      setLikesCount(data.likes_count || 0);
      setBookmarksCount(data.bookmarks_count || 0);

      // Fetch comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*, profiles:user_id(name, username, image)')
        .eq('story_id', data.id)
        .order('created_at');

      if (commentsData) {
        setComments(commentsData);
      }

      // Check like and bookmark status if user is logged in
      if (session?.user) {
        const userId = (session.user as any).id;

        const { data: likeData } = await supabase
          .from('likes')
          .select('id')
          .eq('story_id', data.id)
          .eq('user_id', userId)
          .maybeSingle();

        setIsLiked(!!likeData);

        const { data: bookmarkData } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('story_id', data.id)
          .eq('user_id', userId)
          .maybeSingle();

        setIsBookmarked(!!bookmarkData);
      }
    } catch {
      // Silently handle fetch errors
    } finally {
      setLoading(false);
    }
  }, [slug, session]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  const handleLikeToggle = async () => {
    if (!session?.user || !story) return;
    const userId = (session.user as any).id;

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('story_id', story.id)
          .eq('user_id', userId);
        setLikesCount((c) => Math.max(0, c - 1));
      } else {
        await supabase.from('likes').insert({ story_id: story.id, user_id: userId });
        setLikesCount((c) => c + 1);
      }

      await supabase
        .from('stories')
        .update({ likes_count: isLiked ? Math.max(0, likesCount - 1) : likesCount + 1 })
        .eq('id', story.id);

      setIsLiked(!isLiked);
    } catch {
      // Silently handle errors
    }
  };

  const handleBookmarkToggle = async () => {
    if (!session?.user || !story) return;
    const userId = (session.user as any).id;

    try {
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('story_id', story.id)
          .eq('user_id', userId);
        setBookmarksCount((c) => Math.max(0, c - 1));
      } else {
        await supabase.from('bookmarks').insert({ story_id: story.id, user_id: userId });
        setBookmarksCount((c) => c + 1);
      }

      await supabase
        .from('stories')
        .update({ bookmarks_count: isBookmarked ? Math.max(0, bookmarksCount - 1) : bookmarksCount + 1 })
        .eq('id', story.id);

      setIsBookmarked(!isBookmarked);
    } catch {
      // Silently handle errors
    }
  };

  const handleCommentSubmit = async () => {
    if (!session?.user || !story || !commentText.trim()) return;
    const userId = (session.user as any).id;

    setSubmittingComment(true);
    try {
      const { data: newComment } = await supabase
        .from('comments')
        .insert({
          story_id: story.id,
          user_id: userId,
          content: commentText.trim(),
        })
        .select('*, profiles:user_id(name, username, image)')
        .single();

      if (newComment) {
        setComments((prev) => [...prev, newComment]);
        const newCount = (story.comments_count || 0) + 1;
        await supabase
          .from('stories')
          .update({ comments_count: newCount })
          .eq('id', story.id);
        setStory((prev) => prev ? { ...prev, comments_count: newCount } : prev);
        setCommentText('');
      }
    } catch {
      // Silently handle errors
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: idLocale });
    } catch {
      return '';
    }
  };

  const coverImage = story?.story_images?.[0]?.image_url || null;
  const galleryImages = story?.story_images?.slice(1) || [];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Memuat cerita...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Cerita tidak ditemukan</h2>
            <p className="text-muted-foreground mb-6">Cerita yang kamu cari mungkin telah dihapus atau tidak tersedia.</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl glass font-medium text-foreground hover:bg-accent/50 transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4" />
              Kembali
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.main
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="pt-20 pb-16"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Back button */}
          <motion.div variants={fadeInUp} className="mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Kembali
            </button>
          </motion.div>

          {/* Cover Image */}
          {coverImage && (
            <motion.div variants={fadeInUp} className="mb-8 rounded-2xl overflow-hidden relative">
              <img
                src={coverImage}
                alt={story.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6"
          >
            {story.title}
          </motion.h1>

          {/* Author Info */}
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
            {story.profiles?.image ? (
              <img
                src={story.profiles.image}
                alt={story.profiles.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="h-11 w-11 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <Link
                href={`/profile/${story.profiles?.username || 'me'}`}
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                {story.profiles?.name || 'Anonim'}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatTime(story.created_at)}
              </p>
            </div>
          </motion.div>

          {/* Trail Info */}
          {story.trails && (
            <motion.div variants={fadeInUp} className="glass rounded-2xl p-5 mb-6">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-foreground font-medium">
                  <MapPin className="h-4 w-4 text-primary" />
                  {story.trails.name}
                </div>
                {story.trails.location && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {story.trails.location}
                  </div>
                )}
                {story.trails.elevation && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <ArrowUp className="h-4 w-4" />
                    {story.trails.elevation.toLocaleString()} mdpl
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Metadata Badges */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2 mb-8">
            {story.difficulty && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${difficultyColor[story.difficulty] || 'bg-muted text-muted-foreground'}`}>
                <Smile className="h-3.5 w-3.5" />
                {story.difficulty.charAt(0).toUpperCase() + story.difficulty.slice(1)}
              </span>
            )}
            {story.duration && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {story.duration}
              </span>
            )}
            {story.mood && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <Smile className="h-3.5 w-3.5" />
                {moodEmoji[story.mood] || story.mood}
              </span>
            )}
          </motion.div>

          {/* Tags */}
          {story.story_tags && story.story_tags.length > 0 && (
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2 mb-8">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {story.story_tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-accent/50 transition-colors"
                >
                  {tag.tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Content */}
          <motion.div variants={fadeInUp} className="mb-10">
            <div
              className="text-foreground/90 text-base sm:text-lg leading-relaxed whitespace-pre-wrap"
            >
              {story.content}
            </div>
          </motion.div>

          {/* Tips Section */}
          {story.tips && story.tips.trim() !== '' && (
            <motion.div variants={fadeInUp} className="glass rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-semibold text-foreground">Tips</h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {story.tips}
              </div>
            </motion.div>
          )}

          {/* Warnings Section */}
          {story.warnings && story.warnings.trim() !== '' && (
            <motion.div variants={fadeInUp} className="glass rounded-2xl p-6 mb-6 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-semibold text-foreground">Peringatan</h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {story.warnings}
              </div>
            </motion.div>
          )}

          {/* Image Gallery */}
          {galleryImages.length > 0 && (
            <motion.div variants={fadeInUp} className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">Galeri</h3>
              </div>

              {/* Main gallery image */}
              <div className="rounded-2xl overflow-hidden mb-3">
                <img
                  src={galleryImages[galleryIndex]?.image_url}
                  alt={galleryImages[galleryIndex]?.caption || `Foto ${galleryIndex + 1}`}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                {galleryImages[galleryIndex]?.caption && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    {galleryImages[galleryIndex].caption}
                  </p>
                )}
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setGalleryIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden ring-2 transition-all duration-200 ${
                        idx === galleryIndex
                          ? 'ring-primary opacity-100'
                          : 'ring-transparent opacity-60 hover:opacity-90'
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt={img.caption || `Foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Interaction Section */}
          <motion.div
            variants={fadeInUp}
            className="glass rounded-2xl p-5 mb-8 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              {/* Like Button */}
              <button
                onClick={handleLikeToggle}
                disabled={!session?.user}
                className="flex items-center gap-1.5 group transition-all duration-200"
              >
                <Heart
                  className={`h-5 w-5 transition-all duration-200 ${
                    isLiked
                      ? 'fill-red-500 text-red-500 scale-110'
                      : 'text-muted-foreground group-hover:text-red-400'
                  }`}
                />
                <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {likesCount}
                </span>
              </button>

              {/* Bookmark Button */}
              <button
                onClick={handleBookmarkToggle}
                disabled={!session?.user}
                className="flex items-center gap-1.5 group transition-all duration-200"
              >
                <Bookmark
                  className={`h-5 w-5 transition-all duration-200 ${
                    isBookmarked
                      ? 'fill-primary text-primary scale-110'
                      : 'text-muted-foreground group-hover:text-primary'
                  }`}
                />
                <span className={`text-sm font-medium ${isBookmarked ? 'text-primary' : 'text-muted-foreground'}`}>
                  {bookmarksCount}
                </span>
              </button>
            </div>

            {/* Comment Count */}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{story.comments_count || comments.length}</span>
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Komentar ({comments.length})
              </h3>
            </div>

            {/* Comment Input */}
            {session?.user ? (
              <div className="glass rounded-2xl p-4 mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Tulis komentar..."
                  rows={3}
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none resize-none text-sm leading-relaxed"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim() || submittingComment}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {submittingComment ? 'Mengirim...' : 'Kirim'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl p-4 mb-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Masuk untuk menulis komentar
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Belum ada komentar. Jadilah yang pertama!
                </p>
              )}

              {comments.map((comment) => (
                <div key={comment.id} className="glass rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    {comment.profiles?.image ? (
                      <img
                        src={comment.profiles.image}
                        alt={comment.profiles.name}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-border flex-shrink-0"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/profile/${comment.profiles?.username || 'me'}`}
                          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {comment.profiles?.name || 'Anonim'}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
