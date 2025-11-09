"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CpuArchitecture } from "../app/loadingScreen";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timer: NodeJS.Timeout;

    interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 3; // random speed for realism
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 150);

    // Wait until progress reaches 100%, then trigger complete
    timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsComplete(true), 400); // fade out delay
        }
        return p;
      });
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark ${
        isComplete ? "pointer-events-none" : ""
      }`}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="w-32 h-32 mb-8">
          <CpuArchitecture
            text="IRIS"
            animateText={true}
            animateLines={true}
            animateMarkers={true}
          />
        </div>

        <h1 className="text-3xl font-bold mb-2 gradient-text">
          IRIS Robotics Club
        </h1>
        <p className="text-gray-400 mb-6">Initializing interface...</p>

        <div className="w-full h-1 bg-dark-300 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
            className="h-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>

        <div className="flex justify-between w-full text-xs text-gray-500">
          <span>Loading assets</span>
          <span>{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}
