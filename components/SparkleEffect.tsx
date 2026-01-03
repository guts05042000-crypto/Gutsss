
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

const SparkleEffect: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const createParticle = (isInitial = false) => {
      const colors = ['#FFD700', '#FF69B4', '#FF1493', '#FFFFFF', '#FFB6C1', '#FFE4E1'];
      return {
        x: Math.random() * canvas.width,
        // Start from top
        y: isInitial ? Math.random() * -canvas.height : -20,
        size: Math.random() * 5 + 2,
        speedX: (Math.random() - 0.5) * 2,
        // Fall downwards
        speedY: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      };
    };

    // Substantially increased initial burst
    for (let i = 0; i < 300; i++) {
      particles.current.push(createParticle(true));
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Continue adding particles while active for a "snowfall" effect
      if (particles.current.length < 400) {
        particles.current.push(createParticle());
      }

      particles.current.forEach((p, index) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        
        // Subtle fading as they fall
        if (p.y > canvas.height * 0.8) {
          p.opacity -= 0.01;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        
        // Draw star-like shapes
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(0, p.size);
          ctx.rotate(Math.PI / 5);
          ctx.lineTo(0, p.size / 2);
          ctx.rotate(Math.PI / 5);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Remove particles that go off screen or fade out
        if (p.y > canvas.height + 20 || p.opacity <= 0) {
          particles.current.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ display: isActive ? 'block' : 'none' }}
    />
  );
};

export default SparkleEffect;
