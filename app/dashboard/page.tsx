"use client";

import { Mountain } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DashboardSidebar, DashboardFeed } from "@/components/dashboard";
import { useDashboard } from "@/hooks/dashboard/use-dashboard";

export default function DashboardPage() {
  const {
    user,
    stories,
    loading,
    activeTab,
    setActiveTab,
    userName,
    userImage,
    isDevMode,
    username,
  } = useDashboard();

  if (!isDevMode && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Mountain className="h-10 w-10 text-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {isDevMode && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-yellow-500/90 text-yellow-950 text-xs font-semibold shadow-lg backdrop-blur">
          ⚠️ DEV MODE — Auth dinonaktifkan. Set{" "}
          <code className="font-mono">DEV_BYPASS_AUTH = false</code> sebelum
          deploy.
        </div>
      )}

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <DashboardSidebar
              userName={userName}
              userImage={userImage}
              username={username}
            />
            <DashboardFeed
              stories={stories}
              loading={loading}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
