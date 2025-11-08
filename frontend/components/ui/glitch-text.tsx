"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchIntensity?: number; // 0-10 scale
  glitchFrequency?: number; // milliseconds
  color?: string;
}

export default function GlitchText({
  text,
  className = "",
  glitchIntensity = 3,
  glitchFrequency = 2000,
  color = "text-primary"
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  
  // Characters to use for glitch effect
  const glitchChars = "!<>-_\\/@#$%^&*()=+[]{}|;:,.?";
  
  useEffect(() => {
    // Set initial text
    setDisplayText(text);
    
    // Create glitch effect at random intervals
    const interval = setInterval(() => {
      // Skip glitch sometimes for more natural effect
      if (Math.random() > 0.7) return;
      
      // Start glitch sequence
      glitchSequence();
    }, glitchFrequency);
    
    return () => clearInterval(interval);
  }, [text, glitchIntensity, glitchFrequency]);
  
  // Create a sequence of glitch effects
  const glitchSequence = () => {
    // Number of glitch frames based on intensity
    const frames = Math.floor(glitchIntensity / 2) + 1;
    
    // Create a sequence of frames with setTimeout
    for (let i = 0; i < frames; i++) {
      setTimeout(() => {
        setDisplayText(createGlitchedText(text, glitchIntensity));
      }, i * 50);
    }
    
    // Reset to original text after glitch sequence
    setTimeout(() => {
      setDisplayText(text);
    }, frames * 50);
  };
  
  // Create glitched version of text
  const createGlitchedText = (originalText: string, intensity: number) => {
    // Convert intensity to percentage of characters to glitch (1-20%)
    const glitchPercent = Math.min(intensity * 2, 20) / 100;
    
    // Create array from text
    const chars = originalText.split("");
    
    // Number of characters to glitch
    const numToGlitch = Math.max(1, Math.floor(chars.length * glitchPercent));
    
    // Randomly select positions to glitch
    const positions = new Set<number>();
    while (positions.size < numToGlitch) {
      positions.add(Math.floor(Math.random() * chars.length));
    }
    
    // Replace characters at selected positions
    positions.forEach(pos => {
      chars[pos] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
    });
    
    return chars.join("");
  };
  
  return (
    <motion.span
      className={`inline-block ${color} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayText}
    </motion.span>
  );
}
