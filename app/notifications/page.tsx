'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mountain, Heart, MessageCircle, UserPlus, Award, Bell, CheckCheck, Loader as Loader2 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { supabase } from '@/lib/supabase';

interface Actor {
  name: string;
  username: string;
  image: string | null;
}

interface StoryInfo {
  title: string;
  slug: string;
}

interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  type: 'like' | 'comment' | 'follow' | 'achievement';
  is_read: boolean;
  created_at: string;
  actor: Actor;
  stories: StoryInfo | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const typeConfig: Record<
  string,
  { icon: typeof Heart; label: string; color: string; bgColor: string }
> = {
  like: {
    icon: Heart,
    label: 'menyukai ceritamu',
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
  },
  comment: {
    icon: MessageCircle,
    label: 'mengomentari ceritamu',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  follow: {
    icon: UserPlus,
    label: 'mulai mengikutimu',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  achievement: {
    icon: Award,
    label: 'Kamu mendapatkan badge baru!',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
};

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffWeeks < 4) return `${diffWeeks} minggu lalu`;
  return `${diffMonths} bulan lalu`;
}

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState<string | null>(null);

  const userId = (session?.user as any)?.id;

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('notifications')
      .select(
        '*, actor:profiles!notifications_actor_id_fkey(name, username, image), stories(title, slug)'
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      setNotifications(data || []);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (status === 'authenticated' && userId) {
      fetchNotifications();
    }
  }, [status, userId, fetchNotifications]);

  // Mark a single notification as read
  const markAsRead = async (notificationId: string) => {
    setMarkingRead(notificationId);

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    }

    setMarkingRead(null);
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', unreadIds);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    }
  };

  // Loading state while checking auth
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

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
                <Bell className="h-7 w-7 text-primary" />
                Notifikasi
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {unreadCount > 0
                  ? `${unreadCount} notifikasi belum dibaca`
                  : 'Semua notifikasi sudah dibaca'}
              </p>
            </div>

            {unreadCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-medium text-foreground hover:bg-accent/50 transition-all duration-300"
              >
                <CheckCheck className="h-4 w-4 text-primary" />
                Tandai semua dibaca
              </motion.button>
            )}
          </motion.div>

          {/* Notifications list */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">
                  Memuat notifikasi...
                </p>
              </motion.div>
            ) : notifications.length > 0 ? (
              <motion.div
                key="notifications"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {notifications.map((notification) => {
                  const config = typeConfig[notification.type] || typeConfig.like;
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={notification.id}
                      variants={itemVariants}
                      layout
                    >
                      <button
                        onClick={() => {
                          if (!notification.is_read) {
                            markAsRead(notification.id);
                          }
                        }}
                        className={`w-full text-left glass rounded-2xl p-4 sm:p-5 transition-all duration-300 group hover:shadow-md hover:shadow-primary/5 ${
                          !notification.is_read
                            ? 'border-primary/20 bg-primary/[0.03]'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Actor avatar */}
                          <div className="relative flex-shrink-0">
                            {notification.actor?.image ? (
                              <img
                                src={notification.actor.image}
                                alt={notification.actor.name}
                                className="h-11 w-11 rounded-full object-cover ring-2 ring-border"
                              />
                            ) : (
                              <div className="h-11 w-11 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-border">
                                <span className="text-sm font-bold text-primary">
                                  {notification.actor?.name?.[0] || '?'}
                                </span>
                              </div>
                            )}

                            {/* Type icon badge */}
                            <div
                              className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${config.bgColor} flex items-center justify-center ring-2 ring-background`}
                            >
                              <Icon className={`h-3 w-3 ${config.color}`} />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground leading-relaxed">
                              {notification.type === 'achievement' ? (
                                <span className="font-medium">
                                  {config.label}
                                </span>
                              ) : (
                                <>
                                  <span className="font-semibold text-foreground">
                                    {notification.actor?.name || 'Seseorang'}
                                  </span>{' '}
                                  <span className="text-muted-foreground">
                                    {config.label}
                                  </span>
                                  {notification.stories && (
                                    <span className="font-medium text-foreground">
                                      {' '}
                                      &ldquo{notification.stories.title}&rdquo
                                    </span>
                                  )}
                                </>
                              )}
                            </p>

                            <p className="text-xs text-muted-foreground mt-1.5">
                              {getRelativeTime(notification.created_at)}
                            </p>
                          </div>

                          {/* Unread indicator */}
                          <div className="flex-shrink-0 pt-1">
                            {!notification.is_read && (
                              <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                            )}
                            {markingRead === notification.id && (
                              <Loader2 className="h-4 w-4 text-primary animate-spin" />
                            )}
                          </div>
                        </div>
                      </button>
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
                <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Belum ada notifikasi
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Saat orang lain menyukai, mengomentari, atau mengikutimu, notifikasi akan muncul di sini.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
