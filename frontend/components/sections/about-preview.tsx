"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPreview() {
  return (
    <section id="about" className="relative py-20 md:py-32 overflow-hidden">
      <div className="container-custom">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">About</span> IRIS Robotics Club
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
        </motion.div>
        
        {/* Simplified content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-8 md:p-12 rounded-xl text-center"
          >
            <h3 className="text-2xl font-semibold text-glow-cyan mb-6">
              Empowering Innovators to Design a Smarter World
            </h3>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              IRIS Robotics Club is dedicated to fostering innovation and technical excellence 
              in the field of robotics. We provide a collaborative environment where students 
              can explore cutting-edge technologies, develop practical skills, and create 
              solutions that address real-world challenges.
            </p>
            
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">150+</div>
                <div className="text-sm text-gray-400">Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">50+</div>
                <div className="text-sm text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">15+</div>
                <div className="text-sm text-gray-400">Competitions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">30+</div>
                <div className="text-sm text-gray-400">Workshops</div>
              </div>
            </div>
            
            {/* CTA */}
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-primary rounded-full text-primary hover:bg-primary/10 hover:shadow-neon-cyan transition-all duration-300"
            >
              Explore Our Projects
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
