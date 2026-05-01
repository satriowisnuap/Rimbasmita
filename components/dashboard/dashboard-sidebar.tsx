"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
} from "lucide-react";

interface DashboardSidebarProps {
  userName: string;
  userImage?: string | null;
  username?: string;
}

export function DashboardSidebar({
  userName,
  userImage,
  username,
}: DashboardSidebarProps) {
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
          <Link
            href={username ? `/profile/${username}` : "#"}
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
  );
}
