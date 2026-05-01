"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Plus, X } from "lucide-react";
import Image from "next/image";

interface Props {
  imageUrls: string[];
  imageUrlInput: string;
  setImageUrlInput: (v: string) => void;
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleAddImageUrl: () => void;
  handleImageUrlKeyDown: (e: React.KeyboardEvent) => void;
  removeImage: (url: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
}

export function ImageSection({
  imageUrls,
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
}: Props) {
  return (
    <section className="glass rounded-2xl p-6">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
        <ImagePlus className="h-4 w-4 text-primary" />
        Images
      </label>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/40 hover:bg-card/30"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={() => {
            const url = prompt("Enter image URL:");
            if (
              url &&
              url.trim() &&
              !imageUrls.includes(url.trim()) &&
              imageUrls.length < 5
            ) {
              // handled via parent
            }
          }}
        />
        <ImagePlus
          className={`h-8 w-8 mx-auto mb-3 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground/60"}`}
        />
        <p
          className={`text-sm font-medium ${isDragging ? "text-primary" : "text-muted-foreground"}`}
        >
          {isDragging
            ? "Drop images here"
            : "Drag & drop images or click to add"}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Up to 5 images. Add image URLs for now.
        </p>
      </div>

      {/* URL Input */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={imageUrlInput}
          onChange={(e) => setImageUrlInput(e.target.value)}
          onKeyDown={handleImageUrlKeyDown}
          placeholder="Paste an image URL..."
          className="flex-1 bg-card/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
        <button
          type="button"
          onClick={handleAddImageUrl}
          disabled={
            !imageUrlInput.trim() ||
            imageUrls.includes(imageUrlInput.trim()) ||
            imageUrls.length >= 5
          }
          className="px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Image Previews */}
      <AnimatePresence>
        {imageUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4"
          >
            {imageUrls.map((url) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group rounded-xl overflow-hidden border border-border aspect-video"
              >
                <div className="relative w-full h-full bg-muted animate-pulse">
                  <Image
                    src={url || "/fallback.jpg"}
                    alt="Story image"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    onError={(e) => {
                      // optional fallback kalau gagal load
                      const img = e.target as HTMLImageElement;
                      img.src = "/fallback.jpg";
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
