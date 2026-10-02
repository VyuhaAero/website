import { useState, useEffect, useCallback } from 'react';
import Atmosphere from './Atmosphere';

const founders: [string, string, string][] = [
  ['Kailash A', 'Chief Executive Officer', 'kailash-a.jpg'],
  ['Prithviraj G', 'Chief Technology Officer', 'prithviraj-g.jpg'],
  ['Sai Vignesh B', 'Chief Operating Officer', 'sai-vignesh-b.png'],
  ['Tharun Kumar V', 'Chief Financial Officer', 'tharun-kumar-v.jpg'],
  ['Dr. Richards Joe Stanislaus', 'Chief Technical Advisor', 'richards-joe-stanislaus.png']
];

const Arrow = () => <span className="arrow" aria-hidden="true">→</span>;

const phrases: [string, string][] = [
  ["For the world", "above the map."],
  ["The unknown", "is an engineering problem."],
  ["Where autonomy", "meets the unknown."],
  ["When the map ends,", "systems must continue."],
  ["From sensing", "to understanding."],
  ["Built to navigate", "the uncertain."],
  ["For missions", "without easy answers."],
  ["Beyond the limits", "of the familiar."],
  ["The difficult places", "are worth reaching."],
  ["The horizon is not", "the limit."]
];

type Phase = 'typing' | 'holding' | 'deleting' | 'pausing';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const assetBase = import.meta.env.BASE_URL;

  // Typewriter state
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');

  const fullText = phrases[phraseIdx][0] + '\n' + phrases[phraseIdx][1];

  // Check reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setCharIndex(fullText.length);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    switch (phase) {
      case 'typing':
        if (charIndex < fullText.length) {
          timer = setTimeout(() => setCharIndex(prev => prev + 1), 80);
        } else {
          setPhase('holding');
        }
        break;
      case 'holding':
        timer = setTimeout(() => setPhase('deleting'), 3500);
        break;
      case 'deleting':
        if (charIndex > 0) {
          timer = setTimeout(() => setCharIndex(prev => prev - 1), 45);
        } else {
          setPhase('pausing');
        }
        break;
      case 'pausing':
        timer = setTimeout(() => {
          setPhraseIdx(prev => (prev + 1) % phrases.length);
          setPhase('typing');
        }, 550);
        break;
    }

    return () => clearTimeout(timer);
  }, [charIndex, phase, fullText.length, prefersReducedMotion]);

  // Derive displayed text
  const displayed = fullText.substring(0, charIndex);
  const newlinePos = displayed.indexOf('\n');
  let line1 = displayed;
  let line2 = '';
  if (newlinePos !== -1) {
    line1 = displayed.substring(0, newlinePos);
    line2 = displayed.substring(newlinePos + 1);
  }

  // Show line2 em only when we have typed past the newline
  const showLine2 = newlinePos !== -1;

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <main className="site-shell animate-enter">
      <Atmosphere />

      {/* ───── NAVBAR ───── */}
      <header className="nav-wrap">
        <a className="wordmark" href="#top">
          <img src={`${assetBase}vyuha-emblem.png`} alt="VyuhaAero Systems" className="logo-img" />
          <div className="wordmark-text">
            <span>VyuhaAero</span>
            <small>Systems</small>
          </div>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <nav className={menuOpen ? 'navigation open' : 'navigation'}>
          <a href="#about" onClick={closeMenu}>Approach</a>
          <a href="#products" onClick={closeMenu}>Updates</a>
          <a href="#founders" onClick={closeMenu}>Founders</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
      </header>

      {/* ───── HERO ───── */}
      <section className="hero-section" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> CHENNAI, INDIA · EST. 2026</p>

          <h1 className="hero-headline-dynamic" aria-label={fullText.replace('\n', ' ')}>
            <span className="hl-line1">{line1}</span>
            {showLine2 && <br />}
            {showLine2 && <em className="hl-line2">{line2}</em>}
            <span className="typewriter-cursor" aria-hidden="true" />
          </h1>

          <p className="hero-description">
            VyuhaAero Systems is an Indian deeptech startup focused on aerial infrastructure with both defence and civilian applications. We are at the beginning of a long journey — learning, building, and refining with intent.
          </p>

          <div className="hero-actions">
            <a className="button primary" href="#about">Our approach <Arrow /></a>
            <a className="plain-link" href="#founders">Meet the team <span>↓</span></a>
          </div>
        </div>

        <div className="orbit-stage" aria-hidden="true">
          <p className="stage-label sl1">ENGINEERING<br />THE UNCHARTED</p>
          <div className="orbit-glow" />
          <div className="orbit-line ol1"><i /></div>
          <div className="orbit-line ol2"><i /></div>
          <div className="orbit-line ol3"><i /></div>
          <div className="orbit-center"><img src={`${assetBase}vyuha-emblem.png`} alt="" /><i /><i /><i /></div>
          <div className="crosshair ch1" />
          <div className="crosshair ch2" />
        </div>
      </section>

      {/* ───── MANIFESTO ───── */}
      <section className="manifesto">
        <p>There is no shortcut to capability.</p>
        <span>VYUHA AERO SYSTEMS / 01</span>
      </section>

      {/* ───── APPROACH ───── */}
      <section className="approach-section" id="about">
        <div className="section-index">01 / OUR APPROACH</div>
        <div className="approach-copy">
          <h2>Made In India,<br /><em>Made for the World</em></h2>
          <div>
            <p>VyuhaAero Systems is being incubated at V-NEST, VIT Chennai, by a team of engineering students working across aerospace, electronics, autonomy, and intelligent systems. We are focused on developing indigenous capabilities for aerial applications across defence and civilian sectors.</p>
            <p>We are drawn to difficult problems in aerospace, autonomy, and intelligent systems. Our work is still at an early stage, and we approach it accordingly — through experimentation, measurement, iteration, and disciplined engineering. We build, test, learn, and refine until the system works as intended.</p>
          </div>
        </div>
        <div className="principles">
          <article>
            <span>01</span>
            <h3>Systems Thinking</h3>
            <p>We study the environment, understand the constraints, and validate our assumptions before choosing a solution.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Indigenous</h3>
            <p>We believe meaningful capability is built through patient engineering, technical depth, and solutions suited to our needs.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Long-term</h3>
            <p>We are building foundations for the future, prioritising sound engineering over promises made ahead of the work.</p>
          </article>
        </div>
      </section>

      {/* ───── UPDATES ───── */}
      <section className="updates-section" id="products">
        <div className="updates-copy">
          <div className="section-index">02 / CURRENT STATUS</div>
          <h2>Engineering what<br /><em>comes next.</em></h2>
          <p>Our early work is focused on learning, experimentation, and developing the foundations for future aerospace systems. We will share more as our work matures and reaches the right stage for public release.</p>
        </div>
        <div className="sealed-module">
          <div className="module-header">
            <span>VYUHA / DEVELOPMENT LOG</span>
            <span>IN DEVELOPMENT</span>
          </div>
          <div className="module-center">
            <i /><i /><i />
            <strong>EARLY-STAGE<br />DEVELOPMENT</strong>
          </div>
          <div className="module-footer">
            <span>PUBLIC RELEASE / PENDING</span>
            <span>+</span>
          </div>
        </div>
      </section>

      {/* ───── FOUNDERS ───── */}
      <section className="founders-section" id="founders">
        <div className="section-index">03 / FOUNDERS</div>
        <div className="founders-intro">
          <h2>People who<br /><em>choose the hard way.</em></h2>
          <p>Small team. Long horizon.</p>
        </div>
        <div className="founder-grid">
          {founders.map(([name, title, image]) => (
            <article className="founder" key={name}>
              <div className="portrait">
                <img src={`${assetBase}vyuha-emblem.png`} alt="" aria-hidden="true" className="portrait-logo" />
                <img src={`${assetBase}founders/${image}`} alt={`${name} portrait`} onError={e => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <h3>{name}</h3>
              <p>{title}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ───── CONTACT ───── */}
      <footer id="contact">
        <div>
          <p className="section-index">04 / CONTACT</p>
          <h2>Let's make<br /><em>contact.</em></h2>
        </div>
        <div className="contact">
          <a href="mailto:founders@vyuhaaero.com"><span>founders@vyuhaaero.com</span><Arrow /></a>
          <p>V-NEST, VIT Chennai<br />Tamil Nadu, India</p>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VYUHA AERO SYSTEMS</span>
          <span>INDIA</span>
        </div>
      </footer>
    </main>
  );
}
