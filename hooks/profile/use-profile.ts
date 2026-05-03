"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export type ProfileTab = "cerita" | "disimpan";

export interface Profile {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  location: string | null;
  image: string | null;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
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

export interface UseProfileReturn {
  // params
  username: string;

  // profile
  profile: Profile | null;
  loading: boolean;
  profileNotFound: boolean;

  // stats
  storiesCount: number;
  totalLikes: number;
  trailsVisited: number;
  followersCount: number;
  followingCount: number;

  // tabs & stories
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
  currentStories: Story[];
  storiesLoading: boolean;

  // follow
  isFollowing: boolean;
  followLoading: boolean;
  handleFollowToggle: () => Promise<void>;

  // derived
  isOwnProfile: boolean;
  session: any;

  // helpers
  getCoverImage: (story: Story) => string | undefined;
}

export function useProfile(): UseProfileReturn {
  const { data: session } = useSession();
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileNotFound, setProfileNotFound] = useState(false);

  const [storiesCount, setStoriesCount] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [trailsVisited, setTrailsVisited] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [activeTab, setActiveTab] = useState<ProfileTab>("cerita");
  const [stories, setStories] = useState<Story[]>([]);
  const [bookmarkedStories, setBookmarkedStories] = useState<Story[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const currentUserId = (session?.user as any)?.id;
  const isOwnProfile = currentUserId === profile?.id;

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setProfileNotFound(false);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (error || !data) {
        setProfileNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(data);

      // Fetch stats in parallel
      const storiesQuery = supabase
        .from("stories")
        .select("id, likes_count, trail_id", { count: "exact" })
        .eq("user_id", data.id)
        .eq("is_draft", false);

      if (currentUserId !== data.id) {
        storiesQuery.eq("is_private", false);
      }

      const [storiesRes, followersRes, followingRes] =
        await Promise.all([
          storiesQuery,
          supabase
            .from("follows")
            .select("id", { count: "exact" })
            .eq("following_id", data.id),
          supabase
            .from("follows")
            .select("id", { count: "exact" })
            .eq("follower_id", data.id),
        ]);

      setStoriesCount(storiesRes.count || 0);
      setTotalLikes(
        (storiesRes.data || []).reduce((sum: number, s: any) => sum + (s.likes_count || 0), 0),
      );
      const uniqueTrails = new Set(
        (storiesRes.data || []).map((t: any) => t.trail_id).filter(Boolean),
      );
      setTrailsVisited(uniqueTrails.size);
      setFollowersCount(followersRes.count || 0);
      setFollowingCount(followingRes.count || 0);

      // Check follow status
      if (currentUserId && currentUserId !== data.id) {
        const { data: followData } = await supabase
          .from("follows")
          .select("id")
          .eq("follower_id", currentUserId)
          .eq("following_id", data.id)
          .maybeSingle();

        setIsFollowing(!!followData);
      }

      setLoading(false);
    };

    if (username) {
      fetchProfile();
    }
  }, [username, currentUserId]);

  // Fetch stories for active tab
    const fetchStories = useCallback(async () => {
    if (!profile) return;

    setStoriesLoading(true);

    if (activeTab === "cerita") {
      let query = supabase
        .from("stories")
        .select(
          `id, title, slug, excerpt, difficulty, duration, mood, likes_count, comments_count, created_at, is_private, is_draft,
          trails:trail_id(name, location),
          story_images(image_url, display_order)`,
        )
        .eq("user_id", profile.id)
        .eq("is_draft", false);

      // Only show private stories if it's the owner's profile
      if (!isOwnProfile) {
        query = query.eq("is_private", false);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (!error && data) {
        setStories(
          data.map((s) => ({
            ...s,
            profiles: [
              {
                name: profile.name,
                username: profile.username,
                image: profile.image,
              },
            ],
            trails: Array.isArray(s.trails) ? s.trails : s.trails ? [s.trails] : null,
          })),
        );
      }
    } else {
      const { data, error } = await supabase
        .from("bookmarks")
        .select(
          `story_id, stories(id, title, slug, excerpt, difficulty, duration, mood, likes_count, comments_count, created_at, is_private, is_draft,
          profiles:user_id(name, username, image),
          trails:trail_id(name, location),
          story_images(image_url, display_order))`,
        )
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const parsed = data
          .filter((b: any) => b.stories !== null)
          .map((b: any) => {
            const s = b.stories;
            return {
              ...s,
              profiles: Array.isArray(s.profiles)
                ? s.profiles
                : s.profiles
                  ? [s.profiles]
                  : null,
              trails: Array.isArray(s.trails)
                ? s.trails
                : s.trails
                  ? [s.trails]
                  : null,
            } as Story;
          });
        setBookmarkedStories(parsed);
      }
    }

    setStoriesLoading(false);
  }, [profile, activeTab, isOwnProfile]);

  useEffect(() => {
    if (profile) {
      fetchStories();
    }
  }, [profile, activeTab, fetchStories]);

  // Follow / Unfollow toggle
  const handleFollowToggle = async () => {
    if (!profile || !currentUserId || followLoading) return;

    setFollowLoading(true);

    if (isFollowing) {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", profile.id);

      if (!error) {
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
      }
    } else {
      const { error } = await supabase.from("follows").insert({
        follower_id: currentUserId,
        following_id: profile.id,
      });

      if (!error) {
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    }

    setFollowLoading(false);
  };

  // Helper
  const getCoverImage = (story: Story) => {
    const sorted = story.story_images?.sort(
      (a, b) => a.display_order - b.display_order,
    );
    return sorted?.[0]?.image_url;
  };

  const currentStories = activeTab === "cerita" ? stories : bookmarkedStories;

  return {
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
  };
}
