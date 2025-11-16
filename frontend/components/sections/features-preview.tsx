"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Cpu, Calendar, User, Users } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Innovative Projects",
    description: "Explore our cutting-edge robotics projects from autonomous drones to robotic arms.",
    href: "/projects",
    color: "from-primary/20 to-secondary/20"
  },
  {
    icon: Calendar,
    title: "Events & Workshops",
    description: "Join our workshops, competitions, and tech talks to enhance your robotics skills.",
    href: "/events",
    color: "from-secondary/20 to-primary/20"
  },
  {
    icon: User,
    title: "Technical Blogs",
    description: "Learn from detailed tutorials and insights shared by our team members.",
    href: "/blog",
    color: "from-primary/20 to-secondary/20"
  },
  {
    icon: Users,
    title: "Photo Gallery",
    description: "View moments from our competitions, workshops, and team activities.",
    href: "/gallery",
    color: "from-secondary/20 to-primary/20"
  }
];

export default function FeaturesPreview() {
  return (
    <section className="relative py-20 md:py-32 bg-dark-100">
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
            <span className="gradient-text">Discover</span> What We Offer
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore our projects, attend events, read technical blogs, and view our gallery
          </p>
        </motion.div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={feature.href}
                className="block glass-card rounded-xl p-6 hover-lift group h-full"
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-glow-cyan transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  {feature.description}
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Explore
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
