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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SortTab>("terbaru");

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

  // ✅ FETCH PROFILE + STORIES
  useEffect(() => {
    if (!DEV_BYPASS_AUTH && !user) return;

    const fetchAll = async () => {
      setLoading(true);

      try {
        const userEmail = user?.email;

        // 🔥 PROFILE (pakai maybeSingle biar tidak error)
        let { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", userEmail)
          .maybeSingle();

        // 🔥 AUTO CREATE PROFILE kalau belum ada
        if (!profileData) {
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert({
              email: userEmail,
              username: userEmail?.split("@")[0],
              name: user?.name,
              image: user?.image,
            })
            .select()
            .maybeSingle();

          if (insertError) {
            console.error("Insert profile error:", insertError);
          } else {
            profileData = newProfile;
          }
        }

        setProfile(profileData);

        // 🔥 STORIES
        const { data: storiesData, error: storiesError } = await supabase
          .from("stories")
          .select(
            `
            id, title, slug, excerpt, likes_count, created_at,
            profiles:user_id (name, username),
            trails:trail_id (name),
            story_images (image_url)
          `,
          )
          .eq("is_private", false)
          .eq("is_draft", false)
          .order(activeTab === "terbaru" ? "created_at" : "likes_count", {
            ascending: false,
          })
          .limit(20);

        if (storiesError) {
          console.error("Stories error:", storiesError);
        } else {
          setStories(storiesData || []);
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
    loading,
    activeTab,
    setActiveTab,
    userName,
    userImage,
    username,
    isDevMode: DEV_BYPASS_AUTH,
  };
}
