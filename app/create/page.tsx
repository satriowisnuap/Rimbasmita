"use client";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CreateStoryForm } from "@/components/story/create-story-form";
import { AlertModal } from "@/components/ui/alert-modal";
import { useAlert } from "@/components/ui/use-alert";
import { motion } from "framer-motion";
import { Loader as Loader2, PenLine } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function CreateStoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { state: alert } = useAlert();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      <AlertModal
        open={!!alert?.open}
        type={alert?.type}
        title={alert?.title}
        message={alert?.message || ""}
      />

      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div {...fadeInUp} className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <PenLine className="h-4 w-4 text-primary" />

              <span className="text-sm font-medium text-foreground">
                Tulis Ceritamu
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
              <span className="text-foreground">Bagikan</span>{" "}
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                perjalananmu
              </span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              Setiap langkah di jalur pendakian memiliki cerita yang layak
              dikenang. Luangkan waktumu dan tulislah dari hati.
            </p>
          </motion.div>

          <CreateStoryForm />

          <div className="h-8" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
