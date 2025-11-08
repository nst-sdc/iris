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

const About = dynamic(() => import("../components/sections/about"), {
  ssr: false,
  loading: () => <div className="min-h-screen"></div>
});

const Projects = dynamic(() => import("../components/sections/projects"), {
  ssr: false,
  loading: () => <div className="min-h-screen"></div>
});

const Events = dynamic(() => import("../components/sections/events"), {
  ssr: false,
  loading: () => <div className="min-h-screen"></div>
});

const Blog = dynamic(() => import("../components/sections/blog"), {
  ssr: false,
  loading: () => <div className="min-h-screen"></div>
});

const Gallery = dynamic(() => import("../components/sections/gallery"), {
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
        
        {/* About Section */}
        <About />
        
        {/* Projects Section */}
        <Projects />
        
        {/* Events Section */}
        <Events />
        
        {/* Blog Section */}
        <Blog />
        
        {/* Gallery Section */}
        <Gallery />
        
        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
