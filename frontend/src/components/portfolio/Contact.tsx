import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

export function Contact() {
  return (
    <div className="relative">
      <svg className="absolute w-full h-auto -top-[1px] left-0 pointer-events-none z-10" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path className="fill-[#F7F7F2]" d="M0,120 C480,0 960,0 1440,120 L1440,0 L0,0 Z" />
      </svg>
      
      <section className="pt-60 pb-40 bg-[#FFFFFF] px-6 lg:px-12 relative overflow-hidden">
        
        <div className="max-w-[100rem] mx-auto relative z-10 flex flex-col items-center text-center gap-12">
          
          <h2 className="text-[12vw] lg:text-[10vw] font-bold tracking-tighter text-[#111111] leading-[0.85] mb-8">
            LET'S<br/>BUILD<br/>
            <span className="italic font-serif font-light text-[#635BFF]">SOMETHING.</span>
          </h2>
          
          <MagneticButton className="bg-[#111111] text-white font-bold px-12 py-6 rounded-full hover:bg-[#635BFF] hover:scale-105 transition-all duration-300 border-none group text-xl shadow-xl flex items-center">
            START A PROJECT <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
          </MagneticButton>

          <div className="flex gap-12 mt-12 text-sm font-mono uppercase tracking-widest text-[#111111] font-bold">
            <MagneticButton variant="secondary" className="hover:text-[#635BFF]">Email</MagneticButton>
            <MagneticButton variant="secondary" className="hover:text-[#635BFF]">LinkedIn</MagneticButton>
            <MagneticButton variant="secondary" className="hover:text-[#635BFF]">GitHub</MagneticButton>
          </div>
          
        </div>
      </section>
    </div>
  );
}
