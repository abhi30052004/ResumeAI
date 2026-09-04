import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HowItWorksModal } from '../../components/resume-ai/HowItWorksModal';

export function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const springX = useSpring(0, { stiffness: 40, damping: 20 });
  const springY = useSpring(0, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      springX.set(x * -20);
      springY.set(y * -20);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [springX, springY]);

  const lineVars = {
    hidden: { opacity: 0, y: 100, clipPath: 'inset(100% 0 0 0)', filter: 'blur(10px)' },
    show: { 
      opacity: 1, 
      y: 0, 
      clipPath: 'inset(0% 0 0 0)',
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="relative min-h-[110vh] flex flex-col justify-center bg-[#F7F7F2] overflow-hidden pt-24">
      {/* Background AI Orb Effect */}
      <motion.div 
        style={{ x: useTransform(springX, v => v * 1.5), y: useTransform(springY, v => v * 1.5) }}
        className="absolute right-[10%] top-1/4 w-[800px] h-[800px] pointer-events-none opacity-40 mix-blend-multiply flex items-center justify-center"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#635BFF]/30 to-transparent blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute inset-20 rounded-full border border-[#8B7CFF]/20 border-dashed animate-[spin_20s_linear_infinite]" />
        <div className="text-[#8B7CFF]/10 font-mono text-[200px] font-bold select-none">AI</div>
      </motion.div>

      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Text Content */}
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E5E5DE] bg-white shadow-sm mb-8"
          >
            <span className="text-[#635BFF] text-lg leading-none">✦</span>
            <span className="text-xs font-bold tracking-widest uppercase text-[#111111]">AI-Powered Resume Intelligence</span>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              show: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } }
            }}
            className="flex flex-col mb-8"
          >
            {["MAKE YOUR", "RESUME", "WORK HARDER."].map((line, i) => (
              <div key={i} className="overflow-hidden pb-4 -mb-4">
                <motion.h1 
                  variants={lineVars}
                  className="text-[clamp(48px,9vw,120px)] font-bold tracking-tighter text-[#111111] leading-[0.85]"
                >
                  {line}
                </motion.h1>
              </div>
            ))}
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-lg md:text-xl text-[#666666] font-light max-w-md leading-relaxed mb-10"
          >
            AI-powered resume analysis, optimization and job matching designed to turn your experience into better opportunities.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button 
              onClick={() => navigate(user ? '/analyze' : '/register')}
              className="bg-[#635BFF] text-white px-8 py-4 rounded-full font-bold hover:bg-[#8B7CFF] transition-colors border-none shadow-lg shadow-[#635BFF]/20 flex items-center group cursor-pointer"
            >
              Analyze My Resume 
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-transparent text-[#111111] px-8 py-4 rounded-full font-semibold hover:bg-white border border-[#E5E5DE] transition-colors cursor-pointer"
            >
              See How It Works
            </button>
          </motion.div>
        </div>

        {/* Floating AI Dashboard Visual */}
        <motion.div 
          style={{ x: springX, y: springY }}
          className="relative perspective-[1000px] hidden lg:block"
        >
          <motion.div
            initial={{ opacity: 0, rotateX: 10, rotateY: -10, y: 50 }}
            animate={{ opacity: 1, rotateX: 0, rotateY: 0, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 1 }}
            className="w-full max-w-[500px] mx-auto bg-white rounded-3xl border border-[#E5E5DE] shadow-[0_30px_60px_rgba(0,0,0,0.05)] overflow-hidden"
          >
            {/* Dashboard Header */}
            <div className="px-6 py-4 border-b border-[#F0F0EA] flex justify-between items-center bg-[#F7F7F2]/50">
              <span className="text-sm font-semibold text-[#111111]">Resume Analysis</span>
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5DE]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5DE]" />
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[#666666] mb-1">Overall Score</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-bold tracking-tighter text-[#111111]">87</span>
                    <span className="text-xl font-medium text-[#666666]">/100</span>
                  </div>
                </div>
                {/* Circular Score Visual */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-[#F0F0EA]" strokeWidth="8" fill="none" />
                    <motion.circle 
                      cx="50" cy="50" r="40" 
                      className="stroke-[#635BFF]" 
                      strokeWidth="8" fill="none" 
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 251" }}
                      animate={{ strokeDasharray: "218 251" }} // 87%
                      transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-[#635BFF]">Good</span>
                  </div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-5">
                {[
                  { label: "ATS Compatibility", score: "92%" },
                  { label: "Content Quality", score: "84%" },
                  { label: "Impact", score: "81%" },
                  { label: "Keywords", score: "91%" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-[#111111]">{item.label}</span>
                      <span className="text-[#635BFF]">{item.score}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#F0F0EA] rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-[#111111]"
                        initial={{ width: 0 }}
                        animate={{ width: item.score }}
                        transition={{ duration: 1, delay: 1.5 + (i * 0.1) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* SVG Curve */}
      <svg className="absolute w-full h-auto -bottom-[1px] left-0 pointer-events-none z-10" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path className="fill-white" d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" />
      </svg>

      {/* How It Works Modal */}
      <HowItWorksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
