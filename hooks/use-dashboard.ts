// hooks/use-dashboard.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export type SortTab = "terbaru" | "populer" | "trending";

export interface Story {
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

export interface UseDashboardReturn {
  user: any;
  stories: Story[];
  loading: boolean;
  activeTab: SortTab;
  setActiveTab: (tab: SortTab) => void;
  userName: string;
  userImage: string | null | undefined;
  isDevMode: boolean;
}

export function useDashboard(): UseDashboardReturn {
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

  // Gunakan data Supabase atau dev
  const userName = DEV_BYPASS_AUTH
    ? DEV_USER.name
    : user?.user_metadata?.name || "Pendaki";

  const userImage = DEV_BYPASS_AUTH
    ? DEV_USER.image
    : user?.user_metadata?.avatar_url;

  return {
    user,
    stories,
    loading,
    activeTab,
    setActiveTab,
    userName,
    userImage,
    isDevMode: DEV_BYPASS_AUTH,
  };
}
