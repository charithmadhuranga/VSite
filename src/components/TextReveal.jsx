import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export default function TextReveal({ text, tag: Tag = 'span', className = '', as, ...props }) {
  const ref = useRef(null);
  const UseTag = as || Tag;

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const original = text;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          const totalDuration = Math.min(original.length * 0.025, 1.2);
          const steps = Math.min(original.length, 40);

          for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const revealIndex = Math.floor(progress * original.length);

            tl.call(() => {
              let displayed = '';
              for (let j = 0; j < original.length; j++) {
                if (j < revealIndex) {
                  displayed += original[j];
                } else if (original[j] === ' ') {
                  displayed += ' ';
                } else {
                  displayed += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
              }
              el.textContent = displayed;
            }, null, (i / steps) * totalDuration);
          }

          tl.call(() => {
            el.textContent = original;
          });
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [text]);

  return (
    <UseTag ref={ref} className={className} {...props}>
      {text}
    </UseTag>
  );
}
