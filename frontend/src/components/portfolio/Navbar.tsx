import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagneticButton } from './MagneticButton';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Work', 'About', 'Skills', 'Contact'];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.5 }} // delay for preloader
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
        <div className="flex items-center gap-2 group z-50 text-[#111111] font-bold tracking-tighter text-xl">
          [ ABH ]
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <MagneticButton 
              key={link} 
              variant="secondary"
              className="text-sm font-medium text-[#666666] hover:text-[#111111] transition-colors relative group bg-transparent border-none"
            >
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#635BFF] transition-all duration-300 group-hover:w-full" />
            </MagneticButton>
          ))}
        </nav>

        {/* Status */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono font-medium border border-[#E5E5DE] rounded-full px-3 py-1.5 bg-[#F7F7F2]">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[#111111]">Available</span>
        </div>
      </div>
    </motion.header>
  );
}
