"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactUsPage() {
  const headerRef = useRef<HTMLElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setFormData({ name: "", email: "", category: "", message: "" });
  };

  return (
    <>
      {/* Hero Section */}
      <section
        ref={headerRef}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-dark-100/0 to-dark-100 opacity-90" />
          <div className="parallax-bg absolute inset-0 bg-circuit-pattern opacity-10" />
        </div>

        {/* Hero Content */}
        <div className="container-custom relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="text-glow-cyan">Connect with</span>{" "}
            <span className="gradient-text">IRIS Robotics Club</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Whether you’re a student, collaborator, or robotics enthusiast, we’re always open to ideas and opportunities.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={sectionRef} className="relative py-20 bg-dark-100">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="space-y-10 text-white"
>
  {/* Header */}
  <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
    Contact Information
  </h2>

  {/* Contact Cards */}
  <div className="space-y-6">
    <div className="contact-card flex items-center gap-4 bg-zinc-900/80 p-5 rounded-2xl border border-zinc-700 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300">
      <Mail className="w-6 h-6 text-cyan-400" />
      <div>
        <p className="text-gray-400 text-sm">Email</p>
        <h3 className="text-white font-medium">irisroboticsclub@gmail.com</h3>
      </div>
    </div>

    <div className="contact-card flex items-center gap-4 bg-zinc-900/80 p-5 rounded-2xl border border-zinc-700 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all duration-300">
      <Phone className="w-6 h-6 text-emerald-400" />
      <div>
        <p className="text-gray-400 text-sm">Phone</p>
        <h3 className="text-white font-medium">+91 98765 43210</h3>
      </div>
    </div>

    <div className="contact-card flex items-center gap-4 bg-zinc-900/80 p-5 rounded-2xl border border-zinc-700 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(96,165,250,0.3)] transition-all duration-300">
      <MapPin className="w-6 h-6 text-blue-400" />
      <div>
        <p className="text-gray-400 text-sm">Address</p>
        <h3 className="text-white font-medium">
          IRIS Robotics Lab, Newton School of Technology Campus, India
        </h3>
      </div>
    </div>
  </div>

  {/* Embedded Map */}
  <div className="mt-10 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.6)] h-72 border border-zinc-700">
    <iframe
      title="IRIS Robotics Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18435.088191545412!2d73.89957561842056!3d18.62301991896188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c7007ca391d7%3A0x9da4723c416a8ee5!2sNewton%20school%20of%20technology%20pune%20campus!5e0!3m2!1sen!2sin!4v1762634832410!5m2!1sen!2sin"
      width="100%"
      height="100%"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="border-0 grayscale-[40%] brightness-90 contrast-125"
    ></iframe>
  </div>
</motion.div>


          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-8 rounded-2xl shadow-neon-glow space-y-6"
          >
            <h2 className="text-3xl font-semibold mb-4 gradient-text">Send a Message</h2>

            {/* Name */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 bg-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-white"
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Event Participation">Event Participation</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows={5}
                required
                className="w-full px-4 py-3 bg-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-white"
              />
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-dark font-semibold py-3 rounded-lg shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              <Send className="w-5 h-5" />
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </section>
    </>
  );
}
