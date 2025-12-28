'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import STLViewer to avoid SSR issues
// @ts-ignore
const STLViewer = dynamic(() => import('react-stl-viewer').then(mod => mod.StlViewer), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">Loading 3D model...</div>,
});

interface StlViewerProps {
  url: string;
  className?: string;
}

export function StlViewer({ url, className = '' }: StlViewerProps) {
  return (
    <div className={`bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      <div className="w-full h-[70vh] max-h-[600px]">
        <STLViewer
          url={url}
          modelProps={{
            color: '#00f5ff',
            positionX: 0,
            positionY: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 1,
          }}
          floorProps={{
            gridLength: 200,
            gridWidth: 200,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
          orbitControls
          shadows
        />
      </div>
    </div>
  );
}
