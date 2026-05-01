import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { JournalStory } from "@/constans/journal-config";

export function useJournalStories() {
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;

  const [privateStories, setPrivateStories] = useState<JournalStory[]>([]);
  const [drafts, setDrafts] = useState<JournalStory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrivateStories = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("stories")
      .select(
        "id, title, slug, excerpt, mood, is_draft, is_private, created_at",
      )
      .eq("user_id", userId)
      .eq("is_private", true)
      .eq("is_draft", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching private stories:", error);
    } else {
      setPrivateStories(data || []);
    }
  }, [userId]);

  const fetchDrafts = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("stories")
      .select(
        "id, title, slug, excerpt, mood, is_draft, is_private, created_at",
      )
      .eq("user_id", userId)
      .eq("is_draft", true)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching drafts:", error);
    } else {
      setDrafts(data || []);
    }
  }, [userId]);

  useEffect(() => {
    if (status !== "authenticated" || !userId) return;

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchPrivateStories(), fetchDrafts()]);
      setLoading(false);
    };

    fetchAll();
  }, [status, userId, fetchPrivateStories, fetchDrafts]);

  const removeStory = (storyId: string) => {
    setPrivateStories((prev) => prev.filter((s) => s.id !== storyId));
    setDrafts((prev) => prev.filter((s) => s.id !== storyId));
  };

  return { privateStories, drafts, loading, removeStory };
}
