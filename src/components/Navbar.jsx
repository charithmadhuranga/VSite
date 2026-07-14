import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';

const navLinks = [
  {
    label: 'VPlatform',
    submenu: [
      {
        label: 'Software',
        children: [
          { label: 'VCloud', href: '#products' },
          { label: 'VEdge', href: '#products' },
          { label: 'VApp', href: '#products' },
          { label: 'VOS', href: '#products' },
        ],
      },
      {
        label: 'Hardware',
        children: [
          { label: 'VEdgeHub', href: '#products' },
          { label: 'DeviceHub', href: '#products' },
        ],
      },
    ],
  },
  { label: 'Industries', href: '#industries' },
  { label: 'Solutions', href: '#features' },
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.a
          href="#"
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl rotate-12 opacity-80" />
            <div className="absolute inset-0.5 bg-dark rounded-xl flex items-center justify-center">
              <span className="text-gradient font-black text-lg">V</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white">VIONETA</span>
            <span className="text-[10px] font-medium text-text-secondary tracking-[0.2em] -mt-1">EDGE COMPUTING</span>
          </div>
        </motion.a>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.submenu && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={link.href || '#'}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5"
              >
                {link.label}
                {link.submenu && <ChevronDown className="w-3.5 h-3.5" />}
              </a>
              <AnimatePresence>
                {link.submenu && activeDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 w-64 glass-card rounded-xl p-3 shadow-2xl"
                  >
                    {link.submenu.map((group) => (
                      <div key={group.label} className="mb-2 last:mb-0">
                        <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-text-muted">
                          {group.label}
                        </div>
                        <div className="border-l border-white/5 ml-4">
                          {group.children.map((item) => (
                            <a
                              key={item.label}
                              href={item.href}
                              className="flex items-center gap-2 px-3 py-2 ml-4 text-sm text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                            >
                              <ChevronRight className="w-3 h-3 text-text-muted" />
                              {item.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/blog"
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5"
          >
            Blog
          </Link>
          <motion.a
            href="https://vioneta.com"
            target="_blank"
            className="px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5"
            whileHover={{ scale: 1.02 }}
          >
            Log In
          </motion.a>
          <motion.a
            href="#contact"
            className="relative px-6 py-2.5 text-sm font-semibold text-dark bg-gradient-to-r from-primary to-primary-light rounded-xl overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-text-secondary hover:text-white transition-colors"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-dark/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-6 py-6 space-y-2">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <a
                    href={link.href || '#'}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                  {link.submenu && (
                    <div className="pl-4 space-y-3 mt-1">
                      {link.submenu.map((group) => (
                        <div key={group.label}>
                          <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-text-muted px-4 mb-1">
                            {group.label}
                          </div>
                          <div className="pl-2">
                            {group.children.map((item) => (
                              <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-white transition-colors"
                              >
                                <ChevronRight className="w-3 h-3" />
                                {item.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 space-y-3">
                <Link
                  to="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-6 py-3 text-sm font-medium text-text-secondary hover:text-white rounded-xl hover:bg-white/5"
                >
                  Blog
                </Link>
                <a
                  href="#contact"
                  className="block w-full text-center px-6 py-3 text-sm font-semibold text-dark bg-gradient-to-r from-primary to-primary-light rounded-xl"
                >
                  Get Started
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
