import type { ReactNode } from 'react';

// Animated line-art illustrations for the four capability cards. Drawn as SVG so
// they stay sharp at any size; deliberately generic, with no dimensions or figures.

const W = 400;
const H = 300;

function Frame({ id, fig, status, children }: { id: string; fig: string; status: string; children: ReactNode }) {
  return (
    <svg className="cv" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" className="cv-grid" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-grid)`} />
      {children}
      <text x="16" y={H - 14} className="cv-label">{fig}</text>
      <text x={W - 16} y={H - 14} className="cv-label" textAnchor="end">{status}</text>
    </svg>
  );
}

/** 01 · Blueprint of a generic hybrid VTOL airframe with spinning rotors. */
export function AirframeVisual() {
  const rotors: [number, number][] = [[128, 96], [282, 96], [128, 204], [282, 204]];
  return (
    <Frame id="cv1" fig="FIG 01 · AIRFRAME" status="CONCEPT">
      <g className="cv-line">
        {/* booms */}
        <path d="M128 96H282M128 204H282" />
        {/* fuselage */}
        <path d="M92 150c0-10 30-15 70-15h96c26 0 50 6 60 15c-10 9-34 15-60 15h-96c-40 0-70-5-70-15z" className="cv-fill" />
        {/* wing */}
        <path d="M178 44h26l8 106-8 106h-26l-6-106z" className="cv-fill" />
        {/* tail */}
        <path d="M96 128h18l6 22-6 22H96l-4-22z" className="cv-fill" />
        {/* payload bay */}
        <rect x="222" y="141" width="30" height="18" rx="2" className="cv-amber" />
      </g>
      {rotors.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="30" className="cv-disc" />
          <circle cx={x} cy={y} r="3" className="cv-hub" />
          <g className="cv-spin" style={{ transformOrigin: `${x}px ${y}px`, animationDuration: `${0.9 + i * 0.07}s` }}>
            <path d={`M${x - 28} ${y}H${x + 28}`} className="cv-blade" />
          </g>
        </g>
      ))}
      {/* centre of gravity marker */}
      <g className="cv-cg">
        <circle cx="192" cy="150" r="7" />
        <path d="M192 143v14M185 150h14" />
      </g>
      {/* dimension lines, deliberately without values */}
      <g className="cv-dim">
        <path d="M352 44V256M346 44h12M346 256h12" />
        <path d="M92 262H318M92 256v12M318 256v12" />
      </g>
      <text x="360" y="153" className="cv-label">SPAN</text>
      <text x="205" y="256" className="cv-label" textAnchor="middle">LENGTH</text>
      <path d="M252 150l40-44h52" className="cv-leader" />
      <text x="300" y="100" className="cv-label cv-label-amber">PAYLOAD</text>
      <rect x="0" y="0" width="2" height={H} className="cv-scan" />
    </Frame>
  );
}

/** 02 · Plan-position radar scope with a rotating sweep and fading tracks. */
export function RadarVisual() {
  const cx = 200, cy = 146, T = 4;
  const tracks: [number, number, string][] = [[38, 92, 'TRK 01'], [124, 64, 'TRK 02'], [212, 104, 'TRK 03'], [298, 48, 'TRK 04']];
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);
  return (
    <Frame id="cv2" fig="FIG 02 · SENSING" status="SCANNING">
      <defs>
        <linearGradient id="cv2-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e8893a" stopOpacity="0" />
          <stop offset="1" stopColor="#e8893a" stopOpacity="0.32" />
        </linearGradient>
      </defs>
      {[40, 80, 120].map(r => <circle key={r} cx={cx} cy={cy} r={r} className="cv-ring" />)}
      <path d={`M${cx - 128} ${cy}H${cx + 128}M${cx} ${cy - 128}V${cy + 128}`} className="cv-ring" />
      {ticks.map(a => {
        const rad = (a - 90) * Math.PI / 180, r1 = a % 30 === 0 ? 112 : 116;
        return <path key={a} d={`M${cx + Math.cos(rad) * r1} ${cy + Math.sin(rad) * r1}L${cx + Math.cos(rad) * 120} ${cy + Math.sin(rad) * 120}`} className="cv-tick" />;
      })}
      <g className="cv-sweep" style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: `${T}s` }}>
        <path d={`M${cx} ${cy}L${cx} ${cy - 120}A120 120 0 0 0 ${cx - 60} ${cy - 104}Z`} fill="url(#cv2-sweep)" />
        <path d={`M${cx} ${cy}V${cy - 120}`} className="cv-sweep-line" />
      </g>
      {tracks.map(([a, r, label]) => {
        const rad = (a - 90) * Math.PI / 180, x = cx + Math.cos(rad) * r, y = cy + Math.sin(rad) * r;
        return (
          <g key={label} className="cv-blip" style={{ animationDelay: `${(a / 360) * T}s`, animationDuration: `${T}s` }}>
            <circle cx={x} cy={y} r="3.2" />
            <rect x={x - 8} y={y - 8} width="16" height="16" className="cv-box" />
            <text x={x + 12} y={y - 6} className="cv-label">{label}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="3" className="cv-hub" />
    </Frame>
  );
}

/** 03 · Gimballed reference rings and a source-confidence panel. */
export function NavigationVisual() {
  const cx = 138, cy = 146;
  const sources = [['GNSS', 'cv-src-gnss'], ['INERTIAL', ''], ['VISUAL', ''], ['MAGNETIC', '']];
  return (
    <Frame id="cv3" fig="FIG 03 · NAVIGATION" status="FUSED">
      {Array.from({ length: 72 }, (_, i) => {
        const rad = (i * 5 - 90) * Math.PI / 180, r1 = i % 6 === 0 ? 92 : 98;
        return <path key={i} d={`M${cx + Math.cos(rad) * r1} ${cy + Math.sin(rad) * r1}L${cx + Math.cos(rad) * 104} ${cy + Math.sin(rad) * 104}`} className={i % 6 === 0 ? 'cv-tick cv-tick-major' : 'cv-tick'} />;
      })}
      <path d={`M${cx} ${cy - 112}l-6 -10h12z`} className="cv-amber-fill" />
      <g className="cv-gimbal" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <ellipse cx={cx} cy={cy} rx="78" ry="22" className="cv-ring-bright g1" />
        <ellipse cx={cx} cy={cy} rx="24" ry="78" className="cv-ring-bright g2" />
        <ellipse cx={cx} cy={cy} rx="62" ry="62" className="cv-ring g3" />
      </g>
      <circle cx={cx} cy={cy} r="16" className="cv-core-glow" />
      <circle cx={cx} cy={cy} r="8" className="cv-core" />
      <g transform="translate(262 78)">
        <text x="0" y="0" className="cv-label">SOURCE CONFIDENCE</text>
        {sources.map(([name, cls], i) => (
          <g key={name} transform={`translate(0 ${22 + i * 34})`}>
            <text x="0" y="0" className="cv-label">{name}</text>
            <rect x="0" y="8" width="118" height="4" className="cv-bar-bg" />
            <rect x="0" y="8" width={[118, 104, 92, 98][i]} height="4" className={`cv-bar ${cls}`} />
          </g>
        ))}
        <text x="0" y="164" className="cv-label cv-label-amber cv-blink">GNSS · DEGRADED</text>
      </g>
    </Frame>
  );
}

/** 04 · A node mesh that drops one node and re-routes around it. */
export function MeshVisual() {
  const pts: [number, number][] = [[86, 82], [192, 58], [304, 86], [130, 168], [246, 160], [334, 196], [196, 236], [62, 222]];
  const edges = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 4], [2, 5], [3, 4], [4, 5], [3, 6], [5, 6], [3, 7], [7, 6]];
  const lost = 4;
  const detour = [[3, 2], [6, 5], [1, 3]];
  return (
    <Frame id="cv4" fig="FIG 04 · NETWORK" status="SELF-HEALING">
      {edges.map(([a, b], k) => {
        const viaLost = a === lost || b === lost;
        return (
          <g key={k} className={viaLost ? 'cv-edge-lost' : ''}>
            <line x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} className={a === 1 || b === 1 ? 'cv-edge cv-edge-lead' : 'cv-edge'} />
            <circle r="2" className="cv-packet">
              <animateMotion dur={`${2 + (k % 4) * 0.6}s`} repeatCount="indefinite" path={`M${pts[a][0]},${pts[a][1]} L${pts[b][0]},${pts[b][1]}`} />
            </circle>
          </g>
        );
      })}
      {detour.map(([a, b], k) => (
        <line key={k} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} className="cv-detour" />
      ))}
      {pts.map(([x, y], i) => (
        <g key={i} className={i === lost ? 'cv-node cv-node-lost' : i === 1 ? 'cv-node cv-node-lead' : 'cv-node'}>
          <circle cx={x} cy={y} r="14" className="cv-node-halo" />
          <circle cx={x} cy={y} r={i === 1 ? 5.5 : 4} />
          {i === 1 && <circle cx={x} cy={y} r="6" className="cv-pulse" />}
          <text x={x + 10} y={y - 10} className="cv-label">N-0{i + 1}</text>
        </g>
      ))}
    </Frame>
  );
}
