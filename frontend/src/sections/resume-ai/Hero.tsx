import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, Variants, animate, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HowItWorksModal } from '../../components/resume-ai/HowItWorksModal';
import { Sparkles, ArrowRight, CheckCircle2, Zap, FileText } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const springX = useSpring(0, { stiffness: 40, damping: 20 });
  const springY = useSpring(0, { stiffness: 40, damping: 20 });

  const scoreValue = useMotionValue(0);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      springX.set(x * -20);
      springY.set(y * -20);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animate score from 0 to 87
    const controls = animate(scoreValue, 87, {
      duration: 2,
      delay: 1.5,
      ease: "easeOut" as any,
      onUpdate: (latest) => setDisplayScore(Math.round(latest))
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      controls.stop();
    };
  }, [springX, springY, scoreValue]);

  const lineVars: Variants = {
    hidden: { opacity: 0, y: 100, clipPath: 'inset(100% 0 0 0)', filter: 'blur(10px)' },
    show: {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0 0 0)',
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: "easeOut" as any }
    }
  };

  // Floating animation for decorative elements
  const floatingAnimation = {
    y: ["-15px", "15px"],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as any
    }
  };

  // Background blobs animation
  const blob1Animation = {
    x: [0, 50, 0, -50, 0],
    y: [0, 30, 60, 30, 0],
    scale: [1, 1.1, 0.9, 1.05, 1],
    transition: { duration: 15, repeat: Infinity, ease: "linear" as any }
  };

  const blob2Animation = {
    x: [0, -40, 20, -20, 0],
    y: [0, -50, -20, 10, 0],
    scale: [1, 0.9, 1.1, 0.95, 1],
    transition: { duration: 18, repeat: Infinity, ease: "linear" as any }
  };

  return (
    <section className="relative min-h-[110vh] flex flex-col justify-center bg-[#F8FAFC] overflow-hidden pt-24 pb-32 lg:pb-24 text-[#0f172a]">
      {/* Dynamic Animated Background - Light Mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={blob1Animation}
          className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#635BFF]/20 to-[#A07CFF]/20 blur-[100px] mix-blend-multiply opacity-70"
        />
        <motion.div
          animate={blob2Animation}
          className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#FF3366]/20 to-[#FF8A8A]/20 blur-[100px] mix-blend-multiply opacity-70"
        />
        <motion.div
          animate={{ ...blob1Animation, transition: { duration: 22, repeat: Infinity, ease: "linear" as any } }}
          className="absolute top-[30%] left-[40%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#27C93F]/10 to-[#10b981]/10 blur-[100px] mix-blend-multiply opacity-60"
        />

        {/* Subtle Grid pattern for light mode */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-70" />
      </div>

      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10 pb-20">

        {/* Text Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur-md mb-8 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#FF3366]" />
            <span className="text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-[#635BFF] to-[#FF3366] bg-clip-text text-transparent">AI-Powered Talent Intelligence</span>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              show: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } }
            }}
            className="flex flex-col mb-8"
          >
            <div className="overflow-hidden pb-4 -mb-4">
              <motion.h1
                variants={lineVars}
                className="text-2xl md:text-3xl font-bold text-slate-500 mb-2 uppercase tracking-widest"
              >
                ProfileIQ
              </motion.h1>
            </div>
            {["INTELLIGENT", "PROFILES FOR"].map((line, i) => (
              <div key={i} className="overflow-hidden pb-4 -mb-4">
                <motion.h1
                  variants={lineVars}
                  className="text-[clamp(48px,8vw,110px)] font-bold tracking-tighter text-slate-900 leading-[0.9]"
                >
                  {line}
                </motion.h1>
              </div>
            ))}
            <div className="overflow-hidden pb-4 -mb-4">
              <motion.div variants={lineVars}>
                <motion.h1
                  className="text-[clamp(48px,8vw,110px)] font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] via-[#A07CFF] to-[#FF3366]"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" as any }}
                  style={{ backgroundSize: '200% auto' }}
                >
                  SMARTER STAFFING.
                </motion.h1>
              </motion.div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-lg md:text-xl text-slate-600 font-normal max-w-lg leading-relaxed mb-6"
          >
            Connect employee skills, experience, project history, availability, and requirements with AI-powered intelligence.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="text-base text-slate-500 font-normal max-w-lg leading-relaxed mb-10"
          >
            Turn raw employee data into actionable project staffing intelligence. Discover the talent you already have and build stronger teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
          >
            <button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="bg-slate-900 text-white font-bold px-8 py-4 rounded-full hover:bg-slate-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2 group border-none cursor-pointer"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white/50 backdrop-blur-sm text-slate-700 font-bold px-8 py-4 rounded-full hover:bg-white transition-all duration-300 border border-slate-200 hover:border-slate-300 flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              Explore Platform
            </button>
          </motion.div>
        </div>

        {/* 3D Floating Dashboard Visual - Light Mode */}
        <motion.div
          style={{ x: springX, y: springY }}
          className="relative perspective-[1200px] hidden lg:block"
        >
          {/* Decorative floating elements */}
          <motion.div animate={floatingAnimation} className="absolute -top-8 -left-8 bg-white/90 p-4 rounded-2xl border border-pink-100 backdrop-blur-md shadow-[0_10px_30px_rgba(255,51,102,0.15)] z-20">
            <Zap className="w-8 h-8 text-[#FF3366]" />
          </motion.div>
          <motion.div animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }} className="absolute -bottom-8 -right-8 bg-white/90 p-4 rounded-2xl border border-indigo-100 backdrop-blur-md shadow-[0_10px_30px_rgba(99,91,255,0.15)] z-20">
            <FileText className="w-8 h-8 text-[#635BFF]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotateX: 15, rotateY: -15, z: -100 }}
            animate={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" as any, delay: 0.8 }}
            className="w-full max-w-[540px] mx-auto bg-white/80 backdrop-blur-2xl rounded-3xl border border-white shadow-[0_30px_80px_rgba(0,0,0,0.08)] overflow-hidden relative"
          >
            {/* Light glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />

            {/* Dashboard Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#635BFF]" />
                Analysis Results
              </span>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-2">Overall Match</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-7xl font-bold tracking-tighter text-slate-900 drop-shadow-sm">
                      {displayScore}
                    </span>
                    <span className="text-xl font-medium text-slate-500">/100</span>
                  </div>
                </div>
                {/* Score Visual */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#635BFF]/10 rounded-full blur-xl animate-pulse" />
                  <svg className="w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-slate-100" strokeWidth="8" fill="none" />
                    <motion.circle
                      cx="50" cy="50" r="40"
                      className="stroke-[#635BFF]"
                      strokeWidth="8" fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 251" }}
                      animate={{ strokeDasharray: "218 251" }} // 87%
                      transition={{ duration: 2.5, delay: 1.5, ease: "easeOut" as any }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[#635BFF]" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { label: "ATS Compatibility", score: "92%", color: "from-[#635BFF] to-[#A07CFF]" },
                  { label: "Content Quality", score: "84%", color: "from-[#FF3366] to-[#FF8A8A]" },
                  { label: "Impact & Achievements", score: "81%", color: "from-[#27C93F] to-[#8EE09C]" },
                  { label: "Skills Relevance", score: "89%", color: "from-[#FFBD2E] to-[#F59E0B]" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="text-slate-900 font-bold">{item.score}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${item.color} relative rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: item.score }}
                        transition={{ duration: 1.5, delay: 2 + (i * 0.2), ease: "easeOut" as any }}
                      >
                        {/* Shimmer effect inside progress bar */}
                        <motion.div
                          className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" as any, delay: 3 }}
                        />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modern Wave SVG transitioning to the next section */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[1px]">
        <svg className="relative block w-full h-[100px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.3,191.9,101.44,236.23,88.4,278.49,71.21,321.39,56.44Z" className="fill-white" />
        </svg>
      </div>

      <HowItWorksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
