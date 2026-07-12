import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    name: 'Isuru Akalanka',
    role: 'Chief Executive Officer',
    abbr: 'IA',
    color: 'from-primary to-emerald-400',
  },
  {
    name: 'Charith Madhuranga',
    role: 'Chief Technology Officer',
    abbr: 'CM',
    color: 'from-secondary to-violet-400',
  },
  {
    name: 'Nipuna Dhananjaya',
    role: 'Chief Marketing Officer',
    abbr: 'ND',
    color: 'from-amber-500 to-orange-400',
  },
  {
    name: 'Wageesha',
    role: 'Chief Operating Officer',
    abbr: 'W',
    color: 'from-rose-500 to-pink-400',
  },
  {
    name: 'Jacob',
    role: 'Director — Agriculture',
    abbr: 'J',
    color: 'from-emerald-500 to-teal-400',
  },
];

export default function Team() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.team-header', {
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
    <section id="team" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 team-header">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-secondary tracking-[0.3em] uppercase"
          >
            Our Team
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-black mt-4 mb-6">
            <span className="text-white">The People Behind </span>
            <span className="text-gradient">Vioneta</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            A visionary leadership team driving innovation in edge computing across industries.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="group text-center"
            >
              <div className="relative w-28 h-28 mx-auto mb-5">
                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-60`} />
                <div className="relative w-full h-full bg-dark-card rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                  <span className="text-2xl font-black text-white/80">{member.abbr}</span>
                </div>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{member.name}</h4>
              <p className="text-xs text-text-muted">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
