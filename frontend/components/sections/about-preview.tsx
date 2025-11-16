"use client";

import { motion } from "framer-motion";
import CircuitLines from "../ui/circuit-lines";
import FloatingIcons from "../ui/floating-icons";
import DataStream from "../ui/data-stream";
import HexagonGrid from "../ui/hexagon-grid";

export default function AboutPreview() {
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
                IRIS is the robotics club of Newton School of Technology, Ajeenkya DY Patil University. 
                We're a community of students who love building cool robots and experimenting with technology.
              </p>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                From autonomous drones to AI-powered systems, we work on projects that push the boundaries 
                of what's possible. Whether you're a complete beginner or already know your way around circuits 
                and code, there's a place for you here.
              </p>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                We participate in competitions, host workshops, and collaborate on projects that matter. 
                It's not just about robots—it's about learning, growing, and having fun while doing it.
              </p>
            </div>
          </div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-4 sm:p-6"
            >
              <div className="text-2xl sm:text-3xl font-semibold text-white mb-1">20+</div>
              <div className="text-xs sm:text-sm text-gray-400">Active Members</div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-4 sm:p-6"
            >
              <div className="text-2xl sm:text-3xl font-semibold text-white mb-1">5+</div>
              <div className="text-xs sm:text-sm text-gray-400">Projects Built</div>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent pointer-events-none" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-4 sm:p-6"
            >
              <div className="text-2xl sm:text-3xl font-semibold text-white mb-1">5+</div>
              <div className="text-xs sm:text-sm text-gray-400">Competitions Won</div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-4 sm:p-6"
            >
              <div className="text-2xl sm:text-3xl font-semibold text-white mb-1">3+</div>
              <div className="text-xs sm:text-sm text-gray-400">Workshops Held</div>
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
