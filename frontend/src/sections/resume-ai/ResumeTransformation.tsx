import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

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

  return (
    <section id="builder" className="py-32 bg-[#F7F7F2] relative overflow-hidden">
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#111111] leading-[0.9] mb-6">
            FROM<br/>
            <span className="text-[#666666]">AVERAGE</span><br/>
            TO<br/>
            <span className="text-[#635BFF] italic font-serif">IMPACTFUL</span>
          </h2>
          <p className="text-lg text-[#666666] max-w-md mx-auto">
            Drag the slider to see how Resume AI transforms standard bullets into interview-winning achievements.
          </p>
        </div>

        {/* Draggable Comparison Container */}
        <div 
          ref={containerRef}
          className="relative max-w-5xl mx-auto h-[500px] bg-white rounded-3xl shadow-xl overflow-hidden cursor-ew-resize select-none border border-[#E5E5DE]"
          onPointerMove={handlePointerMove}
          onPointerUp={() => setIsDragging(false)}
          onPointerLeave={() => setIsDragging(false)}
        >
          {/* Base Layer: AFTER (Right) */}
          <motion.div 
            style={{ clipPath: clipPathRight }}
            className="absolute inset-0 bg-[#F0F0EA] p-12 md:p-20"
          >
            <div className="max-w-md ml-auto h-full flex flex-col justify-center text-right">
              <div className="text-xs font-mono uppercase tracking-widest text-[#635BFF] mb-6 font-bold">After Resume AI</div>
              <ul className="space-y-6">
                <li className="text-lg text-[#111111] font-medium leading-relaxed bg-white p-4 rounded-xl shadow-sm border border-[#E5E5DE]">
                  Built scalable React applications used by 10K+ monthly active users, improving engagement by 15%.
                </li>
                <li className="text-lg text-[#111111] font-medium leading-relaxed bg-white p-4 rounded-xl shadow-sm border border-[#E5E5DE]">
                  Designed REST APIs reducing response latency by 28% through aggressive caching strategies.
                </li>
                <li className="text-lg text-[#111111] font-medium leading-relaxed bg-white p-4 rounded-xl shadow-sm border border-[#E5E5DE]">
                  Resolved 50+ production issues maintaining a 99.9% service reliability over 12 months.
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Top Layer: BEFORE (Left) */}
          <motion.div 
            style={{ clipPath: clipPathLeft }}
            className="absolute inset-0 bg-white p-12 md:p-20 border-r border-[#E5E5DE]"
          >
            <div className="max-w-md mr-auto h-full flex flex-col justify-center">
              <div className="text-xs font-mono uppercase tracking-widest text-[#666666] mb-6 font-bold">Original Resume</div>
              <ul className="space-y-6 text-[#666666] list-disc list-inside">
                <li className="text-lg leading-relaxed">Developed web applications.</li>
                <li className="text-lg leading-relaxed">Worked with APIs.</li>
                <li className="text-lg leading-relaxed">Fixed bugs in production.</li>
              </ul>
            </div>
          </motion.div>

          {/* Slider Handle */}
          <motion.div 
            style={{ left: useTransform(sliderX, val => `${val}%`) }}
            className="absolute top-0 bottom-0 w-1 bg-[#111111] cursor-ew-resize z-10 flex items-center justify-center -translate-x-1/2"
            onPointerDown={() => setIsDragging(true)}
          >
            <div className="w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center text-white text-[10px] font-bold tracking-widest gap-2 shadow-lg hover:scale-110 transition-transform">
              <span>←</span>
              <span>→</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
