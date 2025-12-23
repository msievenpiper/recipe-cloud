"use client";

import { useEffect, useRef } from 'react';

const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const balls: Ball[] = [];

    class Ball {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor(x: number, y: number, vx: number, vy: number, radius: number, color: string) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx!.fillStyle = this.color;
        ctx!.fill();
      }

      update() {
        if (this.x + this.radius > width || this.x - this.radius < 0) {
          this.vx = -this.vx;
        }
        if (this.y + this.radius > height || this.y - this.radius < 0) {
          this.vy = -this.vy;
        }
        this.x += this.vx;
        this.y += this.vy;
        this.draw();
      }
    }

    const colors = ['#ba68c8', '#ab47bc', '#80deea', '#4dd0e1', '#26c6da'];
    for (let i = 0; i < 50; i++) {
      const radius = Math.random() * 15 + 5;
      balls.push(new Ball(
        Math.random() * (width - radius * 2) + radius,
        Math.random() * (height - radius * 2) + radius,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        radius,
        colors[Math.floor(Math.random() * colors.length)]
      ));
    }

    let animationFrameId: number;
    const animate = () => {
      ctx!.clearRect(0, 0, width, height);
      balls.forEach(ball => ball.update());
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleInteraction = (x: number, y: number) => {
      balls.forEach(ball => {
        const dx = x - ball.x;
        const dy = y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          ball.vx -= dx * 0.01;
          ball.vy -= dy * 0.01;
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleInteraction(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default InteractiveBackground;
