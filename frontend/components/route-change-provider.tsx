"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingScreen from "../app/loadingScreen";

// Create context for route change state
interface RouteChangeContextType {
  isChangingRoute: boolean;
}

const RouteChangeContext = createContext<RouteChangeContextType>({
  isChangingRoute: false,
});

export const useRouteChange = () => useContext(RouteChangeContext);

interface RouteChangeProviderProps {
  children: React.ReactNode;
}

export function RouteChangeProvider({ children }: RouteChangeProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isChangingRoute, setIsChangingRoute] = useState(false);
  
  // Track route changes
  useEffect(() => {
    // Show loading screen on initial load
    setIsChangingRoute(true);
    
    // Hide loading screen after a delay
    const timer = setTimeout(() => {
      setIsChangingRoute(false);
    }, 100); // Small delay to ensure context is properly set
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);
  
  return (
    <RouteChangeContext.Provider value={{ isChangingRoute }}>
      {/* <LoadingScreen /> */}
      {children}
    </RouteChangeContext.Provider>
  );
}
