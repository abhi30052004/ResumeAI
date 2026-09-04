import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedCounter } from '../AnimatedCounter';

export function Stats() {
  const stats = [
    { num: 10, suffix: '+', label: 'Projects' },
    { num: 15, suffix: '+', label: 'Technologies' },
    { num: 100, suffix: '%', label: 'Curiosity' }
  ];

  return (
    <section className="py-24 bg-[#FFFFFF]">
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-[#E5E5DE] py-24">
          {stats.map((stat, i) => (
            <StatItem key={i} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ stat }: { stat: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="flex flex-col items-center justify-center text-center group cursor-default">
      <div className="text-8xl lg:text-9xl font-bold tracking-tighter text-[#111111] flex items-center group-hover:text-[#635BFF] transition-colors duration-500">
        {isInView ? <AnimatedCounter from={0} to={stat.num} duration={2} /> : "0"}
        <span className="text-6xl lg:text-7xl ml-1 text-[#635BFF]">{stat.suffix}</span>
      </div>
      <div className="text-xl font-mono uppercase tracking-widest text-[#666666] mt-4 font-semibold">
        {stat.label}
      </div>
    </div>
  );
}
