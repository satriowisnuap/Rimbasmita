"use client";

import HeroSection from "@/components/homepage/page/hero-section";
import FeaturesSection from "@/components/homepage/page/features-section";
import TrailsSection from "@/components/homepage/page/trails-section";
import TestimonialsSection from "@/components/homepage/page/testimonials-section";
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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <HeroSection />
      {/* Featured Section */}
      <FeaturesSection fadeInUp={fadeInUp} stagger={stagger} />
      {/* Trails Section */}
      <TrailsSection fadeInUp={fadeInUp} stagger={stagger} />
      {/* Testimonials Section */}
      <TestimonialsSection fadeInUp={fadeInUp} stagger={stagger} />
      {/* Final CTA Section */}
      <FinalCTASection />
      <Footer />
    </div>
  );
}
