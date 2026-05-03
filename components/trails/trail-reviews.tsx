"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Send, User, Trash2 } from "lucide-react";
import Image from "next/image";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    name: string;
    username: string;
    image: string | null;
  };
}

interface TrailReviewsProps {
  trailId: string;
}

export function TrailReviews({ trailId }: TrailReviewsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/trails/${trailId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [trailId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (rating === 0) {
      alert("Silakan pilih rating bintang");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/trails/${trailId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
        setRating(0);
        setComment("");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Star className="h-6 w-6 text-primary" />
          Ulasan Jalur
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-bold text-primary">{averageRating}</span>
            <span className="text-xs text-muted-foreground ml-1">({reviews.length} ulasan)</span>
          </div>
        )}
      </div>

      {/* Review Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 sm:p-8 border-primary/10"
      >
        <h3 className="text-lg font-bold mb-4">Bagikan Pengalamanmu</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating Anda</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    className={`h-8 w-8 transition-colors ${
                      (hoverRating || rating) >= star 
                        ? "text-primary fill-primary" 
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm font-semibold text-muted-foreground">
                {rating > 0 ? `${rating} dari 5 bintang` : "Pilih rating"}
              </span>
            </div>
          </div>

          {/* Comment input */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Komentar</span>
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ceritakan pengalamanmu mendaki jalur ini..."
                className="w-full min-h-[120px] glass rounded-2xl p-4 text-sm resize-none focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
              <button
                type="submit"
                disabled={submitting || rating === 0}
                className="absolute bottom-4 right-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
              >
                {submitting ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Kirim Ulasan
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 border-l-4 border-primary/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {review.profiles.image ? (
                      <Image 
                        src={review.profiles.image} 
                        alt={review.profiles.name} 
                        width={40} 
                        height={40} 
                        className="rounded-full object-cover ring-2 ring-primary/10"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-foreground">{review.profiles.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">@{review.profiles.username}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`h-3 w-3 ${review.rating >= s ? "text-primary fill-primary" : "text-muted-foreground/20"}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground leading-relaxed pl-1">
                    {review.comment}
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-12 glass rounded-3xl border-dashed border-2">
            <MessageSquare className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Belum ada ulasan untuk jalur ini.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Jadilah yang pertama berbagi pengalaman!</p>
          </div>
        )}
      </div>
    </div>
  );
}
