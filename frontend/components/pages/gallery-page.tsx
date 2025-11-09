"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";
import { galleryData, videoData, GalleryItem, VideoItem } from "../../data/gallery-data";
import ParticlesBackground from "../ui/particles-background";

// Define gallery filter categories
type GalleryCategory = 'All' | 'Events' | 'Projects' | 'Members' | 'Behind The Scenes';

// Lightbox state interface
interface LightboxState {
  isOpen: boolean;
  currentItem: GalleryItem | null;
  currentIndex: number;
}

export default function GalleryPage() {
  // State for filtering and display
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>(galleryData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    currentItem: null,
    currentIndex: -1
  });
  
  // Refs for animations
  const heroRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  
  // Filter gallery items based on category
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(galleryData);
    } else {
      setFilteredItems(galleryData.filter(item => item.category === activeCategory));
    }
  }, [activeCategory]);
  
  // Initialize GSAP animations
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Initialize animations after loading
      initAnimations();
    }, 800);
    
    return () => {
      clearTimeout(timer);
      // Kill all ScrollTriggers on component unmount
      ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
    };
  }, []);
  
  // Re-initialize animations when filtered items change
  useEffect(() => {
    if (!isLoading) {
      // Small timeout to ensure DOM is updated
      const timer = setTimeout(() => {
        // Reset scroll triggers
        ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
        // Reinitialize animations
        initAnimations();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [filteredItems, isLoading]);
  
  // Initialize animations
  const initAnimations = () => {
    // Hero section parallax effect
    if (heroRef.current) {
      gsap.to(".parallax-bg", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: (i: number, target: Element) => -ScrollTrigger.maxScroll(window) * parseFloat((target as HTMLElement).dataset.speed || "0.2"),
        ease: "none"
      });
      
      // Hero text animation
      gsap.from(".hero-title", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 80%",
          end: "center center",
          scrub: true
        },
        y: 50,
        opacity: 0,
        duration: 1
      });
      
      gsap.from(".hero-subtitle", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 70%",
          end: "center center",
          scrub: true
        },
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2
      });
    }
    
    // Gallery items animation
    if (galleryRef.current) {
      gsap.from(".gallery-item", {
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 85%"
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      });
    }
    
    // Video carousel animation
    if (videoRef.current) {
      gsap.from(".video-item", {
        scrollTrigger: {
          trigger: videoRef.current,
          start: "top 85%"
        },
        x: -50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
      });
    }
    
    // Animate floating text labels
    gsap.utils.toArray(".floating-label").forEach((label: any, i: number) => {
      gsap.to(label, {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: true
        },
        y: (i % 2 === 0) ? "20vh" : "-20vh",
        ease: "none"
      });
    });
    
    // Initialize particle animation
    initParticles();
  };
  
  // Initialize particle animation
  const initParticles = () => {
    if (!particlesRef.current) return;
    
    // This would typically be implemented with a canvas-based animation
    // For now, we'll use a simple GSAP animation on pre-created particle divs
    gsap.utils.toArray(".particle").forEach((particle: any) => {
      gsap.to(particle, {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        opacity: "random(0.1, 0.5)",
        duration: "random(10, 20)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  };
  
  // Handle category filter change
  const handleCategoryChange = (category: GalleryCategory) => {
    setActiveCategory(category);
  };
  
  // Open lightbox with selected item
  const openLightbox = (item: GalleryItem) => {
    const index = filteredItems.findIndex(i => i.id === item.id);
    setLightbox({
      isOpen: true,
      currentItem: item,
      currentIndex: index
    });
    
    // Disable body scroll when lightbox is open
    document.body.style.overflow = "hidden";
  };
  
  // Close lightbox
  const closeLightbox = () => {
    setLightbox({
      isOpen: false,
      currentItem: null,
      currentIndex: -1
    });
    
    // Re-enable body scroll
    document.body.style.overflow = "auto";
  };
  
  // Navigate to next item in lightbox
  const nextItem = () => {
    if (lightbox.currentIndex < filteredItems.length - 1) {
      const nextIndex = lightbox.currentIndex + 1;
      setLightbox({
        ...lightbox,
        currentItem: filteredItems[nextIndex],
        currentIndex: nextIndex
      });
    }
  };
  
  // Navigate to previous item in lightbox
  const prevItem = () => {
    if (lightbox.currentIndex > 0) {
      const prevIndex = lightbox.currentIndex - 1;
      setLightbox({
        ...lightbox,
        currentItem: filteredItems[prevIndex],
        currentIndex: prevIndex
      });
    }
  };
  
  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox.isOpen) return;
      
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowRight":
          nextItem();
          break;
        case "ArrowLeft":
          prevItem();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);
  
  // Create particles for background effect
  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push(
        <div
          key={`particle-${i}`}
          className="particle absolute rounded-full bg-primary/20"
          style={{
            width: `${Math.random() * 10 + 2}px`,
            height: `${Math.random() * 10 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5
          }}
        ></div>
      );
    }
    return particles;
  };

  return (
    <>
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 z-50 bg-dark flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="w-16 h-16 mb-4 mx-auto relative">
                <motion.div 
                  className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-2 rounded-full border-b-2 border-l-2 border-secondary"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <p className="text-gray-300 text-sm">Loading gallery...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating text labels */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-label absolute left-[10%] top-[30%] text-6xl font-bold text-primary/5">Innovation</div>
        <div className="floating-label absolute right-[5%] top-[50%] text-6xl font-bold text-secondary/5">Engineering</div>
        <div className="floating-label absolute left-[15%] top-[70%] text-6xl font-bold text-primary/5">AI</div>
        <div className="floating-label absolute right-[10%] top-[20%] text-6xl font-bold text-secondary/5">Collaboration</div>
      </div>
      
      {/* Particle background */}
      <ParticlesBackground count={40} color="#00F5FF" />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Parallax background layers */}
        <div className="absolute inset-0 z-0">
          <div className="parallax-bg absolute inset-0 bg-circuit-pattern opacity-10" data-speed="0.2"></div>
          <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-dark-100/0 to-dark-100 z-10"></div>
        </div>
        
        {/* Content */}
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-glow-cyan">Gallery of</span>{" "}
              <span className="gradient-text">Innovation</span>
            </h1>
            <p className="hero-subtitle text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Snapshots of creativity, passion, and progress.
            </p>
            
            {/* Hero animation placeholder */}
            <div className="hero-animation h-64 relative mb-12">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-2 border-primary animate-pulse"></div>
                <div className="w-64 h-64 rounded-full border border-secondary absolute animate-ping opacity-20"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Filter Section */}
      <section className="py-8 bg-dark-100 sticky top-0 z-30">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {['All', 'Events', 'Projects', 'Members', 'Behind The Scenes'].map((category) => (
              <motion.button
                key={category}
                onClick={() => handleCategoryChange(category as GalleryCategory)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-primary to-secondary text-dark shadow-neon-glow"
                    : "bg-dark-300 text-gray-300 hover:bg-dark-200"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Gallery Masonry Grid */}
      <section className="py-16 bg-dark-50">
        <div className="container-custom">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">
                {activeCategory === 'All' ? 'All Gallery Items' : activeCategory}
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
            <p className="text-gray-300 max-w-3xl mx-auto">
              {activeCategory === 'All' 
                ? 'Explore our complete collection of moments and milestones' 
                : `Browse our ${activeCategory.toLowerCase()} gallery`}
            </p>
          </motion.div>
          
          {/* Masonry grid */}
          <div 
            ref={galleryRef} 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                className={`gallery-item glass-card rounded-xl overflow-hidden cursor-pointer group ${
                  // Make featured items span 2 columns on larger screens
                  item.featured ? 'md:col-span-2' : ''
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => openLightbox(item)}
              >
                <div className="relative aspect-video overflow-hidden">
                  {/* Placeholder for image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-white/50">{item.title}</span>
                  </div>
                  {/* Uncomment when images are available */}
                  {/* <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  /> */}
                  
                  {/* Overlay with info */}
                  <div className="absolute inset-0 bg-dark/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-300">{item.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Video Highlights Carousel */}
      <section className="py-20 bg-dark-100">
        <div className="container-custom">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-glow-cyan">Video</span>{" "}
              <span className="gradient-text">Highlights</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Watch our robotics journey unfold through these featured videos
            </p>
          </motion.div>
          
          {/* Video carousel */}
          <div 
            ref={videoRef}
            className="flex overflow-x-auto pb-8 space-x-6 snap-x"
          >
            {videoData.map((video, index) => (
              <motion.div
                key={video.id}
                className="video-item flex-shrink-0 w-full md:w-[500px] snap-center glass-card rounded-xl overflow-hidden"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative aspect-video overflow-hidden">
                  {/* Placeholder for video thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-white/50">{video.title}</span>
                  </div>
                  {/* Uncomment when thumbnails are available */}
                  {/* <Image 
                    src={video.thumbnail} 
                    alt={video.title}
                    fill
                    className="object-cover"
                  /> */}
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-dark">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-300">{video.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox.isOpen && lightbox.currentItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-300 flex items-center justify-center text-gray-400 hover:text-white z-10"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Navigation buttons */}
              {lightbox.currentIndex > 0 && (
                <button
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    prevItem();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-dark-300 flex items-center justify-center text-gray-400 hover:text-white z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
              )}
              
              {lightbox.currentIndex < filteredItems.length - 1 && (
                <button
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    nextItem();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-dark-300 flex items-center justify-center text-gray-400 hover:text-white z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              )}
              
              {/* Image container with animated border */}
              <div className="relative rounded-xl overflow-hidden">
                <motion.div
                  className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-secondary opacity-70"
                  animate={{ 
                    background: ["linear-gradient(to right, #00F5FF, #8B5CF6)", "linear-gradient(to right, #8B5CF6, #00F5FF)"]
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                ></motion.div>
                
                <div className="relative rounded-xl overflow-hidden bg-dark">
                  {/* Placeholder for image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white/50">{lightbox.currentItem.title}</span>
                  </div>
                  {/* Uncomment when images are available */}
                  {/* <Image 
                    src={lightbox.currentItem.image} 
                    alt={lightbox.currentItem.title}
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                  /> */}
                </div>
              </div>
              
              {/* Image details */}
              <div className="bg-dark-100 p-6 rounded-b-xl">
                <h3 className="text-2xl font-bold text-white mb-2">{lightbox.currentItem.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{lightbox.currentItem.category} • {lightbox.currentItem.date}</p>
                <p className="text-gray-300">{lightbox.currentItem.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
