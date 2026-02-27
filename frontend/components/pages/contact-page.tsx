"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import CircuitLines from "../ui/circuit-lines";
import FloatingIcons from "../ui/floating-icons";
import DataStream from "../ui/data-stream";
import HexagonGrid from "../ui/hexagon-grid";
import { clubInfo, contactCategories, googleMapsEmbedUrl } from "@/data/site-data";

export default function ContactUsPage() {
  const headerRef = useRef<HTMLElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    initAnimations();

    return () => {
      ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
    };
  }, []);

  const initAnimations = () => {
    gsap.to(".parallax-bg", {
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: -100,
      ease: "none",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          from_name: formData.name,
          email: formData.email,
          subject: `[IRIS Contact] ${formData.category} — from ${formData.name}`,
          message: `Name: ${formData.name}\nEmail: ${formData.email}\nCategory: ${formData.category}\n\n${formData.message}`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: "", email: "", category: "", message: "" });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-black pt-32 pb-12 sm:pb-16 overflow-hidden">
        {/* Animated background layers */}
        <CircuitLines />
        <FloatingIcons />
        <DataStream />
        <HexagonGrid />
        
        <div className="container-custom max-w-6xl relative z-10 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              Get in Touch
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-3xl">
              Whether you want to join our club, collaborate on projects, or just connect with us, we're always open to ideas and opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-12 sm:py-16 bg-black overflow-hidden">
        {/* Animated background layers */}
        <CircuitLines />
        <FloatingIcons />
        <DataStream />
        <HexagonGrid />
        
        <div className="container-custom max-w-6xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white">
                Contact Information
              </h2>

              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 hover:border-cyan-400/50 hover:bg-zinc-900/50 transition-all duration-300">
                  <Mail className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm mb-1">Email</p>
                    <a href={`mailto:${clubInfo.email}`} className="text-white text-sm sm:text-base font-medium hover:text-cyan-400 transition-colors">
                      {clubInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-zinc-800/50 bg-zinc-900/30 hover:border-cyan-400/50 hover:bg-zinc-900/50 transition-all duration-300">
                  <MapPin className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs sm:text-sm mb-1">Address</p>
                    <p className="text-white text-sm sm:text-base font-medium leading-relaxed">
                      {clubInfo.university}<br />
                      {clubInfo.parentUniversity}<br />
                      {clubInfo.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Map */}
            <div className="rounded-xl overflow-hidden h-64 sm:h-80 border border-zinc-800/50">
              <iframe
                title="IRIS Robotics Location"
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="border-0 grayscale brightness-90"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 sm:p-8 rounded-xl border border-zinc-800/50 bg-zinc-900/30 space-y-5"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white">Send a Message</h2>

            {/* Name */}
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg focus:outline-none focus:border-cyan-400 text-white placeholder-gray-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg focus:outline-none focus:border-cyan-400 text-white placeholder-gray-500 transition-colors"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg focus:outline-none focus:border-cyan-400 text-white transition-colors"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {contactCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows={5}
                required
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg focus:outline-none focus:border-cyan-400 text-white placeholder-gray-500 transition-colors resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex items-center justify-center gap-2 font-medium py-3 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
                submitStatus === 'success'
                  ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                  : submitStatus === 'error'
                  ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'bg-white text-black shadow-[0_0_15px_rgba(0,245,255,0.15)] hover:shadow-[0_0_25px_rgba(0,245,255,0.3)] hover:bg-cyan-50'
              }`}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Sending...
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Message Sent!
                </>
              ) : submitStatus === 'error' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  Failed — Try Again
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </motion.form>
        </div>
      </section>
    </>
  );
}
