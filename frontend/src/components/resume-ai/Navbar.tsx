import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Analysis', path: '#analysis' },
    { name: 'Builder', path: '#builder' },
    { name: 'Matching', path: '#matching' },
    { name: 'Pricing', path: '#pricing' }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1 }}
      className="fixed top-0 inset-x-0 z-[100] flex justify-center mt-4 px-6 pointer-events-none"
    >
      <div 
        className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-out ${
          isScrolled 
            ? 'w-full md:w-[900px] bg-white/80 backdrop-blur-xl border border-[#E5E5DE] shadow-sm rounded-full px-6 py-3'
            : 'w-full max-w-7xl bg-transparent px-4 py-4 border border-transparent rounded-none'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group z-50 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#635BFF] flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-sm" />
          </div>
          <span className="text-[#111111] font-bold tracking-tight text-lg">Resume AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.path}
              className="text-sm font-medium text-[#666666] hover:text-[#111111] transition-colors relative group cursor-pointer"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#111111] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Auth / CTA */}
        <div className="hidden md:flex items-center gap-6">
          {user && (
            <Link to="/dashboard" className="text-sm font-bold text-[#111111] hover:text-[#635BFF] transition-colors">
              Dashboard
            </Link>
          )}
          <button 
            onClick={() => navigate(user ? '/analyze' : '/register')}
            className="bg-[#111111] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#635BFF] transition-colors flex items-center gap-2 group cursor-pointer"
          >
            Analyze My Resume
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
