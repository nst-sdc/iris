"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "../../components/loading-screen";

// Dynamically import components to reduce initial load time
const Navigation = dynamic(() => import("../../components/navigation"), {
  ssr: false,
  loading: () => <div className="h-20"></div>
});

const ProjectsPage = dynamic(() => import("../../components/pages/projects-page"), {
  ssr: false,
  loading: () => <div className="min-h-screen"></div>
});

const Footer = dynamic(() => import("../../components/sections/footer"), {
  ssr: false,
  loading: () => <div className="min-h-[300px]"></div>
});

export default function Projects() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
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
        
        {/* Projects Page Content */}
        <ProjectsPage />
        
        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
