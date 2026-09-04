import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Work', path: '/#work' },
    { name: 'Skills', path: '/#skills' },
    { name: 'Experience', path: '/#experience' },
    { name: 'About', path: '/#about' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-[100] flex justify-center mt-6 px-6 pointer-events-none"
    >
      <div 
        className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-out ${
          isScrolled 
            ? 'w-full md:w-[850px] bg-white/80 backdrop-blur-xl border border-[#E5E5DE] shadow-[0_10px_40px_rgba(0,0,0,0.05)] rounded-full px-6 py-3'
            : 'w-full max-w-7xl bg-transparent px-2 py-4 border border-transparent rounded-none'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group z-50">
          <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center">
            <span className="text-white font-bold tracking-tighter text-sm">DEV</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.path}
              className="text-sm font-medium text-[#666666] hover:text-[#111111] transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#635BFF] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <MagneticButton className="bg-[#111111] text-white px-6 py-2.5 text-sm font-semibold rounded-full hover:bg-[#635BFF] transition-colors h-auto border-none">
            Contact &rarr;
          </MagneticButton>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden z-50 p-2 text-[#111111] pointer-events-auto"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full mt-4 inset-x-6 bg-white border border-[#E5E5DE] rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.1)] pointer-events-auto md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-[#111111] hover:text-[#635BFF] transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-[#E5E5DE] my-2" />
              <button className="w-full text-center py-4 bg-[#111111] text-white rounded-xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
