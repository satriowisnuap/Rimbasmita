"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";

interface Props {
  imageUrls: string[];
  isDragging: boolean;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (url: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
}

export function ImageSection({
  imageUrls,
  isDragging,
  isUploading,
  fileInputRef,
  handleFileChange,
  removeImage,
  handleDragOver,
  handleDragLeave,
  handleDrop,
}: Props) {
  return (
    <section className="glass rounded-2xl p-6">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
        <ImagePlus className="h-4 w-4 text-primary" />
        Gambar
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
          onChange={handleFileChange}
        />

        {isUploading ? (
          <Loader2 className="h-8 w-8 mx-auto mb-3 text-primary animate-spin" />
        ) : (
          <ImagePlus
            className={`h-8 w-8 mx-auto mb-3 transition-colors ${
              isDragging ? "text-primary" : "text-muted-foreground/60"
            }`}
          />
        )}

        <p
          className={`text-sm font-medium ${
            isDragging ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {isDragging
            ? "Lepaskan gambar di sini"
            : isUploading
            ? "Sedang mengupload..."
            : "Seret & lepas gambar atau klik untuk menambahkan"}
        </p>

        <p className="text-xs text-muted-foreground/60 mt-1">
          Maksimal 5 gambar (maks 3MB per file)
        </p>
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
                <div className="relative w-full h-full bg-muted">
                  <Image
                    src={url || "/fallback.jpg"}
                    alt="Gambar cerita"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.src.includes("fallback.jpg")) {
                        img.src = "/fallback.jpg";
                      }
                    }}
                  />
                  {url.startsWith("blob:") && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
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
