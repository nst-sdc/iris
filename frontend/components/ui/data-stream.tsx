"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DataStream() {
  const [streams, setStreams] = useState<number[]>([]);

  useEffect(() => {
    setStreams(Array.from({ length: 15 }, (_, i) => i));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
      {streams.map((index) => (
        <motion.div
          key={index}
          className="absolute top-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent"
          style={{
            left: `${(index / streams.length) * 100}%`,
            height: "100%",
          }}
          initial={{ y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
