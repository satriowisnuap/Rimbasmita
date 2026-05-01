import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { generateSlug } from "@/lib/utils";

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
      const { data, error: insertError } = await supabase
        .from("stories")
        .insert({
          user_id: (session!.user as any).id,
          title: title.trim(),
          slug,
          content: content.trim(),
          excerpt: content.trim().substring(0, 200),
          trail_id: selectedTrail || null,
          difficulty: difficulty || null,
          duration: duration.trim() || null,
          elevation: elevation.trim() || null,
          mood: mood || null,
          tips: tips.trim() || null,
          warnings: warnings.trim() || null,
          is_private: isPrivate,
          is_draft: draft,
        })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === "23505") {
          setError(
            "A story with a similar title already exists. Please try a different title.",
          );
        } else {
          setError(`Failed to create story: ${insertError.message}`);
        }
        setIsSubmitting(false);
        return;
      }

      const storyId = data.id;

      if (tags.length > 0) {
        const { error: tagsError } = await supabase
          .from("story_tags")
          .insert(tags.map((tag) => ({ story_id: storyId, tag })));
        if (tagsError) console.error("Error inserting tags:", tagsError);
      }

      if (imageUrls.length > 0) {
        const { error: imagesError } = await supabase
          .from("story_images")
          .insert(
            imageUrls.map((url, index) => ({
              story_id: storyId,
              image_url: url,
              display_order: index,
            })),
          );
        if (imagesError) console.error("Error inserting images:", imagesError);
      }

      router.push(`/story/${slug}`);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, isDraft, error, setError, handleSubmit };
}
