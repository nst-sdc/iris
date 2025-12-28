"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SplineScene } from "../ui/splite";
import CircuitLines from "../ui/circuit-lines";
import FloatingIcons from "../ui/floating-icons";
import DataStream from "../ui/data-stream";
import HexagonGrid from "../ui/hexagon-grid";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      
      // Create floating animation for 3D model
      gsap.to(heroRef.current?.querySelector(".model-container"), {
        y: 15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    };

    initGSAP();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-20 sm:pt-24 pb-10 overflow-hidden bg-black"
    >
      {/* Video Background - Behind Everything */}
      <div className="absolute inset-0 z-0 flex items-center justify-end pr-0 lg:pr-20">
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center relative">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain opacity-90"
          >
            <source src="https://res.cloudinary.com/daefnk9rw/video/upload/v1766940391/qr5q4owqt69hbmh6boek.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlays for smooth blending - more subtle */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent pointer-events-none opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent pointer-events-none opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none opacity-20"></div>
        </div>
      </div>

      {/* Animated background layers */}
      <CircuitLines />
      <FloatingIcons />
      <DataStream />
      <HexagonGrid />
      
      {/* Scanning line effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-20"
        animate={{
          y: ["0vh", "100vh"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ boxShadow: "0 0 20px rgba(0, 245, 255, 0.8)" }}
      />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left content - Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col space-y-4 sm:space-y-6 text-center lg:text-left"
          >
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            > 
              <motion.span 
                className="font-spacefont text-[3.5rem] sm:text-[5rem] md:text-[7rem] bg-iris-gradient text-transparent bg-clip-text drop-shadow-glow inline-block"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(0,245,255,0.5)",
                    "0 0 40px rgba(0,245,255,0.8)",
                    "0 0 20px rgba(0,245,255,0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                IRIS
              </motion.span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="space-y-2 sm:space-y-4"
            >
              <motion.p 
                className="font-spacefont text-xl sm:text-2xl md:text-3xl lg:text-4xl bg-iris-gradient text-transparent bg-clip-text drop-shadow-glow"
                animate={{
                  textShadow: [
                    "0 0 15px rgba(0,245,255,0.4)",
                    "0 0 30px rgba(0,245,255,0.6)",
                    "0 0 15px rgba(0,245,255,0.4)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                The Robotics Club
              </motion.p>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0">
                Newton School of Technology<br />
                Ajeenkya DY Patil University
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start px-4 lg:px-0"
            >
              <motion.a
                href="/projects"
                className="w-full sm:w-auto px-6 py-3 bg-white text-black rounded-lg font-medium transition-all duration-200 shadow-[0_0_15px_rgba(0,245,255,0.15)] hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:bg-cyan-50 text-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Projects
              </motion.a>
              <motion.a
                href="#about"
                className="w-full sm:w-auto px-6 py-3 bg-zinc-800/50 text-white rounded-lg font-medium border border-zinc-700/50 transition-all duration-200 shadow-[0_0_10px_rgba(139,92,246,0.1)] hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:bg-zinc-800 hover:border-violet-500/50 text-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>
          
          {/* Right content - Empty space for video background */}
          <div className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px]"></div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1, 
          delay: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5
        }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20"
      >
        <span className="text-sm text-gray-400 mb-2">Scroll Down</span>
        <motion.svg
          className="w-5 h-5 text-primary"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
