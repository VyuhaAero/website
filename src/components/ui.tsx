import { useEffect, useRef, type ReactNode } from 'react';

/** Section label in the film's bracketed mono style: [02]  WHAT WE BUILD */
export function Label({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <p className="label">
      {index && <span className="label-index">[{index}]</span>}
      <span>{children}</span>
    </p>
  );
}

export function Title({ text, accent, as = 'h2' }: { text: string; accent?: string; as?: 'h1' | 'h2' }) {
  const Tag = as;
  return (
    <Tag className="title">
      <span>{text}</span>
      {accent && <><br /><em>{accent}</em></>}
    </Tag>
  );
}

export const Arrow = () => <span className="arrow" aria-hidden="true">→</span>;

/** Fades children in as they scroll into view. */
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); }
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/** Muted looping clip that only plays while on screen. */
export function LoopVideo({ src, className = '', label }: { src: string; className?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current!;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.05 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} className={className} src={src} muted loop playsInline preload="metadata" aria-label={label} />;
}

export function Marquee({ items }: { items: string[] }) {
  const row = (copy: number) => items.map(item => <span key={`${copy}-${item}`}>{item}<i>✦</i></span>);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">{row(0)}{row(1)}</div>
    </div>
  );
}
