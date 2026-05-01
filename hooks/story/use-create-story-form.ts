import { useState } from "react";

export function useCreateStoryForm() {
  const [title, setTitle] = useState("");
  const [selectedTrail, setSelectedTrail] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState("");
  const [elevation, setElevation] = useState("");
  const [mood, setMood] = useState("");
  const [content, setContent] = useState("");
  const [tips, setTips] = useState("");
  const [warnings, setWarnings] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

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
