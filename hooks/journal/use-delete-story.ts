import { useState } from "react";

interface UseDeleteStoryProps {
  onDeleted: (storyId: string) => void;
}

export function useDeleteStory({ onDeleted }: UseDeleteStoryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (storyId: string) => {
    setDeletingId(storyId);
    setConfirmDeleteId(null);

    try {
      const res = await fetch(`/api/journal/${storyId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete story");
      } else {
        onDeleted(storyId);
      }
    } catch (error) {
      console.error("Error deleting story:", error);
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
