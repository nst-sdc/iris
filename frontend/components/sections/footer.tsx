"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { clubInfo, socialLinks, quickLinks } from "@/data/site-data";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="contact" className="relative pt-16 sm:pt-20 pb-8 overflow-hidden bg-black border-t border-zinc-800/50">
      <div className="container-custom max-w-6xl relative z-10 px-4 sm:px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
          {/* Column 1: About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-cyan-400">IRIS</span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {clubInfo.description}
            </p>
            <div className="flex space-x-3">
              <a 
                target="_blank"
                href={socialLinks.github} 
                className="w-10 h-10 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-zinc-800 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                target="_blank"
                href={socialLinks.linkedin} 
                className="w-10 h-10 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-zinc-800 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                target="_blank"
                href={socialLinks.instagram} 
                className="w-10 h-10 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-zinc-800 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
          
          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-base font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 text-sm hover:text-cyan-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Column 3: Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-base font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-cyan-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  {clubInfo.university}<br />
                  {clubInfo.parentUniversity}<br />
                  {clubInfo.location}
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                <a href={`mailto:${clubInfo.email}`} className="text-gray-400 text-sm hover:text-cyan-400 transition-colors">
                  {clubInfo.email}
                </a>
              </li>
            </ul>
          </motion.div>
          
          {/* Column 4: Get in Touch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-base font-semibold mb-4 text-white">Get in Touch</h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Have questions or ideas? Reach out to us anytime.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-medium shadow-[0_0_15px_rgba(0,245,255,0.15)] hover:shadow-[0_0_25px_rgba(0,245,255,0.3)] hover:bg-cyan-50 transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </Link>
          </motion.div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-zinc-800/50 pt-6">
          {/* Copyright */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <p>© {currentYear} {clubInfo.fullName}. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
