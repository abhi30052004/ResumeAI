import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export function CTA() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Background blobs animation
  const blobAnimation = {
    x: [0, 50, 0, -50, 0],
    y: [0, -30, -60, -30, 0],
    scale: [1, 1.2, 0.8, 1.1, 1],
    transition: { duration: 20, repeat: Infinity, ease: "linear" as any }
  };

  return (
    <div className="relative bg-slate-900">
      {/* Wave Separator from previous section */}
      <svg className="absolute w-full h-auto -top-[1px] left-0 pointer-events-none z-10" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path className="fill-[#F8FAFC]" d="M0,120 C480,0 960,0 1440,120 L1440,0 L0,0 Z" />
      </svg>

      <section className="pt-60 pb-40 px-6 lg:px-12 relative overflow-hidden text-white">
        {/* Dark Mode Dynamic Background for CTA */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            animate={blobAnimation}
            className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#635BFF]/30 to-[#FF3366]/30 blur-[100px] mix-blend-screen opacity-50"
          />
          <motion.div
            animate={{ ...blobAnimation, transition: { duration: 25, repeat: Infinity, ease: "linear" as any } }}
            className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#A07CFF]/20 to-[#635BFF]/20 blur-[120px] mix-blend-screen opacity-50"
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        </div>

        <div className="max-w-[100rem] mx-auto relative z-10 flex flex-col items-center text-center gap-10">

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-[6vw] lg:text-[5vw] font-bold tracking-tighter text-white leading-[0.85] drop-shadow-2xl uppercase"
          >
            TURN EMPLOYEE DATA INTO<br />
            <span className="italic font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] to-[#FF3366]">PROJECT</span> INTELLIGENCE.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl text-slate-300 font-light max-w-lg mb-4 space-y-4"
          >
            <p className="font-bold text-white text-2xl">Understand your people. Discover your talent.</p>
            <p>Match skills to opportunities and build stronger project teams.</p>
            <p className="text-[#A07CFF] font-bold uppercase tracking-widest text-sm pt-4">Intelligent Professional Profile</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="bg-gradient-to-r from-[#635BFF] to-[#A07CFF] text-white font-bold px-12 py-6 rounded-full hover:scale-105 transition-all duration-300 border-none group text-xl shadow-[0_20px_50px_rgba(99,91,255,0.4)] hover:shadow-[0_20px_60px_rgba(99,91,255,0.6)] flex items-center cursor-pointer"
            >
              Explore ProfileIQ <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>

        </div>
      </section>

      {/* Footer minimal */}
      <footer className="bg-slate-950 border-t border-slate-800 py-16 px-6 lg:px-12 relative z-10">
        <div className="max-w-[100rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-slate-400 font-medium mb-12">
          <div className="flex flex-col gap-4 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#635BFF] to-[#FF3366] flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 bg-white rounded-sm" />
              </div>
              <span className="font-bold text-white tracking-wider uppercase">PROFILEIQ</span>
            </div>
            <p className="text-white font-bold mb-2">Intelligent Professional Profile</p>
            <p>Understand your people.</p>
            <p>Discover your talent.</p>
            <p>Match skills to opportunities.</p>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-white font-bold mb-2">Platform</span>
            <a href="#" className="hover:text-white transition-colors">AI Profile Intelligence</a>
            <a href="#" className="hover:text-white transition-colors">Smart Resource Matching</a>
            <a href="#" className="hover:text-white transition-colors">Project Experience</a>
            <a href="#" className="hover:text-white transition-colors">Skill Intelligence</a>
            <a href="#" className="hover:text-white transition-colors">AI Career Assistant</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-white font-bold mb-2">Solutions</span>
            <a href="#" className="hover:text-white transition-colors">For Employees</a>
            <a href="#" className="hover:text-white transition-colors">For Managers</a>
            <a href="#" className="hover:text-white transition-colors">For Leadership</a>
            <a href="#" className="hover:text-white transition-colors">Talent Acquisition</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-white font-bold mb-2">Company</span>
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
        <div className="max-w-[100rem] mx-auto pt-8 border-t border-slate-800 text-slate-500 text-sm">
          © 2026 ProfileIQ. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
