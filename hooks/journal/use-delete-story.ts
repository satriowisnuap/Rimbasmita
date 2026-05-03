import { useState } from "react";
import { useAlert } from "@/components/ui/use-alert";

interface UseDeleteStoryProps {
  onDeleted: (storyId: string) => void;
}

export function useDeleteStory({ onDeleted }: UseDeleteStoryProps) {
  const { showAlert } = useAlert();
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
        showAlert({
          type: "success",
          title: "Cerita dihapus",
          message: "Cerita kamu telah berhasil dihapus secara permanen.",
        });
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
