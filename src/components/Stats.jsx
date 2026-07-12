import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function AnimatedCounter({ target, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 85%',
        onEnter: () => {
          if (counted.current) return;
          counted.current = true;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration,
            ease: 'power2.out',
            onUpdate: () => setCount(Math.floor(obj.val)),
          });
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  { value: 50, suffix: '+', label: 'Industries Served', description: 'Across agriculture, manufacturing, energy & more' },
  { value: 10000, suffix: '+', label: 'Devices Connected', description: 'Processing data at the edge worldwide' },
  { value: 99, suffix: '.9%', label: 'Uptime SLA', description: 'Enterprise-grade reliability guaranteed' },
  { value: 24, suffix: '/7', label: 'Monitoring', description: 'Real-time fleet oversight and alerts' },
];

export default function Stats() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stats-content', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-surface to-dark" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="stats-content">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center group"
              >
                <div className="text-4xl lg:text-5xl font-black text-gradient mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-bold text-white mb-1">{stat.label}</div>
                <div className="text-xs text-text-muted hidden sm:block">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
