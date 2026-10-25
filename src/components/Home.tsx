import { useEffect, useRef, useState } from 'react';
import { asset, capabilities, formatDate, principles, roadmap, site, team, updates } from '../content';
import Topography from './Topography';
import { FilmModal, FilmSection } from './Film';
import { Arrow, Label, LoopVideo, Marquee, Reveal, Title } from './ui';
import FormationNet from './FormationNet';
import { AirframeVisual, MeshVisual, NavigationVisual, RadarVisual } from './CapVisuals';

const capVisuals = [AirframeVisual, RadarVisual, NavigationVisual, MeshVisual];

function Hero({ onPlay }: { onPlay: () => void }) {
  const h = site.hero;
  return (
    <section className="hero" id="top">
      <div className="hero-sky" />
      <Topography />
      <div className="hero-vignette" />
      <div className="hero-inner">
        <p className="label hero-eyebrow"><span className="live-dot" />{h.eyebrow}</p>
        <h1 className="hero-title">
          <span className="line"><span>{h.headline}</span></span>
          <span className="line"><em>{h.headline_accent}</em></span>
        </h1>
        <p className="hero-intro">{h.intro}</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onPlay}>
            <span className="btn-play" aria-hidden="true">▶</span>{h.primary_label}
          </button>
          <a className="btn btn-ghost" href="#mission">{h.secondary_label}<Arrow /></a>
        </div>
      </div>
      <div className="hero-hud" aria-hidden="true">
        <div><span>STATUS</span><b><i className="live-dot" />{h.status}</b></div>
        <div><span>INCUBATION</span><b>V-NEST · VIT CHENNAI</b></div>
        <div><span>POSITION</span><b>13.08° N · 80.27° E</b></div>
        <div className="hero-scroll"><span>SCROLL</span><i /></div>
      </div>
    </section>
  );
}

function Statement() {
  const s = site.statement;
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  // Lines and words light up as the section scrolls through the viewport.
  useEffect(() => {
    const onScroll = () => {
      const r = ref.current!.getBoundingClientRect();
      const vh = window.innerHeight;
      setProgress(Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height * 0.9))));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  const lines = s.lines ?? [];
  const words = (s.body ?? '').split(' ');
  return (
    <section className="statement" ref={ref}>
      <div className="statement-lines">
        {lines.map((line, i) => (
          <p key={line} className={progress > (i + 0.4) / (lines.length + 2) ? 'lit' : ''}>{line}</p>
        ))}
      </div>
      <p className="statement-body">
        {words.map((word, i) => (
          <span key={i} className={progress > 0.45 + (i / words.length) * 0.45 ? 'lit' : ''}>{word} </span>
        ))}
      </p>
    </section>
  );
}

function PlatformBand() {
  const p = site.platform;
  if (!p?.video) return null;
  return (
    <section className="band">
      <div className="band-frame">
        <LoopVideo src={asset(p.video)} className="band-video" label={p.note} />
        <div className="band-scan" aria-hidden="true" />
        <div className="band-hud" aria-hidden="true">
          <span className="band-tl">FIG. 01 · {p.label}</span>
          <span className="band-tr"><i className="live-dot" />LOOP</span>
          <span className="band-reticle"><i /><i /></span>
        </div>
        <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
      </div>
      <div className="band-caption">
        <Reveal><Title text={p.title} accent={p.title_accent} /></Reveal>
        <p className="band-note">{p.note}</p>
      </div>
    </section>
  );
}

function Mission() {
  const m = site.mission;
  return (
    <section className="mission" id="mission">
      <img className="mission-emblem" src={asset('emblem-white.png')} alt="" aria-hidden="true" />
      <div className="split">
        <div>
          <Label index="01">{m.label}</Label>
          <Reveal><Title text={m.title} accent={m.title_accent} /></Reveal>
        </div>
        <Reveal className="prose" delay={120}>
          {(m.paragraphs ?? []).map(p => <p key={p.slice(0, 24)}>{p}</p>)}
        </Reveal>
      </div>
      <dl className="facts">
        {(m.facts ?? []).map(f => (
          <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
        ))}
      </dl>
    </section>
  );
}

function Capabilities() {
  const c = capabilities;
  return (
    <section className="capabilities" id="capabilities">
      <div className="split">
        <div>
          <Label index="02">{c.label}</Label>
          <Reveal><Title text={c.title} accent={c.title_accent} /></Reveal>
        </div>
        <Reveal delay={120}><p className="lede">{c.intro}</p></Reveal>
      </div>
      <div className="cap-grid">
        {(c.areas ?? []).map((a, i) => (
          <Reveal key={a.title} className="cap" delay={i * 90}>
            <div className="cap-media">
              {a.media ? <LoopVideo src={asset(a.media)} label={a.title} /> : <CapVisual n={i} />}
              <span className="cap-code">{a.code}</span>
            </div>
            <div className="cap-text">
              <h3>{a.title}</h3>
              <p>{a.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="programmes">
        <FormationNet />
        <div className="programme-list">
          <p className="label"><span className="label-index">//</span><span>Programmes</span></p>
          {(c.programmes ?? []).map(p => (
            <Reveal key={p.name} className="programme">
              <h3>{p.name}</h3>
              <span className="programme-kind">{p.kind}</span>
              <p>{p.body}</p>
              <span className="tag">{p.status}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapVisual({ n }: { n: number }) {
  const Visual = capVisuals[n % capVisuals.length];
  return <Visual />;
}

function Principles() {
  const p = principles;
  return (
    <section className="principles" id="principles">
      <Label index="04">{p.label}</Label>
      <Reveal><Title text={p.title} accent={p.title_accent} /></Reveal>
      <ol className="principle-list">
        {(p.items ?? []).map((item, i) => (
          <Reveal key={item.title} className="principle" delay={i * 80}>
            <span className="principle-n">0{i + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

function Roadmap() {
  const r = roadmap;
  return (
    <section className="roadmap" id="roadmap">
      <div className="split">
        <div>
          <Label index="05">{r.label}</Label>
          <Reveal><Title text={r.title} accent={r.title_accent} /></Reveal>
        </div>
        <Reveal delay={120}><p className="lede">{r.note}</p></Reveal>
      </div>
      <div className="track">
        {(r.phases ?? []).map((ph, i) => (
          <Reveal key={ph.phase} className={`phase ${ph.current ? 'phase-current' : ''}`} delay={i * 90}>
            <div className="phase-node"><i /></div>
            <span className="phase-n">PHASE {ph.phase}{ph.current && <b> · NOW</b>}</span>
            <h3>{ph.title}</h3>
            <p>{ph.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function LatestUpdates() {
  if (updates.length === 0) return null;
  return (
    <section className="updates" id="updates">
      <div className="updates-head">
        <div>
          <Label index="06">Updates</Label>
          <Title text="From the" accent="workshop." />
        </div>
        <a className="btn btn-ghost" href="#/updates">All updates<Arrow /></a>
      </div>
      <div className="update-grid">
        {updates.slice(0, 3).map((u, i) => <UpdateCard key={u.slug} u={u} delay={i * 90} />)}
      </div>
    </section>
  );
}

export function UpdateCard({ u, delay = 0 }: { u: (typeof updates)[number]; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <a className="update-card" href={`#/updates/${u.slug}`}>
        <div className="update-thumb">
          {u.cover ? <img src={asset(u.cover)} alt="" loading="lazy" /> : <img className="update-thumb-mark" src={asset('emblem-white.png')} alt="" />}
        </div>
        <div className="update-meta"><span>{u.category}</span><span>{formatDate(u.date)}</span></div>
        <h3>{u.title}</h3>
        <p>{u.summary}</p>
        <span className="update-more">Read<Arrow /></span>
      </a>
    </Reveal>
  );
}

function People() {
  const t = team;
  return (
    <section className="people" id="people">
      <Label index="07">{t.label}</Label>
      <Reveal><Title text={t.title} accent={t.title_accent} /></Reveal>
      <div className="people-grid">
        {(t.members ?? []).map((m, i) => (
          <Reveal key={m.name} className="person" delay={i * 70}>
            <div className="person-photo">
              <img className="person-fallback" src={asset('emblem-white.png')} alt="" aria-hidden="true" />
              {m.photo && <img src={asset(m.photo)} alt={m.name} loading="lazy" onError={e => { e.currentTarget.style.display = 'none'; }} />}
            </div>
            <h3>{m.linkedin ? <a href={m.linkedin} target="_blank" rel="noreferrer">{m.name} ↗</a> : m.name}</h3>
            <p>{m.role}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Careers() {
  const c = site.careers;
  return (
    <section className="careers" id="careers">
      <div className="careers-glow" aria-hidden="true" />
      <Label index="08">{c.label}</Label>
      <Reveal><Title text={c.title} accent={c.title_accent} /></Reveal>
      <div className="careers-body">
        <p className="lede">{c.body}</p>
        <ul className="areas">{(c.areas ?? []).map(a => <li key={a}>{a}</li>)}</ul>
      </div>
      <a className="btn btn-primary" href={`mailto:${c.email}?subject=Joining%20VyuhaAero`}>Write to us<Arrow /></a>
    </section>
  );
}

export default function Home() {
  const [filmOpen, setFilmOpen] = useState(false);
  return (
    <main>
      <Hero onPlay={() => setFilmOpen(true)} />
      <Marquee items={['Aerial platforms', 'Distributed sensing', 'Resilient navigation', 'Networked autonomy', 'Made in India', 'Chennai · V-NEST']} />
      <Statement />
      <PlatformBand />
      <Mission />
      <Capabilities />
      <FilmSection />
      <Principles />
      <Roadmap />
      <LatestUpdates />
      <People />
      <Careers />
      <FilmModal open={filmOpen} onClose={() => setFilmOpen(false)} />
    </main>
  );
}
