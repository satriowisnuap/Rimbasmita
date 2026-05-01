"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mountain } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardFeed } from "@/components/dashboard/dashboard-feed";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────
// DEV FLAG — set true untuk bypass auth
// Ganti ke false sebelum deploy ke production
// ─────────────────────────────────────────────
const DEV_BYPASS_AUTH = true;

const DEV_USER = {
  name: "Developer",
  image: null as string | null,
};
// ─────────────────────────────────────────────

type SortTab = "terbaru" | "populer" | "trending";

interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  difficulty: string | null;
  duration: string | null;
  mood: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles:
    | {
        name: string;
        username: string;
        image: string | null;
      }[]
    | null;
  trails:
    | {
        name: string;
        location: string;
      }[]
    | null;
  story_images: {
    image_url: string;
    display_order: number;
  }[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SortTab>("terbaru");

  // Auth guard — dilewati kalau DEV_BYPASS_AUTH aktif
  useEffect(() => {
    if (DEV_BYPASS_AUTH) return;
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch stories
  useEffect(() => {
    // Kalau dev bypass aktif, langsung fetch tanpa cek auth
    if (!DEV_BYPASS_AUTH && status !== "authenticated") return;

    const fetchStories = async () => {
      setLoading(true);

      let query = supabase
        .from("stories")
        .select(
          `
          id, title, slug, excerpt, difficulty, duration, mood, likes_count, comments_count, created_at,
          profiles:user_id (name, username, image),
          trails:trail_id (name, location),
          story_images (image_url, display_order)
        `,
        )
        .eq("is_private", false)
        .eq("is_draft", false);

      if (activeTab === "terbaru") {
        query = query.order("created_at", { ascending: false });
      } else if (activeTab === "populer") {
        query = query.order("likes_count", { ascending: false });
      } else if (activeTab === "trending") {
        query = query.order("likes_count", { ascending: false });
      }

      query = query.limit(20);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching stories:", error);
      } else {
        setStories(data || []);
      }

      setLoading(false);
    };

    fetchStories();
  }, [status, activeTab]);

  // Loading state — dilewati kalau dev bypass aktif
  if (!DEV_BYPASS_AUTH && status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Mountain className="h-10 w-10 text-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!DEV_BYPASS_AUTH && !session) return null;

  // Gunakan data session asli atau mock dev
  const userName = DEV_BYPASS_AUTH
    ? DEV_USER.name
    : (session?.user as any)?.name || "Pendaki";

  const userImage = DEV_BYPASS_AUTH
    ? DEV_USER.image
    : (session?.user as any)?.image;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner dev mode */}
      {DEV_BYPASS_AUTH && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-yellow-500/90 text-yellow-950 text-xs font-semibold shadow-lg backdrop-blur">
          ⚠️ DEV MODE — Auth dinonaktifkan. Set{" "}
          <code className="font-mono">DEV_BYPASS_AUTH = false</code> sebelum
          deploy.
        </div>
      )}

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <DashboardSidebar userName={userName} userImage={userImage} />
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
