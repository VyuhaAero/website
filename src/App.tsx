import { useEffect, useState } from 'react';
import { site } from './content';
import { Footer, Nav } from './components/Chrome';
import Home from './components/Home';
import { UpdatePost, UpdatesIndex } from './components/UpdatePages';

// Hash routing keeps every page working on GitHub Pages without server rewrites.
// "#/updates/..." are pages; any other hash ("#film") is a section on the home page.
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

function App() {
  const hash = useHash();
  const route = hash.startsWith('#/') ? hash.slice(2).split('/') : [];
  const isPage = route.length > 0 && route[0] !== '';
  const page0 = isPage ? route[0] : '';

  useEffect(() => {
    if (isPage) {
      window.scrollTo(0, 0);
      return;
    }
    const id = hash.slice(1);
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, [hash, isPage]);

  useEffect(() => {
    document.title = page0 === 'updates'
      ? `Updates — ${site.company}`
      : `${site.company} — ${site.tagline}`;
  }, [page0]);

  let page = <Home />;
  if (isPage && route[0] === 'updates') page = route[1] ? <UpdatePost slug={route[1]} /> : <UpdatesIndex />;

  return (
    <>
      <Nav />
      {page}
      <Footer />
    </>
  );
}

export default App;
