"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Cpu, Calendar, FileText, Image } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CircuitLines from "../ui/circuit-lines";
import FloatingIcons from "../ui/floating-icons";
import DataStream from "../ui/data-stream";
import HexagonGrid from "../ui/hexagon-grid";
import { features } from "@/data/site-data";

const featureIconMap: Record<string, LucideIcon> = { Cpu, Calendar, FileText, Image };

export default function FeaturesPreview() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-black overflow-hidden">
      {/* Animated background layers */}
      <CircuitLines />
      <FloatingIcons />
      <DataStream />
      <HexagonGrid />
      
      <div className="container-custom max-w-6xl relative z-10 px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-white">
            Explore IRIS
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl">
            From building robots to competing globally, discover what drives our community.
          </p>
        </motion.div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {features.map((feature, index) => {
            const FeatureIcon = featureIconMap[feature.iconName];
            return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={feature.href}
                className="group block relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700/50 transition-all duration-300 p-6 sm:p-8"
              >
                {/* Icon */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center group-hover:bg-zinc-800 group-hover:border-zinc-600/50 transition-all duration-300">
                    {FeatureIcon && <FeatureIcon className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />}
                  </div>
                  <svg 
                    className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-[15px] leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-violet-500/0 group-hover:from-cyan-500/5 group-hover:to-violet-500/5 transition-all duration-500 pointer-events-none" />
              </Link>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
