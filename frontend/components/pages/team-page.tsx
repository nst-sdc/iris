"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin } from "lucide-react";

// Define team member types
type Department = 'Core Team' | 'Research & Development' | 'Software' | 'Hardware' | 'Design';
type MemberType = 'Team' | 'Mentor' | 'Contributor';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: Department;
  type: MemberType;
  avatar: string;
  bio: string;
  github?: string;
  linkedin?: string;
}

// Sample team data
const teamData: TeamMember[] = [
  {
    id: "member-1",
    name: "Arpit Sarang",
    role: "Lead Developer",
    department: "Software",
    type: "Team",
    avatar: "/images/avatars/member1.jpg",
    bio: "Full-stack developer specializing in AI and robotics software integration. Led the development of our award-winning autonomous navigation system.",
    github: "https://github.com/CodeMaverick-143",
    linkedin: "https://linkedin.com/in/arpit-sarang"
  },
  {
    id: "member-2",
    name: "Maya Rodriguez",
    role: "Hardware Lead",
    department: "Hardware",
    type: "Team",
    avatar: "/images/avatars/member2.jpg",
    bio: "Electrical engineering expert with a focus on sensor integration and power systems for robotics applications.",
    github: "https://github.com/maya-robotics",
    linkedin: "https://linkedin.com/in/maya-rodriguez"
  },
  {
    id: "member-3",
    name: "Raj Patel",
    role: "Research Director",
    department: "Research & Development",
    type: "Team",
    avatar: "/images/avatars/member3.jpg",
    bio: "PhD in Robotics with expertise in computer vision and machine learning. Leads our research initiatives in autonomous systems.",
    github: "https://github.com/raj-robotics",
    linkedin: "https://linkedin.com/in/raj-patel"
  },
  {
    id: "member-4",
    name: "Alex Chen",
    role: "UI/UX Designer",
    department: "Design",
    type: "Team",
    avatar: "/images/avatars/member4.jpg",
    bio: "Creates intuitive interfaces for our robotics control systems. Passionate about making complex technology accessible.",
    github: "https://github.com/alex-design",
    linkedin: "https://linkedin.com/in/alex-chen"
  },
  {
    id: "member-5",
    name: "Dr. Sarah Johnson",
    role: "Technical Advisor",
    department: "Core Team",
    type: "Mentor",
    avatar: "/images/avatars/mentor1.jpg",
    bio: "Professor of Robotics at MIT with 15+ years of industry experience. Provides strategic guidance on our technical roadmap.",
    linkedin: "https://linkedin.com/in/sarah-johnson"
  },
  {
    id: "member-6",
    name: "Michael Zhang",
    role: "Robotics Engineer",
    department: "Hardware",
    type: "Team",
    avatar: "/images/avatars/member5.jpg",
    bio: "Specializes in mechanical design and prototyping. Has built robots for international competitions.",
    github: "https://github.com/michael-robotics",
    linkedin: "https://linkedin.com/in/michael-zhang"
  },
  {
    id: "member-7",
    name: "Emma Davis",
    role: "AI Researcher",
    department: "Research & Development",
    type: "Team",
    avatar: "/images/avatars/member6.jpg",
    bio: "Focuses on reinforcement learning algorithms for robotic manipulation. Previously worked at DeepMind.",
    github: "https://github.com/emma-ai",
    linkedin: "https://linkedin.com/in/emma-davis"
  },
  {
    id: "member-8",
    name: "Prof. Thomas Wright",
    role: "Industry Mentor",
    department: "Core Team",
    type: "Mentor",
    avatar: "/images/avatars/mentor2.jpg",
    bio: "Former CTO of RoboIndustries with extensive experience in bringing robotics products to market.",
    linkedin: "https://linkedin.com/in/thomas-wright"
  }
];

// Define filter departments
const departments: Department[] = ['Core Team', 'Research & Development', 'Software', 'Hardware', 'Design'];

export default function TeamPage() {
  // State for active department filter
  const [activeDepartment, setActiveDepartment] = useState<'All' | Department>('All');
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>(teamData);
  
  // Refs for animations
  const heroRef = useRef<HTMLElement>(null);
  const teamGridRef = useRef<HTMLDivElement>(null);
  const mentorSectionRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  
  // Filter members based on department
  useEffect(() => {
    if (activeDepartment === 'All') {
      setFilteredMembers(teamData);
    } else {
      setFilteredMembers(teamData.filter(member => member.department === activeDepartment));
    }
  }, [activeDepartment]);
  
  // Initialize GSAP animations
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize animations
    initAnimations();
    
    return () => {
      // Kill all ScrollTriggers on component unmount
      ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
    };
  }, []);
  
  // Re-initialize animations when filtered members change
  useEffect(() => {
    // Small timeout to ensure DOM is updated
    const timer = setTimeout(() => {
      initAnimations();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [filteredMembers]);
  
  // Initialize animations
  const initAnimations = () => {
    // Hero section parallax effect
    if (heroRef.current) {
      gsap.to(".parallax-bg", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: (i: number, target: Element) => -ScrollTrigger.maxScroll(window) * parseFloat((target as HTMLElement).dataset.speed || "0.2"),
        ease: "none"
      });
    }
    
    // Animate robot assistant
    if (robotRef.current) {
      gsap.to(robotRef.current, {
        y: "20px",
        rotation: 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
  };
  
  // Handle department filter change
  const handleDepartmentChange = (department: 'All' | Department) => {
    setActiveDepartment(department);
  };

  // Separate team members and mentors
  const teamMembers = filteredMembers.filter(member => member.type === 'Team');
  const mentors = filteredMembers.filter(member => member.type === 'Mentor');

  return (
    <>
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Parallax background layers */}
        <div className="absolute inset-0 z-0">
          <div className="parallax-bg absolute inset-0 bg-circuit-pattern opacity-10" data-speed="0.2"></div>
          <div className="parallax-bg absolute inset-0 bg-gradient-to-b from-dark-100/0 to-dark-100 z-10"></div>
        </div>
        
        {/* Content */}
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-glow-cyan">Meet the</span>{" "}
              <span className="gradient-text">IRIS Robotics Team</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Driven by passion, powered by collaboration.
            </p>
            
            {/* Animated circuit lines */}
            <div className="circuit-animation h-40 relative">
              <svg className="w-full h-full" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
                {/* Horizontal lines */}
                <motion.path
                  d="M50,50 L350,50"
                  stroke="#00F5FF"
                  strokeWidth="2"
                  strokeDasharray="350"
                  initial={{ strokeDashoffset: 350 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                
                {/* Vertical branches */}
                <motion.path
                  d="M100,50 L100,20 M200,50 L200,80 M300,50 L300,20"
                  stroke="#00F5FF"
                  strokeWidth="2"
                  strokeDasharray="30"
                  initial={{ strokeDashoffset: 30, opacity: 0 }}
                  animate={{ strokeDashoffset: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
                />
                
                {/* Connection nodes */}
                <motion.circle cx="100" cy="50" r="5" fill="#00F5FF"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                />
                <motion.circle cx="200" cy="50" r="5" fill="#00F5FF"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                />
                <motion.circle cx="300" cy="50" r="5" fill="#00F5FF"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                />
                
                {/* End nodes */}
                <motion.circle cx="100" cy="20" r="3" fill="#8B5CF6"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                />
                <motion.circle cx="200" cy="80" r="3" fill="#8B5CF6"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                />
                <motion.circle cx="300" cy="20" r="3" fill="#8B5CF6"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                />
                
                {/* Pulse effect */}
                <motion.circle cx="50" cy="50" r="5" fill="#00F5FF"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle cx="350" cy="50" r="5" fill="#00F5FF"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
        
        {/* Robot Assistant */}
        <div 
          ref={robotRef}
          className="fixed bottom-10 right-10 z-50 cursor-pointer"
          title="IRIS Robot Assistant"
          onClick={() => alert('Hello! I\'m your IRIS Robotics assistant. How can I help you today?')}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden shadow-glow">
            <div className="relative w-full h-full">
              <Image
                src="/images/robot-assistant.svg"
                alt="Robot Assistant"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Filters Section */}
      <section className="py-12 bg-dark-100">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              onClick={() => handleDepartmentChange('All')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeDepartment === 'All' ? "bg-white text-black hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]" : "bg-zinc-800/50 text-gray-300 border border-zinc-700/50 hover:bg-zinc-700/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"}`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              All
            </motion.button>
            
            {departments.map((department) => (
              <motion.button
                key={department}
                onClick={() => handleDepartmentChange(department)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${activeDepartment === department ? "bg-white text-black hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]" : "bg-zinc-800/50 text-gray-300 border border-zinc-700/50 hover:bg-zinc-700/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {department}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="py-20 bg-dark-50">
        <div className="container-custom">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">
                {activeDepartment === 'All' ? 'Our Team' : activeDepartment}
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
            <p className="text-gray-300 max-w-3xl mx-auto">
              {activeDepartment === 'All' 
                ? 'Meet the brilliant minds behind IRIS Robotics' 
                : `Our ${activeDepartment} specialists pushing the boundaries of innovation`}
            </p>
          </motion.div>
          
          {/* Team members grid */}
          <div ref={teamGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      {mentors.length > 0 && (
        <section className="py-20 bg-dark-100">
          <div className="container-custom">
            {/* Section heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-glow-violet">Our Mentors</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Industry leaders and academic experts guiding our journey
              </p>
            </motion.div>
            
            {/* Mentors grid */}
            <div ref={mentorSectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {mentors.map((mentor, index) => (
                <MentorCard key={mentor.id} mentor={mentor} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join CTA Section */}
      <section className="py-20 bg-dark-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-glow-cyan">Want to join</span>{" "}
              <span className="gradient-text">the IRIS Team?</span>
            </h2>
            <p className="text-gray-300 mb-10">
              We're always looking for passionate individuals to join our community of innovators.
              Whether you're a developer, designer, or robotics enthusiast, there's a place for you here.
            </p>
            <motion.a
              href="#"
              className="inline-block px-8 py-4 bg-white text-black rounded-lg font-medium hover:shadow-[0_0_25px_rgba(0,245,255,0.3)] transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply for Membership
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// Team Member Card Component
interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

const TeamMemberCard = ({ member, index }: TeamMemberCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card rounded-xl overflow-hidden group"
    >
      <div className="p-6 flex flex-col items-center text-center">
        {/* Avatar with neon ring */}
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              {/* Placeholder for avatar */}
              <span className="text-2xl font-bold text-white/50">{member.name.charAt(0)}</span>
            </div>
            {/* Uncomment when images are available */}
            {/* <Image 
              src={member.avatar} 
              alt={member.name}
              fill
              className="object-cover"
            /> */}
          </div>
          <div className="absolute -inset-1 rounded-full border border-primary opacity-0 group-hover:opacity-70 transition-opacity duration-300 animate-pulse-slow"></div>
        </div>
        
        {/* Member info */}
        <h3 className="text-xl font-bold mb-1 group-hover:text-glow-cyan transition-all">
          {member.name}
        </h3>
        <p className="text-primary mb-1">{member.role}</p>
        <p className="text-sm text-gray-400 mb-4">{member.department}</p>
        
        {/* Social links */}
        <div className="flex space-x-3 mb-4">
          {member.github && (
            <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
              <Github size={18} />
            </a>
          )}
          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
              <Linkedin size={18} />
            </a>
          )}
        </div>
        
        {/* Bio - hidden by default, shown on hover */}
        <motion.div 
          className="text-sm text-gray-300 mt-2 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          whileHover={{ height: "auto", opacity: 1 }}
        >
          <p>{member.bio}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Mentor Card Component
interface MentorCardProps {
  mentor: TeamMember;
  index: number;
}

const MentorCard = ({ mentor, index }: MentorCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="glass-card rounded-xl overflow-hidden group"
    >
      <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar with glowing halo */}
        <div className="relative">
          <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-violet-500 shadow-glow-violet">
            <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-primary/20 flex items-center justify-center">
              {/* Placeholder for avatar */}
              <span className="text-3xl font-bold text-white/50">{mentor.name.charAt(0)}</span>
            </div>
            {/* Uncomment when images are available */}
            {/* <Image 
              src={mentor.avatar} 
              alt={mentor.name}
              fill
              className="object-cover"
            /> */}
          </div>
          <motion.div 
            className="absolute -inset-3 rounded-full bg-violet-500/10 z-0"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Mentor info */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-bold mb-2 text-glow-violet">
            {mentor.name}
          </h3>
          <p className="text-primary text-lg mb-2">{mentor.role}</p>
          <p className="text-gray-300 mb-6">{mentor.bio}</p>
          
          {/* Social links */}
          <div className="flex space-x-4 justify-center md:justify-start">
            {mentor.github && (
              <a href={mentor.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-violet-400 transition-colors">
                <Github size={20} />
              </a>
            )}
            {mentor.linkedin && (
              <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-violet-400 transition-colors">
                <Linkedin size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
