import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import { useAlert } from "@/components/ui/use-alert";

interface SubmitParams {
  title: string;
  content: string;
  selectedTrail: string;
  difficulty: string;
  duration: string;
  elevation: string;
  mood: string;
  tips: string;
  warnings: string;
  isPrivate: boolean;
  tags: string[];
  imageUrls: string[];
}

export function useSubmitStory() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (draft: boolean, params: SubmitParams) => {
    const {
      title,
      content,
      selectedTrail,
      difficulty,
      duration,
      elevation,
      mood,
      tips,
      warnings,
      isPrivate,
      tags,
      imageUrls,
    } = params;

    if (!(session?.user as any)?.id) {
      setError("You must be logged in to create a story.");
      return;
    }
    if (!title.trim()) {
      setError("Please add a title for your story.");
      return;
    }
    if (!content.trim()) {
      setError("Please write some content for your story.");
      return;
    }

    setIsDraft(draft);
    setIsSubmitting(true);
    setError("");

    const slug = generateSlug(title);

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          selectedTrail: selectedTrail || null,
          difficulty: difficulty || null,
          duration: duration.trim() || null,
          elevation: elevation.trim() || null,
          mood: mood || null,
          tips: tips.trim() || null,
          warnings: warnings.trim() || null,
          isPrivate: isPrivate,
          isDraft: draft,
          tags: tags,
          imageUrls: imageUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create story");
        showAlert({
          type: "error",
          title: "Gagal",
          message: data.error || "Gagal menerbitkan cerita. Silakan coba lagi.",
        });
        setIsSubmitting(false);
        return;
      }

      showAlert({
        type: "success",
        title: draft ? "Draft disimpan" : "Cerita terbit",
        message: draft 
          ? "Cerita kamu telah disimpan sebagai draft." 
          : "Cerita kamu berhasil diterbitkan dan dapat dilihat oleh publik.",
      });

      router.push(`/story/${slug}`);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (slug: string, draft: boolean, params: SubmitParams) => {
    const {
      title,
      content,
      selectedTrail,
      difficulty,
      duration,
      elevation,
      mood,
      tips,
      warnings,
      isPrivate,
      tags,
      imageUrls,
    } = params;

    if (!(session?.user as any)?.id) {
      setError("You must be logged in to update a story.");
      return;
    }
    if (!title.trim()) {
      setError("Please add a title for your story.");
      return;
    }

    setIsDraft(draft);
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/stories/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          selectedTrail: selectedTrail || null,
          difficulty: difficulty || null,
          duration: duration.trim() || null,
          elevation: elevation.trim() || null,
          mood: mood || null,
          tips: tips.trim() || null,
          warnings: warnings.trim() || null,
          isPrivate: isPrivate,
          isDraft: draft,
          tags: tags,
          imageUrls: imageUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update story");
        showAlert({
          type: "error",
          title: "Gagal",
          message: data.error || "Gagal memperbarui cerita. Silakan coba lagi.",
        });
        setIsSubmitting(false);
        return;
      }

      showAlert({
        type: "success",
        title: draft ? "Draft diperbarui" : "Cerita diperbarui",
        message: draft 
          ? "Draft cerita kamu telah diperbarui." 
          : "Cerita kamu berhasil diperbarui.",
      });

      router.push(`/story/${slug}`);
      router.refresh();
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, isDraft, error, setError, handleSubmit, handleUpdate };
}
