"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CircuitLines from "../ui/circuit-lines";
import FloatingIcons from "../ui/floating-icons";
import DataStream from "../ui/data-stream";
import HexagonGrid from "../ui/hexagon-grid";

export default function CTASection() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-black overflow-hidden">
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
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-white">
              Join IRIS Robotics
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl">
              Whether you're interested in building robots, learning new skills, or competing in hackathons.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="group relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700/50 hover:shadow-[0_0_25px_rgba(0,245,255,0.15)] transition-all duration-300 p-6 sm:p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-black" strokeWidth={2} />
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  Get Started
                </h3>
                <p className="text-gray-400 text-[15px] leading-relaxed">
                  Join our club and start your robotics journey with experienced mentors and a supportive community.
                </p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-violet-500/0 group-hover:from-cyan-500/5 group-hover:to-violet-500/5 transition-all duration-500 pointer-events-none" />
            </Link>

            <Link
              href="/projects"
              className="group relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] transition-all duration-300 p-6 sm:p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center group-hover:bg-zinc-800 group-hover:border-zinc-600/50 transition-all duration-300">
                  <svg 
                    className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  View Projects
                </h3>
                <p className="text-gray-400 text-[15px] leading-relaxed">
                  Explore our ongoing and completed robotics projects, from autonomous drones to robotic arms.
                </p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-violet-500/0 group-hover:from-cyan-500/5 group-hover:to-violet-500/5 transition-all duration-500 pointer-events-none" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
