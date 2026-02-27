// ============================================================
// IRIS Robotics Club - Centralized Site Data
// Edit this file to update content across the entire site.
// ============================================================

// --- Club Info ---
export const clubInfo = {
  name: "IRIS",
  fullName: "IRIS Robotics Club",
  tagline: "The Robotics Club",
  university: "Newton School of Technology",
  parentUniversity: "Ajeenkya DY Patil University",
  location: "Pune, Maharashtra",
  email: "iris@nstpune.edu",
  description:
    "The Robotics Club of Newton School of Technology, ADYPU. Building the future through innovation and collaboration.",
  heroVideoUrl:
    "https://res.cloudinary.com/daefnk9rw/video/upload/v1766940391/qr5q4owqt69hbmh6boek.mp4",
};

// --- Social Links ---
export const socialLinks = {
  github: "https://github.com/nst-sdc/iris",
  linkedin: "https://www.linkedin.com/in/iris-the-robotics-club/",
  instagram: "https://www.instagram.com/iris.nstpune/",
};

// --- Stats ---
export interface Stat {
  title: string;
  value: string;
  description: string;
  iconName: "Users" | "Cpu" | "Award" | "Rocket";
}

export const stats: Stat[] = [
  {
    title: "Active Members",
    value: "20+",
    iconName: "Users",
    description: "Active robotics enthusiasts",
  },
  {
    title: "Projects Built",
    value: "5+",
    iconName: "Cpu",
    description: "Innovative robotics solutions",
  },
  {
    title: "Competitions Won",
    value: "5+",
    iconName: "Award",
    description: "Annual tech competitions",
  },
  {
    title: "Workshops Held",
    value: "3+",
    iconName: "Rocket",
    description: "Skill development sessions",
  },
];

// --- About Section ---
export const aboutContent = {
  mission:
    "IRIS is the robotics club of Newton School of Technology, Ajeenkya DY Patil University. We're a community of students who love building cool robots and experimenting with technology.",
  paragraphs: [
    "From autonomous drones to AI-powered systems, we work on projects that push the boundaries of what's possible. Whether you're a complete beginner or already know your way around circuits and code, there's a place for you here.",
    "We participate in competitions, host workshops, and collaborate on projects that matter. It's not just about robots—it's about learning, growing, and having fun while doing it.",
  ],
  whatWeDo: [
    "Design and build innovative robotics projects",
    "Participate in national and international robotics competitions",
    "Conduct workshops and training sessions for skill development",
    "Collaborate with industry partners on research projects",
  ],
};

// --- Navigation Quick Links ---
export const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Projects", href: "/projects" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
];

// --- Features (Home page nav cards) ---
export const features = [
  {
    iconName: "Cpu" as const,
    title: "Projects",
    description: "Autonomous systems, robotics platforms, and hardware innovations.",
    href: "/projects",
  },
  {
    iconName: "Calendar" as const,
    title: "Events",
    description: "Workshops, hackathons, and robotics competitions throughout the year.",
    href: "/events",
  },
  {
    iconName: "FileText" as const,
    title: "Blog",
    description: "Technical articles, tutorials, and project documentation.",
    href: "/blog",
  },
  {
    iconName: "Image" as const,
    title: "Gallery",
    description: "Photos from builds, events, and team activities.",
    href: "/gallery",
  },
];

// --- Contact Page ---
export const contactCategories = [
  "Join the Club",
  "General Inquiry",
  "Collaboration",
  "Technical Support",
  "Event Participation",
];

export const googleMapsEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18435.088191545412!2d73.89957561842056!3d18.62301991896188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c7007ca391d7%3A0x9da4723c416a8ee5!2sNewton%20school%20of%20technology%20pune%20campus!5e0!3m2!1sen!2sin!4v1762634832410!5m2!1sen!2sin";
