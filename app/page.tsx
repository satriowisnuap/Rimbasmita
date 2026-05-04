"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/homepage/page/hero-section";
import FeaturesSection from "@/components/homepage/page/features-section";
import TrailsSection from "@/components/homepage/page/trails-section";
import StorySection from "@/components/homepage/page/story-section";
import FinalCTASection from "@/components/homepage/page/final-cta-section";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const [stories, setStories] = useState<any[]>([]);
  const [trails, setTrails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const res = await fetch("/api/homepage");
        if (!res.ok) throw new Error("Failed to fetch homepage data");
        const data = await res.json();
        setStories(Array.isArray(data.stories) ? data.stories : []);
        setTrails(Array.isArray(data.trails) ? data.trails : []);
      } catch (err) {
        console.error("Homepage fetch error:", err);
        setStories([]);
        setTrails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection fadeInUp={fadeInUp} stagger={stagger} />
      <TrailsSection
        fadeInUp={fadeInUp}
        stagger={stagger}
        trails={trails}
        loading={loading}
      />
      <StorySection
        fadeInUp={fadeInUp}
        stagger={stagger}
        stories={stories}
        loading={loading}
      />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
