import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import { useAlert } from "@/components/ui/use-alert";

export function useImageManager(initialImageUrls: string[] = []) {
  const { data: session } = useSession();
  const { showAlert } = useAlert();
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls);
  const imageUrlsRef = useRef<string[]>(initialImageUrls);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    imageUrlsRef.current = imageUrls;
  }, [imageUrls]);

  useEffect(() => {
    if (initialImageUrls.length > 0 && imageUrls.length === 0) {
      setImageUrls(initialImageUrls);
      imageUrlsRef.current = initialImageUrls;
    }
  }, [initialImageUrls]);

  const uploadImage = async (file: File) => {
    const userId = (session?.user as any)?.id;
    if (!userId) {
      showAlert({
        type: "error",
        title: "Unauthorized",
        message: "Anda harus login untuk mengupload gambar.",
      });
      return null;
    }

    // Validation
    if (!file.type.startsWith("image/")) {
      showAlert({
        type: "error",
        title: "File tidak valid",
        message: "Hanya file gambar yang diperbolehkan.",
      });
      return null;
    }

    if (file.size > 3 * 1024 * 1024) {
      showAlert({
        type: "error",
        title: "File terlalu besar",
        message: "Ukuran maksimal file adalah 3MB.",
      });
      return null;
    }

    if (imageUrlsRef.current.length >= 5) {
      showAlert({
        type: "error",
        title: "Batas tercapai",
        message: "Maksimal 5 gambar diperbolehkan.",
      });
      return null;
    }

    // Create local preview
    const previewUrl = URL.createObjectURL(file);
    setImageUrls((prev) => [...prev, previewUrl]);
    setIsUploading(true);

    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = `${userId}/${fileName}`;

    try {
      const { error } = await supabase.storage
        .from("rimbasmita")
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("rimbasmita")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      
      // Replace local preview with public URL
      setImageUrls((prev) => 
        prev.map((url) => (url === previewUrl ? publicUrl : url))
      );
      
      return publicUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      // Remove preview if upload failed
      setImageUrls((prev) => prev.filter((url) => url !== previewUrl));
      
      showAlert({
        type: "error",
        title: "Upload Gagal",
        message: error.message || "Terjadi kesalahan saat mengupload gambar.",
      });
      return null;
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      if (imageUrlsRef.current.length < 5) {
        await uploadImage(files[i]);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (!files) return;

      for (let i = 0; i < files.length; i++) {
        if (imageUrlsRef.current.length < 5) {
          await uploadImage(files[i]);
        }
      }
    },
    [imageUrls, session, showAlert],
  );

  return {
    imageUrls,
    setImageUrls,
    isDragging,
    isUploading,
    fileInputRef,
    handleFileChange,
    removeImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}

