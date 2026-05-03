"use client";

import { Mountain, User } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAlert } from "@/components/ui/use-alert";
import { AlertModal } from "@/components/ui/alert-modal";
import { useProfile } from "@/hooks/profile/use-profile";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ProfileStories } from "@/components/profile/profile-stories";

export default function ProfilePage() {
  const {
    username,
    profile,
    loading,
    profileNotFound,
    storiesCount,
    totalLikes,
    trailsVisited,
    followersCount,
    followingCount,
    activeTab,
    setActiveTab,
    currentStories,
    storiesLoading,
    isFollowing,
    followLoading,
    handleFollowToggle,
    isOwnProfile,
    session,
    getCoverImage,
  } = useProfile();
  const { state: alert } = useAlert();

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

  return (
    <div className="min-h-screen bg-background">
      <AlertModal
        open={!!alert?.open}
        type={alert?.type}
        title={alert?.title}
        message={alert?.message || ""}
      />
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader
            profile={profile}
            storiesCount={storiesCount}
            totalLikes={totalLikes}
            trailsVisited={trailsVisited}
            followersCount={followersCount}
            followingCount={followingCount}
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            followLoading={followLoading}
            session={session}
            handleFollowToggle={handleFollowToggle}
          />

          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <ProfileStories
            activeTab={activeTab}
            currentStories={currentStories}
            storiesLoading={storiesLoading}
            isOwnProfile={isOwnProfile}
            profileName={profile.name}
            getCoverImage={getCoverImage}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
