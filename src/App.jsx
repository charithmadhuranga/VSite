import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Features from './components/Features';
import Industries from './components/Industries';
import Stats from './components/Stats';
import Team from './components/Team';
import CTA from './components/CTA';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import NoiseOverlay from './components/NoiseOverlay';
import Marquee from './components/Marquee';

const MARQUEE_ITEMS = [
  'Edge Computing', 'IoT Solutions', 'VEdgeHub', 'VCloud', 'VEdge',
  'Industrial IoT', 'Smart Agriculture', 'Manufacturing 4.0',
  'Real-Time Analytics', 'Edge AI', 'Fleet Management', 'VOS',
];

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Lenis smooth scroll
  useEffect(() => {
    if (!showContent) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [showContent]);

  const handleLoaderComplete = () => {
    setLoaded(true);
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <>
      <Loader onComplete={handleLoaderComplete} />

      {showContent && (
        <>
          <CustomCursor />
          <NoiseOverlay />

          <div className="min-h-screen bg-dark">
            <Navbar />
            <Hero />

            <div className="relative py-6 border-y border-white/5">
              <Marquee items={MARQUEE_ITEMS} speed={40} className="text-text-muted/40 text-sm font-medium tracking-widest uppercase" />
            </div>

            <Stats />
            <Products />
            <Features />

            <div className="relative py-6 border-y border-white/5">
              <Marquee items={[...MARQUEE_ITEMS].reverse()} speed={35} reverse className="text-text-muted/30 text-sm font-medium tracking-widest uppercase" />
            </div>

            <Industries />
            <Team />
            <CTA />
            <Footer />
          </div>
        </>
      )}
    </>
  );
}
