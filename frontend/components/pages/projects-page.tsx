"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Github, Users, Calendar } from "lucide-react";

// Import GSAP and ScrollTrigger
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Define project types
type TeamMember = {
  name: string;
  role: string;
  avatar: string;
};

type ProjectLinks = {
  github: string;
  demo: string;
};

type BaseProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  team: TeamMember[];
  startDate: string;
  endDate: string;
};

type OngoingProject = BaseProject & {
  progress: number;
  links: ProjectLinks;
};

type CompletedProject = BaseProject & {
  links: ProjectLinks;
};

type UpcomingProject = BaseProject;

type ProjectsDataType = {
  ongoing: OngoingProject[];
  completed: CompletedProject[];
  upcoming: UpcomingProject[];
};

// Project data categorized
const projectsData: ProjectsDataType = {
  ongoing: [
    {
      id: "ongoing-1",
      title: "Autonomous Drone System",
      category: "Aerial Robotics",
      description: "AI-powered drone with object recognition and autonomous navigation capabilities for search and rescue operations.",
      image: "/images/projects/drone.jpg",
      tags: ["Computer Vision", "AI", "Navigation"],
      progress: 75,
      team: [
        { name: "Alex Chen", role: "Project Lead", avatar: "/images/team/alex.jpg" },
        { name: "Maya Rodriguez", role: "AI Specialist", avatar: "/images/team/maya.jpg" },
        { name: "Raj Patel", role: "Hardware Engineer", avatar: "/images/team/raj.jpg" }
      ],
      links: {
        github: "https://github.com/iris-robotics/autonomous-drone",
        demo: "#"
      },
      startDate: "2023-09-01",
      endDate: "2024-06-30"
    },
    {
      id: "ongoing-2",
      title: "Swarm Robotics Platform",
      category: "Multi-Agent Systems",
      description: "Decentralized multi-robot system that demonstrates emergent behaviors and collective intelligence for complex task solving.",
      image: "/images/projects/swarm.jpg",
      tags: ["Distributed Systems", "Algorithms", "Communication"],
      progress: 60,
      team: [
        { name: "Sarah Johnson", role: "Project Lead", avatar: "/images/team/sarah.jpg" },
        { name: "David Kim", role: "Software Engineer", avatar: "/images/team/david.jpg" },
        { name: "Priya Sharma", role: "Systems Architect", avatar: "/images/team/priya.jpg" }
      ],
      links: {
        github: "https://github.com/iris-robotics/swarm-platform",
        demo: "#"
      },
      startDate: "2023-10-15",
      endDate: "2024-08-30"
    },
    {
      id: "ongoing-3",
      title: "Neural Interface Control",
      category: "Human-Robot Interaction",
      description: "Brain-computer interface for intuitive robot control using neural signals and machine learning algorithms.",
      image: "/images/projects/neural.jpg",
      tags: ["BCI", "Machine Learning", "Signal Processing"],
      progress: 40,
      team: [
        { name: "James Wilson", role: "Neuroscience Lead", avatar: "/images/team/james.jpg" },
        { name: "Aisha Mohammed", role: "ML Engineer", avatar: "/images/team/aisha.jpg" },
        { name: "Liam Chen", role: "Interface Designer", avatar: "/images/team/liam.jpg" }
      ],
      links: {
        github: "https://github.com/iris-robotics/neural-interface",
        demo: "#"
      },
      startDate: "2023-11-01",
      endDate: "2024-10-15"
    },
    {
      id: "ongoing-4",
      title: "Smart Prosthetic Hand",
      category: "Medical Robotics",
      description: "Advanced prosthetic hand with tactile feedback and fine motor control using embedded sensors and actuators.",
      image: "/images/projects/prosthetic.jpg",
      tags: ["Haptics", "Biomechanics", "Embedded Systems"],
      progress: 65,
      team: [
        { name: "Elena Petrova", role: "Project Lead", avatar: "/images/team/elena.jpg" },
        { name: "Jamal Washington", role: "Electronics Engineer", avatar: "/images/team/jamal.jpg" },
        { name: "Hiroshi Tanaka", role: "Mechanical Designer", avatar: "/images/team/hiroshi.jpg" }
      ],
      links: {
        github: "https://github.com/iris-robotics/smart-prosthetic",
        demo: "#"
      },
      startDate: "2023-08-15",
      endDate: "2024-09-30"
    },
    {
      id: "ongoing-5",
      title: "Agricultural Robot Fleet",
      category: "Field Robotics",
      description: "Network of autonomous robots for precision farming, including soil analysis, planting, monitoring, and harvesting.",
      image: "/images/projects/agri-robots.jpg",
      tags: ["Precision Agriculture", "IoT", "Automation"],
      progress: 50,
      team: [
        { name: "Maria Gonzalez", role: "Project Lead", avatar: "/images/team/maria.jpg" },
        { name: "Feng Wei", role: "Robotics Engineer", avatar: "/images/team/feng.jpg" },
        { name: "Amara Okafor", role: "Agricultural Specialist", avatar: "/images/team/amara.jpg" }
      ],
      links: {
        github: "https://github.com/iris-robotics/agri-fleet",
        demo: "#"
      },
      startDate: "2023-07-01",
      endDate: "2024-11-30"
    }
  ],
  completed: [
    {
      id: "completed-1",
      title: "Robotic Arm Manipulator",
      category: "Industrial Automation",
      description: "6-DOF robotic arm with precision control for industrial applications and educational demonstrations.",
      image: "/images/projects/robotic-arm.jpg",
      tags: ["Kinematics", "Control Systems", "Mechanics"],
      team: [
        { name: "Michael Zhang", role: "Project Lead", avatar: "/images/team/michael.jpg" },
        { name: "Emma Davis", role: "Mechanical Engineer", avatar: "/images/team/emma.jpg" }
      ],
      links: {
        github: "https://github.com/iris-robotics/robotic-arm",
        demo: "https://demo.irisrobotics.com/arm"
      },
      startDate: "2022-05-15",
      endDate: "2023-04-30"
    },
    {
      id: "completed-2",
      title: "Autonomous Ground Vehicle",
      category: "Mobile Robotics",
      description: "Self-driving robot with LIDAR mapping and advanced path planning for indoor navigation and obstacle avoidance.",
      image: "/images/projects/agv.jpg",
      tags: ["SLAM", "Path Planning", "Sensors"],
      team: [
        { name: "Olivia Park", role: "Project Lead", avatar: "/images/team/olivia.jpg" },
        { name: "Carlos Mendez", role: "Navigation Specialist", avatar: "/images/team/carlos.jpg" }
      ],
      links: {
        github: "https://github.com/iris-robotics/agv-platform",
        demo: "https://demo.irisrobotics.com/agv"
      },
      startDate: "2022-08-01",
      endDate: "2023-07-15"
    },
    {
      id: "completed-3",
      title: "Soft Robotics Gripper",
      category: "Biomimetic Design",
      description: "Flexible gripper inspired by octopus tentacles for handling delicate and irregularly shaped objects.",
      image: "/images/projects/soft-gripper.jpg",
      tags: ["Soft Materials", "Pneumatics", "Biomimicry"],
      team: [
        { name: "Sophia Lee", role: "Project Lead", avatar: "/images/team/sophia.jpg" },
        { name: "Daniel Brown", role: "Materials Specialist", avatar: "/images/team/daniel.jpg" }
      ],
      links: {
        github: "https://github.com/iris-robotics/soft-gripper",
        demo: "https://demo.irisrobotics.com/gripper"
      },
      startDate: "2022-03-10",
      endDate: "2023-02-28"
    },
    {
      id: "completed-4",
      title: "Disaster Response Robot",
      category: "Search and Rescue",
      description: "Rugged robot designed to navigate hazardous environments and assist in disaster response operations.",
      image: "/images/projects/disaster-robot.jpg",
      tags: ["Terrain Navigation", "Thermal Imaging", "Reinforced Design"],
      team: [
        { name: "Kenji Yamamoto", role: "Project Lead", avatar: "/images/team/kenji.jpg" },
        { name: "Zoe Martinez", role: "Structural Engineer", avatar: "/images/team/zoe.jpg" }
      ],
      links: {
        github: "https://github.com/iris-robotics/disaster-response",
        demo: "https://demo.irisrobotics.com/disaster-bot"
      },
      startDate: "2022-01-15",
      endDate: "2023-03-20"
    },
    {
      id: "completed-5",
      title: "Educational Robotics Kit",
      category: "STEM Education",
      description: "Modular robotics kit designed for K-12 education with programmable components and curriculum materials.",
      image: "/images/projects/edu-kit.jpg",
      tags: ["Education", "Programming", "Modular Design"],
      team: [
        { name: "Benjamin Foster", role: "Project Lead", avatar: "/images/team/benjamin.jpg" },
        { name: "Lily Wong", role: "Education Specialist", avatar: "/images/team/lily.jpg" }
      ],
      links: {
        github: "https://github.com/iris-robotics/edu-kit",
        demo: "https://demo.irisrobotics.com/edu-kit"
      },
      startDate: "2022-06-01",
      endDate: "2023-05-15"
    },
    {
      id: "completed-6",
      title: "Robotic Exoskeleton Prototype",
      category: "Wearable Robotics",
      description: "First-generation lower-body exoskeleton for mobility assistance and strength augmentation.",
      image: "/images/projects/exo-prototype.jpg",
      tags: ["Biomechanics", "Power Systems", "Human Factors"],
      team: [
        { name: "Victor Nguyen", role: "Project Lead", avatar: "/images/team/victor.jpg" },
        { name: "Samantha Reid", role: "Biomedical Engineer", avatar: "/images/team/samantha.jpg" }
      ],
      links: {
        github: "https://github.com/iris-robotics/exo-prototype",
        demo: "https://demo.irisrobotics.com/exo-v1"
      },
      startDate: "2021-11-01",
      endDate: "2022-12-15"
    }
  ],
  upcoming: [
    {
      id: "upcoming-1",
      title: "Exoskeleton Assistance System",
      category: "Wearable Robotics",
      description: "Powered exoskeleton for mobility assistance and rehabilitation with adaptive control systems.",
      image: "/images/projects/exoskeleton.jpg",
      tags: ["Biomechanics", "Wearable Tech", "Rehabilitation"],
      team: [
        { name: "Thomas Wright", role: "Project Lead", avatar: "/images/team/thomas.jpg" },
        { name: "Leila Ahmadi", role: "Biomedical Engineer", avatar: "/images/team/leila.jpg" }
      ],
      startDate: "2024-07-01",
      endDate: "2025-06-30"
    },
    {
      id: "upcoming-2",
      title: "Underwater Exploration ROV",
      category: "Marine Robotics",
      description: "Remotely operated vehicle for deep-sea exploration with advanced imaging and sampling capabilities.",
      image: "/images/projects/underwater.jpg",
      tags: ["Marine Tech", "Remote Control", "Imaging"],
      team: [
        { name: "Natalie Chen", role: "Project Lead", avatar: "/images/team/natalie.jpg" },
        { name: "Marcus Johnson", role: "Marine Specialist", avatar: "/images/team/marcus.jpg" }
      ],
      startDate: "2024-08-15",
      endDate: "2025-09-30"
    },
    {
      id: "upcoming-3",
      title: "Humanoid Robot Assistant",
      category: "Service Robotics",
      description: "Human-like robot designed to assist in healthcare settings with advanced social interaction capabilities.",
      image: "/images/projects/humanoid.jpg",
      tags: ["Social Robotics", "Healthcare", "Human-Robot Interaction"],
      team: [
        { name: "Isabella Romano", role: "Project Lead", avatar: "/images/team/isabella.jpg" },
        { name: "Kwame Osei", role: "AI Specialist", avatar: "/images/team/kwame.jpg" }
      ],
      startDate: "2024-09-01",
      endDate: "2025-10-31"
    },
    {
      id: "upcoming-4",
      title: "Micro-Robotic Swarm",
      category: "Micro-Robotics",
      description: "Collective of miniature robots that work together for microscale tasks in medical and industrial applications.",
      image: "/images/projects/micro-swarm.jpg",
      tags: ["Micro-Fabrication", "Swarm Intelligence", "Medical Robotics"],
      team: [
        { name: "Arjun Mehta", role: "Project Lead", avatar: "/images/team/arjun.jpg" },
        { name: "Fatima Al-Zahra", role: "Micro-Systems Engineer", avatar: "/images/team/fatima.jpg" }
      ],
      startDate: "2024-10-15",
      endDate: "2026-01-30"
    },
    {
      id: "upcoming-5",
      title: "Space Robotics Platform",
      category: "Aerospace Robotics",
      description: "Robotic system designed for satellite servicing and space debris management in low Earth orbit.",
      image: "/images/projects/space-robotics.jpg",
      tags: ["Space Tech", "Orbital Mechanics", "Remote Operations"],
      team: [
        { name: "Neil Kapoor", role: "Project Lead", avatar: "/images/team/neil.jpg" },
        { name: "Luna Park", role: "Aerospace Engineer", avatar: "/images/team/luna.jpg" }
      ],
      startDate: "2025-01-15",
      endDate: "2026-06-30"
    }
  ]
};

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ongoing' | 'completed' | 'upcoming'>("all");
  const [selectedProject, setSelectedProject] = useState<OngoingProject | CompletedProject | UpcomingProject | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<(OngoingProject | CompletedProject | UpcomingProject)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize animations
    initAnimations();
    
    const allProjects = [
      ...projectsData.ongoing,
      ...projectsData.completed,
      ...projectsData.upcoming
    ];
    setFilteredProjects(allProjects);
    
    return () => {
      // Kill all ScrollTriggers on component unmount
      ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
    };
  }, []);
  
  useEffect(() => {
    // Re-initialize animations when filtered projects change
    initAnimations();
  }, [filteredProjects]);
  
  const initAnimations = () => {
    // Header parallax effect
    gsap.to(".parallax-bg", {
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      y: (_i: number, target: Element) => -ScrollTrigger.maxScroll(window) * parseFloat((target as HTMLElement).dataset.speed || "0"),
      ease: "none"
    });
    
    // Animate project cards
    gsap.from(".project-card", {
      scrollTrigger: {
        trigger: projectsRef.current,
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2
    });
  };
  
  const handleCategoryChange = (category: 'all' | 'ongoing' | 'completed' | 'upcoming') => {
    setActiveCategory(category);
    
    if (category === 'all') {
      const allProjects = [
        ...projectsData.ongoing,
        ...projectsData.completed,
        ...projectsData.upcoming
      ];
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(projectsData[category]);
    }
  };
  
  const handleProjectClick = (project: OngoingProject | CompletedProject | UpcomingProject) => {
    setSelectedProject(project);
  };
  
  const closeProjectModal = () => {
    setSelectedProject(null);
  };

  return (
    <>
      {/* Hero Header */}
      <section 
        ref={headerRef}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20"
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-glow-cyan">Our</span>{" "}
              <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Explore our innovative robotics projects that combine cutting-edge technology 
              with practical applications to solve real-world challenges.
            </p>
            
            {/* Category navigation */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {["all", "upcoming", "ongoing", "completed"].map((category, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleCategoryChange(category as 'all' | 'ongoing' | 'completed' | 'upcoming')}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-primary to-secondary text-dark shadow-neon-glow"
                      : "bg-dark-300 text-gray-300 hover:bg-dark-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {index === 0 ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
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
      
      {/* Projects Section */}
      <section 
        ref={projectsRef}
        className="relative py-20 bg-dark-100"
      >
        <div className="container-custom">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">
                {activeCategory === "all" ? "All" : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
              </span> Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mb-6"></div>
            <p className="text-gray-300 max-w-3xl">
              {activeCategory === "all" && "All our robotics projects across various stages of development."}
              {activeCategory === "ongoing" && "Current projects our teams are actively developing with cutting-edge technology."}
              {activeCategory === "completed" && "Successfully delivered projects that showcase our technical expertise and innovation."}
              {activeCategory === "upcoming" && "Future initiatives in our development pipeline that push the boundaries of robotics."}
            </p>
          </motion.div>
          
          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project: OngoingProject | CompletedProject | UpcomingProject, index: number) => (
              <motion.div
                key={project.id}
                className="project-card glass-card rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => handleProjectClick(project)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="relative h-60 overflow-hidden">
                  {/* Placeholder for project image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white/50">{project.title}</span>
                  </div>
                  {/* Uncomment when images are available */}
                  {/* <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  /> */}
                  
                  {/* Category badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-dark/80 text-xs font-medium text-primary">
                    {project.category}
                  </div>
                  
                  {/* Progress indicator for ongoing projects */}
                  {activeCategory === "ongoing" && 'progress' in project && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/80">Progress</span>
                        <span className="text-xs text-white/80">{project.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-dark-300 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Date badge for upcoming projects */}
                  {activeCategory === "upcoming" && (
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-dark/80 text-xs font-medium text-secondary flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-glow-cyan transition-all">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag: string) => (
                      <span 
                        key={tag} 
                        className="px-2 py-1 rounded-full text-xs font-medium bg-dark-300 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Team members preview */}
                  <div className="flex items-center mt-4">
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member: TeamMember, i: number) => (
                        <div 
                          key={i} 
                          className="w-8 h-8 rounded-full border-2 border-dark-100 bg-dark-300 flex items-center justify-center overflow-hidden"
                          title={member.name}
                        >
                          {/* Placeholder for team member avatar */}
                          <span className="text-xs font-medium">{member.name.charAt(0)}</span>
                          {/* Uncomment when avatars are available */}
                          {/* <Image 
                            src={member.avatar} 
                            alt={member.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          /> */}
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-dark-100 bg-dark-300 flex items-center justify-center">
                          <span className="text-xs font-medium">+{project.team.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <span className="ml-3 text-xs text-gray-400">
                      {project.team.length} team member{project.team.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {/* View details indicator */}
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
        </div>
      </section>
      
      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeProjectModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass rounded-xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeProjectModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-dark-300 flex items-center justify-center text-gray-400 hover:text-white z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              {/* Project header */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                {/* Placeholder for project image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white/70">{selectedProject.title}</span>
                </div>
                {/* Uncomment when images are available */}
                {/* <Image 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                /> */}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
                
                {/* Project title */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="mb-2">
                    <span className="px-3 py-1 rounded-full bg-dark/80 text-xs font-medium text-primary">
                      {selectedProject.category}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white text-glow-cyan">{selectedProject.title}</h2>
                </div>
              </div>
              
              {/* Project content */}
              <div className="p-6 md:p-8">
                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-glow-violet">About the Project</h3>
                  <p className="text-gray-300">{selectedProject.description}</p>
                </div>
                
                {/* Project details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Timeline */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-glow-cyan">Timeline</h3>
                    <div className="glass-card p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          <span className="text-sm text-gray-300">Start Date</span>
                        </div>
                        <span className="text-sm font-medium">
                          {new Date(selectedProject.startDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-secondary" />
                          <span className="text-sm text-gray-300">End Date</span>
                        </div>
                        <span className="text-sm font-medium">
                          {selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'Ongoing'}
                        </span>
                      </div>
                      
                      {/* Progress bar for ongoing projects */}
                      {activeCategory === "ongoing" && 'progress' in selectedProject && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-white/80">Progress</span>
                            <span className="text-xs text-white/80">{selectedProject.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-dark-300 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-secondary"
                              style={{ width: `${selectedProject.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Technologies */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-glow-violet">Technologies</h3>
                    <div className="glass-card p-4 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag: string) => (
                          <span 
                            key={tag} 
                            className="px-3 py-1.5 rounded-full text-sm font-medium bg-dark-300 text-primary border border-primary/20 hover:border-primary/50 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Team members */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-glow-cyan">Team Members</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProject.team.map((member: TeamMember, index: number) => (
                      <div key={index} className="glass-card p-4 rounded-lg flex items-center">
                        {/* Placeholder for team member avatar */}
                        <div className="w-12 h-12 rounded-full bg-dark-300 flex items-center justify-center mr-4">
                          <span className="text-lg font-medium">{member.name.charAt(0)}</span>
                          {/* Uncomment when avatars are available */}
                          {/* <Image 
                            src={member.avatar} 
                            alt={member.name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                          /> */}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{member.name}</h4>
                          <p className="text-xs text-gray-400">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Project links */}
                {'links' in selectedProject && selectedProject.links && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-glow-violet">Project Links</h3>
                    <div className="flex flex-wrap gap-4">
                      {'links' in selectedProject && selectedProject.links.github && (
                        <a 
                          href={selectedProject.links.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-dark-300 rounded-lg text-white hover:bg-dark-200 transition-colors"
                        >
                          <Github className="w-5 h-5 mr-2" />
                          GitHub Repository
                        </a>
                      )}
                      {'links' in selectedProject && selectedProject.links.demo && (
                        <a 
                          href={selectedProject.links.demo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg text-white hover:from-primary/30 hover:to-secondary/30 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
