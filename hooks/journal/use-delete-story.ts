import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface UseDeleteStoryProps {
  onDeleted: (storyId: string) => void;
}

export function useDeleteStory({ onDeleted }: UseDeleteStoryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (storyId: string) => {
    setDeletingId(storyId);
    setConfirmDeleteId(null);

    const { error } = await supabase.from("stories").delete().eq("id", storyId);

    if (error) {
      console.error("Error deleting story:", error);
    } else {
      onDeleted(storyId);
    }

    setDeletingId(null);
  };

  return {
    deletingId,
    confirmDeleteId,
    setConfirmDeleteId,
    handleDelete,
  };
}
