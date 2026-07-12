import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  VPlatform: [
    { label: 'VCloud', href: '#products' },
    { label: 'VEdge', href: '#products' },
    { label: 'VEdgeHub', href: '#products' },
    { label: 'VApp', href: '#products' },
    { label: 'DeviceHub', href: '#products' },
    { label: 'VOS', href: '#products' },
  ],
  Industries: [
    { label: 'Agriculture', href: '#industries' },
    { label: 'Manufacturing', href: '#industries' },
    { label: 'Energy & Utilities', href: '#industries' },
    { label: 'Healthcare', href: '#industries' },
    { label: 'Logistics', href: '#industries' },
    { label: 'Infrastructure', href: '#industries' },
  ],
  Company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Team', href: '#team' },
    { label: 'Contact', href: '#contact' },
    { label: 'Careers', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl rotate-12 opacity-80" />
                <div className="absolute inset-0.5 bg-dark rounded-xl flex items-center justify-center">
                  <span className="text-gradient font-black text-lg">V</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white">VIONETA</span>
                <span className="text-[10px] font-medium text-text-secondary tracking-[0.2em] -mt-1">(PVT) LIMITED</span>
              </div>
            </a>
            <p className="text-sm text-text-secondary max-w-xs leading-relaxed mb-6">
              Vioneta (Pvt) Limited is a tech startup specialising in developing edge computing
              solutions that scale across different verticals.
            </p>
            <div className="space-y-3">
              <a href="mailto:info@vioneta.com" className="flex items-center gap-3 text-sm text-text-muted hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                info@vioneta.com
              </a>
              <div className="flex items-center gap-3 text-sm text-text-muted">
                <MapPin className="w-4 h-4" />
                Sri Lanka
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-white mb-5">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-muted hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Vioneta (Pvt) Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-text-muted hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-text-muted hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
