"use client";
import { useEffect, useRef } from 'react';
import LatticeSimulationEngine from '../core/LatticeSimulationEngine';

export default function SwarmCanvas({ chaosMode, onStatsUpdate }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (engineRef.current) {
        engineRef.current.setBounds(canvas.width, canvas.height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    // Initialize Engine
    engineRef.current = new LatticeSimulationEngine(canvas.width, canvas.height);
    
    let animationFrameId;

    const renderLoop = () => {
      ctx.fillStyle = 'rgba(5, 5, 8, 0.4)'; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update simulation logic
      const stats = engineRef.current.tick(chaosMode);
      onStatsUpdate(stats);

      // Render Nodes & Links
      engineRef.current.render(ctx);

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Update engine when chaosMode prop changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setChaosMode(chaosMode);
    }
  }, [chaosMode]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        background: 'var(--bg-color)',
        cursor: 'crosshair'
      }}
    />
  );
}
