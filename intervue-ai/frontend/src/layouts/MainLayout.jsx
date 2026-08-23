import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function NeuralNetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = 85;
    const connectionDistance = 140;
    const mouse = { x: null, y: null, radius: 180 };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: (Math.random() - 0.5) * 600,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.2,
      });
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let angleY = 0.0008;
    let angleX = 0.0004;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const projected = [];
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        const boundaryX = width * 0.7;
        const boundaryY = height * 0.7;
        const boundaryZ = 300;

        if (p.x < -boundaryX) p.x = boundaryX;
        if (p.x > boundaryX) p.x = -boundaryX;
        if (p.y < -boundaryY) p.y = boundaryY;
        if (p.y > boundaryY) p.y = -boundaryY;
        if (p.z < -boundaryZ) p.z = boundaryZ;
        if (p.z > boundaryZ) p.z = -boundaryZ;

        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        let y1 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y1;
        p.z = z2;

        const perspective = 900;
        const scale = perspective / (perspective + p.z);
        const screenX = width / 2 + p.x * scale;
        const screenY = height / 2 + p.y * scale;

        projected.push({
          x: screenX,
          y: screenY,
          z: p.z,
          radius: p.radius * scale,
          scale: scale
        });
      }

      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const depthFactor = Math.min(1.2, Math.max(0.3, (p1.scale + p2.scale) / 2));
            const alpha = (1 - dist / connectionDistance) * 0.22 * depthFactor;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.lineWidth = 0.8 * depthFactor;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.35 * p1.scale;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1.1 * p1.scale;
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        
        const opacity = Math.min(0.7, Math.max(0.15, p.scale * 0.45));
        ctx.fillStyle = `rgba(14, 165, 233, ${opacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (canvas) canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full opacity-35" />
    </div>
  );
}

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 selection:bg-sky-500 selection:text-slate-950 font-sans relative overflow-x-hidden">
      {/* Global Interactive Neural Network Synapses Canvas Background */}
      <NeuralNetworkBackground />

      <Navbar />
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
