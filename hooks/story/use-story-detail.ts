"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { supabase } from "@/lib/supabase";

export interface StoryImage {
  id: string;
  image_url: string;
  caption?: string;
}

export interface StoryTag {
  id: string;
  tag: string;
}

export interface Profile {
  id: string;
  name: string;
  username: string;
  image?: string;
}

export interface Trail {
  id: string;
  name: string;
  location: string;
  elevation: number;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  content: string;
  difficulty: string;
  duration: string;
  mood: string;
  tips: string;
  warnings: string;
  likes_count: number;
  bookmarks_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  trail_id: string;
  profiles: Profile;
  trails: Trail;
  story_images: StoryImage[];
  story_tags: StoryTag[];
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    name: string;
    username: string;
    image?: string;
  };
}

export interface UseStoryDetailReturn {
  // data
  story: Story | null;
  comments: Comment[];
  loading: boolean;

  // interaction state
  isLiked: boolean;
  isBookmarked: boolean;
  likesCount: number;
  bookmarksCount: number;

  // comment state
  commentText: string;
  setCommentText: (text: string) => void;
  submittingComment: boolean;

  // gallery state
  galleryIndex: number;
  setGalleryIndex: (index: number) => void;

  // derived
  coverImage: string | null;
  galleryImages: StoryImage[];
  session: any;

  // handlers
  handleLikeToggle: () => Promise<void>;
  handleBookmarkToggle: () => Promise<void>;
  handleCommentSubmit: () => Promise<void>;
  formatTime: (dateStr: string) => string;
  handleBack: () => void;
}

export const difficultyColor: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  moderate:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  hard: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  extreme: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const moodEmoji: Record<string, string> = {
  peaceful: "Serene",
  adventurous: "Adventurous",
  reflective: "Reflective",
  exhilarated: "Exhilarated",
  grateful: "Grateful",
  challenged: "Challenged",
};

export function useStoryDetail(): UseStoryDetailReturn {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const slug = params.slug as string;

  const fetchStory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stories/${slug}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      
      const data = await res.json();
      
      setStory(data.story);
      setComments(data.comments || []);
      setLikesCount(data.story.likes_count || 0);
      setBookmarksCount(data.story.bookmarks_count || 0);
      
      if (session?.user) {
        setIsLiked(data.isLiked);
        setIsBookmarked(data.isBookmarked);
      }
    } catch {
      // Silently handle fetch errors
    } finally {
      setLoading(false);
    }
  }, [slug, session]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  const handleLikeToggle = async () => {
    if (!session?.user || !story) return;
    const userId = (session.user as any).id;

    try {
      if (isLiked) {
        await supabase
          .from("likes")
          .delete()
          .eq("story_id", story.id)
          .eq("user_id", userId);
        setLikesCount((c) => Math.max(0, c - 1));
      } else {
        await supabase
          .from("likes")
          .insert({ story_id: story.id, user_id: userId });
        setLikesCount((c) => c + 1);
      }

      await supabase
        .from("stories")
        .update({
          likes_count: isLiked ? Math.max(0, likesCount - 1) : likesCount + 1,
        })
        .eq("id", story.id);

      setIsLiked(!isLiked);
    } catch {
      // Silently handle errors
    }
  };

  const handleBookmarkToggle = async () => {
    if (!session?.user || !story) return;
    const userId = (session.user as any).id;

    try {
      if (isBookmarked) {
        await supabase
          .from("bookmarks")
          .delete()
          .eq("story_id", story.id)
          .eq("user_id", userId);
        setBookmarksCount((c) => Math.max(0, c - 1));
      } else {
        await supabase
          .from("bookmarks")
          .insert({ story_id: story.id, user_id: userId });
        setBookmarksCount((c) => c + 1);
      }

      await supabase
        .from("stories")
        .update({
          bookmarks_count: isBookmarked
            ? Math.max(0, bookmarksCount - 1)
            : bookmarksCount + 1,
        })
        .eq("id", story.id);

      setIsBookmarked(!isBookmarked);
    } catch {
      // Silently handle errors
    }
  };

  const handleCommentSubmit = async () => {
    if (!session?.user || !story || !commentText.trim()) return;
    const userId = (session.user as any).id;

    setSubmittingComment(true);
    try {
      const { data: newComment } = await supabase
        .from("comments")
        .insert({
          story_id: story.id,
          user_id: userId,
          content: commentText.trim(),
        })
        .select("*, profiles:user_id(name, username, image)")
        .single();

      if (newComment) {
        setComments((prev) => [...prev, newComment]);
        const newCount = (story.comments_count || 0) + 1;
        await supabase
          .from("stories")
          .update({ comments_count: newCount })
          .eq("id", story.id);
        setStory((prev) =>
          prev ? { ...prev, comments_count: newCount } : prev,
        );
        setCommentText("");
      }
    } catch {
      // Silently handle errors
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), {
        addSuffix: true,
        locale: idLocale,
      });
    } catch {
      return "";
    }
  };

  const handleBack = () => router.back();

  const coverImage = story?.story_images?.[0]?.image_url || null;
  const galleryImages = story?.story_images?.slice(1) || [];

  return {
    story,
    comments,
    loading,
    isLiked,
    isBookmarked,
    likesCount,
    bookmarksCount,
    commentText,
    setCommentText,
    submittingComment,
    galleryIndex,
    setGalleryIndex,
    coverImage,
    galleryImages,
    session,
    handleLikeToggle,
    handleBookmarkToggle,
    handleCommentSubmit,
    formatTime,
    handleBack,
  };
}
