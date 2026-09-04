import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

function FeatureCard({ children, className, innerClassName }: { children: React.ReactNode, className?: string, innerClassName?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX / rect.width - 0.5);
    y.set(e.clientY / rect.height - 0.5);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`perspective-[1000px] h-full w-full relative z-10 hover:z-50 ${className || ''}`}
    >
      <div 
        className={`w-full h-full bg-white rounded-3xl border border-[#E5E5DE] shadow-sm p-8 group relative overflow-hidden flex flex-col justify-between hover:border-[#635BFF]/50 transition-colors ${innerClassName || ''}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#F7F7F2]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 w-full h-full flex flex-col justify-between transform-gpu transition-transform duration-500 group-hover:translate-z-4">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturesBento() {
  return (
    <section className="py-32 bg-[#F7F7F2] px-6 lg:px-12">
      <div className="max-w-[100rem] mx-auto">
        <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-[#666666] mb-12">Intelligence Suite</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">
          
          {/* Card 1: Resume Analysis */}
          <div className="md:col-span-2 lg:col-span-8">
            <FeatureCard>
              <div className="flex justify-between items-start">
                <h3 className="text-3xl font-bold text-[#111111] uppercase max-w-[200px]">AI Resume Analysis</h3>
                <div className="w-16 h-16 relative flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" stroke="#F0F0EA" strokeWidth="4" fill="none" />
                    <circle cx="32" cy="32" r="28" stroke="#635BFF" strokeWidth="4" fill="none" strokeDasharray="175" strokeDashoffset="20" strokeLinecap="round" />
                  </svg>
                  <span className="font-bold text-[#111111] z-10">94</span>
                </div>
              </div>
              <p className="text-[#666666] max-w-sm mt-auto">Deep structural analysis of your experience, measuring ATS compatibility and content impact.</p>
            </FeatureCard>
          </div>

          {/* Card 2: Job Match */}
          <div className="md:col-span-1 lg:col-span-4">
            <FeatureCard>
              <div className="w-12 h-12 rounded-2xl bg-[#F0F0EA] text-[#635BFF] flex items-center justify-center font-bold text-xl mb-auto">94%</div>
              <div>
                <h3 className="text-xl font-bold text-[#111111] uppercase mb-2 mt-8">Job Match</h3>
                <p className="text-sm text-[#666666]">Instantly score your resume against any job description.</p>
              </div>
            </FeatureCard>
          </div>

          {/* Card 3: AI Rewrite */}
          <div className="md:col-span-1 lg:col-span-4">
            <FeatureCard>
              <div className="flex gap-2 mb-auto">
                <div className="h-2 w-16 bg-[#E5E5DE] rounded" />
                <div className="h-2 w-full bg-[#635BFF]/20 rounded" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#111111] uppercase mb-2 mt-8">AI Rewrite</h3>
                <p className="text-sm text-[#666666]">Transform weak bullets into metric-driven achievements.</p>
              </div>
            </FeatureCard>
          </div>

          {/* Card 4: Career Intel */}
          <div className="md:col-span-1 lg:col-span-4">
            <FeatureCard>
              <h3 className="text-3xl font-bold text-[#111111] uppercase mb-2">Career<br/>Intelligence</h3>
              <div className="flex gap-2 mt-auto">
                {['React', 'TypeScript', 'Node.js'].map(k => (
                  <span key={k} className="px-3 py-1 rounded-md bg-[#F0F0EA] text-[#111111] text-xs font-bold">{k}</span>
                ))}
              </div>
            </FeatureCard>
          </div>

          {/* Card 5: AI Chat */}
          <div className="md:col-span-1 lg:col-span-4">
            <FeatureCard innerClassName="!bg-[#111111] !border-none">
              <div className="text-white text-center flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 rounded-full bg-[#635BFF] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(99,91,255,0.4)]">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <span className="font-bold uppercase tracking-widest text-xs">AI Chat</span>
              </div>
            </FeatureCard>
          </div>

        </div>
      </div>
    </section>
  );
}
