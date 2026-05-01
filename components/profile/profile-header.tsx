"use client";

import { motion } from "framer-motion";
import {
  User,
  MapPin,
  BookOpen,
  Heart,
  Mountain,
  Users,
  Loader as Loader2,
} from "lucide-react";
import type { Profile } from "@/hooks/profile/use-profile";

interface ProfileHeaderProps {
  profile: Profile;
  storiesCount: number;
  totalLikes: number;
  trailsVisited: number;
  followersCount: number;
  followingCount: number;
  isOwnProfile: boolean;
  isFollowing: boolean;
  followLoading: boolean;
  session: any;
  handleFollowToggle: () => Promise<void>;
}

export function ProfileHeader({
  profile,
  storiesCount,
  totalLikes,
  trailsVisited,
  followersCount,
  followingCount,
  isOwnProfile,
  isFollowing,
  followLoading,
  session,
  handleFollowToggle,
}: ProfileHeaderProps) {
  return (
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
                      ? "glass text-foreground hover:bg-destructive/10 hover:text-destructive"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {followLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin inline" />
                  ) : isFollowing ? (
                    "Berhenti Ikuti"
                  ) : (
                    "Ikuti"
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
            <span className="text-xs text-muted-foreground">
              Jalur Dijelajahi
            </span>
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
  );
}
