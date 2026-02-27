"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Users, Award, Cpu, Rocket } from "lucide-react";
import { stats as defaultStats, aboutContent } from "@/data/site-data";
import { statsAPI } from "@/lib/api";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = { Users, Cpu, Award, Rocket };

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [dynamicStats, setDynamicStats] = useState(defaultStats);
  
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await statsAPI.get();
        setDynamicStats([
          {
            title: "Active Members",
            value: `${data.members || 0}+`,
            iconName: "Users" as const,
            description: "Active robotics enthusiasts",
          },
          {
            title: "Projects Built",
            value: `${data.projects || 0}+`,
            iconName: "Cpu" as const,
            description: "Innovative robotics solutions",
          },
          {
            title: "Events Held",
            value: `${data.events || 0}+`,
            iconName: "Award" as const,
            description: "Events & competitions",
          },
          {
            title: "Workshops Held",
            value: `${data.workshops || 0}+`,
            iconName: "Rocket" as const,
            description: "Skill development sessions",
          },
        ]);
      } catch (error) {
        console.error('Failed to load dynamic stats:', error);
        // Fall back to static defaults
      }
    };
    loadStats();
  }, []);
  
  useEffect(() => {
    const initScrollTrigger = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      
      gsap.registerPlugin(ScrollTrigger);
      
      // Create scroll-triggered animations
gsap.from(".stat-card", {
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top 80%",
    end: "bottom 60%",
    toggleActions: "play none none none",
  },
  clearProps: "all", // Clears inline styles after animation
});
    };
    
    initScrollTrigger();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      <div className="container-custom">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">About</span> IRIS Robotics Club
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
        </motion.div>
        
        {/* About content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold text-glow-cyan">Our Mission</h3>
            <p className="text-gray-300">
              {aboutContent.mission}
            </p>
            
            <h3 className="text-2xl font-semibold text-glow-violet">What We Do</h3>
            <ul className="space-y-3 text-gray-300">
              {aboutContent.whatWeDo.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Right content - Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {dynamicStats.map((stat, index) => (
              <div
                key={stat.title}
                className="stat-card glass-card p-6 rounded-xl hover-lift group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
                    {(() => { const Icon = iconMap[stat.iconName]; return Icon ? <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" /> : null; })()}
                  </div>
                  <h3 className="text-xl font-semibold">{stat.title}</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
