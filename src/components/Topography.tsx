import { useEffect, useRef } from 'react';

// Animated topographic terrain in perspective, echoing the launch film's
// opening shot. Contours are extracted from a drifting noise field with
// marching squares and projected onto a ground plane below the horizon.

const COLS = 132;
const ROWS = 84;
const LEVELS = 11;

function hash(x: number, y: number) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function noise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number) {
  return noise(x, y) * 0.6 + noise(x * 2.1, y * 2.1) * 0.28 + noise(x * 4.3, y * 4.3) * 0.12;
}

export default function Topography() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const field = new Float32Array(COLS * ROWS);
    let w = 0, h = 0, raf = 0, visible = true, last = 0;
    const stars: [number, number, number][] = Array.from({ length: 90 }, (_, i) => [hash(i, 7), hash(i, 13), hash(i, 29)]);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Rows are spaced evenly on screen (evenly in 1/z), columns evenly across the
    // screen; the noise is sampled at the matching ground-plane position so the
    // terrain keeps true perspective with no wasted samples off-screen.
    const Z_FAR = 14;
    const rowZ = (j: number) => 1 / (1 - (j / (ROWS - 1)) * (1 - 1 / Z_FAR));
    const project = (u: number, s: number): [number, number] => {
      const horizon = h * 0.47;
      return [w * (u * 1.2 - 0.1), horizon + (h - horizon) * (1 - s * (1 - 1 / Z_FAR))];
    };

    const draw = (t: number) => {
      const drift = t * 0.00004;
      const aspect = w / Math.max(h, 1);
      for (let j = 0; j < ROWS; j++) {
        const z = rowZ(j);
        for (let i = 0; i < COLS; i++) {
          const x = (i / (COLS - 1) - 0.5) * z * aspect * 1.2;
          field[j * COLS + i] = fbm(x * 1.5 + 50, z * 1.5 + drift * 40);
        }
      }

      ctx.clearRect(0, 0, w, h);
      for (const [sx, sy, sb] of stars) {
        ctx.fillStyle = `rgba(235,225,210,${0.15 + sb * 0.5})`;
        ctx.fillRect(sx * w, sy * h * 0.4, sb > 0.85 ? 1.6 : 1, sb > 0.85 ? 1.6 : 1);
      }

      ctx.lineWidth = 1;
      for (let l = 1; l <= LEVELS; l++) {
        const iso = 0.18 + (l / (LEVELS + 1)) * 0.66;
        const peak = l >= LEVELS - 2;
        for (let j = 0; j < ROWS - 1; j++) {
          const v0 = j / (ROWS - 1), v1 = (j + 1) / (ROWS - 1);
          const fade = Math.pow(1 - (v0 + v1) / 2, 1.2);
          ctx.strokeStyle = peak
            ? `rgba(244,150,66,${0.2 + fade * 0.8})`
            : `rgba(${170 + l * 6},${112 + l * 4},${80},${0.08 + fade * 0.6})`;
          ctx.beginPath();
          for (let i = 0; i < COLS - 1; i++) {
            const a = field[j * COLS + i], b = field[j * COLS + i + 1];
            const c = field[(j + 1) * COLS + i + 1], d = field[(j + 1) * COLS + i];
            const idx = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const u0 = i / (COLS - 1), u1 = (i + 1) / (COLS - 1);
            const lerp = (p: number, q: number) => (iso - p) / (q - p);
            const top: [number, number] = [u0 + (u1 - u0) * lerp(a, b), v0];
            const right: [number, number] = [u1, v0 + (v1 - v0) * lerp(b, c)];
            const bottom: [number, number] = [u0 + (u1 - u0) * lerp(d, c), v1];
            const left: [number, number] = [u0, v0 + (v1 - v0) * lerp(a, d)];
            const segs: [number, number][][] = [];
            switch (idx) {
              case 1: case 14: segs.push([left, bottom]); break;
              case 2: case 13: segs.push([bottom, right]); break;
              case 3: case 12: segs.push([left, right]); break;
              case 4: case 11: segs.push([top, right]); break;
              case 6: case 9: segs.push([top, bottom]); break;
              case 7: case 8: segs.push([left, top]); break;
              case 5: segs.push([left, top], [bottom, right]); break;
              case 10: segs.push([left, bottom], [top, right]); break;
            }
            for (const [p, q] of segs) {
              const [x0, y0] = project(p[0], p[1]);
              const [x1, y1] = project(q[0], q[1]);
              ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
            }
          }
          ctx.stroke();
        }
      }
      drawFormation(t, aspect);
    };

    // A formation of aerial nodes holding station above the terrain, with
    // sensor footprints and data links, as in the film's Vajra-Net shot.
    const nodes = [
      [0.62, 2.05], [1.02, 1.75], [1.42, 2.1], [0.82, 2.6], [1.25, 2.75], [1.7, 2.5], [1.12, 3.4],
    ].map(([x, z], i) => ({ x, z, phase: hash(i, 3) * 6.28 }));
    const links = [[0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 6], [5, 6]];

    const drawFormation = (t: number, aspect: number) => {
      const horizon = h * 0.47;
      const shift = w < 760 ? -0.55 : 0;
      const pts = nodes.map(n => {
        const wx = n.x + shift + Math.sin(t * 0.0003 + n.phase) * 0.05;
        const z = n.z + Math.cos(t * 0.00025 + n.phase) * 0.08;
        const alt = 0.36 + Math.sin(t * 0.0006 + n.phase) * 0.025;
        const u = wx / (z * aspect * 1.2) + 0.5;
        const sx = w * (u * 1.2 - 0.1);
        const gy = horizon + (h - horizon) / z;
        return { sx, gy, sy: gy - (alt * (h - horizon)) / z, z };
      });

      for (const p of pts) {
        const half = (h * 0.09) / p.z;
        const g = ctx.createLinearGradient(0, p.sy, 0, p.gy);
        g.addColorStop(0, 'rgba(200,215,235,0.22)');
        g.addColorStop(1, 'rgba(200,215,235,0.02)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(p.sx, p.sy);
        ctx.lineTo(p.sx - half, p.gy);
        ctx.lineTo(p.sx + half, p.gy);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(220,230,240,0.18)';
        ctx.beginPath();
        ctx.ellipse(p.sx, p.gy, half, half * 0.22, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.lineWidth = 1;
      links.forEach(([a, b], k) => {
        const p = pts[a], q = pts[b];
        const lead = a === 1 || b === 1;
        ctx.strokeStyle = lead ? 'rgba(244,170,100,0.7)' : 'rgba(235,235,235,0.38)';
        ctx.beginPath(); ctx.moveTo(p.sx, p.sy); ctx.lineTo(q.sx, q.sy); ctx.stroke();
        // data packet travelling along the link
        const f = ((t * 0.00035 + hash(k, 11)) % 1);
        ctx.fillStyle = lead ? 'rgba(255,190,120,0.95)' : 'rgba(255,255,255,0.8)';
        ctx.fillRect(p.sx + (q.sx - p.sx) * f - 1, p.sy + (q.sy - p.sy) * f - 1, 2, 2);
      });

      pts.forEach((p, i) => {
        const r = Math.max(2.5, 7 / p.z);
        const leader = i === 1;
        const glow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 5);
        glow.addColorStop(0, leader ? 'rgba(244,150,66,0.55)' : 'rgba(255,255,255,0.35)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(p.sx, p.sy, r * 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = leader ? '#f6b37a' : '#f4f1ea';
        ctx.beginPath(); ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2); ctx.fill();
        if (leader) {
          const pulse = (t * 0.0006) % 1;
          ctx.strokeStyle = `rgba(244,150,66,${0.6 * (1 - pulse)})`;
          ctx.beginPath(); ctx.arc(p.sx, p.sy, r + pulse * 26, 0, Math.PI * 2); ctx.stroke();
        }
      });
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || t - last < 33) return;
      last = t;
      draw(t);
    };

    resize();
    draw(0);
    const ro = new ResizeObserver(() => { resize(); draw(last); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    if (!reduced) raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  return <canvas ref={ref} className="topography" aria-hidden="true" />;
}
