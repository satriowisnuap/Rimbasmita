"use client";

import { useState, useEffect } from "react";
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
const DEV_BYPASS_AUTH = false;

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
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SortTab>("terbaru");

  // ✅ Auth guard pakai Supabase
  useEffect(() => {
    if (DEV_BYPASS_AUTH) return;

    const getSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
      } else {
        router.push("/auth/signin");
      }

      setLoading(false); // ✅ penting biar tidak stuck loading
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  // Fetch stories
  useEffect(() => {
    if (!DEV_BYPASS_AUTH && !user) return;

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
  }, [user, activeTab]);

  // Loading state (tetap aman)
  if (!DEV_BYPASS_AUTH && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Mountain className="h-10 w-10 text-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  // Gunakan data Supabase atau dev
  const userName = DEV_BYPASS_AUTH
    ? DEV_USER.name
    : user?.user_metadata?.name || "Pendaki";

  const userImage = DEV_BYPASS_AUTH
    ? DEV_USER.image
    : user?.user_metadata?.avatar_url;

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
