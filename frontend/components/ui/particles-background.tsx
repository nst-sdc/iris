"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface ParticlesBackgroundProps {
  count?: number;
  color?: string;
  size?: [number, number]; // [min, max]
  speed?: [number, number]; // [min, max]
}

export default function ParticlesBackground({
  count = 30,
  color = "#00F5FF",
  size = [2, 10],
  speed = [10, 20]
}: ParticlesBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create particles
    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      const particleSize = Math.random() * (size[1] - size[0]) + size[0];
      
      // Set particle styles
      particle.className = "absolute rounded-full";
      particle.style.width = `${particleSize}px`;
      particle.style.height = `${particleSize}px`;
      particle.style.backgroundColor = color;
      particle.style.opacity = (Math.random() * 0.5).toString();
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      containerRef.current.appendChild(particle);
      particles.push(particle);
    }
    
    // Animate particles
    particles.forEach((particle) => {
      gsap.to(particle, {
        x: `random(-100, 100)`,
        y: `random(-100, 100)`,
        opacity: `random(0.1, 0.5)`,
        duration: `random(${speed[0]}, ${speed[1]})`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
    
    // Cleanup
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, [count, color, size, speed]);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    />
  );
}
