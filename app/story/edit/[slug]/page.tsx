"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { PenLine, Loader as Loader2, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EditStoryForm } from "@/components/story/edit-story-form";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function EditStoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [storyData, setStoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStory = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/stories/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to fetch story");
          return;
        }

        // Check ownership
        if (session && data.story.user_id !== (session.user as any).id) {
          setError("You don't have permission to edit this story.");
          return;
        }

        // Prepare data for the form
        const formattedData = {
          title: data.story.title,
          trail_id: data.story.trail_id || "",
          difficulty: data.story.difficulty || "",
          duration: data.story.duration || "",
          elevation: data.story.elevation || "",
          mood: data.story.mood || "",
          content: data.story.content || "",
          tips: data.story.tips || "",
          warnings: data.story.warnings || "",
          is_private: data.story.is_private,
          is_draft: data.story.is_draft,
          tags: data.story.story_tags?.map((t: any) => t.tag) || [],
          imageUrls: data.story.story_images?.map((img: any) => img.image_url) || [],
        };

        setStoryData(formattedData);
      } catch (err) {
        console.error("Error fetching story:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && slug) {
      fetchStory();
    }
  }, [slug, status, session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-16 px-4">
          <div className="max-w-md mx-auto text-center glass p-8 rounded-3xl">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium"
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session || !storyData) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div {...fadeInUp} className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <PenLine className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Edit Your Story
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Update your journey
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              Refine your words, add more details, or update the photos of your adventure.
            </p>
          </motion.div>

          <EditStoryForm slug={slug} initialData={storyData} />

          <div className="h-8" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
