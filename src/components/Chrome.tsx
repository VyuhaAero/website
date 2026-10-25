import { useEffect, useState } from 'react';
import { asset, site } from '../content';

const links: [string, string][] = [
  ['Mission', '#mission'],
  ['Capabilities', '#capabilities'],
  ['Film', '#film'],
  ['Roadmap', '#roadmap'],
  ['Updates', '#/updates'],
  ['People', '#people'],
  ['Careers', '#careers'],
];

export function Wordmark() {
  return (
    <a className="wordmark" href="#top" aria-label={`${site.company} home`}>
      <img src={asset('emblem-white.png')} alt="" />
      <span className="wordmark-name">VYUHA<b>AERO</b></span>
      <span className="wordmark-sub">SYSTEMS</span>
    </a>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'nav-solid' : ''} ${open ? 'nav-open' : ''}`}>
      <Wordmark />
      <nav className="nav-links" aria-label="Primary">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </nav>
      <a className="nav-cta" href="#contact">Contact</a>
      <button className="nav-toggle" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
        <i /><i />
      </button>
      <div className="nav-drawer" hidden={!open}>
        {links.map(([label, href], i) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            <span>0{i + 1}</span>{label}
          </a>
        ))}
        <a href="#contact" onClick={() => setOpen(false)}><span>0{links.length + 1}</span>Contact</a>
      </div>
    </header>
  );
}

export function Footer() {
  const c = site.contact;
  const socials: [string, string][] = [
    ['LinkedIn', c.linkedin],
    ['Instagram', c.instagram],
    ['X', c.x],
    ['YouTube', c.youtube],
  ].filter((s): s is [string, string] => Boolean(s[1]));

  return (
    <footer className="footer" id="contact">
      <div className="footer-top">
        <div>
          <p className="label"><span className="label-index">[09]</span><span>Contact</span></p>
          <h2 className="title"><span>Let's make</span><br /><em>contact.</em></h2>
        </div>
        <div className="footer-contact">
          <a className="footer-email" href={`mailto:${c.email}`}>{c.email}<span aria-hidden="true">↗</span></a>
          <address>{(c.address_lines ?? []).map(line => <span key={line}>{line}</span>)}</address>
          {socials.length > 0 && (
            <div className="footer-socials">
              {socials.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name}</a>)}
            </div>
          )}
        </div>
      </div>
      <div className="footer-mark" aria-hidden="true">VYUHAAERO</div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {site.company.toUpperCase()}</span>
        <span>MADE IN INDIA</span>
        <span>13.0827° N · 80.2707° E</span>
        <a href="#top">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}
