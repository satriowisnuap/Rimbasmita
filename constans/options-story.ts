import { Flame, Leaf, Wind } from "lucide-react";

export const moodOptions = [
  {
    value: "calm",
    label: "Tenang",
    icon: Leaf,
    description: "Damai & menenangkan",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    activeBg: "bg-emerald-500/20 border-emerald-500",
  },
  {
    value: "challenging",
    label: "Menantang",
    icon: Flame,
    description: "Berat & memuaskan",
    color: "text-orange-500",
    bg: "bg-orange-500/10 border-orange-500/30",
    activeBg: "bg-orange-500/20 border-orange-500",
  },
  {
    value: "reflective",
    label: "Reflektif",
    icon: Wind,
    description: "Mendalam & penuh renungan",
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/30",
    activeBg: "bg-sky-500/25 border-sky-400 shadow-sky-500/20",
  },
];

export const difficultyOptions = [
  { value: "easy", label: "Mudah", color: "text-emerald-500" },
  { value: "medium", label: "Menengah", color: "text-amber-500" },
  { value: "hard", label: "Sulit", color: "text-red-500" },
];
