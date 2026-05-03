"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StoryCard } from "@/components/story-card";
import { 
  Mountain, 
  MapPin, 
  Clock, 
  ArrowUp, 
  BookOpen, 
  ArrowLeft,
  ChevronRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Trail {
  id: string;
  name: string;
  location: string;
  region: string;
  elevation: number;
  difficulty: string;
  description: string;
  estimated_duration: string;
  image: string;
  stories: any[];
}

const difficultyLabels: Record<string, string> = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  hard: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export default function TrailDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrail = async () => {
      try {
        const res = await fetch(`/api/trails/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch trail");
        const data = await res.json();
        setTrail(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTrail();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 flex flex-col items-center justify-center">
          <Mountain className="h-12 w-12 text-primary animate-pulse mb-4" />
          <p className="text-muted-foreground animate-pulse">Memuat jalur...</p>
        </div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 text-center">
          <h2 className="text-2xl font-bold">Jalur tidak ditemukan</h2>
          <Link href="/explore" className="text-primary hover:underline mt-4 inline-block">
            Kembali ke Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <div className="relative h-[400px] sm:h-[500px] w-full overflow-hidden">
          <img 
            src={trail.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070"} 
            alt={trail.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-2">
                  <Link 
                    href="/explore"
                    className="flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Explore
                  </Link>
                  <ChevronRight className="h-3 w-3 text-white/40" />
                  <span className="text-xs font-medium text-white/60">Detail Jalur</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${difficultyColors[trail.difficulty] || ''}`}>
                    {difficultyLabels[trail.difficulty] || trail.difficulty}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase border border-white/10">
                    <BookOpen className="h-3 w-3" />
                    {trail.stories.length} Cerita
                  </span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                  {trail.name}
                </h1>

                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">{trail.location}{trail.region ? `, ${trail.region}` : ''}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Trail Info Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 -mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Description */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: ArrowUp, label: "Ketinggian", value: `${trail.elevation.toLocaleString()} mdpl` },
                  { icon: Clock, label: "Estimasi", value: trail.estimated_duration || "-" },
                  { icon: Info, label: "Kesulitan", value: difficultyLabels[trail.difficulty] || trail.difficulty },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="glass rounded-3xl p-6 flex flex-col items-center text-center gap-2 border-primary/5"
                  >
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                    <span className="text-sm sm:text-base font-bold text-foreground">{stat.value}</span>
                  </motion.div>
                ))}
              </div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-3xl p-8 sm:p-10"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Info className="h-6 w-6 text-primary" />
                  Tentang Jalur
                </h2>
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
                    {trail.description || "Belum ada deskripsi untuk jalur ini."}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Community Stories */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Cerita Pendaki
                </h2>
                <span className="text-sm font-medium text-muted-foreground bg-accent/50 px-3 py-1 rounded-full">
                  {trail.stories.length}
                </span>
              </div>

              <div className="space-y-6">
                {trail.stories.length > 0 ? (
                  trail.stories.map((story, i) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <StoryCard 
                        id={story.id}
                        slug={story.slug}
                        title={story.title}
                        excerpt={story.excerpt || ""}
                        coverImage={story.story_images?.[0]?.image_url}
                        author={{
                          name: story.profiles?.name || "Anonim",
                          username: story.profiles?.username || "",
                          image: story.profiles?.image || undefined
                        }}
                        trail={{
                          name: trail.name,
                          location: trail.location
                        }}
                        difficulty={story.difficulty || undefined}
                        duration={story.duration || undefined}
                        mood={story.mood || undefined}
                        likesCount={story.likes_count}
                        commentsCount={story.comments_count}
                        createdAt={story.created_at}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="glass rounded-3xl p-10 text-center">
                    <BookOpen className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Belum ada cerita pendaki untuk jalur ini. Jadilah yang pertama!</p>
                    <Link href="/create" className="text-primary font-bold text-sm mt-4 inline-block hover:underline">
                      Tulis Cerita
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
