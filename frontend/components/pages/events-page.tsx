"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Calendar, Clock, MapPin, Award, Users } from "lucide-react";

// Import GSAP and ScrollTrigger
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";


// Define event types
type EventType = 'Workshop' | 'Competition' | 'Hackathon' | 'Meetup';
type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed';
type ViewMode = 'timeline' | 'grid';

// Event detail modal state
interface EventDetailState {
  isOpen: boolean;
  event: EventData | null;
}

interface EventSpeaker {
  name: string;
  role: string;
  avatar: string;
}

interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  endDate?: string;
  location: string;
  type: EventType;
  status: EventStatus;
  description: string;
  image: string;
  featured: boolean;
  registerLink?: string;
  recapLink?: string;
  speakers?: EventSpeaker[];
}

// Sample event data
const eventsData: EventData[] = [
  {
    id: "event-1",
    title: "IRIS Robotics Hackathon 2025",
    date: "2025-03-14",
    time: "09:00 AM - 09:00 AM (Next day)",
    location: "Main Engineering Building, Room 305",
    type: "Hackathon",
    status: "Upcoming",
    description: "A 24-hour robotics build-a-thon focusing on automation and AI challenges. Teams will compete to build innovative solutions for real-world problems.",
    image: "/images/events/hackathon2025.jpg",
    featured: true,
    registerLink: "#"
  },
  {
    id: "event-2",
    title: "Autonomous Drone Workshop",
    date: "2025-02-20",
    time: "02:00 PM - 05:00 PM",
    location: "Robotics Lab, Building 4",
    type: "Workshop",
    status: "Upcoming",
    description: "Learn how to program autonomous flight patterns and object recognition for drone applications. Hands-on session with our fleet of training drones.",
    image: "/images/events/drone-workshop.jpg",
    featured: true,
    registerLink: "#",
    speakers: [
      {
        name: "Dr. Sarah Chen",
        role: "Drone Systems Engineer",
        avatar: "/images/team/sarah.jpg"
      }
    ]
  },
  {
    id: "event-3",
    title: "AI in Robotics Symposium",
    date: "2025-01-15",
    time: "10:00 AM - 04:00 PM",
    location: "Virtual Event",
    type: "Meetup",
    status: "Upcoming",
    description: "Join leading researchers and practitioners for a day of talks and discussions on the latest advancements in AI for robotics applications.",
    image: "/images/events/ai-symposium.jpg",
    featured: false,
    registerLink: "#"
  },
  {
    id: "event-4",
    title: "Winter Robotics Showcase",
    date: "2024-12-10",
    time: "03:00 PM - 07:00 PM",
    location: "University Exhibition Hall",
    type: "Competition",
    status: "Ongoing",
    description: "Our annual showcase of student projects and research. Come see the cutting-edge innovations from our robotics teams and vote for your favorites.",
    image: "/images/events/winter-showcase.jpg",
    featured: true,
    registerLink: "#"
  },
  {
    id: "event-5",
    title: "ROS2 Fundamentals Workshop",
    date: "2024-11-05",
    time: "01:00 PM - 04:00 PM",
    location: "Computer Lab 2",
    type: "Workshop",
    status: "Completed",
    description: "An introduction to Robot Operating System 2 (ROS2) for beginners. Learn the basics of nodes, topics, services, and how to build simple robotic applications.",
    image: "/images/events/ros-workshop.jpg",
    featured: false,
    recapLink: "#"
  },
  {
    id: "event-6",
    title: "Robotic Arm Programming Challenge",
    date: "2024-10-20",
    time: "09:00 AM - 06:00 PM",
    location: "Engineering Building, Room 201",
    type: "Competition",
    status: "Completed",
    description: "A day-long competition where teams programmed robotic arms to complete a series of precision tasks. Prizes awarded for speed, accuracy, and innovation.",
    image: "/images/events/arm-challenge.jpg",
    featured: false,
    recapLink: "#"
  },
  {
    id: "event-7",
    title: "Industry 4.0 and Robotics",
    date: "2024-09-15",
    time: "05:00 PM - 07:00 PM",
    location: "Lecture Hall 3",
    type: "Meetup",
    status: "Completed",
    description: "A panel discussion with industry experts on how robotics is transforming manufacturing and industrial processes in the age of Industry 4.0.",
    image: "/images/events/industry40.jpg",
    featured: false,
    recapLink: "#"
  },
  {
    id: "event-8",
    title: "Summer Robotics Bootcamp",
    date: "2024-07-10",
    endDate: "2024-07-14",
    time: "09:00 AM - 04:00 PM",
    location: "Robotics Lab",
    type: "Workshop",
    status: "Completed",
    description: "An intensive 5-day bootcamp covering mechanical design, electronics, programming, and AI for robotics. Participants built their own robot from scratch.",
    image: "/images/events/bootcamp.jpg",
    featured: true,
    recapLink: "#"
  }
];

export default function EventsPage() {
  // State for filtering and display
  const [activeFilter, setActiveFilter] = useState<'All' | EventStatus>('All');
  const [activeType, setActiveType] = useState<'All' | EventType>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>(eventsData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [eventDetail, setEventDetail] = useState<EventDetailState>({ isOpen: false, event: null });

  // Group events by year and month for better timeline organization
  interface GroupedEvents {
    [year: string]: {
      [month: string]: EventData[];
    };
  }

  const groupedEvents = useMemo<GroupedEvents>(() => {
    const grouped: GroupedEvents = {};
    
    filteredEvents.forEach((event: EventData) => {
      const date = new Date(event.date);
      const year = date.getFullYear().toString();
      const month = date.toLocaleString('default', { month: 'long' });
      
      if (!grouped[year]) {
        grouped[year] = {};
      }
      
      if (!grouped[year][month]) {
        grouped[year][month] = [];
      }
      
      grouped[year][month].push(event);
    });
    
    return grouped;
  }, [filteredEvents]);
  
  // Refs for animations and functionality
  const timelineRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Initialize animations after loading
      initAnimations();
    }, 800);
    
    // Apply initial filters
    filterEvents();
    
    return () => {
      clearTimeout(timer);
      // Kill all ScrollTriggers on component unmount
      ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
    };
  }, []);
  
  useEffect(() => {
    // Re-filter events when filters change
    filterEvents();
  }, [activeFilter, activeType]);
  
  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    // Re-initialize animations when filtered events or view mode changes
    if (!isLoading) {
      // Reset scroll triggers
      ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
      // Reinitialize animations with a slight delay to ensure DOM updates
      setTimeout(() => {
        initAnimations();
      }, 100);
    }
  }, [filteredEvents, viewMode, isLoading]);
  
  // Advanced filter events based on multiple criteria
  const filterEvents = () => {
    // Start with all events
    let filtered = [...eventsData];
    
    // Apply status filter
    if (activeFilter !== 'All') {
      filtered = filtered.filter(event => event.status === activeFilter);
    }
    
    // Apply type filter
    if (activeType !== 'All') {
      filtered = filtered.filter(event => event.type === activeType);
    }
    
    // Apply search filter if implemented
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }
    
    // Sort events based on date and status
    filtered = sortEvents(filtered);
    
    // Update state with animation flag for smooth transitions
    setIsFiltering(true);
    setTimeout(() => {
      setFilteredEvents(filtered);
      setIsFiltering(false);
    }, 300);
  };
  
  // Sort events by date and timeframe
  const sortEvents = (events: EventData[]): EventData[] => {
    return [...events].sort((a, b) => {
      const timeframeA = getEventTimeframe(a);
      const timeframeB = getEventTimeframe(b);
      
      // First sort by timeframe (future, present, past)
      if (timeframeA !== timeframeB) {
        if (timeframeA === 'future') return -1;
        if (timeframeB === 'future') return 1;
        if (timeframeA === 'present') return -1;
        if (timeframeB === 'present') return 1;
      }
      
      // Then sort by date within each timeframe
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (timeframeA === 'future' || timeframeA === 'present') {
        // Upcoming events: soonest first
        return dateA.getTime() - dateB.getTime();
      } else {
        // Past events: most recent first
        return dateB.getTime() - dateA.getTime();
      }
    });
  };
  
  const initAnimations = () => {
    // Hero section animations with improved effects
    gsap.from(".hero-title", {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.2
    });
    
    gsap.from(".hero-subtitle", {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      delay: 0.4
    });
    
    // Parallax background effect
    if (headerRef.current) {
      gsap.to(".parallax-bg", {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: (i: number, target: Element) => -ScrollTrigger.maxScroll(window) * parseFloat((target as HTMLElement).dataset.speed || "0.2"),
        ease: "none"
      });
    }
    
    // Filter section animations
    if (filterRef.current) {
      gsap.from(".filter-item", {
        scrollTrigger: {
          trigger: filterRef.current,
          start: "top 85%"
        },
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
      });
    }
    
    // Timeline animations with improved effects
    if (timelineRef.current && viewMode === 'timeline') {
      // Animate timeline line with glow effect
      gsap.fromTo(".timeline-line", 
        { scaleY: 0, opacity: 0.4 },
        {
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 85%",
            end: "bottom 15%",
            scrub: true
          },
          scaleY: 1,
          opacity: 1,
          transformOrigin: "top center",
          ease: "power1.inOut"
        }
      );
      
      // Animate timeline dots with pulse effect
      gsap.from(".timeline-dot", {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 85%",
          end: "bottom 15%",
          scrub: 0.5
        },
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
      
      // Animate timeline events with staggered entrance
      gsap.from(".timeline-event", {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.5
        },
        opacity: 0,
        x: (i: number) => i % 2 === 0 ? -50 : 50,
        stagger: 0.15,
        ease: "power2.out"
      });
    }
    
    // Grid view animations
    if (gridRef.current && viewMode === 'grid') {
      gsap.from(".event-card", {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%"
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
      });
    }
    
    // Featured events animations with improved effects
    if (featuredRef.current) {
      gsap.from(".featured-event", {
        scrollTrigger: {
          trigger: featuredRef.current,
          start: "top 80%"
        },
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  };
  
  // Handle status filter change with debounce for better performance
  const handleStatusFilterChange = (filter: 'All' | EventStatus) => {
    // Only update if different from current filter
    if (filter !== activeFilter) {
      setActiveFilter(filter);
      // filterEvents will be called via useEffect
    }
  };
  
  // Handle type filter change with debounce for better performance
  const handleTypeFilterChange = (type: 'All' | EventType) => {
    // Only update if different from current filter
    if (type !== activeType) {
      setActiveType(type);
      // filterEvents will be called via useEffect
    }
  };
  
  // Handle search input change with debounce
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Use debounce to avoid too many filter operations while typing
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      filterEvents();
    }, 300) as unknown as NodeJS.Timeout;
  };
  
  // Reset all filters
  const resetFilters = () => {
    setActiveFilter('All');
    setActiveType('All');
    setSearchQuery('');
    // Small timeout to ensure state updates before filtering
    setTimeout(filterEvents, 10);
  };
  
  // Toggle view mode between timeline and grid
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'timeline' ? 'grid' : 'timeline');
  };
  
  // Open event detail modal
  const openEventDetail = (event: EventData) => {
    setEventDetail({ isOpen: true, event });
  };
  
  // Close event detail modal
  const closeEventDetail = () => {
    setEventDetail({ isOpen: false, event: null });
  };
  
  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'Upcoming':
        return 'text-primary border-primary bg-primary/10';
      case 'Ongoing':
        return 'text-green-400 border-green-400 bg-green-400/10';
      case 'Completed':
        return 'text-gray-400 border-gray-400 bg-gray-400/10';
      default:
        return 'text-primary border-primary bg-primary/10';
    }
  };
  
  const getEventTypeIcon = (type: EventType) => {
    switch (type) {
      case 'Workshop':
        return <Users className="w-4 h-4" />;
      case 'Competition':
        return <Award className="w-4 h-4" />;
      case 'Hackathon':
        return <Clock className="w-4 h-4" />;
      case 'Meetup':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get featured events
  const featuredEvents = eventsData.filter(event => event.featured);
  
  // Function to determine if event is in the past, present, or future
  const getEventTimeframe = (event: EventData): 'past' | 'present' | 'future' => {
    const today = new Date();
    const eventDate = new Date(event.date);
    const eventEndDate = event.endDate ? new Date(event.endDate) : eventDate;
    
    if (eventEndDate < today) return 'past';
    if (eventDate > today) return 'future';
    return 'present';
  };
  
  // Sort events by date (most recent first for past events, soonest first for upcoming)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const timeframeA = getEventTimeframe(a);
    const timeframeB = getEventTimeframe(b);
    
    // First sort by timeframe (future, present, past)
    if (timeframeA !== timeframeB) {
      if (timeframeA === 'future') return -1;
      if (timeframeB === 'future') return 1;
      if (timeframeA === 'present') return -1;
      if (timeframeB === 'present') return 1;
    }
    
    // Then sort by date within each timeframe
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (timeframeA === 'future' || timeframeA === 'present') {
      // Upcoming events: soonest first
      return dateA.getTime() - dateB.getTime();
    } else {
      // Past events: most recent first
      return dateB.getTime() - dateA.getTime();
    }
  });

  return (
    <>
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 z-50 bg-dark flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="w-16 h-16 mb-4 mx-auto relative">
                <motion.div 
                  className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-2 rounded-full border-b-2 border-l-2 border-secondary"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <p className="text-gray-300 text-sm">Loading events...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hero Header */}
      <section 
        ref={headerRef}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Parallax background layers */}
        <div className="absolute inset-0 z-0">
          <div className="parallax-bg absolute inset-0 bg-circuit-pattern opacity-10" data-speed="0.2"></div>
          <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-dark-100/0 to-dark-100 z-10"></div>
        </div>
        
        {/* Glowing grid lines */}
        <div className="absolute inset-0 z-0">
          <div className="grid-lines"></div>
        </div>
        
        {/* Content */}
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-glow-cyan">IRIS Robotics</span>{" "}
              <span className="gradient-text">Events & Workshops</span>
            </h1>
            <p className="hero-subtitle text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Learn, Build, and Compete — Together.
            </p>
            
            {/* Event counter stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <motion.div 
                className="glass-card px-6 py-4 rounded-xl flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <span className="text-3xl font-bold text-glow-cyan mb-1">
                  {eventsData.filter(e => e.status === 'Upcoming').length}
                </span>
                <span className="text-sm text-gray-400">Upcoming Events</span>
              </motion.div>
              
              <motion.div 
                className="glass-card px-6 py-4 rounded-xl flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <span className="text-3xl font-bold text-glow-green mb-1">
                  {eventsData.filter(e => e.status === 'Ongoing').length}
                </span>
                <span className="text-sm text-gray-400">Ongoing Events</span>
              </motion.div>
              
              <motion.div 
                className="glass-card px-6 py-4 rounded-xl flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span className="text-3xl font-bold gradient-text mb-1">
                  {eventsData.filter(e => e.status === 'Completed').length}
                </span>
                <span className="text-sm text-gray-400">Past Events</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-primary flex items-start justify-center p-1">
              <motion.div 
                className="w-1.5 h-1.5 bg-primary rounded-full"
                animate={{ 
                  y: [0, 12, 0],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Advanced Filters Section */}
      <section className="py-10 bg-dark-100">
        <div className="container-custom">
          <div ref={filterRef} className="space-y-6">
            {/* Search bar */}
            <div className="filter-item relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events by title, description, or location..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && filterEvents()}
                  className="w-full px-4 py-3 pl-10 bg-dark-300 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              {/* Filter buttons */}
              <div className="flex flex-wrap gap-4">
                {/* Status filter */}
                <div className="filter-item">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Upcoming', 'Ongoing', 'Completed'].map((status) => (
                      <motion.button
                        key={status}
                        onClick={() => {
                          handleStatusFilterChange(status as 'All' | EventStatus);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                          activeFilter === status
                            ? "bg-gradient-to-r from-primary to-secondary text-dark shadow-neon-glow"
                            : "bg-dark-300 text-gray-300 hover:bg-dark-200"
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {status}
                        {status !== 'All' && (
                          <span className="ml-1 opacity-70">
                            ({eventsData.filter(e => e.status === status).length})
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {/* Type filter */}
                <div className="filter-item">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Event Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Workshop', 'Competition', 'Hackathon', 'Meetup'].map((type) => (
                      <motion.button
                        key={type}
                        onClick={() => {
                          handleTypeFilterChange(type as 'All' | EventType);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                          activeType === type
                            ? "bg-gradient-to-r from-primary to-secondary text-dark shadow-neon-glow"
                            : "bg-dark-300 text-gray-300 hover:bg-dark-200"
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {type}
                        {type !== 'All' && (
                          <span className="ml-1 opacity-70">
                            ({eventsData.filter(e => e.type === type).length})
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* View toggle and reset */}
              <div className="flex items-center gap-3">
                {/* Reset filters button */}
                {(activeFilter !== 'All' || activeType !== 'All' || searchQuery) && (
                  <motion.button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-dark-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-dark-200 transition-colors text-primary"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Reset Filters</span>
                  </motion.button>
                )}
                
                {/* View toggle */}
                <motion.button
                  onClick={toggleViewMode}
                  className="px-4 py-2 bg-dark-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-dark-200 transition-colors"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {viewMode === 'timeline' ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      <span>Grid View</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span>Timeline View</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            
            {/* Filter stats */}
            <div className="flex justify-between items-center pt-2">
              <p className="text-sm text-gray-400">
                Showing {filteredEvents.length} of {eventsData.length} events
                {activeFilter !== 'All' && <span> • Filtered by {activeFilter}</span>}
                {activeType !== 'All' && <span> • Type: {activeType}</span>}
                {searchQuery && <span> • Search: "{searchQuery}"</span>}
              </p>
              
              {/* Loading indicator */}
              {isFiltering && (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-xs text-gray-400">Updating...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Events Carousel */}
      {featuredEvents.length > 0 && (
        <section className="py-20 bg-dark-100">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">Featured</span> Events
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Highlights of our most exciting robotics events and opportunities
              </p>
            </motion.div>
            
            <div 
              ref={featuredRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="featured-event glass-card rounded-xl overflow-hidden hover-lift group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="relative h-60 overflow-hidden">
                    {/* Placeholder for event image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white/50">{event.title}</span>
                    </div>
                    {/* Uncomment when images are available */}
                    {/* <Image 
                      src={event.image} 
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    /> */}
                    
                    {/* Status badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                      {event.status}
                    </div>
                    
                    {/* Type badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-dark/80 text-xs font-medium text-primary flex items-center">
                      {getEventTypeIcon(event.type)}
                      <span className="ml-1">{event.type}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-glow-cyan transition-all">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between">
                      {event.status === 'Completed' ? (
                        <a 
                          href={event.recapLink} 
                          className="px-4 py-2 bg-dark-300 rounded-lg text-primary hover:bg-dark-200 transition-colors text-sm font-medium"
                        >
                          View Recap
                        </a>
                      ) : (
                        <a 
                          href={event.registerLink} 
                          className="px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg text-white hover:from-primary/30 hover:to-secondary/30 transition-colors text-sm font-medium"
                        >
                          Register Now
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Main Content Section - Conditionally render timeline or grid view */}
      <section className="py-20 relative overflow-hidden bg-dark-50">
        <div className="container-custom">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">
                {activeFilter === 'All' ? 'All' : activeFilter}
              </span>
              {activeType !== 'All' && <span className="ml-2">{activeType}</span>} Events
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
            <p className="text-gray-300 max-w-3xl mx-auto">
              {filteredEvents.length === 0 ? 
                'No events found matching your filters.' : 
                `Showing ${filteredEvents.length} ${activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} ${activeType !== 'All' ? activeType.toLowerCase() : ''} events.`
              }
            </p>
          </motion.div>
          
          {/* No results message */}
          {filteredEvents.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">No events found</h3>
              <p className="text-gray-400 mb-6">Try changing your filters to see more results.</p>
              <motion.button
                onClick={() => {
                  handleStatusFilterChange('All');
                  handleTypeFilterChange('All');
                }}
                className="px-6 py-3 bg-dark-300 rounded-lg text-primary hover:bg-dark-200 transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset Filters
              </motion.button>
            </motion.div>
          )}
          
          {/* Timeline View */}
          {viewMode === 'timeline' && filteredEvents.length > 0 && (
            <div ref={timelineRef} className="relative py-10">
              {/* Center timeline line - enhanced with glow effect */}
              <div className="timeline-line absolute left-1/2 transform -translate-x-1/2 w-1.5 bg-gradient-to-b from-primary via-secondary to-primary h-full rounded-full shadow-glow opacity-80"></div>
              
              {/* Year markers */}
              {Object.keys(groupedEvents).sort().reverse().map((year, yearIndex) => (
                <div key={year} className="mb-16">
                  {/* Year heading */}
                  <motion.div 
                    className="relative z-10 mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-dark-200 border-2 border-primary shadow-glow-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-glow-cyan">{year}</span>
                    </div>
                  </motion.div>
                  
                  {/* Months and events */}
                  {Object.keys(groupedEvents[year]).map((month, monthIndex) => (
                    <div key={`${year}-${month}`} className="mb-12">
                      {/* Month heading */}
                      <motion.h3 
                        className="text-xl font-bold text-center mb-8 relative z-10"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="bg-dark-100 px-6 py-2 rounded-full">{month}</span>
                      </motion.h3>
                      
                      {/* Events in this month */}
                      {groupedEvents[year][month].map((event: EventData, eventIndex: number) => (
                        <div 
                          key={event.id}
                          className={`timeline-event flex items-center mb-16 ${eventIndex % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                        >
                          {/* Event card - enhanced with better hover effects */}
                          <motion.div 
                            className="w-5/12 glass-card rounded-xl overflow-hidden cursor-pointer group"
                            initial={{ opacity: 0, x: eventIndex % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            whileHover={{ y: -5, boxShadow: '0 0 20px rgba(0, 200, 255, 0.3)' }}
                            onClick={() => openEventDetail(event)}
                          >
                            <div className="relative h-40 overflow-hidden">
                              {/* Placeholder for event image */}
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                <span className="text-xl font-bold text-white/50">{event.title}</span>
                              </div>
                              {/* Uncomment when images are available */}
                              {/* <Image 
                                src={event.image} 
                                alt={event.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              /> */}
                              
                              {/* Status badge */}
                              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                                {event.status}
                              </div>
                              
                              {/* Type badge */}
                              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-dark/80 text-xs font-medium text-primary flex items-center">
                                {getEventTypeIcon(event.type)}
                                <span className="ml-1">{event.type}</span>
                              </div>
                            </div>
                            
                            <div className="p-5">
                              <h3 className="text-lg font-bold mb-2 group-hover:text-glow-cyan transition-all">
                                {event.title}
                              </h3>
                              
                              <div className="flex items-center text-sm text-gray-400 mb-2">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span>{formatDate(event.date)}</span>
                                {event.endDate && (
                                  <span className="ml-2">- {formatDate(event.endDate)}</span>
                                )}
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-400 mb-2">
                                <MapPin className="w-4 h-4 mr-2" />
                                <span className="truncate">{event.location}</span>
                              </div>
                              
                              <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between items-center">
                                <span className="text-xs text-primary">View details</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary transform group-hover:translate-x-1 transition-transform">
                                  <path d="M9 18l6-6-6-6"/>
                                </svg>
                              </div>
                            </div>
                          </motion.div>
                          
                          {/* Center dot with enhanced pulse effect */}
                          <div className="relative w-2/12 flex justify-center">
                            <div className="absolute w-px h-full bg-gray-800 z-0"></div>
                            <motion.div 
                              className="timeline-dot relative w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary shadow-neon-glow z-10"
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            >
                              {/* Inner pulse effect */}
                              <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></span>
                            </motion.div>
                          </div>
                          
                          {/* Date display with enhanced styling */}
                          <motion.div 
                            className="w-5/12 flex items-center"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            <div className={`${eventIndex % 2 === 0 ? 'ml-8' : 'mr-8 text-right'}`}>
                              <div className="text-xl font-bold text-glow-cyan">{formatDate(event.date).split(',')[0]}</div>
                              <div className="text-gray-400 text-sm">{event.time}</div>
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          
          {/* Grid View */}
          {viewMode === 'grid' && filteredEvents.length > 0 && (
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="event-card glass-card rounded-xl overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, boxShadow: '0 0 20px rgba(0, 200, 255, 0.3)' }}
                  onClick={() => openEventDetail(event)}
                >
                  <div className="relative h-48 overflow-hidden">
                    {/* Placeholder for event image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white/50">{event.title}</span>
                    </div>
                    {/* Uncomment when images are available */}
                    {/* <Image 
                      src={event.image} 
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    /> */}
                    
                    {/* Status badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                      {event.status}
                    </div>
                    
                    {/* Type badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-dark/80 text-xs font-medium text-primary flex items-center">
                      {getEventTypeIcon(event.type)}
                      <span className="ml-1">{event.type}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-glow-cyan transition-all">
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(event.date)}</span>
                      {event.endDate && (
                        <span className="ml-2">- {formatDate(event.endDate)}</span>
                      )}
                    </div>
                    
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                      <span className="text-xs text-primary">View details</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary transform group-hover:translate-x-1 transition-transform">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Event Detail Modal */}
      <AnimatePresence>
        {eventDetail.isOpen && eventDetail.event && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEventDetail}
          >
            <motion.div
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeEventDetail}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-dark-300 flex items-center justify-center text-gray-400 hover:text-white z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              {/* Event header */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                {/* Placeholder for event image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white/70">{eventDetail.event.title}</span>
                </div>
                {/* Uncomment when images are available */}
                {/* <Image 
                  src={eventDetail.event.image} 
                  alt={eventDetail.event.title}
                  fill
                  className="object-cover"
                /> */}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                
                {/* Status badge */}
                <div className="absolute top-6 left-6">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(eventDetail.event.status)}`}>
                    {eventDetail.event.status}
                  </div>
                </div>
                
                {/* Type badge */}
                <div className="absolute top-6 right-16 px-3 py-1 rounded-full bg-dark/80 text-xs font-medium text-primary flex items-center">
                  {getEventTypeIcon(eventDetail.event.type)}
                  <span className="ml-1">{eventDetail.event.type}</span>
                </div>
                
                {/* Event title */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-3xl font-bold text-white text-glow-cyan">{eventDetail.event.title}</h2>
                </div>
              </div>
              
              {/* Event content */}
              <div className="p-6 md:p-8">
                {/* Date and time */}
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <div className="text-sm text-gray-400">Date</div>
                      <div className="font-medium">
                        {formatDate(eventDetail.event.date)}
                        {eventDetail.event.endDate && (
                          <span> - {formatDate(eventDetail.event.endDate)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <div className="text-sm text-gray-400">Time</div>
                      <div className="font-medium">{eventDetail.event.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <div className="text-sm text-gray-400">Location</div>
                      <div className="font-medium">{eventDetail.event.location}</div>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-glow-violet">About the Event</h3>
                  <p className="text-gray-300">{eventDetail.event.description}</p>
                </div>
                
                {/* Speakers */}
                {eventDetail.event.speakers && eventDetail.event.speakers.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-glow-cyan">Speakers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {eventDetail.event.speakers.map((speaker, index) => (
                        <div key={index} className="glass-card p-4 rounded-lg flex items-center">
                          {/* Placeholder for speaker avatar */}
                          <div className="w-12 h-12 rounded-full bg-dark-300 flex items-center justify-center mr-4">
                            <span className="text-lg font-medium">{speaker.name.charAt(0)}</span>
                            {/* Uncomment when avatars are available */}
                            {/* <Image 
                              src={speaker.avatar} 
                              alt={speaker.name}
                              width={48}
                              height={48}
                              className="rounded-full object-cover"
                            /> */}
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{speaker.name}</h4>
                            <p className="text-xs text-gray-400">{speaker.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Action button */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                  {eventDetail.event.status === 'Completed' ? (
                    <a 
                      href={eventDetail.event.recapLink} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-dark-300 rounded-lg text-primary hover:bg-dark-200 transition-colors text-sm font-medium"
                    >
                      View Event Recap
                    </a>
                  ) : (
                    <a 
                      href={eventDetail.event.registerLink} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg text-white hover:from-primary/30 hover:to-secondary/30 transition-colors text-sm font-medium"
                    >
                      Register for this Event
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer CTA */}
      <section className="py-20 bg-dark-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-glow-cyan">Want to host or propose</span>{" "}
              <span className="gradient-text">an event?</span>
            </h2>
            <p className="text-gray-300 mb-8">
              Have an idea for a workshop, competition, or meetup? We're always looking for new
              events to add to our calendar. Submit your proposal and join our community of innovators.
            </p>
            <motion.a
              href="#"
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-dark font-medium hover:shadow-neon-glow transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Event Idea
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
