import { Globe, FileText } from "lucide-react";

export type TabKey = "terbit" | "draft";

export interface JournalStory {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  mood: string | null;
  is_draft: boolean;
  is_private: boolean;
  created_at: string;
}

export const moodColors: Record<string, string> = {
  calm: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  challenging:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  reflective: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  inspired:
    "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  grateful:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export const moodLabels: Record<string, string> = {
  calm: "Tenang",
  challenging: "Menantang",
  reflective: "Reflektif",
  inspired: "Terinspirasi",
  grateful: "Bersyukur",
};

export const tabOptions: {
  key: TabKey;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "terbit", label: "Cerita Terbit", icon: Globe },
  { key: "draft", label: "Draf", icon: FileText },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
