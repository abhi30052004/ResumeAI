import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["0px", "10px"]);

  // Interactive Orb Physics
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const orbX = useSpring(0, { stiffness: 40, damping: 20 });
  const orbY = useSpring(0, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
      
      // Orb moves opposite to mouse for depth
      orbX.set(x * -50);
      orbY.set(y * -50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [orbX, orbY]);

  // Typography stagger animation
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 1.5 } // wait for preloader
    }
  };

  const lineVars = {
    hidden: { opacity: 0, y: 100, rotate: 2 },
    show: { 
      opacity: 1, 
      y: 0, 
      rotate: 0, 
      transition: { duration: 1.2, ease: "easeOut" as const } 
    }
  };

  return (
    <section ref={ref} className="relative min-h-[110vh] flex flex-col justify-center bg-[#F7F7F2] overflow-hidden pt-20">
      
      {/* Interactive Background Orb */}
      <motion.div 
        style={{ x: orbX, y: orbY }}
        className="absolute top-1/4 left-1/4 w-[800px] h-[800px] pointer-events-none opacity-40 mix-blend-multiply"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#635BFF] via-transparent to-transparent blur-[120px]" />
      </motion.div>
      <motion.div 
        style={{ x: useTransform(orbX, v => -v), y: useTransform(orbY, v => -v) }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] pointer-events-none opacity-30 mix-blend-multiply"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-bl from-amber-200/50 via-transparent to-transparent blur-[120px]" />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ y, opacity, filter: `blur(${blur.get()})` }} 
        className="relative z-10 w-full max-w-[100rem] mx-auto px-6 lg:px-12"
      >
        <motion.div variants={containerVars} initial="hidden" animate="show" className="flex flex-col mb-12">
          {["BUILDING", "DIGITAL", "EXPERIENCES."].map((line, i) => (
            <div key={i} className="overflow-hidden pb-4 -mb-4">
              <motion.h1 
                variants={lineVars}
                className="text-[clamp(60px,11vw,180px)] font-bold tracking-tighter text-[#111111] leading-[0.85]"
              >
                {line}
              </motion.h1>
            </div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 2.2, duration: 1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
        >
          <p className="text-lg md:text-2xl text-[#666666] font-light max-w-lg leading-relaxed">
            I engineer premium applications combining deep technical architecture with Awwwards-winning interaction design.
          </p>
          
          <div className="flex items-center gap-4">
            <MagneticButton className="bg-[#111111] text-white px-8 py-4 rounded-full font-medium hover:bg-[#635BFF] transition-colors border-none group flex items-center">
              EXPLORE WORK <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating UI Elements */}
      <motion.div 
        className="absolute top-[20%] right-[10%] p-4 bg-white border border-[#E5E5DE] rounded-2xl shadow-sm hidden lg:flex flex-col gap-2 pointer-events-none"
        animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
      >
        <div className="text-[10px] font-mono text-[#666666] tracking-widest uppercase">System Status</div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#111111]">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          ONLINE
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-[20%] left-[5%] p-4 bg-white/80 backdrop-blur-md border border-[#E5E5DE] rounded-2xl shadow-sm hidden lg:block pointer-events-none"
        animate={{ y: [0, 15, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -150]) }}
      >
        <div className="text-[10px] font-mono text-[#635BFF] font-bold tracking-widest uppercase">01 / FRONTEND</div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.5 }}
      >
        <div className="w-[1px] h-12 bg-[#E5E5DE] relative overflow-hidden">
          <motion.div 
            className="w-full h-1/2 bg-[#111111]"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666]">Scroll</span>
      </motion.div>

      {/* SVG Curve Transition */}
      <svg className="absolute w-full h-auto -bottom-[1px] left-0 pointer-events-none z-10" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path className="fill-white" d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" />
      </svg>
    </section>
  );
}
