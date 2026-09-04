import React from 'react';
import { MagneticButton } from './MagneticButton';

export function Footer() {
  return (
    <footer className="bg-[#F7F7F2] text-[#111111] py-12 px-6 lg:px-12 border-t border-[#E5E5DE]">
      <div className="max-w-[100rem] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tighter text-xl">ABH</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-mono font-medium">
          <span className="text-[#666666]">Designed & engineered with curiosity.</span>
          <div className="flex items-center gap-2 border border-[#E5E5DE] rounded-full px-3 py-1 bg-white shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            AVAILABLE
          </div>
        </div>
      </div>
    </footer>
  );
}
