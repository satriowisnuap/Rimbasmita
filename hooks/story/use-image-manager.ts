import { useState, useCallback, useRef, useEffect } from "react";

export function useImageManager(initialImageUrls: string[] = []) {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialImageUrls.length > 0 && imageUrls.length === 0) {
      setImageUrls(initialImageUrls);
    }
  }, [initialImageUrls]);

  const handleAddImageUrl = useCallback(() => {
    const trimmed = imageUrlInput.trim();
    if (trimmed && !imageUrls.includes(trimmed) && imageUrls.length < 5) {
      setImageUrls((prev) => [...prev, trimmed]);
      setImageUrlInput("");
    }
  }, [imageUrlInput, imageUrls]);

  const handleImageUrlKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddImageUrl();
      }
    },
    [handleAddImageUrl],
  );

  const removeImage = useCallback((url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const url = prompt("Enter image URL:");
      if (
        url &&
        url.trim() &&
        !imageUrls.includes(url.trim()) &&
        imageUrls.length < 5
      ) {
        setImageUrls((prev) => [...prev, url.trim()]);
      }
    },
    [imageUrls],
  );

  return {
    imageUrls,
    setImageUrls,
    imageUrlInput,
    setImageUrlInput,
    isDragging,
    fileInputRef,
    handleAddImageUrl,
    handleImageUrlKeyDown,
    removeImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
