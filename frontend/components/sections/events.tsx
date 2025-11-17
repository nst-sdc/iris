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
          },
  clearProps: "all",
        });
      }
    };
    
    initScrollTrigger();
  }, []);

  return (
    <section
      id="events"
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-black overflow-hidden"
    >
      <div className="container-custom max-w-6xl relative z-10 px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-white">
            Events & Workshops
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl">
            Join our upcoming events to learn new skills and network with fellow robotics enthusiasts.
          </p>
        </motion.div>
        
        {/* Timeline */}
        <div ref={timelineRef} className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-zinc-800/50 transform md:translate-x-[-50%]">
            <div className="timeline-progress absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400 to-blue-500 h-0"></div>
          </div>
          
          {/* Events */}
          <div className="space-y-12 sm:space-y-16">
            {events.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute left-[-6px] md:left-1/2 top-0 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] transform md:translate-x-[-50%] z-10"></div>
                
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
                  <div className={`relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-6 sm:p-8 ${
                    event.isUpcoming ? "border-l-4 border-l-cyan-400 hover:bg-zinc-900/50" : "border-l-4 border-l-zinc-700"
                  } transition-all duration-300`}>
                    <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">
                        {event.title}
                      </h3>
                      {event.isUpcoming && (
                        <span className="px-3 py-1 text-xs font-medium bg-cyan-400/10 text-cyan-400 rounded-full border border-cyan-400/20">
                          Upcoming
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-sm sm:text-base mb-4">
                      {event.description}
                    </p>
                    
                    <div className="flex flex-col space-y-2 text-xs sm:text-sm text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-cyan-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    {event.isUpcoming && (
                      <button className="mt-6 w-full sm:w-auto px-4 py-2 text-sm bg-zinc-800/50 hover:bg-zinc-800 text-cyan-400 rounded-lg border border-zinc-700/50 hover:border-cyan-400/50 transition-all duration-300">
                        Register Now
                      </button>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-violet-500/0 group-hover:from-cyan-500/5 group-hover:to-violet-500/5 transition-all duration-500 pointer-events-none" />
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
