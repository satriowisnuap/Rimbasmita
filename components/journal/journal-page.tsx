"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TabKey } from "@/constans/journal-config";
import { useJournalStories } from "@/hooks/journal/use-journal-stories";
import { useDeleteStory } from "@/hooks/journal/use-delete-story";
import { JournalHeroSection } from "@/components/journal/journal-hero-section";
import { JournalStoryList } from "@/components/journal/journal-story-list";
import { DeleteConfirmModal } from "@/components/journal/delete-confirm-modal";

export function JournalPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("private");

  const { privateStories, drafts, loading, removeStory } = useJournalStories();

  const { deletingId, confirmDeleteId, setConfirmDeleteId, handleDelete } =
    useDeleteStory({
      onDeleted: removeStory,
    });

  const currentStories = activeTab === "private" ? privateStories : drafts;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <JournalHeroSection
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        privateCount={privateStories.length}
        draftCount={drafts.length}
      />

      <JournalStoryList
        loading={loading}
        activeTab={activeTab}
        stories={currentStories}
        deletingId={deletingId}
        onDeleteClick={setConfirmDeleteId}
      />

      <DeleteConfirmModal
        confirmDeleteId={confirmDeleteId}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={handleDelete}
      />

      <Footer />
    </div>
  );
}
