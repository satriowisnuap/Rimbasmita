"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";

const DEV_BYPASS_AUTH = false;

const DEV_USER = {
  name: "Developer",
  image: null as string | null,
};

export type SortTab = "terbaru" | "populer" | "trending";

export function useDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalStories: 0, totalLikes: 0, trailsExplored: 0, streakDays: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SortTab>("terbaru");
  const [role, setRole] = useState<string | null>(null);

  // ✅ AUTH
  useEffect(() => {
    if (DEV_BYPASS_AUTH) return;

    if (status === "loading") return;

    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [session, status]);

  // ✅ FETCH PROFILE, STORIES, STATS
  useEffect(() => {
    if (!DEV_BYPASS_AUTH && !user) return;

    const fetchAll = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/dashboard?tab=${activeTab}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setRole(data.profile?.role ?? null);
          setStories(data.stories || []);
          setStats(data.stats || { totalStories: 0, totalLikes: 0, trailsExplored: 0, streakDays: 0 });
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      }

      setLoading(false);
    };

    fetchAll();
  }, [user, activeTab]);

  const userName = DEV_BYPASS_AUTH ? DEV_USER.name : user?.name || "Pendaki";

  const userImage = DEV_BYPASS_AUTH ? DEV_USER.image : user?.image;

  const username = profile?.username;

  return {
    user,
    stories,
    stats,
    loading,
    activeTab,
    setActiveTab,
    userName,
    userImage,
    username,
    role,
    isDevMode: DEV_BYPASS_AUTH,
  };
}
