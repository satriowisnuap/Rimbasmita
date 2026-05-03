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
  is_private: boolean;
  is_draft: boolean;
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
  const { data: session, status: sessionStatus } = useSession();
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
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const fetchProfileData = useCallback(async () => {
    if (!username) return;

    try {
      setLoading(true);
      setStoriesLoading(true);
      
      const res = await fetch(`/api/profile/${username}`);
      if (res.status === 404) {
        setProfileNotFound(true);
        setLoading(false);
        return;
      }
      
      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      
      setProfile(data.profile);
      setStoriesCount(data.stats.storiesCount);
      setTotalLikes(data.stats.totalLikes);
      setTrailsVisited(data.stats.trailsVisited);
      setFollowersCount(data.stats.followersCount);
      setFollowingCount(data.stats.followingCount);
      setIsFollowing(data.isFollowing);
      setIsOwnProfile(data.isOwnProfile);
      
      // Parse stories to match the expected interface (array wrapping for consistency)
      const parseStories = (stories: any[]) => stories.map(s => ({
        ...s,
        profiles: s.profiles ? (Array.isArray(s.profiles) ? s.profiles : [s.profiles]) : null,
        trails: s.trails ? (Array.isArray(s.trails) ? s.trails : [s.trails]) : null,
      }));

      setStories(parseStories(data.stories || []));
      setBookmarkedStories(parseStories(data.bookmarkedStories || []));
      
      setProfileNotFound(false);
    } catch (error) {
      console.error("Error in fetchProfileData:", error);
    } finally {
      setLoading(false);
      setStoriesLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (sessionStatus !== "loading") {
      fetchProfileData();
    }
  }, [username, sessionStatus, fetchProfileData]);

  // Follow / Unfollow toggle
  const handleFollowToggle = async () => {
    if (!profile || !session?.user || followLoading) return;

    setFollowLoading(true);

    try {
      if (isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", (session.user as any).id)
          .eq("following_id", profile.id);

        if (!error) {
          setIsFollowing(false);
          setFollowersCount((prev) => prev - 1);
        }
      } else {
        const { error } = await supabase.from("follows").insert({
          follower_id: (session.user as any).id,
          following_id: profile.id,
        });

        if (!error) {
          setIsFollowing(true);
          setFollowersCount((prev) => prev + 1);
        }
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
    } finally {
      setFollowLoading(false);
    }
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
