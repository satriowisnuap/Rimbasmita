"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, MapPin, AlignLeft, AtSign, Save, Loader as Loader2, Image as ImageIcon } from "lucide-react";
import { ErrorBanner } from "@/components/error-banner";

interface EditProfileFormProps {
  initialData: {
    name: string;
    username: string;
    bio: string | null;
    location: string | null;
    image: string | null;
  };
}

export function EditProfileForm({ initialData }: EditProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData.name);
  const [username, setUsername] = useState(initialData.username);
  const [bio, setBio] = useState(initialData.bio || "");
  const [location, setLocation] = useState(initialData.location || "");
  const [image, setImage] = useState(initialData.image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/profile/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, bio, location, image }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal memperbarui profil");
        return;
      }

      // Success
      router.push(`/profile/${username.toLowerCase()}`);
      router.refresh();
    } catch (err) {
      console.error("Update profile error:", err);
      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ErrorBanner error={error} onClose={() => setError("")} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-4">
          <div className="relative group">
            {image ? (
              <img
                src={image}
                alt="Profile Preview"
                className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/20"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-primary/20">
                <User className="h-10 w-10 text-primary" />
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                const url = prompt("Masukkan URL gambar profil baru:");
                if (url) setImage(url);
              }}
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
            >
              <ImageIcon className="h-6 w-6" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Klik gambar untuk mengubah URL foto profil
          </p>
        </div>

        {/* Basic Info */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <User className="h-4 w-4 text-primary" />
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                placeholder="Nama Anda"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <AtSign className="h-4 w-4 text-primary" />
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s+/g, "").toLowerCase())}
                required
                className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              Lokasi
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all"
              placeholder="Contoh: Bandung, Indonesia"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <AlignLeft className="h-4 w-4 text-primary" />
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full bg-card/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none transition-all resize-none"
              placeholder="Ceritakan sedikit tentang diri Anda..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 rounded-xl glass text-sm font-medium hover:bg-accent/50 transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
