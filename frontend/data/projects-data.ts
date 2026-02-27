// ============================================================
// Projects Data - Edit this file to update project listings on the homepage.
// The full projects page fetches from the API.
// ============================================================

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
}

export const homeProjects: Project[] = [
  {
    id: 1,
    title: "Autonomous Drone System",
    category: "Aerial Robotics",
    description:
      "AI-powered drone with object recognition and autonomous navigation capabilities for search and rescue operations.",
    image: "/images/projects/drone.jpg",
    tags: ["Computer Vision", "AI", "Navigation"],
  },
  {
    id: 2,
    title: "Robotic Arm Manipulator",
    category: "Industrial Automation",
    description:
      "6-DOF robotic arm with precision control for industrial applications and educational demonstrations.",
    image: "/images/projects/robotic-arm.jpg",
    tags: ["Kinematics", "Control Systems", "Mechanics"],
  },
  {
    id: 3,
    title: "Swarm Robotics Platform",
    category: "Multi-Agent Systems",
    description:
      "Decentralized multi-robot system that demonstrates emergent behaviors and collective intelligence.",
    image: "/images/projects/swarm.jpg",
    tags: ["Distributed Systems", "Algorithms", "Communication"],
  },
  {
    id: 4,
    title: "Autonomous Ground Vehicle",
    category: "Mobile Robotics",
    description:
      "Self-driving robot with LIDAR mapping and advanced path planning for indoor navigation.",
    image: "/images/projects/agv.jpg",
    tags: ["SLAM", "Path Planning", "Sensors"],
  },
];
