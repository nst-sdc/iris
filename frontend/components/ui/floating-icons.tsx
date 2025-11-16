"use client";

import { motion } from "framer-motion";
import { Cpu, Award, Github, Users, Calendar, Mail } from "lucide-react";

const icons = [
  { Icon: Cpu, delay: 0 },
  { Icon: Award, delay: 0.5 },
  { Icon: Github, delay: 1 },
  { Icon: Users, delay: 1.5 },
  { Icon: Calendar, delay: 2 },
  { Icon: Mail, delay: 2.5 },
];

export default function FloatingIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {icons.map(({ Icon, delay }, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            opacity: 0,
            scale: 0
          }}
          animate={{
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0],
            rotate: [0, 360, 720]
          }}
          transition={{
            duration: 20,
            delay: delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Icon className="w-8 h-8 text-primary" strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
}
