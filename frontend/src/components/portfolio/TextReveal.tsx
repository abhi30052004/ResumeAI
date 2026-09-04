import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function TextReveal({ text }: { text: string }) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: container, 
    offset: ["start 80%", "end 20%"] 
  });

  const words = text.split(" ");

  return (
    <section ref={container} className="min-h-screen flex items-center justify-center bg-white py-32 px-6">
      <div className="max-w-[100rem] mx-auto flex flex-wrap justify-center gap-x-6 gap-y-4 text-center">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + (1 / words.length);
          const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
          // Clip path animation instead of just opacity
          const clipPath = useTransform(scrollYProgress, [start, end], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);
          
          return (
            <div key={i} className="relative overflow-hidden inline-block pb-4 -mb-4">
              {/* Background ghost word */}
              <span className="text-[clamp(50px,8vw,120px)] font-bold tracking-tighter text-[#E5E5DE] leading-[0.9]">
                {word}
              </span>
              {/* Foreground clipped word */}
              <motion.span 
                style={{ opacity, clipPath }}
                className="absolute left-0 top-0 text-[clamp(50px,8vw,120px)] font-bold tracking-tighter text-[#111111] leading-[0.9]"
              >
                {word}
              </motion.span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
