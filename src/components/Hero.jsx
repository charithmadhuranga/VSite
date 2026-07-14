import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight, Play } from 'lucide-react';
import MagneticButton from './MagneticButton';

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,170,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[200px]" />
    </div>
  );
}

function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function HeroVisual() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const nodes = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * canvas.width / dpr,
      y: Math.random() * canvas.height / dpr,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 3 + 2,
    }));

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width / dpr) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height / dpr) node.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 212, 170, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 170, 0.4)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 170, 0.05)';
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative aspect-square">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-3xl glass-card glow-primary flex items-center justify-center animate-float">
              <div className="text-center">
                <div className="text-5xl lg:text-7xl font-black text-gradient mb-2">V</div>
                <div className="text-xs lg:text-sm font-semibold text-text-secondary tracking-[0.3em]">VIONETA</div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-secondary mx-auto mt-3" />
              </div>
            </div>
            <div className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl glass-card glow-secondary flex items-center justify-center animate-float-delay">
              <span className="text-lg lg:text-xl font-bold text-secondary">EC</span>
            </div>
            <div className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl glass-card flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
              <span className="text-lg lg:text-xl font-bold text-primary">AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-word', {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
      });
    }, titleRef);
    return () => ctx.revert();
  }, []);

  const words = ['Edge', 'Computing', 'Solutions', 'That', 'Scale'];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <GridBackground />
      <FloatingParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Transforming Industries with Edge Computing</span>
            </motion.div>

            <div ref={titleRef} className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.95] tracking-tight">
                {words.map((word, i) => (
                  <span
                    key={word}
                    className={`hero-word inline-block mr-3 ${
                      i < 3 ? 'text-white' : 'text-gradient'
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-lg lg:text-xl text-text-secondary max-w-lg leading-relaxed"
            >
              Vioneta delivers end-to-end edge computing infrastructure — from cloud to edge to device —
              enabling businesses to deploy intelligent IoT solutions across any industry vertical.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton strength={0.2}>
                <a
                  href="#products"
                  className="group relative inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-dark bg-gradient-to-r from-primary to-primary-light rounded-2xl overflow-hidden"
                >
                  <span className="relative z-10">Explore Platform</span>
                  <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </MagneticButton>
              <MagneticButton strength={0.2}>
                <a
                  href="#about"
                  className="group inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-text-secondary hover:text-white glass-card rounded-2xl transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Play className="w-4 h-4 ml-0.5" />
                  </div>
                  <span>Watch Demo</span>
                </a>
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex items-center gap-8 pt-4"
            >
              {[
                { value: '50+', label: 'Industries Served' },
                { value: '10K+', label: 'Devices Connected' },
                { value: '99.9%', label: 'Uptime SLA' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:block"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
