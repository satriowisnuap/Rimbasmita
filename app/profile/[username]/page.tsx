'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, BookOpen, Heart, Mountain, Users, Bookmark, Loader as Loader2 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { StoryCard, StoryCardSkeleton } from '@/components/story-card';
import { supabase } from '@/lib/supabase';

type ProfileTab = 'cerita' | 'disimpan';

interface Profile {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  location: string | null;
  image: string | null;
}

interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
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

interface BookmarkedStory {
  story_id: string;
  stories: Story | null;
}

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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);

  const [storiesCount, setStoriesCount] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [trailsVisited, setTrailsVisited] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [activeTab, setActiveTab] = useState<ProfileTab>('cerita');
  const [stories, setStories] = useState<Story[]>([]);
  const [bookmarkedStories, setBookmarkedStories] = useState<Story[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const currentUserId = (session?.user as any)?.id;

  const isOwnProfile = currentUserId === profile?.id;

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setProfileNotFound(false);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !data) {
        setProfileNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(data);

      // Fetch stats in parallel
      const [
        storiesRes,
        likesRes,
        trailsRes,
        followersRes,
        followingRes,
      ] = await Promise.all([
        supabase
          .from('stories')
          .select('id', { count: 'exact' })
          .eq('user_id', data.id)
          .eq('is_private', false)
          .eq('is_draft', false),
        supabase
          .from('stories')
          .select('likes_count')
          .eq('user_id', data.id)
          .eq('is_private', false)
          .eq('is_draft', false),
        supabase
          .from('stories')
          .select('trail_id')
          .eq('user_id', data.id)
          .eq('is_private', false)
          .eq('is_draft', false),
        supabase
          .from('follows')
          .select('id', { count: 'exact' })
          .eq('following_id', data.id),
        supabase
          .from('follows')
          .select('id', { count: 'exact' })
          .eq('follower_id', data.id),
      ]);

      setStoriesCount(storiesRes.count || 0);
      setTotalLikes(
        (likesRes.data || []).reduce((sum, s) => sum + (s.likes_count || 0), 0)
      );
      const uniqueTrails = new Set(
        (trailsRes.data || []).map((t) => t.trail_id).filter(Boolean)
      );
      setTrailsVisited(uniqueTrails.size);
      setFollowersCount(followersRes.count || 0);
      setFollowingCount(followingRes.count || 0);

      // Check follow status
      if (currentUserId && currentUserId !== data.id) {
        const { data: followData } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', currentUserId)
          .eq('following_id', data.id)
          .maybeSingle();

        setIsFollowing(!!followData);
      }

      setLoading(false);
    };

    if (username) {
      fetchProfile();
    }
  }, [username, currentUserId]);

  // Fetch stories for active tab
  const fetchStories = useCallback(async () => {
    if (!profile) return;

    setStoriesLoading(true);

    if (activeTab === 'cerita') {
      const { data, error } = await supabase
        .from('stories')
        .select(
          `id, title, slug, excerpt, difficulty, duration, mood, likes_count, comments_count, created_at,
          trails:trail_id(name, location),
          story_images(image_url, display_order)`
        )
        .eq('user_id', profile.id)
        .eq('is_private', false)
        .eq('is_draft', false)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setStories(
          data.map((s) => ({
            ...s,
            profiles: [{
              name: profile.name,
              username: profile.username,
              image: profile.image,
            }],
          }))
        );
      }
    } else {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(
          `story_id, stories(id, title, slug, excerpt, difficulty, duration, mood, likes_count, comments_count, created_at,
          profiles:user_id(name, username, image),
          trails:trail_id(name, location),
          story_images(image_url, display_order))`
        )
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const parsed = data
          .filter((b: any) => b.stories !== null)
          .map((b: any) => {
            const s = b.stories;
            return {
              ...s,
              profiles: Array.isArray(s.profiles) ? s.profiles : s.profiles ? [s.profiles] : null,
              trails: Array.isArray(s.trails) ? s.trails : s.trails ? [s.trails] : null,
            } as Story;
          });
        setBookmarkedStories(parsed);
      }
    }

    setStoriesLoading(false);
  }, [profile, activeTab]);

  useEffect(() => {
    if (profile) {
      fetchStories();
    }
  }, [profile, activeTab, fetchStories]);

  // Follow / Unfollow toggle
  const handleFollowToggle = async () => {
    if (!profile || !currentUserId || followLoading) return;

    setFollowLoading(true);

    if (isFollowing) {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('following_id', profile.id);

      if (!error) {
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
      }
    } else {
      const { error } = await supabase.from('follows').insert({
        follower_id: currentUserId,
        following_id: profile.id,
      });

      if (!error) {
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    }

    setFollowLoading(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Mountain className="h-10 w-10 text-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">Memuat profil...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (profileNotFound || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-2xl p-12"
            >
              <User className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Profil Tidak Ditemukan
              </h1>
              <p className="text-sm text-muted-foreground">
                Pengguna dengan nama &ldquo;{username}&rdquo; tidak ditemukan.
              </p>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getCoverImage = (story: Story) => {
    const sorted = story.story_images?.sort(
      (a, b) => a.display_order - b.display_order
    );
    return sorted?.[0]?.image_url;
  };

  const renderStoryCard = (story: Story) => (
    <motion.div key={story.id} variants={itemVariants}>
      <StoryCard
        id={story.id}
        slug={story.slug}
        title={story.title}
        excerpt={story.excerpt || ''}
        coverImage={getCoverImage(story)}
        author={{
          name: story.profiles?.[0]?.name || 'Anonim',
          username: story.profiles?.[0]?.username || '',
          image: story.profiles?.[0]?.image || undefined,
        }}
        trail={
          story.trails?.[0]
            ? { name: story.trails[0].name, location: story.trails[0].location }
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

  const currentStories = activeTab === 'cerita' ? stories : bookmarkedStories;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-6 sm:p-8 mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ring-primary/20"
                  />
                ) : (
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-primary/20 flex items-center justify-center ring-4 ring-primary/20">
                    <User className="h-12 w-12 sm:h-14 sm:w-14 text-primary" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {profile.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  @{profile.username}
                </p>

                {profile.bio && (
                  <p className="text-sm text-muted-foreground mt-3 max-w-lg leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {profile.location && (
                  <div className="flex items-center gap-1.5 mt-3 justify-center sm:justify-start">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {profile.location}
                    </span>
                  </div>
                )}

                {/* Follow / Edit button */}
                <div className="mt-4">
                  {isOwnProfile ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2.5 rounded-xl glass text-sm font-medium text-foreground hover:bg-accent/50 transition-all duration-300"
                    >
                      Edit Profil
                    </motion.button>
                  ) : (
                    session && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleFollowToggle}
                        disabled={followLoading}
                        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 disabled:opacity-50 ${
                          isFollowing
                            ? 'glass text-foreground hover:bg-destructive/10 hover:text-destructive'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        {followLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin inline" />
                        ) : isFollowing ? (
                          'Berhenti Ikuti'
                        ) : (
                          'Ikuti'
                        )}
                      </motion.button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col items-center sm:items-start gap-1">
                  <div className="flex items-center gap-1.5 text-primary">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xl font-bold text-foreground">
                      {storiesCount}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Cerita</span>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-1">
                  <div className="flex items-center gap-1.5 text-primary">
                    <Heart className="h-4 w-4" />
                    <span className="text-xl font-bold text-foreground">
                      {totalLikes}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Suka Diterima</span>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-1">
                  <div className="flex items-center gap-1.5 text-primary">
                    <Mountain className="h-4 w-4" />
                    <span className="text-xl font-bold text-foreground">
                      {trailsVisited}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Jalur Dijelajahi</span>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-1">
                  <div className="flex items-center gap-1.5 text-primary">
                    <Users className="h-4 w-4" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {followersCount}
                      </span>
                      <span className="text-xs text-muted-foreground">pengikut</span>
                      <span className="text-sm font-semibold text-foreground">
                        {followingCount}
                      </span>
                      <span className="text-xs text-muted-foreground">mengikuti</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-1 p-1 glass rounded-xl mb-8 w-fit"
          >
            <button
              onClick={() => setActiveTab('cerita')}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'cerita'
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {activeTab === 'cerita' && (
                <motion.div
                  layoutId="profileTab"
                  className="absolute inset-0 bg-primary rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Cerita
              </span>
            </button>

            <button
              onClick={() => setActiveTab('disimpan')}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === 'disimpan'
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {activeTab === 'disimpan' && (
                <motion.div
                  layoutId="profileTab"
                  className="absolute inset-0 bg-primary rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5" />
                Disimpan
              </span>
            </button>
          </motion.div>

          {/* Stories / Bookmarked Stories */}
          <AnimatePresence mode="wait">
            {storiesLoading ? (
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
            ) : currentStories.length > 0 ? (
              <motion.div
                key={`stories-${activeTab}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {currentStories.map((story) => renderStoryCard(story))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-12 text-center"
              >
                {activeTab === 'cerita' ? (
                  <>
                    <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Belum ada cerita
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      {isOwnProfile
                        ? 'Kamu belum menulis cerita. Bagikan pengalaman mendakimu!'
                        : `${profile.name} belum menerbitkan cerita.`}
                    </p>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Belum ada cerita disimpan
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      {isOwnProfile
                        ? 'Kamu belum menyimpan cerita apapun.'
                        : `${profile.name} belum menyimpan cerita apapun.`}
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
