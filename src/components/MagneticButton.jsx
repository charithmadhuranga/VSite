import { useRef, useState } from 'react';

export default function MagneticButton({ children, className = '', strength = 0.35, ...props }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setStyle({
      transform: `translate(${x * strength}px, ${y * strength}px)`,
      transition: 'transform 0.2s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'translate(0px, 0px)',
      transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
    });
  };

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={className}
      data-cursor="pointer"
      {...props}
    >
      {children}
    </button>
  );
}
