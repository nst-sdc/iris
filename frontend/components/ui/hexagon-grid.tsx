"use client";

import { motion } from "framer-motion";

export default function HexagonGrid() {
  const hexagons = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="hexagons"
            x="0"
            y="0"
            width="100"
            height="86.6"
            patternUnits="userSpaceOnUse"
          >
            {hexagons.map((i) => (
              <motion.polygon
                key={i}
                points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25"
                fill="none"
                stroke="rgba(0, 245, 255, 0.3)"
                strokeWidth="0.5"
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
    </div>
  );
}
