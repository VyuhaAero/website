import { useEffect, useRef, useState } from 'react';
import { asset, site } from '../content';

function youtubeId(url: string): string | null {
  const m = /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/.exec(url);
  return m ? m[1] : null;
}

/** The launch film: a self-hosted MP4, or a YouTube link if one is set in the CMS. */
function Player({ autoPlay = false }: { autoPlay?: boolean }) {
  const f = site.film;
  const yt = f.youtube ? youtubeId(f.youtube) : null;
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(autoPlay);

  useEffect(() => {
    if (autoPlay && video.current) video.current.play().catch(() => setStarted(false));
  }, [autoPlay]);

  if (yt) {
    return started ? (
      <iframe
        className="film-media"
        src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
        title={`${site.company} launch film`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    ) : (
      <button className="film-cover" onClick={() => setStarted(true)} aria-label="Play the launch film">
        <img src={asset(f.poster)} alt="" />
        <PlayMark />
      </button>
    );
  }

  return (
    <>
      <video
        ref={video}
        className="film-media"
        src={asset(f.video)}
        poster={asset(f.poster)}
        controls={started}
        playsInline
        preload="metadata"
      />
      {!started && (
        <button
          className="film-cover film-cover-overlay"
          aria-label="Play the launch film"
          onClick={() => { setStarted(true); video.current?.play(); }}
        >
          <PlayMark />
        </button>
      )}
    </>
  );
}

function PlayMark() {
  return (
    <span className="play">
      <span className="play-ring"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg></span>
      <span className="play-text">PLAY THE FILM</span>
    </span>
  );
}

export function FilmSection() {
  const f = site.film;
  return (
    <section className="film" id="film">
      <div className="section-head">
        <p className="label"><span className="label-index">[03]</span><span>{f.label}</span></p>
        <div className="film-head">
          <h2 className="title"><span>{f.title}</span></h2>
          <p className="lede">{f.caption}</p>
        </div>
      </div>
      <div className="film-frame">
        <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
        <Player />
      </div>
      <div className="film-meta">
        <span>VYUHAAERO SYSTEMS · LAUNCH FILM</span>
        <span>CHENNAI, INDIA</span>
      </div>
    </section>
  );
}

export function FilmModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.classList.add('menu-open');
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('menu-open'); };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Launch film" onClick={onClose}>
      <button className="modal-close" onClick={onClose}>CLOSE ✕</button>
      <div className="modal-body" onClick={e => e.stopPropagation()}>
        <Player autoPlay />
      </div>
    </div>
  );
}
