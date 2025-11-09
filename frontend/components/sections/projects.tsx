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
      className="relative py-20 md:py-32 bg-dark-100"
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
            <span className="gradient-text">Featured</span> Projects
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore our innovative robotics projects that combine cutting-edge technology 
            with practical applications to solve real-world challenges.
          </p>
        </motion.div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card glass-card rounded-xl overflow-hidden hover-lift group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-60 overflow-hidden">
                {/* Placeholder for project image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white/50">{project.title}</span>
                </div>
                {/* Uncomment when images are available */}
                {/* <Image 
                  src={project.image} 
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                /> */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-dark/80 text-xs font-medium text-primary">
                  {project.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-glow-cyan transition-all">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 rounded-full text-xs font-medium bg-dark-300 text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
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
            className="inline-flex items-center px-6 py-3 bg-transparent border border-primary rounded-full text-primary hover:bg-primary/10 hover:shadow-neon-cyan transition-all duration-300"
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
