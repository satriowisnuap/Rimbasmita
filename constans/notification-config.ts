import { Heart, MessageCircle, UserPlus, Award, Bookmark } from "lucide-react";

export interface Actor {
  name: string;
  username: string;
  image: string | null;
}

export interface StoryInfo {
  title: string;
  slug: string;
}

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  type: "like" | "comment" | "follow" | "achievement" | "bookmark";
  is_read: boolean;
  message?: string;
  created_at: string;
  actor: Actor;
  stories: StoryInfo | null;
}

export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export const typeConfig: Record<
  string,
  { icon: typeof Heart; label: string; color: string; bgColor: string }
> = {
  like: {
    icon: Heart,
    label: "menyukai ceritamu",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  comment: {
    icon: MessageCircle,
    label: "mengomentari ceritamu",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  follow: {
    icon: UserPlus,
    label: "mulai mengikutimu",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  achievement: {
    icon: Award,
    label: "Kamu mendapatkan badge baru!",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  bookmark: {
    icon: Bookmark,
    label: "menyimpan ceritamu",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
};

export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffWeeks < 4) return `${diffWeeks} minggu lalu`;
  return `${diffMonths} bulan lalu`;
}
