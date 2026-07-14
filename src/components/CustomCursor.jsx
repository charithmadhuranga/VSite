import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [textCursor, setTextCursor] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Hide on mobile/touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setHidden(true);
      return;
    }
    setHidden(false);

    const onMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onMouseEnter = () => setHidden(false);
    const onMouseLeave = () => setHidden(true);

    // Detect hoverable elements
    const onMouseOver = (e) => {
      const target = e.target.closest('a, button, [data-cursor="pointer"], input, textarea, select');
      const textTarget = e.target.closest('[data-cursor="text"]');
      if (textTarget) {
        setTextCursor(true);
        setHovering(false);
      } else if (target) {
        setHovering(true);
        setTextCursor(false);
      }
    };

    const onMouseOut = (e) => {
      const target = e.target.closest('a, button, [data-cursor="pointer"], input, textarea, select, [data-cursor="text"]');
      if (target) {
        setHovering(false);
        setTextCursor(false);
      }
    };

    // Smooth ring follow
    let raf;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.15;
      ring.current.y += (pos.current.y - ring.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          width: textCursor ? '2px' : hovering ? '4px' : '6px',
          height: textCursor ? '20px' : hovering ? '4px' : '6px',
          borderRadius: textCursor ? '1px' : '50%',
          background: '#fff',
          transition: 'width 0.3s, height 0.3s, border-radius 0.3s',
          marginLeft: textCursor ? '-1px' : hovering ? '-2px' : '-3px',
          marginTop: textCursor ? '-10px' : hovering ? '-2px' : '-3px',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference"
        style={{
          width: hovering ? '56px' : '36px',
          height: hovering ? '56px' : '36px',
          borderRadius: '50%',
          border: `1.5px solid rgba(255,255,255,${hovering ? '0.5' : '0.25'})`,
          transition: 'width 0.4s cubic-bezier(0.23,1,0.32,1), height 0.4s cubic-bezier(0.23,1,0.32,1), border-color 0.3s',
          marginLeft: hovering ? '-28px' : '-18px',
          marginTop: hovering ? '-28px' : '-18px',
        }}
      />
    </>
  );
}
