"use client";

import { motion } from "framer-motion";
import { useCreateStoryForm } from "@/hooks/story/use-create-story-form";
import { useTrails } from "@/hooks/use-trails";
import { useTagManager } from "@/hooks/story/use-tag-manager";
import { useImageManager } from "@/hooks/story/use-image-manager";
import { useSubmitStory } from "@/hooks/story/use-submit-story";
import { ErrorBanner } from "@/components/error-banner";
import { TitleSection } from "@/components/story/title-section";
import { TrailDifficultySection } from "@/components/story/trail-difficult-section";
import { MoodSection } from "@/components/story/mood-section";
import { ContentSection } from "@/components/story/content-section";
import { TipsWarningsSection } from "@/components/story/tips-warning-section";
import { TagsSection } from "@/components/story/tags-section";
import { ImageSection } from "@/components/story/image-section";
import { PrivacyActionsSection } from "@/components/story/privacy-actions-section";

export function CreateStoryForm() {
  const form = useCreateStoryForm();
  const { trails, loading: loadingTrails } = useTrails();
  const tagManager = useTagManager();
  const imageManager = useImageManager();
  const { isSubmitting, isDraft, error, setError, handleSubmit } =
    useSubmitStory();

  const submitParams = {
    title: form.title,
    content: form.content,
    selectedTrail: form.selectedTrail,
    difficulty: form.difficulty,
    duration: form.duration,
    elevation: form.elevation,
    mood: form.mood,
    tips: form.tips,
    warnings: form.warnings,
    isPrivate: form.isPrivate,
    tags: tagManager.tags,
    imageUrls: imageManager.imageUrls,
  };

  return (
    <>
      <ErrorBanner error={error} onClose={() => setError("")} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-8"
      >
        <TitleSection title={form.title} setTitle={form.setTitle} />

        <TrailDifficultySection
          trails={trails}
          loadingTrails={loadingTrails}
          selectedTrail={form.selectedTrail}
          setSelectedTrail={form.setSelectedTrail}
          difficulty={form.difficulty}
          setDifficulty={form.setDifficulty}
          duration={form.duration}
          setDuration={form.setDuration}
          elevation={form.elevation}
          setElevation={form.setElevation}
        />

        <MoodSection mood={form.mood} setMood={form.setMood} />

        <ContentSection content={form.content} setContent={form.setContent} />

        <TipsWarningsSection
          tips={form.tips}
          setTips={form.setTips}
          warnings={form.warnings}
          setWarnings={form.setWarnings}
        />

        <TagsSection
          tags={tagManager.tags}
          tagInput={tagManager.tagInput}
          setTagInput={tagManager.setTagInput}
          handleAddTag={tagManager.handleAddTag}
          handleTagKeyDown={tagManager.handleTagKeyDown}
          removeTag={tagManager.removeTag}
        />

        <ImageSection
          imageUrls={imageManager.imageUrls}
          isDragging={imageManager.isDragging}
          isUploading={imageManager.isUploading}
          fileInputRef={imageManager.fileInputRef}
          handleFileChange={imageManager.handleFileChange}
          removeImage={imageManager.removeImage}
          handleDragOver={imageManager.handleDragOver}
          handleDragLeave={imageManager.handleDragLeave}
          handleDrop={imageManager.handleDrop}
        />

        <PrivacyActionsSection
          isPrivate={form.isPrivate}
          setIsPrivate={form.setIsPrivate}
          isSubmitting={isSubmitting}
          isDraft={isDraft}
          title={form.title}
          content={form.content}
          onSaveDraft={() => handleSubmit(true, submitParams)}
          onPublish={() => handleSubmit(false, submitParams)}
        />
      </motion.div>
    </>
  );
}
