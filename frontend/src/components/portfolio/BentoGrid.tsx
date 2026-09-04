import React from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Database } from 'lucide-react';

function TiltCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative w-full h-full perspective-[1000px] ${className || ''}`}
    >
      <div 
        style={{ transform: "translateZ(30px)" }}
        className="w-full h-full"
      >
        {children}
      </div>
    </motion.div>
  );
}

export function BentoGrid() {
  return (
    <section className="py-32 bg-[#F7F7F2] px-6 lg:px-12 relative overflow-hidden rounded-[3rem] mx-4 lg:mx-12 shadow-sm border border-[#E5E5DE]">
      <div className="max-w-[100rem] mx-auto">
        <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-[#666666] mb-12">WHAT I BUILD</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[350px]">
          {/* Card 1 - AI */}
          <div className="md:col-span-8 p-0 perspective-[1000px]">
            <TiltCard>
              <div className="flex flex-col justify-end overflow-hidden group bg-[#FFFFFF] rounded-3xl border border-[#E5E5DE] shadow-sm relative h-full">
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
                <div className="absolute top-12 left-12 right-12 bottom-32 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="space-y-4 w-full max-w-md mx-auto transform-gpu transition-transform duration-500 group-hover:-translate-y-4">
                    <div className="p-4 rounded-2xl rounded-tl-sm bg-[#F0F0EA] text-sm text-[#111111]">Generate user dashboard layout...</div>
                    <div className="p-4 rounded-2xl rounded-tr-sm bg-[#635BFF] text-sm text-white ml-auto text-right">Building layout and compiling components...</div>
                  </div>
                </div>
                <div className="relative z-20 p-8 md:p-12 transition-transform duration-500 group-hover:translate-y-2">
                  <h3 className="text-3xl font-bold text-[#111111] mb-2">AI Applications</h3>
                  <p className="text-[#666666] font-light max-w-md">Integrating LLMs to build intelligent agents and contextual features.</p>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Card 2 - Full Stack */}
          <div className="md:col-span-4 perspective-[1000px]">
            <TiltCard>
              <div className="h-full p-8 md:p-12 flex flex-col justify-between group bg-[#FFFFFF] rounded-3xl border border-[#E5E5DE] shadow-sm">
                <div className="w-12 h-12 rounded-full border border-[#E5E5DE] bg-[#F7F7F2] flex items-center justify-center mb-12 group-hover:bg-[#635BFF] group-hover:text-white transition-colors group-hover:border-transparent">
                  <Database className="w-5 h-5" />
                </div>
                <div className="transition-transform duration-500 group-hover:translate-x-2">
                  <h3 className="text-2xl font-bold text-[#111111] mb-2">Full Stack</h3>
                  <p className="text-[#666666] font-light text-sm">Frontend → API → Database</p>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Card 3 - UI/UX */}
          <div className="md:col-span-4 perspective-[1000px]">
            <TiltCard>
              <div className="h-full p-8 md:p-12 flex flex-col justify-between bg-[#FFFFFF] rounded-3xl border border-[#E5E5DE] shadow-sm group">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E5E5DE] transition-transform duration-300 group-hover:-translate-y-2" />
                  <div className="w-8 h-8 rounded-full bg-[#635BFF] transition-transform duration-300 delay-75 group-hover:-translate-y-2" />
                  <div className="w-8 h-8 rounded-full bg-[#111111] transition-transform duration-300 delay-150 group-hover:-translate-y-2" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#111111] mb-2">UI/UX Systems</h3>
                  <p className="text-[#666666] font-light text-sm">Pixel-perfect component libraries.</p>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Card 4 - Product Development */}
          <div className="md:col-span-8 perspective-[1000px]">
            <TiltCard>
              <div className="h-full p-8 md:p-12 flex flex-col md:flex-row justify-between items-end bg-[#FFFFFF] rounded-3xl border border-[#E5E5DE] shadow-sm bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-95 group">
                <div className="relative z-20 max-w-md transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-3xl font-bold text-[#111111] mb-2">Product Development</h3>
                  <p className="text-[#666666] font-light">End-to-end architecture from wireframe to production deployment.</p>
                </div>
                <div className="flex items-center gap-4 mt-8 md:mt-0">
                  <div className="w-16 h-16 rounded-2xl bg-[#F0F0EA] flex flex-col gap-2 p-3 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <div className="h-2 w-full bg-white rounded-sm" />
                    <div className="h-2 w-2/3 bg-white rounded-sm" />
                    <div className="h-6 w-full bg-[#635BFF]/20 rounded-sm mt-auto" />
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}
