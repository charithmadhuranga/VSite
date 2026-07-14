import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Layers, Globe, Shield, Cpu, RefreshCw, Workflow,
  Radio, Database, Lock, Gauge
} from 'lucide-react';
import TiltCard from './TiltCard';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Cpu,
    title: 'Edge Processing',
    description: 'Process data at the edge with VOS-powered computers, reducing latency and cloud dependency.',
  },
  {
    icon: Radio,
    title: 'Multi-Protocol',
    description: '4G LTE, LoRa, WiFi, Modbus — connect anything to everything with built-in protocol support.',
  },
  {
    icon: Workflow,
    title: 'Automation Engine',
    description: 'Define data logic and event-driven rules with our visual automation controller across devices.',
  },
  {
    icon: Database,
    title: 'Device Provisioning',
    description: 'Onboard devices in minutes with secure identity management and instant connectivity.',
  },
  {
    icon: RefreshCw,
    title: 'OTA Updates',
    description: 'Push secure firmware updates across entire fleets with staged rollouts and rollback support.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'End-to-end encryption, device authentication, and role-based access control built in.',
  },
  {
    icon: Gauge,
    title: 'Real-Time Monitoring',
    description: 'Live telemetry, alerts, and dashboards for complete visibility of your edge infrastructure.',
  },
  {
    icon: Globe,
    title: 'Fleet Management',
    description: 'Manage thousands of devices from a single cloud dashboard with VCloud.',
  },
  {
    icon: Layers,
    title: 'Modular Architecture',
    description: 'Stack hardware and software modules to build exactly the solution your use case demands.',
  },
  {
    icon: Lock,
    title: 'Edge AI / ML',
    description: 'Run machine learning models directly on VEdge computers for intelligent local decision-making.',
  },
];

export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.features-header', {
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
    <section id="features" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 features-header">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-primary tracking-[0.3em] uppercase"
          >
            Capabilities
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-black mt-4 mb-6">
            <span className="text-white">Built for the </span>
            <span className="text-gradient">Edge</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Every feature is engineered for reliability, speed, and scalability
            — from the sensor to the cloud.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <TiltCard
                key={feature.title}
                className="group rounded-2xl glass-card p-6 border border-white/5 hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-xs text-text-secondary leading-relaxed">{feature.description}</p>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
