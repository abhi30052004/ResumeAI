import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagneticButton } from './MagneticButton';
import { ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

// Sub-components for Interaction Lab

function SplitTextButton({ text }: { text: string }) {
  return (
    <MagneticButton className="px-6 py-3 rounded-full bg-[#111111] text-white overflow-hidden group">
      <div className="relative overflow-hidden h-5 flex items-center justify-center font-bold">
        <motion.div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-full"
        >
          {text} <ArrowRight className="w-4 h-4 ml-2" />
        </motion.div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-500 group-hover:translate-y-0 text-[#635BFF]"
        >
          {text} <ArrowRight className="w-4 h-4 ml-2" />
        </motion.div>
      </div>
    </MagneticButton>
  );
}

function LiquidButton() {
  return (
    <button className="relative px-6 py-3 font-bold text-[#111111] border border-[#111111] rounded-full overflow-hidden group hover:text-white transition-colors duration-500">
      <span className="relative z-10 flex items-center">
        LIQUID HOVER <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </span>
      <div className="absolute inset-0 bg-[#635BFF] translate-y-[100%] rounded-[50%] group-hover:translate-y-[0%] group-hover:rounded-none transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
    </button>
  );
}

function Accordion() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="w-full max-w-sm border-b border-[#E5E5DE]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left font-bold text-[#111111]"
      >
        <span>01 How do I approach projects</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden text-[#666666] text-sm"
          >
            <div className="pb-4 pt-1">
              Research &rarr; Design &rarr; Build &rarr; Test &rarr; Deploy
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function InteractionLab() {
  const [toggle, setToggle] = useState(false);

  return (
    <section className="py-40 bg-[#FFFFFF]">
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-start">
        
        <div className="sticky top-40">
          <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-[#666666] mb-8">INTERACTION LAB</h2>
          <h3 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#111111] leading-[0.9] mb-8">
            MOTION IS<br/>NOT AN<br/>AFTERTHOUGHT.
          </h3>
          <p className="text-xl text-[#666666] font-light max-w-md">
            I craft components that feel physical, responsive, and deeply satisfying to use. Every state is designed.
          </p>
        </div>

        {/* Playground */}
        <div className="grid sm:grid-cols-2 gap-6">
          
          {/* Button Playground */}
          <div className="p-8 rounded-[2rem] bg-[#F7F7F2] border border-[#E5E5DE] flex flex-col items-center justify-center gap-6 min-h-[300px]">
            <SplitTextButton text="SPLIT TEXT" />
            <LiquidButton />
            <MagneticButton className="px-6 py-3 font-bold text-[#111111] border border-[#E5E5DE] rounded-full bg-white shadow-sm hover:shadow-md hover:border-[#111111]">
              MAGNETIC PULL
            </MagneticButton>
          </div>

          {/* Form & Toggles Playground */}
          <div className="p-8 rounded-[2rem] bg-[#F7F7F2] border border-[#E5E5DE] flex flex-col gap-6 min-h-[300px] justify-center">
            
            {/* Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#E5E5DE] shadow-sm">
              <span className="text-sm font-bold text-[#111111]">Available for work</span>
              <button 
                onClick={() => setToggle(!toggle)}
                className={cn("w-12 h-6 rounded-full p-1 transition-colors duration-300 shadow-inner relative flex items-center", toggle ? "bg-[#635BFF]" : "bg-[#E5E5DE]")}
              >
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  style={{ marginLeft: toggle ? "24px" : "0px" }}
                />
              </button>
            </div>

            {/* Input */}
            <div className="relative group">
              <input 
                type="text" 
                placeholder=" "
                className="w-full bg-transparent border-b-2 border-[#E5E5DE] outline-none text-[#111111] text-lg pt-4 pb-2 focus:border-[#635BFF] transition-colors peer"
              />
              <label className="absolute left-0 top-4 text-[#666666] font-semibold tracking-widest text-xs uppercase transition-all duration-300 peer-focus:-top-2 peer-focus:text-[#635BFF] peer-focus:text-[10px] peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[10px]">
                Email Address
              </label>
            </div>

          </div>

          {/* Accordion & Tooltip */}
          <div className="sm:col-span-2 p-8 rounded-[2rem] bg-[#F7F7F2] border border-[#E5E5DE] flex flex-col md:flex-row gap-12 items-start justify-between min-h-[200px]">
            <Accordion />
            
            {/* Tooltip demo */}
            <div className="relative group flex items-center justify-center w-full max-w-[200px] h-20 border border-dashed border-[#E5E5DE] rounded-2xl bg-white">
              <span className="font-bold text-[#111111] cursor-pointer decoration-[#635BFF] underline underline-offset-4">Hover Me</span>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 translate-y-4 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300 pointer-events-none">
                <div className="bg-[#111111] text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap relative">
                  Tooltip Active
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111111] rotate-45" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
