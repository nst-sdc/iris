"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Mail, Calendar } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient opacity-10"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to <span className="gradient-text">Join</span> the Future?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Become part of IRIS Robotics Club and start building innovative solutions 
              that shape tomorrow's technology landscape.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-dark font-medium hover:shadow-neon-glow transition-all duration-300 text-lg"
              >
                Join Us Now
              </Link>
              <Link
                href="/events"
                className="px-8 py-4 bg-transparent border-2 border-primary rounded-full text-primary hover:bg-primary/10 hover:shadow-neon-cyan transition-all duration-300 text-lg"
              >
                View Events
              </Link>
            </div>
          </motion.div>
          
          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Link
              href="/projects"
              className="glass-card p-6 rounded-xl text-center hover-lift group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">View Projects</h3>
              <p className="text-gray-400 text-sm">
                See our teams working on projects
              </p>
            </Link>
            
            <Link
              href="/contact"
              className="glass-card p-6 rounded-xl text-center hover-lift group"
            >
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/30 transition-colors">
                <Mail className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Get in Touch</h3>
              <p className="text-gray-400 text-sm">
                Contact us for collaborations
              </p>
            </Link>
            
            <Link
              href="/events"
              className="glass-card p-6 rounded-xl text-center hover-lift group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
              <p className="text-gray-400 text-sm">
                Check out our latest workshops
              </p>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
