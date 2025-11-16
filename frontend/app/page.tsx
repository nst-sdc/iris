"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "../components/loading-screen";

// Dynamically import components to reduce initial load time
const Navigation = dynamic(() => import("../components/navigation"), {
  ssr: false,
  loading: () => <div className="h-20"></div>
});

const Hero = dynamic(() => import("../components/sections/hero"), {
  ssr: false,
  loading: () => <div className="min-h-screen"></div>
});

const AboutPreview = dynamic(() => import("../components/sections/about-preview"), {
  ssr: false,
  loading: () => <div className="min-h-screen"></div>
});

const FeaturesPreview = dynamic(() => import("../components/sections/features-preview"), {
  ssr: false,
  loading: () => <div className="min-h-screen"></div>
});

const CTASection = dynamic(() => import("../components/sections/cta-section"), {
  ssr: false,
  loading: () => <div className="min-h-screen"></div>
});

const Footer = dynamic(() => import("../components/sections/footer"), {
  ssr: false,
  loading: () => <div className="min-h-[300px]"></div>
});

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {loading && <LoadingScreen />}
      
      <main className="relative overflow-hidden">
        {/* Circuit pattern background */}
        <div className="circuit-bg"></div>
        
        {/* Navigation */}
        <Navigation />
        
        {/* Hero Section */}
        <Hero />
        
        {/* About Preview Section */}
        <AboutPreview />
        
        {/* Features Preview - Quick Links to all pages */}
        <FeaturesPreview />
        
        {/* Call to Action Section */}
        <CTASection />
        
        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
