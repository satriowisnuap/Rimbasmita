import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { JournalStory } from "@/constans/journal-config";

export function useJournalStories() {
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.id;

  const [publishedStories, setPublishedStories] = useState<JournalStory[]>([]);
  const [drafts, setDrafts] = useState<JournalStory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJournalStories = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch("/api/journal");
      if (!res.ok) {
        console.error("Failed to fetch journal stories");
        return;
      }

      const data = await res.json();
      setPublishedStories(data.publishedStories || []);
      setDrafts(data.drafts || []);
    } catch (error) {
      console.error("Error fetching journal stories:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (status !== "authenticated" || !userId) return;

    const fetchAll = async () => {
      setLoading(true);
      await fetchJournalStories();
      setLoading(false);
    };

    fetchAll();
  }, [status, userId, fetchJournalStories]);

  const removeStory = (storyId: string) => {
    setPublishedStories((prev) => prev.filter((s) => s.id !== storyId));
    setDrafts((prev) => prev.filter((s) => s.id !== storyId));
  };

  return { publishedStories, drafts, loading, removeStory };
}
