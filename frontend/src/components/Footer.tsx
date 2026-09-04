import React from 'react';
import { motion } from 'framer-motion';

export function Footer() {
  return (
    <footer className="bg-zinc-950 pt-24 pb-12 px-6 lg:px-12 border-t border-zinc-900 relative overflow-hidden">
      {/* Subtle animated gradient orb in footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold tracking-tighter">DEV</span>
              </div>
              <span className="text-white font-bold tracking-tight text-xl">PORTFOLIO</span>
            </div>
            <p className="text-zinc-400 font-light max-w-sm">
              Building intelligent digital experiences with modern web technologies.
            </p>
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-medium mb-2">Navigation</h4>
              {['Work', 'Skills', 'About', 'Contact'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-zinc-400 hover:text-white transition-colors">{item}</a>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-medium mb-2">Social</h4>
              {['GitHub', 'LinkedIn', 'Twitter', 'Dribbble'].map(item => (
                <a key={item} href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-800/50 gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Designed & built with curiosity.
          </p>
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <span>Powered by</span>
            <span className="text-zinc-300 font-medium">React</span>
            <span>&</span>
            <span className="text-zinc-300 font-medium">Framer Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
