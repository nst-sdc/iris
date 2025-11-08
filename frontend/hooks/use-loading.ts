"use client";

import { useState, useCallback } from "react";

// Create a global event system for loading state
const LOADING_START_EVENT = "loading:start";
const LOADING_END_EVENT = "loading:end";

// Custom hook for controlling loading state
export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Start loading with optional minimum duration
  const startLoading = useCallback((options?: { minimumDuration?: number }) => {
    setIsLoading(true);
    
    // Dispatch global event for other components to react
    window.dispatchEvent(new CustomEvent(LOADING_START_EVENT, { 
      detail: options 
    }));
    
    return () => endLoading();
  }, []);
  
  // End loading
  const endLoading = useCallback(() => {
    setIsLoading(false);
    
    // Dispatch global event
    window.dispatchEvent(new CustomEvent(LOADING_END_EVENT));
  }, []);
  
  return {
    isLoading,
    startLoading,
    endLoading
  };
}

// Listen for global loading events
export function setupLoadingListeners(
  onStart: (options?: { minimumDuration?: number }) => void,
  onEnd: () => void
) {
  const handleStart = (event: Event) => {
    const customEvent = event as CustomEvent;
    onStart(customEvent.detail);
  };
  
  const handleEnd = () => {
    onEnd();
  };
  
  // Add event listeners
  window.addEventListener(LOADING_START_EVENT, handleStart);
  window.addEventListener(LOADING_END_EVENT, handleEnd);
  
  // Return cleanup function
  return () => {
    window.removeEventListener(LOADING_START_EVENT, handleStart);
    window.removeEventListener(LOADING_END_EVENT, handleEnd);
  };
}
