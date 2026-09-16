import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Bot, LineChart, Target, Zap, FolderKanban, Network, Briefcase } from 'lucide-react';

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
        className={`w-full h-full bg-slate-50/70 backdrop-blur-2xl rounded-3xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-8 group relative overflow-hidden flex flex-col justify-between hover:border-[#635BFF]/30 hover:shadow-[0_20px_50px_rgba(99,91,255,0.1)] transition-all duration-300 ${innerClassName || ''}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10 w-full h-full flex flex-col justify-between transform-gpu transition-transform duration-500 group-hover:translate-z-4">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturesBento() {
  // Background blobs animation
  const blobAnimation = {
    x: [0, -40, 0, 40, 0],
    y: [0, 50, 0, -50, 0],
    scale: [1, 1.1, 0.9, 1.05, 1],
    transition: { duration: 25, repeat: Infinity, ease: "linear" as any }
  };

  return (
    <section id="features" className="py-32 bg-white relative overflow-hidden px-6 lg:px-12 text-slate-900">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={blobAnimation}
          className="absolute top-[20%] left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#635BFF]/10 to-[#A07CFF]/10 blur-[120px] mix-blend-multiply opacity-50"
        />
        <motion.div
          animate={{ ...blobAnimation, transition: { duration: 20, repeat: Infinity, ease: "linear" as any } }}
          className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#FF3366]/5 to-[#FF8A8A]/5 blur-[120px] mix-blend-multiply opacity-50"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>

      <div className="max-w-[100rem] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-slate-900 mb-6 drop-shadow-sm">
            KNOW YOUR PEOPLE.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] to-[#FF3366]">BUILD BETTER TEAMS.</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            ProfileIQ brings employee profiles, project requirements, resource availability, and AI-powered matching into one connected platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">

          {/* Card 1: AI Profile Intelligence */}
          <div className="md:col-span-2 lg:col-span-8">
            <FeatureCard innerClassName="!bg-gradient-to-br !from-white !to-slate-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <LineChart className="w-8 h-8 text-[#635BFF] mb-4" />
                  <h3 className="text-4xl font-bold text-slate-900 uppercase max-w-[400px] leading-none drop-shadow-sm">AI PROFILE INTELLIGENCE</h3>
                </div>
                <div className="w-20 h-20 relative flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" stroke="#F1F5F9" strokeWidth="6" fill="none" />
                    <circle cx="32" cy="32" r="28" stroke="url(#gradient)" strokeWidth="6" fill="none" strokeDasharray="175" strokeDashoffset="20" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#635BFF" />
                        <stop offset="100%" stopColor="#FF3366" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="font-bold text-2xl text-slate-900 z-10">94</span>
                </div>
              </div>
              <div className="mt-auto space-y-2">
                <p className="text-slate-600 max-w-lg text-base leading-relaxed">
                  Understand every employee's skills, experience, achievements, and project history in a structured, actionable format.
                </p>
              </div>
            </FeatureCard>
          </div>

          {/* Card 2: Smart Resource Matching */}
          <div className="md:col-span-1 lg:col-span-4">
            <FeatureCard>
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm text-[#635BFF] flex items-center justify-center font-bold text-2xl mb-auto">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 uppercase mb-2 mt-8 flex items-center gap-2">
                  SMART MATCHING
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Find available employees whose skills and experience strongly align with incoming project requirements.
                </p>
              </div>
            </FeatureCard>
          </div>

          {/* Card 3: Project Experience */}
          <div className="md:col-span-1 lg:col-span-4">
            <FeatureCard>
              <div className="flex gap-2 mb-auto flex-col space-y-3 w-full">
                 <FolderKanban className="w-10 h-10 text-[#27C93F] mb-2" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 uppercase mb-2 mt-8 flex items-center gap-2">
                  PROJECT EXPERIENCE
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Turn past project experience and historical assignments into actionable, queryable staffing intelligence.
                </p>
              </div>
            </FeatureCard>
          </div>

          {/* Card 4: Skill Intelligence */}
          <div className="md:col-span-1 lg:col-span-4">
            <FeatureCard>
              <Network className="w-10 h-10 text-[#FFBD2E] mb-auto" />
              <h3 className="text-2xl font-bold text-slate-900 uppercase mb-2 mt-8 leading-none">
                SKILL <br /><span className="text-[#635BFF]">INTELLIGENCE</span>
              </h3>
              <p className="text-slate-500 text-sm mt-4 mb-4 leading-relaxed tracking-tight">
                Identify strengths, spot skill gaps, and discover the specific technologies needed across the entire organization.
              </p>
            </FeatureCard>
          </div>
          
          {/* Card 5: Internal Opportunities */}
          <div className="md:col-span-1 lg:col-span-4">
            <FeatureCard>
              <Briefcase className="w-10 h-10 text-[#FF3366] mb-auto" />
              <h3 className="text-2xl font-bold text-slate-900 uppercase mb-2 mt-8 leading-none">
                INTERNAL <br />OPPORTUNITIES
              </h3>
              <p className="text-slate-500 text-sm mt-4 mb-4 leading-relaxed tracking-tight">
                Help bench employees seamlessly discover internal projects that perfectly align with their goals and profiles.
              </p>
            </FeatureCard>
          </div>

          {/* Card 6: AI Chat */}
          <div className="md:col-span-2 lg:col-span-12">
            <FeatureCard innerClassName="!bg-slate-900 !border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.2)] md:flex-row !items-center !justify-between">
              <div className="flex-1 text-left max-w-2xl relative z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#635BFF] to-[#A07CFF] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,91,255,0.4)] relative">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/20"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <Bot className="w-8 h-8 text-white relative z-10" />
                </div>
                <h3 className="text-3xl font-bold text-white uppercase mb-4 tracking-tight">AI CAREER ASSISTANT</h3>
                <p className="text-slate-400 text-base max-w-lg">
                  Give employees personalized insights based on their professional profile. Ask questions like: "Which internal projects match my profile?" or "What skills should I improve?"
                </p>
              </div>
              
              {/* Fake UI visualization for chat */}
              <div className="hidden lg:flex flex-col gap-4 w-[400px] mt-8 lg:mt-0 relative z-10">
                <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-slate-700 self-end w-4/5 shadow-lg text-sm text-slate-200">
                  Which internal projects match my React and Python skills?
                </div>
                <div className="bg-gradient-to-r from-[#635BFF]/20 to-[#A07CFF]/20 backdrop-blur rounded-2xl p-4 border border-[#635BFF]/30 self-start w-[90%] shadow-lg text-sm text-slate-200 flex gap-3">
                  <Bot className="w-5 h-5 shrink-0 text-[#A07CFF] mt-0.5" />
                  <p>Based on your profile, the <strong>AI Knowledge Platform</strong> is an 89% match. It requires Python and React. You can apply on the opportunities board.</p>
                </div>
              </div>
              
              {/* Dark mode card ambient glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#635BFF]/20 blur-[80px] rounded-full pointer-events-none" />
            </FeatureCard>
          </div>

        </div>
      </div>
    </section>
  );
}
