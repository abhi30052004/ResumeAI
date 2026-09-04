import React from 'react';
import { motion } from 'framer-motion';

export function Marquee() {
  const row1 = ['AI', 'FULL STACK', 'UI/UX', 'AUTOMATION', 'CLOUD', 'DATA'];
  const row2 = ['React', 'TypeScript', 'Python', 'FastAPI', 'MongoDB', 'PostgreSQL', 'LangChain', 'OpenAI'];

  return (
    <section className="py-24 bg-[#FFFFFF] overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FFFFFF] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FFFFFF] to-transparent z-10 pointer-events-none" />
      
      <div className="flex flex-col gap-12 group">
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="flex gap-8 w-max group-hover:duration-[80s]">
          {[...row1, ...row1, ...row1].map((item, i) => (
            <div key={i} className="text-4xl md:text-6xl font-bold text-[#111111] tracking-tighter cursor-default whitespace-nowrap flex items-center">
              {item} 
              <span className="mx-8 px-4 py-2 rounded-full border border-[#E5E5DE] text-sm text-[#666666] tracking-widest bg-[#F7F7F2]">EXP</span>
            </div>
          ))}
        </motion.div>
        <motion.div animate={{ x: ["-50%", "0%"] }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="flex gap-8 w-max group-hover:duration-[100s]">
          {[...row2, ...row2, ...row2].map((item, i) => (
            <div key={i} className="text-3xl md:text-5xl font-serif italic text-[#666666] hover:text-[#635BFF] transition-colors cursor-default whitespace-nowrap">
              {item} <span className="text-[#E5E5DE] mx-6 not-italic font-sans">—</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
