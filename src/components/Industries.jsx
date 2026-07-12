import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Leaf, Factory, Zap, HeartPulse, Truck, Building2,
  ArrowRight, ArrowUpRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const industries = [
  {
    icon: Leaf,
    name: 'Agriculture',
    description: 'Smart farming, precision irrigation, soil monitoring, and crop health analytics with edge-processed data.',
    stats: '40% water savings',
    color: 'from-emerald-500/20 to-emerald-500/5',
    borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
  },
  {
    icon: Factory,
    name: 'Manufacturing',
    description: 'Predictive maintenance, process automation, quality control, and real-time equipment monitoring.',
    stats: '60% less downtime',
    color: 'from-blue-500/20 to-blue-500/5',
    borderColor: 'border-blue-500/20 hover:border-blue-500/40',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
  },
  {
    icon: Zap,
    name: 'Energy & Utilities',
    description: 'Smart grid management, energy monitoring, load balancing, and renewable integration at the edge.',
    stats: '30% energy optimisation',
    color: 'from-amber-500/20 to-amber-500/5',
    borderColor: 'border-amber-500/20 hover:border-amber-500/40',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
  },
  {
    icon: HeartPulse,
    name: 'Healthcare',
    description: 'Patient monitoring, medical device integration, asset tracking, and edge-processed health data.',
    stats: 'Real-time vitals',
    color: 'from-rose-500/20 to-rose-500/5',
    borderColor: 'border-rose-500/20 hover:border-rose-500/40',
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/10',
  },
  {
    icon: Truck,
    name: 'Logistics & Transportation',
    description: 'Fleet management, route optimization, cold chain monitoring, and real-time asset visibility.',
    stats: '35% cost reduction',
    color: 'from-violet-500/20 to-violet-500/5',
    borderColor: 'border-violet-500/20 hover:border-violet-500/40',
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10',
  },
  {
    icon: Building2,
    name: 'Commercial Infrastructure',
    description: 'Smart buildings, HVAC control, access management, energy optimisation, and occupancy analytics.',
    stats: '25% operational savings',
    color: 'from-cyan-500/20 to-cyan-500/5',
    borderColor: 'border-cyan-500/20 hover:border-cyan-500/40',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10',
  },
];

export default function Industries() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.industries-header', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      gsap.utils.toArray('.industry-card').forEach((card, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="industries" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/3 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 industries-header">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-secondary tracking-[0.3em] uppercase"
          >
            Industries
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-black mt-4 mb-6">
            <span className="text-white">Scaling Across </span>
            <span className="text-gradient">Every Vertical</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            From farms to factories, hospitals to highways — Vioneta's edge computing solutions
            are purpose-built for the unique demands of each industry.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((industry, i) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.name}
                className={`industry-card group relative rounded-2xl glass-card p-7 border ${industry.borderColor} transition-all duration-300 cursor-pointer`}
                whileHover={{ y: -4, scale: 1.01 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl ${industry.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${industry.iconColor}`} />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/5 text-text-muted border border-white/5">
                      {industry.stats}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{industry.name}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-5">{industry.description}</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore Solutions
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
