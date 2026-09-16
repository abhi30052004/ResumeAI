import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AIAnalysis() {
  const [uploadState, setUploadState] = useState<'idle' | 'analyzing' | 'complete'>('idle');

  const simulateUpload = () => {
    if (uploadState !== 'idle') return;
    setUploadState('analyzing');
    setTimeout(() => setUploadState('complete'), 3000);
  };

  // Background blobs animation
  const blob1Animation = {
    x: [0, 30, 0, -30, 0],
    y: [0, 40, 20, -20, 0],
    scale: [1, 1.05, 0.95, 1.02, 1],
    transition: { duration: 18, repeat: Infinity, ease: "linear" as any }
  };

  return (
    <section id="analysis" className="py-32 bg-[#F8FAFC] relative overflow-hidden text-slate-900">
      {/* Dynamic Animated Background - Light Mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={blob1Animation}
          className="absolute top-[20%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#635BFF]/15 to-[#A07CFF]/15 blur-[120px] mix-blend-multiply opacity-60"
        />
        <motion.div
          animate={{ ...blob1Animation, transition: { duration: 24, repeat: Infinity, ease: "linear" as any } }}
          className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#FF3366]/10 to-[#FF8A8A]/10 blur-[120px] mix-blend-multiply opacity-60"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-70" />
      </div>

      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 relative z-10">

        {/* Upload Interaction */}
        <div className="mb-40 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 mb-6 drop-shadow-sm uppercase">
              YOUR PROFESSIONAL PROFILE, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] to-[#FF3366]">UNDERSTOOD BY AI</span>.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4 font-medium">
              Your resume contains your experience. ProfileIQ turns that information into career intelligence.
            </p>
            <p className="text-base text-slate-500 max-w-2xl mx-auto mb-8">
              Upload your resume and let AI understand:
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 max-w-2xl mx-auto text-left text-sm text-slate-600 mb-12">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" /> Your skills</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" /> Your experience</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" /> Your achievements</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" /> Your technical strengths</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" /> Your career interests</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" /> Your job compatibility</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" /> Areas that need improvement</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onClick={simulateUpload}
            className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-500 cursor-pointer shadow-sm backdrop-blur-xl ${uploadState === 'idle' ? 'border-slate-300 hover:border-[#635BFF] bg-white/60 hover:bg-white/80' :
                uploadState === 'analyzing' ? 'border-[#635BFF] bg-white/90 shadow-lg shadow-[#635BFF]/10' : 'border-green-400 bg-green-50/90 shadow-lg shadow-green-500/10'
              }`}
          >
            <AnimatePresence mode="wait">
              {uploadState === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <div className="text-xl font-bold text-slate-900">Drop your resume here</div>
                  <div className="text-sm text-slate-500">PDF • DOCX</div>
                  <button className="mt-4 px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:shadow-sm transition-all">Browse Files</button>
                </motion.div>
              )}

              {uploadState === 'analyzing' && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-6 w-full max-w-md mx-auto"
                >
                  <div className="text-lg font-semibold text-slate-900">Resume.pdf</div>
                  <div className="text-sm font-mono text-[#635BFF] animate-pulse">Analyzing structurally...</div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#635BFF] to-[#A07CFF] relative"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "linear" as any }}
                    >
                      <motion.div
                        className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" as any }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {uploadState === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] text-white flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="text-xl font-bold text-green-600">Analysis Complete</div>
                  <div className="text-5xl font-bold text-slate-900 mt-2 tracking-tighter">87<span className="text-xl text-slate-500 font-medium">/100</span></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Split Screen AI Analysis Demo */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Left: Original */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-sm"
          >
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-6 pb-4 border-b border-slate-200">Original Resume Extract</div>

            <div className="space-y-6 opacity-80">
              <div>
                <h4 className="font-bold text-slate-900">Software Developer</h4>
                <p className="text-sm text-slate-500">Tech Corp • 2023 - Present</p>
              </div>
              <ul className="list-disc list-inside text-sm text-slate-700 space-y-4">
                <li>Collaborated with team to build features.</li>
                <li className="relative bg-red-50 text-red-900 p-2 rounded -ml-2 border border-red-100 shadow-sm">
                  <span className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">!</span>
                  Worked on web applications.
                </li>
                <li>Fixed bugs and attended meetings.</li>
              </ul>
            </div>
          </motion.div>

          {/* Right: AI Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 border border-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#635BFF]/10 to-transparent blur-[30px] rounded-full pointer-events-none" />

            <div className="text-xs font-mono uppercase tracking-widest text-[#635BFF] mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-semibold">AI Intelligence</span>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#635BFF] animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#635BFF] animate-pulse" style={{ animationDelay: '200ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#635BFF] animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <span className="text-amber-600 font-bold text-xs">!</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Weak Bullet Detected</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    "Worked on web applications" is vague and lacks measurable impact. Let's rewrite this using the XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]).
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-6 shadow-inner">
                <div className="text-xs font-bold text-[#635BFF] mb-3 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                  AI Suggestion
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <p className="text-slate-900 font-medium leading-relaxed">
                    "Built and optimized scalable React applications, reducing average page load time by 32% and increasing user retention."
                  </p>
                </motion.div>
                <div className="mt-5 flex gap-3">
                  <button className="px-5 py-2 bg-[#635BFF] hover:bg-[#5247ed] text-white text-xs font-bold rounded-lg transition-colors shadow-sm shadow-[#635BFF]/30">Apply Fix</button>
                  <button className="px-5 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-xs font-bold rounded-lg shadow-sm transition-colors">Regenerate</button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
