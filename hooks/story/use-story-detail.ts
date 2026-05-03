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
      
      setIsLiked(data.isLiked || false);
      setIsBookmarked(data.isBookmarked || false);
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
    
    // Optimistic UI update
    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;
    
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? Math.max(0, likesCount - 1) : likesCount + 1);

    try {
      const res = await fetch(`/api/stories/${slug}/like`, { method: "POST" });
      if (!res.ok) {
        // Revert on error
        setIsLiked(previousIsLiked);
        setLikesCount(previousLikesCount);
      }
    } catch {
      // Revert on error
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!session?.user || !story) return;

    // Optimistic UI update
    const previousIsBookmarked = isBookmarked;
    const previousBookmarksCount = bookmarksCount;

    setIsBookmarked(!isBookmarked);
    setBookmarksCount(isBookmarked ? Math.max(0, bookmarksCount - 1) : bookmarksCount + 1);

    try {
      const res = await fetch(`/api/stories/${slug}/bookmark`, { method: "POST" });
      if (!res.ok) {
        // Revert on error
        setIsBookmarked(previousIsBookmarked);
        setBookmarksCount(previousBookmarksCount);
      }
    } catch {
      // Revert on error
      setIsBookmarked(previousIsBookmarked);
      setBookmarksCount(previousBookmarksCount);
    }
  };

  const handleCommentSubmit = async () => {
    if (!session?.user || !story || !commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/stories/${slug}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        const newComment = data.comment;
        
        if (newComment) {
          setComments((prev) => [...prev, newComment]);
          const newCount = (story.comments_count || 0) + 1;
          setStory((prev) =>
            prev ? { ...prev, comments_count: newCount } : prev,
          );
          setCommentText("");
        }
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
