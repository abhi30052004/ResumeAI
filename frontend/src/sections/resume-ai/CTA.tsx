import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function CTA() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <div className="relative">
      <svg className="absolute w-full h-auto -top-[1px] left-0 pointer-events-none z-10" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path className="fill-[#FFFFFF]" d="M0,120 C480,0 960,0 1440,120 L1440,0 L0,0 Z" />
      </svg>
      
      <section className="pt-60 pb-40 bg-[#F7F7F2] px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-[100rem] mx-auto relative z-10 flex flex-col items-center text-center gap-10">
          
          <h2 className="text-[12vw] lg:text-[10vw] font-bold tracking-tighter text-[#111111] leading-[0.85]">
            YOUR NEXT<br/>
            <span className="italic font-serif font-light text-[#635BFF]">OPPORTUNITY</span><br/>
            STARTS HERE.
          </h2>
          
          <p className="text-xl text-[#666666] font-light max-w-lg mb-4">
            Turn your experience into a resume that gets noticed by both ATS scanners and human recruiters.
          </p>

          <button 
            onClick={() => navigate(user ? '/analyze' : '/register')}
            className="bg-[#111111] text-white font-bold px-12 py-6 rounded-full hover:bg-[#635BFF] hover:scale-105 transition-all duration-300 border-none group text-xl shadow-xl flex items-center cursor-pointer"
          >
            Analyze My Resume <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
          </button>
          
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="bg-[#F7F7F2] border-t border-[#E5E5DE] py-12 px-6 lg:px-12">
        <div className="max-w-[100rem] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[#666666] font-medium">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#635BFF] flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-sm" />
            </div>
            <span className="font-bold text-[#111111]">Resume AI</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#111111]">Product</a>
            <a href="#" className="hover:text-[#111111]">Features</a>
            <a href="#" className="hover:text-[#111111]">Pricing</a>
            <a href="#" className="hover:text-[#111111]">About</a>
          </div>
          <div>© 2026 Resume AI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
