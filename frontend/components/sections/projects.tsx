"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Sample project data
const projects = [
  {
    id: 1,
    title: "Autonomous Drone System",
    category: "Aerial Robotics",
    description: "AI-powered drone with object recognition and autonomous navigation capabilities for search and rescue operations.",
    image: "/images/projects/drone.jpg", // Placeholder - will need to be created
    tags: ["Computer Vision", "AI", "Navigation"]
  },
  {
    id: 2,
    title: "Robotic Arm Manipulator",
    category: "Industrial Automation",
    description: "6-DOF robotic arm with precision control for industrial applications and educational demonstrations.",
    image: "/images/projects/robotic-arm.jpg", // Placeholder - will need to be created
    tags: ["Kinematics", "Control Systems", "Mechanics"]
  },
  {
    id: 3,
    title: "Swarm Robotics Platform",
    category: "Multi-Agent Systems",
    description: "Decentralized multi-robot system that demonstrates emergent behaviors and collective intelligence.",
    image: "/images/projects/swarm.jpg", // Placeholder - will need to be created
    tags: ["Distributed Systems", "Algorithms", "Communication"]
  },
  {
    id: 4,
    title: "Autonomous Ground Vehicle",
    category: "Mobile Robotics",
    description: "Self-driving robot with LIDAR mapping and advanced path planning for indoor navigation.",
    image: "/images/projects/agv.jpg", // Placeholder - will need to be created
    tags: ["SLAM", "Path Planning", "Sensors"]
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const initScrollTrigger = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      
      gsap.registerPlugin(ScrollTrigger);
      
      // Create scroll-triggered animations
      gsap.from(".project-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 60%",
          toggleActions: "play none none none"
        },
  clearProps: "all",
      });
    };
    
    initScrollTrigger();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-black overflow-hidden"
    >
      <div className="container-custom max-w-6xl relative z-10 px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-white">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl">
            Explore our innovative robotics projects that combine cutting-edge technology 
            with practical applications.
          </p>
        </motion.div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card group block relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700/50 transition-all duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-48 sm:h-60 overflow-hidden">
                {/* Placeholder for project image */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-white/40">{project.title}</span>
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 text-xs font-medium text-cyan-400">
                  {project.category}
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 rounded-full text-xs font-medium bg-zinc-800/50 border border-zinc-700/50 text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-violet-500/0 group-hover:from-cyan-500/5 group-hover:to-violet-500/5 transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
        
        {/* View all projects button */}
        <div className="text-center mt-12">
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg font-medium shadow-[0_0_15px_rgba(0,245,255,0.15)] hover:shadow-[0_0_35px_rgba(0,245,255,0.5)] hover:bg-cyan-50 transition-all duration-300"
          >
            View All Projects
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
