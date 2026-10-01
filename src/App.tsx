import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import Scene from './components/Scene';
import Overlay from './components/Overlay';
import Home from './components/Home';

function App() {
  const [progress, setProgress] = useState(0);
  const [showHome, setShowHome] = useState(false);
  useEffect(() => {
    const startedAt = performance.now();
    const frame = (now: number) => {
      const next = Math.min(100, ((now - startedAt) / 3600) * 100);
      setProgress(next);
      if (next < 100) requestAnimationFrame(frame);
      else window.setTimeout(() => setShowHome(true), 700);
    };
    const id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, []);
  return <div className="app-root">
    <div className="space-canvas"><Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}><Suspense fallback={null}><Scene loadingComplete={showHome} /><Preload all /></Suspense></Canvas></div>
    {!showHome && <Overlay progress={progress} />}
    {showHome && <Home />}
  </div>;
}
export default App;
