"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User } from "lucide-react";

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: "The Future of Humanoid Robotics",
    excerpt: "Exploring the latest advancements in humanoid robots and their potential applications in everyday life.",
    author: "Dr. Sarah Chen",
    date: "December 15, 2025",
    readTime: "5 min read",
    image: "/images/blog/humanoid.jpg", // Placeholder - will need to be created
    category: "Research"
  },
  {
    id: 2,
    title: "Getting Started with Microcontrollers for Robotics",
    excerpt: "A beginner's guide to selecting and programming microcontrollers for your first robotics project.",
    author: "Michael Rodriguez",
    date: "November 28, 2025",
    readTime: "8 min read",
    image: "/images/blog/microcontrollers.jpg", // Placeholder - will need to be created
    category: "Tutorial"
  },
  {
    id: 3,
    title: "Ethics in AI and Robotics Development",
    excerpt: "Discussing the ethical considerations and responsibilities in developing intelligent robotic systems.",
    author: "Prof. James Wilson",
    date: "November 10, 2025",
    readTime: "6 min read",
    image: "/images/blog/ethics.jpg", // Placeholder - will need to be created
    category: "Opinion"
  },
];

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const initScrollTrigger = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      
      gsap.registerPlugin(ScrollTrigger);
      
      // Create scroll-triggered animations
      gsap.from(".blog-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 60%",
          toggleActions: "play none none none"
        }
      });
    };
    
    initScrollTrigger();
  }, []);

  return (
    <section
      id="blog"
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
            <span className="gradient-text">Latest</span> Articles
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest trends, tutorials, and insights in the world of robotics 
            through our regularly updated blog.
          </p>
        </motion.div>
        
        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className="blog-card glass-card rounded-xl overflow-hidden hover-lift group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-48 overflow-hidden">
                {/* Placeholder for blog image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-white/50">{post.title}</span>
                </div>
                {/* Uncomment when images are available */}
                {/* <Image 
                  src={post.image} 
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                /> */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-dark/80 text-xs font-medium text-primary">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-glow-cyan transition-all">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1 text-primary" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-primary" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-primary" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                
                <a 
                  href="#" 
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  Read More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* View all posts button */}
        <div className="text-center mt-12">
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center px-6 py-3 bg-transparent border border-primary rounded-full text-primary hover:bg-primary/10 hover:shadow-neon-cyan transition-all duration-300"
          >
            View All Articles
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
