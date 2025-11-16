"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Github, Users, Calendar } from "lucide-react";

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

const headerVariants = {
  hidden: { 
    opacity: 0,
    y: -50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8
    }
  }
};

const textVariants = {
  hidden: { 
    opacity: 0,
    x: -20
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6
    }
  })
};

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ongoing' | 'completed' | 'upcoming'>("all");
  const [selectedProject, setSelectedProject] = useState<OngoingProject | CompletedProject | UpcomingProject | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<(OngoingProject | CompletedProject | UpcomingProject)[]>([]);
  
  useEffect(() => {
    const allProjects = [
      ...projectsData.ongoing,
      ...projectsData.completed,
      ...projectsData.upcoming
    ];
    setFilteredProjects(allProjects);
  }, []);
  
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
      <section className="relative bg-black pt-32 pb-12 sm:pb-16">
        <div className="container-custom max-w-6xl relative z-10 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              Explore Our Projects
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-3xl">
              A showcase of our passion for innovation and robotics engineering.
            </p>
          </motion.div>
          
          {/* Category Chips */}
          <motion.div 
            className="flex gap-3 overflow-x-auto pb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {["all", "ongoing", "completed", "upcoming"].map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryChange(category as 'all' | 'ongoing' | 'completed' | 'upcoming')}
                className={`flex h-9 shrink-0 items-center justify-center rounded-full px-4 transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-cyan-400 text-black font-bold"
                    : "bg-zinc-800/80 text-white hover:bg-cyan-400/20 border border-zinc-700/50"
                }`}
              >
                <p className="text-sm font-medium capitalize">{category}</p>
              </button>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section className="relative py-8 sm:py-12 bg-black">
        <div className="container-custom max-w-6xl relative z-10 px-4 sm:px-6">
          {/* Projects grid */}
          <motion.div 
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {filteredProjects.map((project: OngoingProject | CompletedProject | UpcomingProject, index: number) => (
                <motion.div
                  key={project.id}
                  layout
                  className="flex flex-col gap-4 p-5 rounded-xl bg-white/5 border border-transparent hover:border-cyan-400/50 transition-all duration-300 group cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* Project Image */}
                  <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 flex items-center justify-center">
                      <span className="text-lg sm:text-xl font-bold text-white/40 px-4 text-center">{project.title}</span>
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-xs font-medium text-cyan-400">
                      {project.category}
                    </div>
                    
                    {/* Progress indicator for ongoing projects */}
                    {'progress' in project && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-white/80">Progress</span>
                          <span className="text-xs text-white/80">{project.progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                          <div 
                            className="h-full bg-cyan-400"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Project Content */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-white text-xl font-bold leading-normal group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm font-normal leading-normal min-h-[60px]">
                      {project.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-bold leading-normal group-hover:underline">
                      View Details 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      
      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={closeProjectModal}
          >
            <motion.div
              initial={{ 
                scale: 0.9, 
                opacity: 0,
                y: 20
              }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: 0
              }}
              exit={{ 
                scale: 0.9, 
                opacity: 0,
                y: 20
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300,
                damping: 30
              }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800/50 bg-zinc-900/95 backdrop-blur-xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                onClick={closeProjectModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-gray-400 hover:text-white z-10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>
              
              {/* Project header */}
              <div className="relative h-56 sm:h-64 md:h-80 overflow-hidden rounded-t-2xl">
                {/* Placeholder for project image */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-white/70 px-4 text-center">{selectedProject.title}</span>
                </div>
                {/* Uncomment when images are available */}
                {/* <Image 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                /> */}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                {/* Project title */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="mb-2">
                    <span className="px-3 py-1 rounded-full bg-black/70 text-xs font-medium text-cyan-400">
                      {selectedProject.category}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-white">{selectedProject.title}</h2>
                </div>
              </div>
              
              {/* Project content */}
              <motion.div 
                className="p-6 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {/* Description */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">About the Project</h3>
                  <p className="text-gray-300 text-sm sm:text-base">{selectedProject.description}</p>
                </motion.div>
                
                {/* Project details */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {/* Timeline */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-white">Timeline</h3>
                    <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
                          <span className="text-xs sm:text-sm text-gray-300">Start Date</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-white">
                          {new Date(selectedProject.startDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-violet-400" />
                          <span className="text-xs sm:text-sm text-gray-300">End Date</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-white">
                          {selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short'
                          }) : 'Ongoing'}
                        </span>
                      </div>
                      
                      {/* Progress bar for ongoing projects */}
                      {'progress' in selectedProject && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-white/80">Progress</span>
                            <span className="text-xs text-white/80">{selectedProject.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-zinc-800/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                              style={{ width: `${selectedProject.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                  
                  {/* Technologies */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-white">Technologies</h3>
                    <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-4 sm:p-6">
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag: string) => (
                          <span 
                            key={tag} 
                            className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-zinc-800/50 border border-zinc-700/50 text-gray-300 hover:border-cyan-400/50 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
                
                {/* Team members */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <h3 className="text-base sm:text-lg font-semibold mb-4 text-white">Team Members</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {selectedProject.team.map((member: TeamMember, index: number) => (
                      <motion.div 
                        key={index} 
                        className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-4 flex items-center hover:bg-zinc-900/50 hover:border-zinc-700/50 transition-all duration-300"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
                      >
                        {/* Placeholder for team member avatar */}
                        <div className="w-12 h-12 rounded-full bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-lg font-medium text-cyan-400">{member.name.charAt(0)}</span>
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
                          <h4 className="font-medium text-white text-sm sm:text-base">{member.name}</h4>
                          <p className="text-xs text-gray-400">{member.role}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Project links */}
                {'links' in selectedProject && selectedProject.links && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    <h3 className="text-base sm:text-lg font-semibold mb-4 text-white">Project Links</h3>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      {'links' in selectedProject && selectedProject.links.github && (
                        <motion.a 
                          href={selectedProject.links.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white hover:bg-zinc-700/50 hover:border-zinc-600/50 transition-all text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Github className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          GitHub
                        </motion.a>
                      )}
                      {'links' in selectedProject && selectedProject.links.demo && (
                        <motion.a 
                          href={selectedProject.links.demo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-white text-black rounded-lg font-medium shadow-[0_0_15px_rgba(0,245,255,0.15)] hover:shadow-[0_0_25px_rgba(0,245,255,0.3)] transition-all text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5 mr-2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                          Live Demo
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}