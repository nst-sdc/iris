"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, PenLine } from "lucide-react";
import Link from "next/link";
import { blogsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Blog {
  title: string;
  excerpt: string;
  description?: string;
  author: string;
  author_name?: string;
  date: string;
  created_at?: string;
  readTime?: string;
  image: string;
  image_url?: string;
  category?: string;
  slug: string;
  source?: "markdown" | "database";
}

export default function BlogPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch blogs from both markdown files and database
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const [mdRes, dbBlogs] = await Promise.all([
          fetch("/api/blogdata").then(r => r.json()).catch(() => []),
          blogsAPI.getAll().catch(() => []),
        ]);

        // Normalize markdown blogs
        const mdBlogs: Blog[] = (mdRes || []).map((b: any) => ({
          ...b,
          source: "markdown" as const,
        }));

        // Normalize database blogs
        const normalizedDb: Blog[] = (dbBlogs || []).map((b: any) => ({
          title: b.title,
          description: b.description,
          excerpt: b.description,
          author: b.author_name || "Unknown",
          date: b.created_at ? new Date(b.created_at).toLocaleDateString() : "",
          image: b.image_url || "",
          category: b.category,
          slug: b.slug,
          source: "database" as const,
        }));

        // Merge: database blogs first (newest), then markdown blogs
        setBlogs([...normalizedDb, ...mdBlogs]);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
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
        opacity: 0,
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
      className="relative py-20 md:py-32 bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#111] text-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              BLOGS
            </span>{" "}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest trends, tutorials, and insights in the world of robotics.
          </p>
          {user && (
            <Link
              href="/blog/write"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <PenLine className="w-4 h-4" />
              Write a Blog
            </Link>
          )}
        </motion.div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post, index) => (
            <motion.div
              key={index}
              className="blog-card rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-52 overflow-hidden">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-white/50">{post.title}</span>
                  </div>
                )}
                {post.category && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 text-xs font-medium text-cyan-400">
                    {post.category}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-all">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {post.description || post.excerpt}
                </p>

                <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1 text-cyan-400" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-cyan-400" />
                    <span>{post.date}</span>
                  </div>
                  {post.readTime && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-cyan-400" />
                      <span>{post.readTime}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/blogpost/${post.slug}`}
                  className="inline-flex items-center text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Read More
                  <svg
                    className="w-4 h-4 ml-1"
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
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
