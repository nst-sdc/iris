"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";

// Sample events data
const events = [
  {
    id: 1,
    title: "Robotics Workshop: Introduction to ROS",
    date: "January 15, 2026",
    time: "10:00 AM - 2:00 PM",
    location: "Engineering Building, Room 305",
    description: "Learn the basics of Robot Operating System (ROS) and how to use it for robotics development.",
    isUpcoming: true,
  },
  {
    id: 2,
    title: "Annual Robotics Competition",
    date: "February 20, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "University Main Auditorium",
    description: "Showcase your robotics projects and compete for prizes in various categories.",
    isUpcoming: true,
  },
  {
    id: 3,
    title: "Industry Talk: Future of Automation",
    date: "March 10, 2026",
    time: "4:00 PM - 6:00 PM",
    location: "Virtual Event (Zoom)",
    description: "Join industry experts as they discuss the future trends in robotics and automation.",
    isUpcoming: true,
  },
  {
    id: 4,
    title: "Hands-on Workshop: Building a Line Following Robot",
    date: "April 5, 2026",
    time: "11:00 AM - 3:00 PM",
    location: "Robotics Lab, Tech Building",
    description: "Practical session on building and programming a line following robot from scratch.",
    isUpcoming: false,
  },
];

export default function Events() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const initScrollTrigger = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      
      gsap.registerPlugin(ScrollTrigger);
      
      // Create timeline animation that progresses as user scrolls
      if (timelineRef.current) {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
          }
        });
        
        timeline.to(".timeline-progress", {
          height: "100%",
          duration: 1,
          ease: "none"
        });
        
        // Animate each event card
        gsap.from(".event-card", {
          x: -50,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            end: "bottom 60%",
            toggleActions: "play none none none"
          }
        });
      }
    };
    
    initScrollTrigger();
  }, []);

  return (
    <section
      id="events"
      ref={sectionRef}
      className="relative py-20 md:py-32"
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
            <span className="gradient-text">Events</span> & Workshops
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join our upcoming events to learn new skills, network with fellow robotics 
            enthusiasts, and stay updated with the latest in robotics technology.
          </p>
        </motion.div>
        
        {/* Timeline */}
        <div ref={timelineRef} className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-dark-300 transform md:translate-x-[-50%]">
            <div className="timeline-progress absolute top-0 left-0 w-full bg-gradient-to-b from-primary to-secondary h-0"></div>
          </div>
          
          {/* Events */}
          <div className="space-y-16">
            {events.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute left-[-8px] md:left-1/2 top-0 w-4 h-4 rounded-full bg-primary shadow-neon-cyan transform md:translate-x-[-50%] z-10"></div>
                
                {/* Event card */}
                <motion.div
                  className={`event-card ml-6 md:ml-0 ${
                    index % 2 === 0 ? "md:mr-[50%] md:pr-12" : "md:ml-[50%] md:pl-12"
                  }`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={`glass-card rounded-xl p-6 ${
                    event.isUpcoming ? "border-l-4 border-primary" : "border-l-4 border-gray-600"
                  }`}>
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-glow-cyan mb-2">
                        {event.title}
                      </h3>
                      {event.isUpcoming && (
                        <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
                          Upcoming
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 mb-4">
                      {event.description}
                    </p>
                    
                    <div className="flex flex-col space-y-2 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    {event.isUpcoming && (
                      <button className="mt-4 px-4 py-2 text-sm bg-dark-300 hover:bg-dark-200 text-primary rounded-lg transition-colors duration-300">
                        Register Now
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
        
        {/* View all events button */}
        <div className="text-center mt-16">
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center px-6 py-3 bg-transparent border border-primary rounded-full text-primary hover:bg-primary/10 hover:shadow-neon-cyan transition-all duration-300"
          >
            View All Events
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
