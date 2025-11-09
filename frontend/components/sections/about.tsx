"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Users, Award, Cpu, Rocket } from "lucide-react";

const stats = [
  {
    title: "Members",
    value: "150+",
    icon: Users,
    description: "Active robotics enthusiasts",
  },
  {
    title: "Projects",
    value: "50+",
    icon: Cpu,
    description: "Innovative robotics solutions",
  },
  {
    title: "Competitions",
    value: "15+",
    icon: Award,
    description: "Annual tech competitions",
  },
  {
    title: "Workshops",
    value: "30+",
    icon: Rocket,
    description: "Skill development sessions",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  
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
              IRIS Robotics Club is dedicated to fostering innovation and technical excellence 
              in the field of robotics. We provide a collaborative environment where students 
              can explore cutting-edge technologies, develop practical skills, and create 
              solutions that address real-world challenges.
            </p>
            
            <h3 className="text-2xl font-semibold text-glow-violet">What We Do</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span>Design and build innovative robotics projects</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span>Participate in national and international robotics competitions</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span>Conduct workshops and training sessions for skill development</span>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span>Collaborate with industry partners on research projects</span>
              </li>
            </ul>
          </motion.div>
          
          {/* Right content - Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className="stat-card glass-card p-6 rounded-xl hover-lift group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
                    <stat.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
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
