import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

export function Timeline() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start center", "end center"]
  });

  const experiences = [
    { year: '2026', role: 'Full Stack Developer', desc: 'Working with AI, full-stack development and automation.' },
    { year: '2025', role: 'Frontend Engineer', desc: 'Led development of enterprise React applications.' },
    { year: '2024', role: 'UI/UX Designer', desc: 'Created component libraries and design systems.' },
  ];

  return (
    <section ref={container} className="py-40 bg-[#F7F7F2] relative">
      <div className="max-w-[80rem] mx-auto px-6 lg:px-12 flex">
        
        {/* Left Timeline Line */}
        <div className="w-1 bg-[#E5E5DE] relative mr-12 ml-4">
          <motion.div 
            className="absolute top-0 left-0 w-full bg-[#635BFF] origin-top"
            style={{ scaleY: scrollYProgress }}
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-32 py-12">
          {experiences.map((exp, i) => (
            <TimelineItem key={i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ exp, index }: { exp: any, index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Node */}
      <div className="absolute -left-[58px] top-2 w-4 h-4 rounded-full bg-white border-4 border-[#635BFF] shadow-sm" />
      
      <div className="text-[#635BFF] font-mono font-bold text-xl mb-2">{exp.year}</div>
      <h3 className="text-3xl font-bold text-[#111111] tracking-tighter mb-4">{exp.role}</h3>
      <p className="text-[#666666] text-lg font-light max-w-lg">{exp.desc}</p>
    </motion.div>
  );
}
