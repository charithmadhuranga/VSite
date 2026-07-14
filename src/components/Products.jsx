import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlowDiagram from './FlowDiagram';
import {
  Cpu, LayoutGrid, Cloud, Smartphone, MonitorSmartphone, Server,
  ArrowRight, CheckCircle2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const hardwareProducts = [
  {
    icon: Cpu,
    name: 'Vioneta EdgeHub',
    tag: 'VEdgeHub',
    tagline: 'Modular Edge Computing Platform',
    description:
      'A powerful, modular edge computer purpose-built for industrial IoT. Running custom Vioneta OS (VOS), it processes data at the edge with built-in 4G LTE, LoRa, and Modbus connectivity — eliminating cloud dependency for mission-critical operations.',
    specs: [
      { label: 'Connectivity', value: '4G LTE / LoRa / Modbus' },
      { label: 'Operating System', value: 'Vioneta OS (VOS)' },
      { label: 'Processing', value: 'Edge AI / ML Inference' },
      { label: 'Form Factor', value: 'Modular / DIN Rail' },
    ],
    highlights: ['Custom VOS Operating System', 'Built-in 4G LTE Module', 'LoRa Gateway Capability', 'Modbus TCP/RTU Support', 'Edge AI Processing', 'Industrial Grade Design'],
    color: 'primary',
  },
  {
    icon: LayoutGrid,
    name: 'Vioneta DeviceHub',
    tag: 'VDeviceHub',
    tagline: 'Universal Sensor & Actuator Gateway',
    description:
      'The universal bridge between your physical infrastructure and digital systems. DeviceHub connects multiple sensors and actuators simultaneously, forwarding data to Edge Computers via LoRa, WiFi, or Modbus — enabling seamless device orchestration at scale.',
    specs: [
      { label: 'Protocols', value: 'LoRa / WiFi / Modbus' },
      { label: 'Channels', value: 'Multi-channel Input/Output' },
      { label: 'Sensor Support', value: 'Analog / Digital / I2C / SPI' },
      { label: 'Actuator Control', value: 'Relays / PWM / DAC' },
    ],
    highlights: ['Multi-Protocol Data Forwarding', 'Simultaneous Sensor Aggregation', 'Actuator Control & Automation', 'LoRa Mesh Networking', 'WiFi Connectivity', 'Modbus Integration'],
    color: 'secondary',
  },
];

const softwareProducts = [
  {
    icon: Cloud,
    name: 'Vioneta Cloud',
    tag: 'VCloud',
    description: 'Fleet management, advanced analytics dashboard, and IoT App Store — all from a single cloud platform.',
    highlights: ['Fleet Management', 'App Store', 'Advanced Analytics'],
  },
  {
    icon: Cpu,
    name: 'Vioneta Edge',
    tag: 'VEdge',
    description: 'Edge computing software platform that transforms Vioneta Edge Computers into intelligent processing nodes with data orchestration, protocol bridging, and local intelligence.',
    highlights: ['Edge Analytics', 'Data Orchestration', 'Protocol Bridge'],
  },
  {
    icon: Smartphone,
    name: 'Vioneta App',
    tag: 'VApp',
    description: 'Purpose-built client applications with integrated automation controller for specific industry use cases.',
    highlights: ['Automation Controller', 'Mobile & Web', 'Custom Workflows'],
  },
  {
    icon: MonitorSmartphone,
    name: 'Vioneta OS',
    tag: 'VOS',
    description: 'Custom real-time operating system powering all Vioneta Edge hardware — purpose-built for IoT workloads.',
    highlights: ['Real-Time Kernel', 'Edge AI Runtime', 'OTA Updates'],
  },
  {
    icon: Server,
    name: 'Vioneta Platform',
    tag: 'VPlatform',
    description: 'End-to-end orchestration layer connecting cloud, edge, and device with unified APIs and management.',
    highlights: ['Unified API', 'Device Provisioning', 'Role-Based Access'],
  },
];

function HardwareCard({ product, index }) {
  const cardRef = useRef(null);
  const Icon = product.icon;
  const isPrimary = product.color === 'primary';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="group relative"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative rounded-3xl overflow-hidden border transition-all duration-500 ${
        isPrimary
          ? 'border-primary/10 hover:border-primary/30 hover:shadow-[0_0_40px_rgba(0,212,170,0.08)]'
          : 'border-secondary/10 hover:border-secondary/30 hover:shadow-[0_0_40px_rgba(108,92,231,0.08)]'
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${isPrimary ? 'from-primary/5 to-transparent' : 'from-secondary/5 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="absolute inset-0 bg-dark-card/80 backdrop-blur-sm" />

        <div className="relative z-10 p-8 lg:p-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl ${isPrimary ? 'bg-primary/10' : 'bg-secondary/10'} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${isPrimary ? 'text-primary' : 'text-secondary'}`} />
                </div>
                <div>
                  <span className={`text-xs font-bold tracking-[0.2em] uppercase ${isPrimary ? 'text-primary' : 'text-secondary'}`}>
                    {product.tag}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white">{product.name}</h3>
              <p className="text-text-muted text-sm mt-1">{product.tagline}</p>
            </div>
            <div className={`hidden sm:block px-3 py-1 rounded-full text-xs font-semibold border ${
              isPrimary ? 'border-primary/20 text-primary bg-primary/5' : 'border-secondary/20 text-secondary bg-secondary/5'
            }`}>
              HARDWARE
            </div>
          </div>

          <p className="text-text-secondary leading-relaxed mb-8">{product.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {product.specs.map((spec, i) => (
              <div key={i} className="rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <div className="text-xs text-text-muted mb-1">{spec.label}</div>
                <div className="text-sm font-semibold text-white">{spec.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
            {product.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isPrimary ? 'text-primary/60' : 'text-secondary/60'}`} />
                <span>{h}</span>
              </div>
            ))}
          </div>

          <a href="#contact" className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
            isPrimary ? 'text-primary hover:text-primary-light' : 'text-secondary hover:text-secondary-light'
          }`}>
            Request Hardware Specs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function SoftwareCard({ product, index }) {
  const Icon = product.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -3 }}
      className="group relative rounded-2xl glass-card p-6 lg:p-7 hover:border-white/10 border border-white/5 transition-all duration-300"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-[0.2em] text-primary/70 uppercase mb-0.5">{product.tag}</div>
          <h4 className="text-lg font-bold text-white">{product.name}</h4>
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed mb-5">{product.description}</p>
      <div className="flex flex-wrap gap-2">
        {product.highlights.map((h, i) => (
          <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-text-muted border border-white/5">
            {h}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Products() {
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState('hardware');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.products-header', {
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
    <section id="products" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 products-header">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-primary tracking-[0.3em] uppercase"
          >
            Our Platform
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-black mt-4 mb-6">
            <span className="text-white">Hardware + Software. </span>
            <span className="text-gradient">Unified.</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Vioneta delivers purpose-built hardware and integrated software — a complete
            edge computing stack from the physical device to the cloud.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl glass-card border border-white/5">
            {['hardware', 'software'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-7 py-3 text-sm font-semibold rounded-xl transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? 'text-dark'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="product-tab"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab === 'hardware' ? <Cpu className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
                  {tab}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'hardware' ? (
            <motion.div
              key="hardware"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {hardwareProducts.map((product, index) => (
                <HardwareCard key={product.name} product={product} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="software"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {softwareProducts.map((product, index) => (
                <SoftwareCard key={product.name} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connection Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary tracking-wider uppercase">Architecture</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-black text-white mb-3">
              How It All <span className="text-gradient">Connects</span>
            </h3>
            <p className="text-text-secondary text-sm max-w-md mx-auto leading-relaxed">
              From sensors to cloud — every layer of the Vioneta stack is designed to work together seamlessly.
            </p>
          </div>
          <div className="rounded-3xl border border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent p-3 md:p-4">
            <FlowDiagram />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
