// Gallery data model
export interface GalleryItem {
  id: string;
  title: string;
  category: 'Events' | 'Projects' | 'Members' | 'Behind The Scenes';
  image: string;
  thumbnail?: string; // Optional optimized thumbnail
  description: string;
  date: string;
  featured?: boolean;
  video?: string; // Optional video URL for video items
}

// Sample gallery data
export const galleryData: GalleryItem[] = [
  {
    id: "gallery-1",
    title: "Hackathon 2025",
    category: "Events",
    image: "/images/gallery/hackathon2025.jpg",
    description: "Participants building autonomous robots during the IRIS Robotics Hackathon 2025. Teams from across the country competed to build the most innovative solutions.",
    date: "2025-03-15",
    featured: true
  },
  {
    id: "gallery-2",
    title: "Drone Project Showcase",
    category: "Projects",
    image: "/images/gallery/drone-project.jpg",
    description: "Our autonomous drone project demonstration at the annual tech expo. The drone features advanced object recognition and navigation capabilities.",
    date: "2025-02-20"
  },
  {
    id: "gallery-3",
    title: "AI Workshop",
    category: "Events",
    image: "/images/gallery/ai-workshop.jpg",
    description: "Students learning about implementing AI algorithms in robotics applications during our weekend workshop series.",
    date: "2025-01-25"
  },
  {
    id: "gallery-4",
    title: "Team Building Retreat",
    category: "Members",
    image: "/images/gallery/team-retreat.jpg",
    description: "IRIS Robotics team members at our annual retreat, where we brainstorm new project ideas and strengthen our collaborative bonds.",
    date: "2024-12-10"
  },
  {
    id: "gallery-5",
    title: "Late Night Prototyping",
    category: "Behind The Scenes",
    image: "/images/gallery/late-night-work.jpg",
    description: "Behind the scenes look at our dedicated team working late into the night to perfect their competition robot before the deadline.",
    date: "2024-11-30"
  },
  {
    id: "gallery-6",
    title: "Robotics Competition Finals",
    category: "Events",
    image: "/images/gallery/competition-finals.jpg",
    description: "Our team competing in the finals of the International Robotics Championship, where we secured second place with our innovative design.",
    date: "2024-10-15",
    featured: true
  },
  {
    id: "gallery-7",
    title: "Circuit Board Design",
    category: "Projects",
    image: "/images/gallery/circuit-design.jpg",
    description: "Close-up of our custom-designed circuit board for the autonomous navigation system that powers several of our robots.",
    date: "2024-09-22"
  },
  {
    id: "gallery-8",
    title: "Community Outreach Program",
    category: "Events",
    image: "/images/gallery/community-outreach.jpg",
    description: "IRIS members teaching robotics basics to middle school students as part of our community education initiative.",
    date: "2024-08-18"
  },
  {
    id: "gallery-9",
    title: "Robot Arm Testing",
    category: "Behind The Scenes",
    image: "/images/gallery/arm-testing.jpg",
    description: "Testing precision movements of our newly developed robotic arm, capable of manipulating objects with millimeter accuracy.",
    date: "2024-07-14"
  },
  {
    id: "gallery-10",
    title: "New Member Orientation",
    category: "Members",
    image: "/images/gallery/new-members.jpg",
    description: "Welcoming our newest cohort of talented members to the IRIS Robotics family during orientation week.",
    date: "2024-06-05"
  },
  {
    id: "gallery-11",
    title: "Autonomous Vehicle Project",
    category: "Projects",
    image: "/images/gallery/autonomous-vehicle.jpg",
    description: "Our miniature autonomous vehicle navigating a complex obstacle course using computer vision and sensor fusion.",
    date: "2024-05-20",
    featured: true
  },
  {
    id: "gallery-12",
    title: "Workshop Preparations",
    category: "Behind The Scenes",
    image: "/images/gallery/workshop-prep.jpg",
    description: "Team members preparing materials and equipment for our popular weekend robotics workshop series.",
    date: "2024-04-12"
  },
  {
    id: "gallery-13",
    title: "Guest Lecture Series",
    category: "Events",
    image: "/images/gallery/guest-lecture.jpg",
    description: "Distinguished robotics professor Dr. Sarah Chen delivering a guest lecture on the future of human-robot interaction.",
    date: "2024-03-28"
  },
  {
    id: "gallery-14",
    title: "Team Celebration",
    category: "Members",
    image: "/images/gallery/team-celebration.jpg",
    description: "Celebrating our team's achievements at the end-of-year gala dinner. A moment to recognize everyone's hard work and dedication.",
    date: "2024-02-15"
  },
  {
    id: "gallery-15",
    title: "Robot Vision System",
    category: "Projects",
    image: "/images/gallery/vision-system.jpg",
    description: "Close-up of the multi-camera vision system we developed for our competition robot, enabling 360-degree environmental awareness.",
    date: "2024-01-30"
  }
];

// Homepage gallery subset (6 items for the homepage section)
export interface HomeGalleryImage {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const homeGalleryImages: HomeGalleryImage[] = [
  { id: 1, src: "/images/gallery/gallery1.png", alt: "Team working on a drone project", width: 600, height: 400 },
  { id: 2, src: "/images/gallery/gallery2.jpg", alt: "Robotics competition", width: 400, height: 600 },
  { id: 3, src: "/images/gallery/gallery3.jpg", alt: "Workshop session", width: 600, height: 400 },
  { id: 4, src: "/images/gallery/gallery4.jpg", alt: "Robot prototype testing", width: 600, height: 400 },
  { id: 5, src: "/images/gallery/gallery5.jpg", alt: "Team photo at competition", width: 400, height: 600 },
  { id: 6, src: "/images/gallery/gallery6.jpg", alt: "Close-up of robot components", width: 600, height: 400 },
];

// Featured videos for the video carousel section
export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
}

export const videoData: VideoItem[] = [
  {
    id: "video-1",
    title: "IRIS Robotics Competition Highlights",
    thumbnail: "/images/gallery/videos/competition-thumb.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video URL
    description: "Highlights from our team's journey through the International Robotics Competition 2025."
  },
  {
    id: "video-2",
    title: "Autonomous Drone Project",
    thumbnail: "/images/gallery/videos/drone-thumb.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video URL
    description: "Watch our autonomous drone navigate complex environments and perform precision tasks."
  },
  {
    id: "video-3",
    title: "Behind the Scenes: Building Process",
    thumbnail: "/images/gallery/videos/building-thumb.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video URL
    description: "Time-lapse of our team building the award-winning robot from concept to completion."
  },
  {
    id: "video-4",
    title: "AI Workshop Series",
    thumbnail: "/images/gallery/videos/workshop-thumb.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video URL
    description: "Recap of our popular AI workshop series teaching students how to implement machine learning in robotics."
  }
];
