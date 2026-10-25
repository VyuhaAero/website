import { useState } from 'react';
import { asset, capabilities, formatDate, principles, roadmap, site, team, updates } from '../content';
import Topography from './Topography';
import { FilmModal, FilmSection } from './Film';
import { Arrow, Label, Reveal, Title } from './ui';

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
  return (
    <section className="statement">
      <div className="statement-lines">
        {(s.lines ?? []).map((line, i) => (
          <Reveal key={line} delay={i * 140}><p>{line}</p></Reveal>
        ))}
      </div>
      <Reveal delay={420}><p className="statement-body">{s.body}</p></Reveal>
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
            <div className="cap-top"><span>{a.code}</span><CapGlyph n={i} /></div>
            <h3>{a.title}</h3>
            <p>{a.body}</p>
          </Reveal>
        ))}
      </div>
      {(c.programmes ?? []).length > 0 && (
        <div className="programmes">
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
      )}
    </section>
  );
}

/** Small line-art glyphs for the four capability areas. */
function CapGlyph({ n }: { n: number }) {
  const paths = [
    'M4 24h40M24 10v28M10 18h10M28 18h10M16 30l8-6 8 6',
    'M24 24m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0M24 24m-12 0a12 12 0 1 0 24 0a12 12 0 1 0-24 0M24 24m-19 0a19 19 0 1 0 38 0a19 19 0 1 0-38 0',
    'M24 5v38M5 24h38M24 24l11-11M24 24m-14 0a14 14 0 1 0 28 0a14 14 0 1 0-28 0',
    'M10 12l14 8 14-8M10 12l4 22M38 12l-4 22M24 20v18M14 34h20',
  ];
  return (
    <svg className="glyph" viewBox="0 0 48 48" aria-hidden="true">
      <path d={paths[n % paths.length]} />
      {n === 3 && [[10, 12], [38, 12], [24, 20], [14, 34], [34, 34], [24, 38]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.2" />)}
    </svg>
  );
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
      <Statement />
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
