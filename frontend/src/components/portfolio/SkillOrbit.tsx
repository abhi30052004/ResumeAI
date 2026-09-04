import React from 'react';
import { motion } from 'framer-motion';

export function SkillOrbit() {
  const skills = [
    { name: 'React', angle: 0, radius: 140 },
    { name: 'Python', angle: 45, radius: 180 },
    { name: 'FastAPI', angle: 90, radius: 150 },
    { name: 'MongoDB', angle: 135, radius: 200 },
    { name: 'AI', angle: 180, radius: 130 },
    { name: 'LangChain', angle: 225, radius: 190 },
    { name: 'TypeScript', angle: 270, radius: 160 },
    { name: 'Power Platform', angle: 315, radius: 210 },
  ];

  return (
    <section className="py-40 bg-[#FFFFFF] overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-24">
        <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-[#666666]">Ecosystem</h2>
      </div>

      <div className="relative w-[500px] h-[500px] flex items-center justify-center group">
        
        {/* Orbit Rings */}
        <div className="absolute inset-0 rounded-full border border-[#E5E5DE] opacity-50" />
        <div className="absolute inset-10 rounded-full border border-[#E5E5DE] opacity-30" />
        <div className="absolute inset-24 rounded-full border border-[#E5E5DE] opacity-10" />

        {/* Center */}
        <div className="relative z-10 w-32 h-32 rounded-full bg-[#111111] flex items-center justify-center text-white font-bold text-center leading-tight shadow-xl">
          FULL<br/>STACK
        </div>

        {/* Orbiting Skills */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 group-hover:[animation-play-state:paused]"
        >
          {skills.map((skill, i) => {
            const x = Math.cos((skill.angle * Math.PI) / 180) * skill.radius;
            const y = Math.sin((skill.angle * Math.PI) / 180) * skill.radius;

            return (
              <motion.div
                key={i}
                style={{ x, y }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              >
                {/* Counter-rotate to keep text upright */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="px-4 py-2 bg-white border border-[#E5E5DE] rounded-full text-xs font-bold text-[#111111] shadow-sm hover:scale-125 hover:bg-[#635BFF] hover:text-white transition-all group-hover:[animation-play-state:paused]"
                >
                  {skill.name}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
