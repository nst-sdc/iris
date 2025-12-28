'use client';

import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import DxfParser from 'dxf-parser';

interface DxfViewerProps {
  url: string;
  className?: string;
}

export function DxfViewer({ url, className = '' }: DxfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAndRenderDxf = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the DXF file
        const response = await fetch(url);
        const dxfString = await response.text();

        // Parse the DXF
        const parser = new DxfParser();
        const dxf = parser.parseSync(dxfString);

        if (!dxf) {
          throw new Error('Failed to parse DXF file');
        }

        // Render on canvas
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate bounds
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        dxf.entities.forEach((entity: any) => {
          if (entity.type === 'LINE') {
            minX = Math.min(minX, entity.vertices[0].x, entity.vertices[1].x);
            minY = Math.min(minY, entity.vertices[0].y, entity.vertices[1].y);
            maxX = Math.max(maxX, entity.vertices[0].x, entity.vertices[1].x);
            maxY = Math.max(maxY, entity.vertices[0].y, entity.vertices[1].y);
          } else if (entity.type === 'CIRCLE') {
            minX = Math.min(minX, entity.center.x - entity.radius);
            minY = Math.min(minY, entity.center.y - entity.radius);
            maxX = Math.max(maxX, entity.center.x + entity.radius);
            maxY = Math.max(maxY, entity.center.y + entity.radius);
          }
        });

        // Calculate scale and offset
        const width = maxX - minX;
        const height = maxY - minY;
        const scale = Math.min(canvas.width / width, canvas.height / height) * 0.8;
        const offsetX = (canvas.width - width * scale) / 2 - minX * scale;
        const offsetY = (canvas.height - height * scale) / 2 - minY * scale;

        // Draw entities
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 2;

        dxf.entities.forEach((entity: any) => {
          if (entity.type === 'LINE') {
            ctx.beginPath();
            ctx.moveTo(
              entity.vertices[0].x * scale + offsetX,
              canvas.height - (entity.vertices[0].y * scale + offsetY)
            );
            ctx.lineTo(
              entity.vertices[1].x * scale + offsetX,
              canvas.height - (entity.vertices[1].y * scale + offsetY)
            );
            ctx.stroke();
          } else if (entity.type === 'CIRCLE') {
            ctx.beginPath();
            ctx.arc(
              entity.center.x * scale + offsetX,
              canvas.height - (entity.center.y * scale + offsetY),
              entity.radius * scale,
              0,
              2 * Math.PI
            );
            ctx.stroke();
          } else if (entity.type === 'ARC') {
            ctx.beginPath();
            ctx.arc(
              entity.center.x * scale + offsetX,
              canvas.height - (entity.center.y * scale + offsetY),
              entity.radius * scale,
              -entity.endAngle,
              -entity.startAngle,
              true
            );
            ctx.stroke();
          }
        });

        setLoading(false);
      } catch (err: any) {
        console.error('Error loading DXF:', err);
        setError(err.message || 'Failed to load DXF file');
        setLoading(false);
      }
    };

    loadAndRenderDxf();
  }, [url]);

  return (
    <div className={`bg-gray-900 rounded-lg overflow-auto ${className}`}>
      {loading && (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center text-gray-400">
          Loading DXF file...
        </div>
      )}
      {error && (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center text-red-400">
          Error: {error}
        </div>
      )}
      <div className="overflow-auto max-h-[70vh]">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className={`w-full h-auto ${loading || error ? 'hidden' : ''}`}
        />
      </div>
    </div>
  );
}
