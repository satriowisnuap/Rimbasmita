"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  PenLine,
  BookOpen,
  Mountain,
  Heart,
  TrendingUp,
  ChartBar as BarChart3,
  User,
  FileText,
  ArrowRight,
  Shield,
} from "lucide-react";

interface Props {
  userName?: string;
  userImage?: string;
  username?: string;
  role?: string | null;
  stats?: {
    totalStories: number;
    totalLikes: number;
    trailsExplored: number;
    streakDays: number;
  };
}

export function DashboardSidebar(props: Props) {
  const { data: session } = useSession();

  // ✅ Cast ke any agar bisa akses field custom (id, username, role)
  const user = session?.user as any;

  // ✅ Baca role dari: props → session (urutan prioritas)
  const username = props.username ?? user?.username ?? null;
  const userName = props.userName ?? user?.name ?? "Pendaki";
  const userImage = props.userImage ?? user?.image ?? null;
  const role = props.role ?? user?.role ?? null; // ✅ FIX UTAMA

  const stats = props.stats || {
    totalStories: 0,
    totalLikes: 0,
    trailsExplored: 0,
    streakDays: 0,
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 order-2 lg:order-1">
      <div className="lg:sticky lg:top-24 space-y-6">
        {/* User greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          {username && (
            <Link
              href={`/profile/${username}`}
              className="flex items-center gap-3 mb-4 group"
            >
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName}
                  width={48}
                  height={48}
                  className="rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Selamat datang</p>
                <p className="text-lg font-semibold text-foreground group-hover:text-primary transition">
                  {userName}
                </p>
              </div>
            </Link>
          )}

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

        {/* Admin Panel — hanya tampil jika role === "admin" */}
        {role === "admin" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-2xl overflow-hidden border border-primary/20 bg-primary/5"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/10">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Admin Panel
              </span>
            </div>
            <div className="p-3 space-y-1">
              <Link
                href="/admin/trails"
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl font-medium text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
              >
                <Mountain className="h-4 w-4 text-primary/70" />
                <span>Manajemen Jalur</span>
                <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </motion.div>
        )}

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
              <span className="text-sm font-semibold text-foreground">
                {stats.totalStories}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Heart className="h-3.5 w-3.5" />
                Total suka
              </span>
              <span className="text-sm font-semibold text-foreground">
                {stats.totalLikes}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Mountain className="h-3.5 w-3.5" />
                Jalur dijelajahi
              </span>
              <span className="text-sm font-semibold text-foreground">
                {stats.trailsExplored}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5" />
                Hari berturut
              </span>
              <span className="text-sm font-semibold text-foreground">
                {stats.streakDays}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  );
}
