// ============================================================
// Events Data - Edit this file to update events across the site.
// ============================================================

// Types
export type EventType = "Workshop" | "Competition" | "Hackathon" | "Meetup";
export type EventStatus = "Upcoming" | "Ongoing" | "Completed";

export interface EventSpeaker {
  name: string;
  role: string;
  avatar: string;
}

export interface EventData {
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

// Full events data (used on /events page)
export const eventsData: EventData[] = [
  {
    id: "event-1",
    title: "IRIS Robotics Hackathon 2025",
    date: "2025-03-14",
    time: "09:00 AM - 09:00 AM (Next day)",
    location: "Main Engineering Building, Room 305",
    type: "Hackathon",
    status: "Upcoming",
    description:
      "A 24-hour robotics build-a-thon focusing on automation and AI challenges. Teams will compete to build innovative solutions for real-world problems.",
    image: "/images/events/hackathon2025.jpg",
    featured: true,
    registerLink: "#",
  },
  {
    id: "event-2",
    title: "Autonomous Drone Workshop",
    date: "2025-02-20",
    time: "02:00 PM - 05:00 PM",
    location: "Robotics Lab, Building 4",
    type: "Workshop",
    status: "Upcoming",
    description:
      "Learn how to program autonomous flight patterns and object recognition for drone applications. Hands-on session with our fleet of training drones.",
    image: "/images/events/drone-workshop.jpg",
    featured: true,
    registerLink: "#",
    speakers: [
      {
        name: "Dr. Sarah Chen",
        role: "Drone Systems Engineer",
        avatar: "/images/team/sarah.jpg",
      },
    ],
  },
  {
    id: "event-3",
    title: "AI in Robotics Symposium",
    date: "2025-01-15",
    time: "10:00 AM - 04:00 PM",
    location: "Virtual Event",
    type: "Meetup",
    status: "Upcoming",
    description:
      "Join leading researchers and practitioners for a day of talks and discussions on the latest advancements in AI for robotics applications.",
    image: "/images/events/ai-symposium.jpg",
    featured: false,
    registerLink: "#",
  },
  {
    id: "event-4",
    title: "Winter Robotics Showcase",
    date: "2024-12-10",
    time: "03:00 PM - 07:00 PM",
    location: "University Exhibition Hall",
    type: "Competition",
    status: "Ongoing",
    description:
      "Our annual showcase of student projects and research. Come see the cutting-edge innovations from our robotics teams and vote for your favorites.",
    image: "/images/events/winter-showcase.jpg",
    featured: true,
    registerLink: "#",
  },
  {
    id: "event-5",
    title: "ROS2 Fundamentals Workshop",
    date: "2024-11-05",
    time: "01:00 PM - 04:00 PM",
    location: "Computer Lab 2",
    type: "Workshop",
    status: "Completed",
    description:
      "An introduction to Robot Operating System 2 (ROS2) for beginners. Learn the basics of nodes, topics, services, and how to build simple robotic applications.",
    image: "/images/events/ros-workshop.jpg",
    featured: false,
    recapLink: "#",
  },
  {
    id: "event-6",
    title: "Robotic Arm Programming Challenge",
    date: "2024-10-20",
    time: "09:00 AM - 06:00 PM",
    location: "Engineering Building, Room 201",
    type: "Competition",
    status: "Completed",
    description:
      "A day-long competition where teams programmed robotic arms to complete a series of precision tasks. Prizes awarded for speed, accuracy, and innovation.",
    image: "/images/events/arm-challenge.jpg",
    featured: false,
    recapLink: "#",
  },
  {
    id: "event-7",
    title: "Industry 4.0 and Robotics",
    date: "2024-09-15",
    time: "05:00 PM - 07:00 PM",
    location: "Lecture Hall 3",
    type: "Meetup",
    status: "Completed",
    description:
      "A panel discussion with industry experts on how robotics is transforming manufacturing and industrial processes in the age of Industry 4.0.",
    image: "/images/events/industry40.jpg",
    featured: false,
    recapLink: "#",
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
    description:
      "An intensive 5-day bootcamp covering mechanical design, electronics, programming, and AI for robotics. Participants built their own robot from scratch.",
    image: "/images/events/bootcamp.jpg",
    featured: true,
    recapLink: "#",
  },
];

// Simplified events for homepage section
export interface SimpleEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  isUpcoming: boolean;
}

export const homeEvents: SimpleEvent[] = [
  {
    id: 1,
    title: "Robotics Workshop: Introduction to ROS",
    date: "January 15, 2026",
    time: "10:00 AM - 2:00 PM",
    location: "Engineering Building, Room 305",
    description:
      "Learn the basics of Robot Operating System (ROS) and how to use it for robotics development.",
    isUpcoming: true,
  },
  {
    id: 2,
    title: "Annual Robotics Competition",
    date: "February 20, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "University Main Auditorium",
    description:
      "Showcase your robotics projects and compete for prizes in various categories.",
    isUpcoming: true,
  },
  {
    id: 3,
    title: "Industry Talk: Future of Automation",
    date: "March 10, 2026",
    time: "4:00 PM - 6:00 PM",
    location: "Virtual Event (Zoom)",
    description:
      "Join industry experts as they discuss the future trends in robotics and automation.",
    isUpcoming: true,
  },
  {
    id: 4,
    title: "Hands-on Workshop: Building a Line Following Robot",
    date: "April 5, 2026",
    time: "11:00 AM - 3:00 PM",
    location: "Robotics Lab, Tech Building",
    description:
      "Practical session on building and programming a line following robot from scratch.",
    isUpcoming: false,
  },
];
