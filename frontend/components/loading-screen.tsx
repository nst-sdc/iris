"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CpuArchitecture } from "../app/loadingScreen";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
    }, 3000);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
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
        
        <h1 className="text-3xl font-bold mb-2 gradient-text">IRIS Robotics Club</h1>
        <p className="text-gray-400 mb-6">Initializing interface...</p>
        
        <div className="w-full h-1 bg-dark-300 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
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
