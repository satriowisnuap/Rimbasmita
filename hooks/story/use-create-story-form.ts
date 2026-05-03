import { useState, useEffect } from "react";

export interface InitialStoryData {
  title?: string;
  trail_id?: string;
  difficulty?: string;
  duration?: string;
  elevation?: string;
  mood?: string;
  content?: string;
  tips?: string;
  warnings?: string;
  is_private?: boolean;
  is_draft?: boolean;
}

export function useCreateStoryForm(initialData?: InitialStoryData) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [selectedTrail, setSelectedTrail] = useState(initialData?.trail_id || "");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "");
  const [duration, setDuration] = useState(initialData?.duration || "");
  const [elevation, setElevation] = useState(initialData?.elevation || "");
  const [mood, setMood] = useState(initialData?.mood || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [tips, setTips] = useState(initialData?.tips || "");
  const [warnings, setWarnings] = useState(initialData?.warnings || "");
  const [isPrivate, setIsPrivate] = useState(initialData?.is_private ?? false);
  const [isDraft, setIsDraft] = useState(initialData?.is_draft ?? false);

  useEffect(() => {
    if (initialData) {
      if (initialData.title !== undefined) setTitle(initialData.title);
      if (initialData.trail_id !== undefined) setSelectedTrail(initialData.trail_id);
      if (initialData.difficulty !== undefined) setDifficulty(initialData.difficulty);
      if (initialData.duration !== undefined) setDuration(initialData.duration);
      if (initialData.elevation !== undefined) setElevation(initialData.elevation);
      if (initialData.mood !== undefined) setMood(initialData.mood);
      if (initialData.content !== undefined) setContent(initialData.content);
      if (initialData.tips !== undefined) setTips(initialData.tips);
      if (initialData.warnings !== undefined) setWarnings(initialData.warnings);
      if (initialData.is_private !== undefined) setIsPrivate(initialData.is_private);
      if (initialData.is_draft !== undefined) setIsDraft(initialData.is_draft);
    }
  }, [initialData]);

  return {
    title,
    setTitle,
    selectedTrail,
    setSelectedTrail,
    difficulty,
    setDifficulty,
    duration,
    setDuration,
    elevation,
    setElevation,
    mood,
    setMood,
    content,
    setContent,
    tips,
    setTips,
    warnings,
    setWarnings,
    isPrivate,
    setIsPrivate,
    isDraft,
    setIsDraft,
  };
}
