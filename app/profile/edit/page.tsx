"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Loader as Loader2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EditProfileForm } from "@/components/profile/edit-profile-form";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;
      
      try {
        setLoading(true);
        // Using dashboard API to get personal profile data
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        
        if (res.ok) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session || !profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div {...fadeInUp} className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Pengaturan Profil
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Edit Profil Anda
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Perbarui informasi diri Anda agar teman-teman pendaki lainnya mengenal Anda lebih baik.
            </p>
          </motion.div>

          <EditProfileForm initialData={profile} />

          <div className="h-8" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
