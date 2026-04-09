import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Início', path: '/' },
  { label: 'Coleção', path: '/colecao' },
  { label: 'Novidades', path: '/novidades' },
  { label: 'Sobre', path: '/sobre' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-heading text-2xl md:text-3xl font-light tracking-wider text-pearl">
                VELVET
              </span>
              <span className="font-heading text-2xl md:text-3xl font-light tracking-wider text-rose-glass">
                ·
              </span>
              <span className="font-heading text-sm md:text-base font-light tracking-widest text-rose-glass/70 uppercase">
                Atelier
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-body text-sm tracking-widest uppercase transition-colors duration-300 ${
                    location.pathname === link.path
                      ? 'text-rose-glass'
                      : 'text-pearl/70 hover:text-pearl'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-rose-glass/50"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-5">
              <button className="text-pearl/70 hover:text-pearl transition-colors hidden md:block">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-pearl/70 hover:text-pearl transition-colors hidden md:block">
                <Heart className="w-5 h-5" />
              </button>
              <Link to="/colecao" className="text-pearl/70 hover:text-pearl transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-glass rounded-full flex items-center justify-center text-burgundy-dark text-[9px] font-bold">
                  0
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-pearl/80"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 pt-20 glass-strong"
          >
            <div className="flex flex-col items-center justify-center h-full gap-10 pb-20">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`font-heading text-3xl tracking-wider transition-colors ${
                      location.pathname === link.path ? 'text-rose-glass' : 'text-pearl/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}