// ============================================================
// Team Data - Edit this file to update team members across the site.
// ============================================================

export type Department = "Core Team" | "Research & Development" | "Software" | "Hardware" | "Design";
export type MemberType = "Team" | "Mentor" | "Contributor";

export interface TeamMember {
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

export const teamData: TeamMember[] = [
  {
    id: "member-1",
    name: "Arpit Sarang",
    role: "Lead Developer",
    department: "Software",
    type: "Team",
    avatar: "/images/avatars/member1.jpg",
    bio: "Full-stack developer specializing in AI and robotics software integration. Led the development of our award-winning autonomous navigation system.",
    github: "https://github.com/CodeMaverick-143",
    linkedin: "https://linkedin.com/in/arpit-sarang",
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
    linkedin: "https://linkedin.com/in/maya-rodriguez",
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
    linkedin: "https://linkedin.com/in/raj-patel",
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
    linkedin: "https://linkedin.com/in/alex-chen",
  },
  {
    id: "member-5",
    name: "Dr. Sarah Johnson",
    role: "Technical Advisor",
    department: "Core Team",
    type: "Mentor",
    avatar: "/images/avatars/mentor1.jpg",
    bio: "Professor of Robotics at MIT with 15+ years of industry experience. Provides strategic guidance on our technical roadmap.",
    linkedin: "https://linkedin.com/in/sarah-johnson",
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
    linkedin: "https://linkedin.com/in/michael-zhang",
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
    linkedin: "https://linkedin.com/in/emma-davis",
  },
  {
    id: "member-8",
    name: "Prof. Thomas Wright",
    role: "Industry Mentor",
    department: "Core Team",
    type: "Mentor",
    avatar: "/images/avatars/mentor2.jpg",
    bio: "Former CTO of RoboIndustries with extensive experience in bringing robotics products to market.",
    linkedin: "https://linkedin.com/in/thomas-wright",
  },
];

export const departments: Department[] = [
  "Core Team",
  "Research & Development",
  "Software",
  "Hardware",
  "Design",
];
