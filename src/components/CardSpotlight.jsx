import { useRef, useState } from 'react';

export default function CardSpotlight({ children, className = '', spotlightColor = '255,255,255', ...props }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setPos((p) => ({ ...p, opacity: 0 }));
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(${spotlightColor},0.04), transparent 40%)`,
          opacity: pos.opacity,
          transition: 'opacity 0.4s ease',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
