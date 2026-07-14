import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const lineRef = useRef(null);
  const counterRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        onComplete?.();
      },
    });

    // Animate the progress counter
    tl.to(counterRef.current, {
      innerText: 100,
      duration: 2.2,
      snap: { innerText: 1 },
      ease: 'power2.inOut',
    });

    // Line grow
    tl.fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 2.2, ease: 'power2.inOut' },
      0
    );

    // Text reveal
    tl.fromTo(textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      0.2
    );

    // Exit animation
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
      delay: 0.3,
    });
  }, [onComplete]);

  if (done) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-dark"
    >
      {/* Logo */}
      <div ref={textRef} className="mb-10 opacity-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-black text-lg">V</span>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Vioneta</span>
        </div>
      </div>

      {/* Progress line */}
      <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          ref={lineRef}
          className="h-full bg-gradient-to-r from-primary to-secondary origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Counter */}
      <div className="flex items-baseline gap-1">
        <span ref={counterRef} className="text-sm font-mono text-text-muted">0</span>
        <span className="text-sm font-mono text-text-muted">%</span>
      </div>
    </div>
  );
}
