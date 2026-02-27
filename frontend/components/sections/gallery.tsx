"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";
import { galleryAPI } from "@/lib/api";

interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url?: string;
  category: string;
  description: string;
}

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await galleryAPI.getAll();
        const mapped: GalleryImage[] = data.slice(0, 6).map((item: any) => ({
          id: typeof item._id === 'string' ? item._id : item._id?.$oid || '',
          title: item.title,
          image_url: item.image_url,
          thumbnail_url: item.thumbnail_url,
          category: item.category,
          description: item.description,
        }));
        setImages(mapped);
      } catch (error) {
        console.error('Failed to load gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);
  
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
  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  
  // Handle keyboard events for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedIndex !== null) {
        closeLightbox();
      } else if (e.key === "ArrowRight" && selectedIndex !== null) {
        setSelectedIndex((prev) => 
          prev !== null && prev < images.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowLeft" && selectedIndex !== null) {
        setSelectedIndex((prev) => 
          prev !== null && prev > 0 ? prev - 1 : images.length - 1
        );
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

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
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
            <p className="text-gray-400 mt-4">Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No photos yet. Check back soon!</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              className="gallery-item relative overflow-hidden rounded-2xl cursor-pointer group border border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700/50 transition-all duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-cyan-500/10 to-violet-500/10 overflow-hidden">
                <img
                  src={image.thumbnail_url || image.image_url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <span className="text-white text-xs sm:text-sm font-medium">{image.title}</span>
                  <span className="block text-cyan-400 text-xs mt-0.5">{image.category}</span>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-violet-500/0 group-hover:from-cyan-500/5 group-hover:to-violet-500/5 transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
        )}
        
        {/* View all gallery button */}
        <div className="text-center mt-12">
          <motion.a
            href="/gallery"
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
        {selectedIndex !== null && images[selectedIndex] && (
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
              <div className="rounded-2xl overflow-hidden border border-zinc-800/50">
                <img
                  src={images[selectedIndex].image_url}
                  alt={images[selectedIndex].title}
                  className="w-full h-auto max-h-[80vh] object-contain bg-black"
                />
              </div>
              
              {/* Caption */}
              <div className="mt-4 text-center text-white">
                <p className="font-semibold">{images[selectedIndex].title}</p>
                <p className="text-sm text-cyan-400 mt-1">{images[selectedIndex].category}</p>
              </div>
              
              {/* Navigation arrows */}
              <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-4">
                <button
                  className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-white hover:bg-cyan-400/30 hover:border-cyan-400/50 border border-zinc-700/50 transition-all duration-300"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) => 
                      prev !== null && prev > 0 ? prev - 1 : images.length - 1
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
                    setSelectedIndex((prev) => 
                      prev !== null && prev < images.length - 1 ? prev + 1 : 0
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
