import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function ResumeTransformation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const sliderX = useMotionValue(50); // percentage 0-100

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let percent = ((e.clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    sliderX.set(percent);
  };

  const clipPathLeft = useTransform(sliderX, (val) => `inset(0 ${100 - val}% 0 0)`);
  const clipPathRight = useTransform(sliderX, (val) => `inset(0 0 0 ${val}%)`);

  // Background blobs animation
  const blobAnimation = {
    x: [0, -30, 0, 30, 0],
    y: [0, -40, -20, 20, 0],
    scale: [1, 1.05, 0.95, 1.02, 1],
    transition: { duration: 20, repeat: Infinity, ease: "linear" as any }
  };

  return (
    <section id="builder" className="py-32 bg-white relative overflow-hidden text-slate-900">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={blobAnimation}
          className="absolute top-[30%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#635BFF]/10 to-[#A07CFF]/10 blur-[120px] mix-blend-multiply opacity-50"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>

      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 leading-[0.9] mb-6 drop-shadow-sm uppercase">
              FROM EXPERIENCE<br />
              TO IMPACT.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg text-slate-600 max-w-lg mx-auto space-y-4"
          >
            <p className="font-bold text-xl text-slate-900">Don't just list what you did. Show what you achieved.</p>
            <p className="text-base text-slate-500">ProfileIQ helps transform:</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold text-slate-700">
              <span>Tasks → Achievements</span>
              <span>Skills → Strengths</span>
              <span>Experience → Impact</span>
              <span>Resume → Professional Profile</span>
            </div>
          </motion.div>
        </div>

        {/* Draggable Comparison Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, type: "spring", bounce: 0.2 }}
          ref={containerRef}
          className="relative max-w-5xl mx-auto h-[400px] bg-slate-50/50 backdrop-blur-2xl rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.08)] overflow-hidden cursor-ew-resize select-none border border-white"
          onPointerMove={handlePointerMove}
          onPointerUp={() => setIsDragging(false)}
          onPointerLeave={() => setIsDragging(false)}
        >
          {/* Base Layer: AFTER (Right) */}
          <motion.div
            style={{ clipPath: clipPathRight }}
            className="absolute inset-0 bg-gradient-to-br from-[#635BFF]/5 to-[#FF3366]/5 p-12 md:p-20"
          >
            <div className="max-w-md ml-auto h-full flex flex-col justify-center text-right">
              <div className="text-xs font-mono uppercase tracking-widest text-[#635BFF] mb-8 font-bold flex items-center justify-end gap-2">
                ProfileIQ AI
                <Sparkles className="w-4 h-4 text-[#FF3366]" />
              </div>
              <ul className="space-y-6">
                <li className="text-lg text-slate-800 font-medium leading-relaxed bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white">
                  Developed and optimized web applications while resolving critical issues to improve application reliability and user experience.
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Top Layer: BEFORE (Left) */}
          <motion.div
            style={{ clipPath: clipPathLeft }}
            className="absolute inset-0 bg-white p-12 md:p-20 border-r border-slate-200"
          >
            <div className="max-w-md mr-auto h-full flex flex-col justify-center">
              <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-8 font-bold">Before</div>
              <ul className="space-y-6 text-slate-500 list-disc list-inside">
                <li className="text-lg leading-relaxed p-8 bg-slate-50 rounded-2xl border border-slate-100">Worked on web applications and fixed bugs.</li>
              </ul>
            </div>
          </motion.div>

          {/* Slider Handle */}
          <motion.div
            style={{ left: useTransform(sliderX, val => `${val}%`) }}
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 flex items-center justify-center -translate-x-1/2 drop-shadow-md"
            onPointerDown={() => setIsDragging(true)}
          >
            <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-white text-[12px] font-bold tracking-widest gap-2 shadow-xl hover:scale-110 transition-transform hover:shadow-[0_0_30px_rgba(15,23,42,0.3)]">
              <span>←</span>
              <span>→</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
