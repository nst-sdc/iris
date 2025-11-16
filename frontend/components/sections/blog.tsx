"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User } from "lucide-react";
import Link from "next/link";

interface Blog {
  title: string;
  excerpt: string;
  description?: string;
  author: string;
  date: string;
  readTime?: string;
  image: string;
  category?: string;
  slug: string;
}

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from API
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogdata");
        const data = await res.json();
        console.log("✅ Blogs fetched:", data);
        setBlogs(data);
      } catch (error) {
        console.error("❌ Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  // Scroll animations
  useEffect(() => {
    const initScrollTrigger = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".blog-card", {
        y: 50,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 60%",
          toggleActions: "play none none none",
        },
      });
    };

    initScrollTrigger();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-black">
        Loading blogs...
      </div>
    );
  }

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-black overflow-hidden text-gray-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-white">
            Latest Articles
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl">
            Stay updated with the latest trends, tutorials, and insights in robotics.
          </p>
        </motion.div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {blogs.map((post, index) => (
            <motion.div
              key={index}
              className="blog-card rounded-2xl overflow-hidden border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700/50 transition-all duration-300 group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-44 sm:h-48 overflow-hidden">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 flex items-center justify-center">
                    <span className="text-lg sm:text-xl font-bold text-white/50">{post.title}</span>
                  </div>
                )}
                {post.category && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 text-xs font-medium text-cyan-400">
                    {post.category}
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white group-hover:text-cyan-400 transition-all">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-2">
                  {post.description || post.excerpt}
                </p>

                <div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-500 mb-4 gap-3 sm:gap-4">
                  <div className="flex items-center">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-cyan-400" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-cyan-400" />
                    <span>{post.date}</span>
                  </div>
                  {post.readTime && (
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-cyan-400" />
                      <span>{post.readTime}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/blogpost/${post.slug}`}
                  className="inline-flex items-center text-xs sm:text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Read More
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </Link>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-violet-500/0 group-hover:from-cyan-500/5 group-hover:to-violet-500/5 transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-12">
          <motion.a
            href="/blog"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg font-medium shadow-[0_0_15px_rgba(0,245,255,0.15)] hover:shadow-[0_0_35px_rgba(0,245,255,0.5)] hover:bg-cyan-50 transition-all duration-300"
          >
            View All Articles
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
