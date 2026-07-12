import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-content', {
        y: 50,
        opacity: 0,
        duration: 1,
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
    <section id="contact" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="relative rounded-[2rem] overflow-hidden"
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-dark-surface to-secondary/10" />
          <div className="absolute inset-0 bg-dark-card/90 backdrop-blur-sm" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-primary/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-64 h-40 bg-secondary/10 blur-[80px] rounded-full" />

          <div className="relative z-10 p-12 lg:p-20 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Start Building Today</span>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              <span className="text-white">Ready to Deploy </span>
              <span className="text-gradient">Edge Solutions</span>
              <span className="text-white">?</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Get in touch with our team to discuss your edge computing needs.
              From prototype to production, Vioneta scales with you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="https://vioneta.com"
                target="_blank"
                className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-dark bg-gradient-to-r from-primary to-primary-light rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10">Contact Sales</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
              <motion.a
                href="https://vioneta.com"
                target="_blank"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-text-secondary hover:text-white glass-card rounded-2xl transition-colors duration-300 border border-white/5 hover:border-white/10"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Documentation
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
