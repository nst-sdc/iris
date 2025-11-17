"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

// Sample gallery images data
const galleryImages = [
  {
    id: 1,
    src: "/images/gallery/gallery1.png", // Placeholder - will need to be created
    alt: "Team working on a drone project",
    width: 600,
    height: 400,
  },
  {
    id: 2,
    src: "/images/gallery/gallery2.jpg", // Placeholder - will need to be created
    alt: "Robotics competition",
    width: 400,
    height: 600,
  },
  {
    id: 3,
    src: "/images/gallery/gallery3.jpg", // Placeholder - will need to be created
    alt: "Workshop session",
    width: 600,
    height: 400,
  },
  {
    id: 4,
    src: "/images/gallery/gallery4.jpg", // Placeholder - will need to be created
    alt: "Robot prototype testing",
    width: 600,
    height: 400,
  },
  {
    id: 5,
    src: "/images/gallery/gallery5.jpg", // Placeholder - will need to be created
    alt: "Team photo at competition",
    width: 400,
    height: 600,
  },
  {
    id: 6,
    src: "/images/gallery/gallery6.jpg", // Placeholder - will need to be created
    alt: "Close-up of robot components",
    width: 600,
    height: 400,
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  useEffect(() => {
    const initScrollTrigger = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      
      gsap.registerPlugin(ScrollTrigger);
      
      // Create scroll-triggered animations
      gsap.from(".gallery-item", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 60%",
          toggleActions: "play none none none"
        },
        clearProps: "all",
      });
    };
    
    initScrollTrigger();
  }, []);

  // Handle lightbox open/close
  const openLightbox = (id: number) => setSelectedImage(id);
  const closeLightbox = () => setSelectedImage(null);
  
  // Handle keyboard events for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage !== null) {
        closeLightbox();
      } else if (e.key === "ArrowRight" && selectedImage !== null) {
        setSelectedImage((prev) => 
          prev === galleryImages.length ? 1 : (prev as number) + 1
        );
      } else if (e.key === "ArrowLeft" && selectedImage !== null) {
        setSelectedImage((prev) => 
          prev === 1 ? galleryImages.length : (prev as number) - 1
        );
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-black overflow-hidden"
    >
      <div className="container-custom max-w-6xl relative z-10 px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-white">
            Photo Gallery
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl">
            Explore moments from our workshops, competitions, and team activities.
          </p>
        </motion.div>
        
        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="gallery-item relative overflow-hidden rounded-2xl cursor-pointer group border border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700/50 transition-all duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => openLightbox(image.id)}
            >
              {/* Placeholder for gallery image */}
              <div 
                className="aspect-[4/3] bg-gradient-to-br from-cyan-500/10 to-violet-500/10 flex items-center justify-center"
                style={{ 
                  aspectRatio: image.width / image.height 
                }}
              >
                <span className="text-base sm:text-lg font-bold text-white/30">Gallery {image.id}</span>
              </div>
              {/* Uncomment when images are available */}
              {/* { <Image 
                src={image.src} 
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
              /> } */}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-xs sm:text-sm font-medium">{image.alt}</span>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-violet-500/0 group-hover:from-cyan-500/5 group-hover:to-violet-500/5 transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
        
        {/* View all gallery button */}
        <div className="text-center mt-12">
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg font-medium shadow-[0_0_15px_rgba(0,245,255,0.15)] hover:shadow-[0_0_35px_rgba(0,245,255,0.5)] hover:bg-cyan-50 transition-all duration-300"
          >
            View Full Gallery
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </motion.a>
        </div>
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute -top-12 right-0 text-white hover:text-cyan-400 transition-colors"
                onClick={closeLightbox}
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Image */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-violet-500/10 rounded-2xl aspect-[16/9] flex items-center justify-center border border-zinc-800/50">
                <span className="text-xl sm:text-2xl font-bold text-white/50">
                  Gallery Image {selectedImage}
                </span>
              </div>
              {/* Uncomment when images are available */}
              {/* <Image 
                src={galleryImages.find(img => img.id === selectedImage)?.src || ""}
                alt={galleryImages.find(img => img.id === selectedImage)?.alt || ""}
                width={1200}
                height={800}
                className="w-full h-auto rounded-xl"
              /> */}
              
              {/* Caption */}
              <div className="mt-4 text-center text-white">
                <p>{galleryImages.find(img => img.id === selectedImage)?.alt}</p>
              </div>
              
              {/* Navigation arrows */}
              <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-4">
                <button
                  className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-white hover:bg-cyan-400/30 hover:border-cyan-400/50 border border-zinc-700/50 transition-all duration-300"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => 
                      prev === 1 ? galleryImages.length : (prev as number) - 1
                    );
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <button
                  className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-white hover:bg-cyan-400/30 hover:border-cyan-400/50 border border-zinc-700/50 transition-all duration-300"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setSelectedImage((prev) => 
                      prev === galleryImages.length ? 1 : (prev as number) + 1
                    );
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
