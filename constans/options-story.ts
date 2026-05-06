import { Flame, Leaf, Wind } from "lucide-react";

export const moodOptions = [
  {
    value: "calm",
    label: "Calm",
    icon: Leaf,
    description: "Peaceful & serene",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    activeBg: "bg-emerald-500/20 border-emerald-500",
  },
  {
    value: "challenging",
    label: "Challenging",
    icon: Flame,
    description: "Tough & rewarding",
    color: "text-orange-500",
    bg: "bg-orange-500/10 border-orange-500/30",
    activeBg: "bg-orange-500/20 border-orange-500",
  },
  {
    value: "reflective",
    label: "Reflective",
    icon: Wind,
    description: "Deep & introspective",
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/30",
    activeBg: "bg-blue-500/20 border-blue-500",
  },
];

export const difficultyOptions = [
  { value: "easy", label: "Mudah", color: "text-emerald-500" },
  { value: "medium", label: "Menengah", color: "text-amber-500" },
  { value: "hard", label: "Sulit", color: "text-red-500" },
];
