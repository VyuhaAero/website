import { useEffect, useRef } from 'react';

type Particle = { x: number; y: number; vx: number; vy: number; radius: number; alpha: number };

export default function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const context = canvas.getContext('2d'); if (!context) return;
    const mouse = { x: -9999, y: -9999 };
    let width = 0; let height = 0; let frame = 0;
    const particles: Particle[] = Array.from({ length: 150 }, () => ({ x: 0, y: 0, vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .16, radius: Math.random() * 1.35 + .25, alpha: Math.random() * .52 + .14 }));
    const resize = () => { width = canvas.width = window.innerWidth * devicePixelRatio; height = canvas.height = window.innerHeight * devicePixelRatio; canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px`; context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); particles.forEach(p => { p.x = Math.random() * window.innerWidth; p.y = Math.random() * window.innerHeight; }); };
    const move = (event: PointerEvent) => { mouse.x = event.clientX; mouse.y = event.clientY; };
    const draw = () => { const w = window.innerWidth, h = window.innerHeight; context.clearRect(0, 0, width, height); particles.forEach(p => { const dx = p.x - mouse.x, dy = p.y - mouse.y, distance = Math.hypot(dx, dy); if (distance < 170) { const force = (170 - distance) / 170; p.vx += (dx / (distance || 1)) * force * .045; p.vy += (dy / (distance || 1)) * force * .045; } p.x += p.vx; p.y += p.vy; p.vx *= .994; p.vy *= .994; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; p.x = Math.max(0, Math.min(w, p.x)); p.y = Math.max(0, Math.min(h, p.y)); const glow = distance < 170 ? .75 : p.alpha; context.beginPath(); context.fillStyle = `rgba(171, 234, 240, ${glow})`; context.arc(p.x, p.y, p.radius + (distance < 170 ? .7 : 0), 0, Math.PI * 2); context.fill(); }); frame = requestAnimationFrame(draw); };
    resize(); window.addEventListener('resize', resize); window.addEventListener('pointermove', move); draw(); return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); };
  }, []);
  return <canvas className="atmosphere" ref={canvasRef} aria-hidden="true" />;
}
