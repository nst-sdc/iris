"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import { eventsAPI } from "@/lib/api";

interface HomeEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  isUpcoming: boolean;
}

export default function Events() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [homeEvents, setHomeEvents] = useState<HomeEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventsAPI.getAll();
        // Map API events to the display format, show latest 4
        const mapped: HomeEvent[] = data
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4)
          .map((event: any) => ({
            id: typeof event._id === 'string' ? event._id : event._id?.$oid || event.id || '',
            title: event.title,
            date: new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            time: event.time,
            location: event.location,
            description: event.description,
            isUpcoming: event.status === 'Upcoming' || event.status === 'Ongoing',
          }));
        setHomeEvents(mapped);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);
  
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
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
            <p className="text-gray-400 mt-4">Loading events...</p>
          </div>
        ) : homeEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No events yet. Check back soon!</p>
          </div>
        ) : (
        <div ref={timelineRef} className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-zinc-800/50 transform md:translate-x-[-50%]">
            <div className="timeline-progress absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400 to-blue-500 h-0"></div>
          </div>
          
          {/* Events */}
          <div className="space-y-12 sm:space-y-16">
            {homeEvents.map((event, index) => (
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
        )}
      </div>
    </section>
  );
}
