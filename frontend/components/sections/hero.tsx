"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SplineScene } from "../ui/splite";
import { ArrowDown } from "lucide-react";

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
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-20 z-0"></div>
      
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
<span className="font-spacefont text-[7rem] bg-iris-gradient text-transparent bg-clip-text drop-shadow-glow">
IRIS</span>
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
              <a
                href="#projects"
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-full text-dark font-medium hover:shadow-neon-glow transition-all duration-300"
              >
                Explore Projects
              </a>
              <a
                href="#about"
                className="px-6 py-3 bg-transparent border border-primary rounded-full text-primary hover:bg-primary/10 hover:shadow-neon-cyan transition-all duration-300"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
          
          {/* Right content - 3D Robot */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="robot-container h-[500px] md:h-[600px] relative"
          >
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
            
            {/* Holographic rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full border border-primary/20 animate-pulse"></div>
              <div className="absolute w-80 h-80 rounded-full border border-secondary/20 animate-pulse" style={{ animationDelay: "300ms" }}></div>
              <div className="absolute w-96 h-96 rounded-full border border-primary/10 animate-pulse" style={{ animationDelay: "600ms" }}></div>
            </div>
            
            {/* Particle effects */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                ></div>
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
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-sm text-gray-400 mb-2">Scroll Down</span>
        <ArrowDown className="w-5 h-5 text-primary animate-bounce" />
      </motion.div>
    </section>
  );
}
