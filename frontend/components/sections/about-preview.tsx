"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CircuitLines from "../ui/circuit-lines";
import FloatingIcons from "../ui/floating-icons";
import DataStream from "../ui/data-stream";
import HexagonGrid from "../ui/hexagon-grid";
import { stats as defaultStats, aboutContent } from "@/data/site-data";
import { statsAPI } from "@/lib/api";

export default function AboutPreview() {
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
      }
    };
    loadStats();
  }, []);

  return (
    <section id="about" className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-black">
      {/* Animated background layers */}
      <CircuitLines />
      <FloatingIcons />
      <DataStream />
      <HexagonGrid />
      
      <div className="container-custom max-w-6xl relative z-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-white">
              About IRIS
            </h2>
            <div className="max-w-3xl space-y-4">
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                {aboutContent.mission}
              </p>
              {aboutContent.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {dynamicStats.map((stat, index) => {
              const gradientClass = index % 2 === 0
                ? "from-cyan-500/5"
                : "from-violet-500/5";
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 * (index + 1) }}
                  className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-4 sm:p-6"
                >
                  <div className="text-2xl sm:text-3xl font-semibold text-white mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.title}</div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} via-transparent to-transparent pointer-events-none`} />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
