"use client";

import React from "react";
import { useLoading } from "../../hooks/use-loading";

export default function LoadingDemoPage() {
  const { startLoading } = useLoading();
  
  // Function to demonstrate manual loading trigger
  const triggerLoading = (duration: number) => {
    const stopLoading = startLoading({ minimumDuration: duration });
    
    // Simulate some async operation
    setTimeout(() => {
      stopLoading();
    }, duration);
  };
  
  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Loading Screen Demo</h1>
      
      <div className="max-w-md mx-auto bg-dark-100 p-6 rounded-xl">
        <p className="text-gray-300 mb-6">
          Click the buttons below to trigger the loading screen with different durations.
          This demonstrates how you can manually control the loading state in your application.
        </p>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => triggerLoading(2000)}
            className="px-4 py-3 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
          >
            Quick Loading (2s)
          </button>
          
          <button
            onClick={() => triggerLoading(4000)}
            className="px-4 py-3 bg-secondary/20 hover:bg-secondary/30 text-secondary rounded-lg transition-colors"
          >
            Medium Loading (4s)
          </button>
          
          <button
            onClick={() => triggerLoading(6000)}
            className="px-4 py-3 bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 text-white rounded-lg transition-colors"
          >
            Long Loading (6s)
          </button>
        </div>
      </div>
    </div>
  );
}
