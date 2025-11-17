"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

const headerVariants = {
  hidden: { 
    opacity: 0,
    y: -50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8
    }
  }
};

const textVariants = {
  hidden: { 
    opacity: 0,
    x: -20
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6
    }
  })
};

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
  
  // Filter gallery items based on category
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(galleryData);
    } else {
      setFilteredItems(galleryData.filter(item => item.category === activeCategory));
    }
  }, [activeCategory]);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
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
        {[
          { text: "Innovation", position: "left-[10%] top-[30%]", delay: 0 },
          { text: "Engineering", position: "right-[5%] top-[50%]", delay: 0.2 },
          { text: "AI", position: "left-[15%] top-[70%]", delay: 0.4 },
          { text: "Collaboration", position: "right-[10%] top-[20%]", delay: 0.6 }
        ].map((label, index) => (
          <motion.div
            key={label.text}
            className={`absolute ${label.position} text-6xl font-bold text-primary/5`}
            animate={{
              y: [0, index % 2 === 0 ? 50 : -50, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: label.delay
            }}
          >
            {label.text}
          </motion.div>
        ))}
      </div>
      
      {/* Particle background */}
      <ParticlesBackground count={40} color="#00F5FF" />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background layers */}
        <motion.div 
          className="absolute inset-0 z-0 bg-circuit-pattern opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-dark-100/0 to-dark-100"></div>
        
        {/* Content */}
        <div className="container-custom relative z-10">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span 
                className="text-glow-cyan inline-block"
                variants={textVariants}
                custom={0}
              >
                Gallery of
              </motion.span>
              <span className="inline-block mx-2"> </span>
              <motion.span 
                className="gradient-text inline-block"
                variants={textVariants}
                custom={1}
              >
                Innovation
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Snapshots of creativity, passion, and progress.
            </motion.p>
            
            {/* Hero animation placeholder */}
            <motion.div 
              className="h-64 relative mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-32 h-32 rounded-full border-2 border-primary"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="w-64 h-64 rounded-full border border-secondary absolute opacity-20"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Filter Section */}
      <section className="py-8 bg-dark-100 sticky top-0 z-30">
        <div className="container-custom">
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {['All', 'Events', 'Projects', 'Members', 'Behind The Scenes'].map((category) => (
              <motion.button
                key={category}
                onClick={() => handleCategoryChange(category as GalleryCategory)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-white text-black hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]"
                    : "bg-zinc-800/50 text-gray-300 border border-zinc-700/50 hover:bg-zinc-700/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                }`}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Gallery Masonry Grid */}
      <section className="py-16 bg-dark-50">
        <div className="container-custom">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              duration: 0.8 
            }}
            className="mb-12 text-center"
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="gradient-text">
                {activeCategory === 'All' ? 'All Gallery Items' : activeCategory}
              </span>
            </motion.h2>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 96, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            ></motion.div>
            <motion.p 
              className="text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {activeCategory === 'All' 
                ? 'Explore our complete collection of moments and milestones' 
                : `Browse our ${activeCategory.toLowerCase()} gallery`}
            </motion.p>
          </motion.div>
          
          {/* Masonry grid */}
          <motion.div 
            key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  className={`glass-card rounded-xl overflow-hidden cursor-pointer group ${
                    // Make featured items span 2 columns on larger screens
                    item.featured ? 'md:col-span-2' : ''
                  }`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openLightbox(item)}
                >
                <motion.div 
                  className="relative aspect-video overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Placeholder for image */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                    animate={{
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.span 
                      className="text-xl font-bold text-white/50"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {item.title}
                    </motion.span>
                  </motion.div>
                  {/* Uncomment when images are available */}
                  {/* <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    className="object-cover"
                  /> */}
                  
                  {/* Overlay with info */}
                  <div className="absolute inset-0 bg-dark/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-300">{item.category}</p>
                  </div>
                </motion.div>
              </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      
      {/* Video Highlights Carousel */}
      <section className="py-20 bg-dark-100">
        <div className="container-custom">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              duration: 0.8 
            }}
            className="mb-12 text-center"
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="text-glow-cyan">Video</span>{" "}
              <span className="gradient-text">Highlights</span>
            </motion.h2>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 96, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            ></motion.div>
            <motion.p 
              className="text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Watch our robotics journey unfold through these featured videos
            </motion.p>
          </motion.div>
          
          {/* Video carousel */}
          <motion.div 
            className="flex overflow-x-auto pb-8 space-x-6 snap-x"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {videoData.map((video, index) => (
              <motion.div
                key={video.id}
                className="flex-shrink-0 w-full md:w-[500px] snap-center glass-card rounded-xl overflow-hidden"
                variants={itemVariants}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }
                }}
                whileTap={{ scale: 0.95 }}
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
          </motion.div>
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
            transition={{ duration: 0.3 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden"
              initial={{ 
                scale: 0.8, 
                opacity: 0,
                y: 50,
                rotateX: -15
              }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: 0,
                rotateX: 0
              }}
              exit={{ 
                scale: 0.8, 
                opacity: 0,
                y: 50,
                rotateX: 15
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300,
                damping: 30,
                mass: 0.8
              }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              style={{ perspective: 1000 }}
            >
              {/* Close button */}
              <motion.button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-300 flex items-center justify-center text-gray-400 hover:text-white z-10"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 90,
                  backgroundColor: "rgba(255, 0, 0, 0.2)"
                }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
              
              {/* Navigation buttons */}
              {lightbox.currentIndex > 0 && (
                <motion.button
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    prevItem();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-dark-300 flex items-center justify-center text-gray-400 hover:text-white z-10"
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </motion.button>
              )}
              
              {lightbox.currentIndex < filteredItems.length - 1 && (
                <motion.button
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    nextItem();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-dark-300 flex items-center justify-center text-gray-400 hover:text-white z-10"
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </motion.button>
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
              <motion.div 
                className="bg-dark-100 p-6 rounded-b-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <motion.h3 
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {lightbox.currentItem.title}
                </motion.h3>
                <motion.p 
                  className="text-sm text-gray-400 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {lightbox.currentItem.category} • {lightbox.currentItem.date}
                </motion.p>
                <motion.p 
                  className="text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  {lightbox.currentItem.description}
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

