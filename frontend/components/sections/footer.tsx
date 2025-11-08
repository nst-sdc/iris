"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer id="contact" className="relative pt-20 pb-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 circuit-bg opacity-5"></div>
      
      <div className="container-custom">
        {/* Main footer content */}
        <div className="glass rounded-xl p-8 md:p-12 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl font-bold gradient-text">IRIS</span>
                <span className="text-lg font-medium text-foreground">Robotics Club</span>
              </div>
              <p className="text-gray-400 mb-6">
                Empowering innovators to design a smarter world through robotics, 
                collaboration, and cutting-edge technology.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-9 h-9 rounded-full bg-dark-300 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-dark-200 transition-colors duration-300"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 rounded-full bg-dark-300 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-dark-200 transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 rounded-full bg-dark-300 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-dark-200 transition-colors duration-300"
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
              <h3 className="text-lg font-semibold mb-6 text-glow-cyan">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#home" className="text-gray-400 hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-gray-400 hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#projects" className="text-gray-400 hover:text-primary transition-colors">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="#events" className="text-gray-400 hover:text-primary transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="#blog" className="text-gray-400 hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#gallery" className="text-gray-400 hover:text-primary transition-colors">
                    Gallery
                  </Link>
                </li>
              </ul>
            </motion.div>
            
            {/* Column 3: Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-6 text-glow-violet">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-primary mr-3 mt-1" />
                  <span className="text-gray-400">
                    123 Innovation Drive<br />
                    Tech Campus, Building 4<br />
                    Robotics Lab, Room 305
                  </span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 text-primary mr-3" />
                  <a href="mailto:info@irisrobotics.com" className="text-gray-400 hover:text-primary transition-colors">
                    info@irisrobotics.com
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 text-primary mr-3" />
                  <a href="tel:+1234567890" className="text-gray-400 hover:text-primary transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
              </ul>
            </motion.div>
            
            {/* Column 4: Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-6 text-glow-cyan">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter to get the latest updates on events, 
                workshops, and robotics news.
              </p>
              <form className="space-y-3">
                <div>
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-2 bg-dark-300 border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-gray-300"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-dark font-medium hover:shadow-neon-glow transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          <p>© {currentYear} IRIS Robotics Club. All rights reserved.</p>
          <p className="mt-2">
            Designed with <span className="text-primary">♥</span> by the IRIS Team
          </p>
        </div>
      </div>
    </footer>
  );
}
