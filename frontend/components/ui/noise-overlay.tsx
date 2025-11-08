"use client";

import React, { useEffect, useRef } from "react";

interface NoiseOverlayProps {
  opacity?: number;
  blendMode?: string;
  zIndex?: number;
}

export default function NoiseOverlay({
  opacity = 0.05,
  blendMode = "overlay",
  zIndex = 40
}: NoiseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions to match window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initial resize
    resize();
    
    // Add resize listener
    window.addEventListener("resize", resize);
    
    // Generate noise
    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // Random grayscale value
        const value = Math.floor(Math.random() * 255);
        data[i] = value;     // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
        data[i + 3] = 255;   // A
      }
      
      ctx.putImageData(imageData, 0, 0);
    };
    
    // Animation loop
    let animationId: number;
    const animate = () => {
      generateNoise();
      animationId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{
        opacity,
        mixBlendMode: blendMode as any,
        zIndex
      }}
      aria-hidden="true"
    />
  );
}
