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
    // Set a minimum loading time to allow the loading animation to complete
    const minLoadingTime = 2500; // Match the loading screen's internal timing
    const startTime = Date.now();
    
    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    };

    // Check if already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }
    
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);
  
  return (
    <>
      {loading && <LoadingScreen />}
      
      <main className="relative overflow-hidden bg-black">
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
