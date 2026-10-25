import { useEffect, useRef, useState } from 'react';

// Interactive formation: a mesh of aerial nodes that re-forms when a node is lost.
// Tap or click a node to take it out; the remaining nodes re-link and, if the
// leader was lost, elect a new one. Idle visitors get an automatic demonstration.

interface Node {
  id: number;
  hx: number; hy: number;   // home slot, 0..1
  x: number; y: number;     // current position, px
  phase: number;
  alive: boolean;
  fall: number;             // 0 = flying, >0 = dropping out
  rise: number;             // 1 = fully present
}

const SLOTS: [number, number][] = [
  [0.5, 0.2], [0.3, 0.34], [0.7, 0.34], [0.16, 0.52], [0.44, 0.5], [0.62, 0.56], [0.86, 0.5], [0.3, 0.74], [0.68, 0.78],
];

function neighbours(nodes: Node[]): [number, number][] {
  const alive = nodes.filter(n => n.alive);
  const edges = new Set<string>();
  for (const a of alive) {
    alive
      .filter(b => b !== a)
      .map(b => [b, Math.hypot(a.x - b.x, a.y - b.y)] as const)
      .sort((p, q) => p[1] - q[1])
      .slice(0, 3)
      .forEach(([b]) => edges.add(a.id < b.id ? `${a.id}-${b.id}` : `${b.id}-${a.id}`));
  }
  return [...edges].map(e => e.split('-').map(Number) as [number, number]);
}

export default function FormationNet() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState({ alive: SLOTS.length, leader: 1, event: 'MESH NOMINAL' });

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, visible = false, lastInteraction = performance.now(), lastAuto = 0;
    let leader = 0;
    const nodes: Node[] = SLOTS.map(([hx, hy], id) => ({ id, hx, hy, x: 0, y: 0, phase: id * 1.7, alive: true, fall: 0, rise: 1 }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const report = (event: string) =>
      setStatus({ alive: nodes.filter(n => n.alive).length, leader: leader + 1, event });

    const drop = (n: Node) => {
      if (!n.alive || nodes.filter(m => m.alive).length <= 3) return;
      n.alive = false; n.fall = 0.001;
      if (n.id === leader) {
        leader = nodes.find(m => m.alive)!.id;
        report(`LEADER LOST · N-0${leader + 1} ELECTED`);
      } else {
        report(`N-0${n.id + 1} LOST · MESH RE-ROUTED`);
      }
    };

    const restore = () => {
      nodes.forEach(n => { if (!n.alive) { n.alive = true; n.fall = 0; n.rise = 0; } });
      leader = 0;
      report('FORMATION RESTORED');
    };

    const onClick = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const px = e.clientX - r.left, py = e.clientY - r.top;
      lastInteraction = performance.now();
      const hit = nodes.find(n => n.alive && Math.hypot(n.x - px, n.y - py) < 28);
      if (hit) drop(hit);
      else if (nodes.filter(n => n.alive).length < nodes.length) restore();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, R = Math.max(w, h) * 0.6;

      // range rings, grid and a radar sweep
      ctx.strokeStyle = 'rgba(232,226,214,0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 48) { ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 48) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(232,137,58,0.14)';
      for (let k = 1; k <= 4; k++) { ctx.beginPath(); ctx.arc(cx, cy, (R / 4) * k * 0.8, 0, Math.PI * 2); ctx.stroke(); }
      const a = (t * 0.0005) % (Math.PI * 2);
      const sweep = ctx.createConicGradient ? ctx.createConicGradient(a - 0.6, cx, cy) : null;
      if (sweep) {
        sweep.addColorStop(0, 'rgba(232,137,58,0)');
        sweep.addColorStop(0.09, 'rgba(232,137,58,0.13)');
        sweep.addColorStop(0.0955, 'rgba(232,137,58,0)');
        sweep.addColorStop(1, 'rgba(232,137,58,0)');
        ctx.fillStyle = sweep;
        ctx.fillRect(0, 0, w, h);
      }

      // positions
      for (const n of nodes) {
        n.x = n.hx * w + Math.sin(t * 0.0007 + n.phase) * 10;
        n.y = n.hy * h + Math.cos(t * 0.0006 + n.phase) * 8;
        if (n.fall > 0) n.fall = Math.min(1, n.fall + 0.012);
        if (n.rise < 1) n.rise = Math.min(1, n.rise + 0.02);
      }

      // links with travelling packets
      neighbours(nodes).forEach(([i, j], k) => {
        const p = nodes[i], q = nodes[j];
        const lead = i === leader || j === leader;
        const alpha = Math.min(p.rise, q.rise);
        ctx.strokeStyle = lead ? `rgba(244,170,100,${0.75 * alpha})` : `rgba(236,232,224,${0.32 * alpha})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        const f = (t * 0.0004 + k * 0.37) % 1;
        ctx.fillStyle = lead ? 'rgba(255,190,120,0.95)' : 'rgba(255,255,255,0.75)';
        ctx.fillRect(p.x + (q.x - p.x) * f - 1.5, p.y + (q.y - p.y) * f - 1.5, 3, 3);
      });

      // nodes
      for (const n of nodes) {
        if (!n.alive && n.fall >= 1) continue;
        const isLeader = n.alive && n.id === leader;
        const y = n.y + n.fall * n.fall * h * 0.5;
        const alpha = n.alive ? n.rise : 1 - n.fall;
        const r = isLeader ? 7 : 5;
        const glow = ctx.createRadialGradient(n.x, y, 0, n.x, y, r * 6);
        const col = !n.alive ? '230,80,60' : isLeader ? '244,150,66' : '255,255,255';
        glow.addColorStop(0, `rgba(${col},${0.45 * alpha})`);
        glow.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(n.x, y, r * 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${!n.alive ? '230,80,60' : isLeader ? '246,179,122' : '244,241,234'},${alpha})`;
        ctx.beginPath(); ctx.arc(n.x, y, r, 0, Math.PI * 2); ctx.fill();
        if (n.alive) {
          ctx.strokeStyle = `rgba(236,232,224,${0.35 * alpha})`;
          ctx.beginPath(); ctx.arc(n.x, y, r + 7, -0.6, 0.6); ctx.stroke();
          ctx.beginPath(); ctx.arc(n.x, y, r + 7, Math.PI - 0.6, Math.PI + 0.6); ctx.stroke();
          ctx.fillStyle = `rgba(154,150,142,${alpha})`;
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(`N-0${n.id + 1}`, n.x + 14, y - 10);
        }
        if (isLeader) {
          const pulse = (t * 0.0007) % 1;
          ctx.strokeStyle = `rgba(244,150,66,${0.7 * (1 - pulse)})`;
          ctx.beginPath(); ctx.arc(n.x, y, r + 4 + pulse * 30, 0, Math.PI * 2); ctx.stroke();
        }
      }

      // automatic demonstration while nobody is interacting
      const now = performance.now();
      if (now - lastInteraction > 6000 && now - lastAuto > 3200) {
        lastAuto = now;
        const alive = nodes.filter(n => n.alive);
        if (alive.length <= 5) restore();
        else drop(Math.random() < 0.35 ? nodes[leader] : alive[Math.floor(Math.random() * alive.length)]);
      }
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (visible) draw(t);
    };

    resize();
    draw(0);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.1 });
    io.observe(canvas);
    canvas.addEventListener('pointerdown', onClick);
    if (!reduced) raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); canvas.removeEventListener('pointerdown', onClick); };
  }, []);

  return (
    <div className="formation">
      <div className="formation-hud formation-hud-top">
        <span>VAJRA-NET · FORMATION SIMULATION</span>
        <span><i className="live-dot" />LIVE</span>
      </div>
      <canvas ref={ref} className="formation-canvas" aria-label="Interactive formation demonstration. Click a node to remove it." />
      <div className="formation-hud formation-hud-bottom">
        <span>NODES {String(status.alive).padStart(2, '0')}/{String(SLOTS.length).padStart(2, '0')}</span>
        <span>LEADER N-0{status.leader}</span>
        <span className="formation-event">{status.event}</span>
      </div>
      <p className="formation-hint">Tap a node to take it out. The formation re-forms.</p>
    </div>
  );
}
