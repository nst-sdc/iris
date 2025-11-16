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
      
      // Create floating animation for robot
      gsap.to(heroRef.current?.querySelector(".robot-container"), {
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
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black"
    >
      {/* Animated background layers */}
      <CircuitLines />
      <FloatingIcons />
      <DataStream />
      <HexagonGrid />
      
      {/* Scanning line effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
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
            className="flex flex-col space-y-6"
          >
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            > 
              <motion.span 
                className="font-spacefont text-[5rem] md:text-[7rem] bg-iris-gradient text-transparent bg-clip-text drop-shadow-glow inline-block"
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
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-lg text-gray-300 max-w-lg"
            >
              Join IRIS Robotics Club to explore cutting-edge technology, 
              collaborate on innovative projects, and develop skills that 
              shape the future of robotics and automation.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="/projects"
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-full text-dark font-medium hover:shadow-neon-glow transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
                <span className="relative z-10">Explore Projects</span>
              </motion.a>
              <motion.a
                href="#about"
                className="px-6 py-3 bg-transparent border-2 border-primary rounded-full text-primary hover:bg-primary/10 hover:shadow-neon-cyan transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>
          
          {/* Right content - 3D Robot */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="robot-container h-[200px] md:h-[400px] lg:h-[500px] relative"
          >
            {/* Rotating rings around robot */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-64 h-64 rounded-full border border-primary/30" />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-80 h-80 rounded-full border border-secondary/30" />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-96 h-96 rounded-full border border-primary/20" />
            </motion.div>
            
            {/* 3D Robot Model */}
            <div className="relative z-10 scale-150 md:scale-[2] lg:scale-[2.0]">
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
            
            {/* Pulsing dots */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full"
                  style={{
                    left: `${50 + 40 * Math.cos((i / 8) * Math.PI * 2)}%`,
                    top: `${50 + 40 * Math.sin((i / 8) * Math.PI * 2)}%`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            
            {/* Energy particles */}
            <div className="absolute inset-0 opacity-40">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full"
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                  }}
                  animate={{
                    y: [
                      Math.random() * 100 + "%",
                      Math.random() * 100 + "%",
                      Math.random() * 100 + "%",
                    ],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
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
