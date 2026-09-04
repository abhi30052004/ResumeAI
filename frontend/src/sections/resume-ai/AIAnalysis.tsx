import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AIAnalysis() {
  const [uploadState, setUploadState] = useState<'idle' | 'analyzing' | 'complete'>('idle');

  const simulateUpload = () => {
    if (uploadState !== 'idle') return;
    setUploadState('analyzing');
    setTimeout(() => setUploadState('complete'), 3000);
  };

  return (
    <section id="analysis" className="py-32 bg-[#FFFFFF] relative overflow-hidden">
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
        
        {/* Upload Interaction */}
        <div className="mb-40 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[#111111] mb-12">
            Your resume, decoded by AI.
          </h2>
          
          <div 
            onClick={simulateUpload}
            className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-500 cursor-pointer ${
              uploadState === 'idle' ? 'border-[#E5E5DE] hover:border-[#635BFF] hover:bg-[#F7F7F2]' : 
              uploadState === 'analyzing' ? 'border-[#635BFF] bg-[#F7F7F2]' : 'border-green-500 bg-green-50'
            }`}
          >
            <AnimatePresence mode="wait">
              {uploadState === 'idle' && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-white border border-[#E5E5DE] shadow-sm flex items-center justify-center text-[#666666]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <div className="text-xl font-bold text-[#111111]">Drop your resume here</div>
                  <div className="text-sm text-[#666666]">PDF • DOCX</div>
                  <button className="mt-4 px-6 py-2 bg-white border border-[#E5E5DE] rounded-full text-sm font-semibold text-[#111111]">Browse Files</button>
                </motion.div>
              )}

              {uploadState === 'analyzing' && (
                <motion.div 
                  key="analyzing"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-6 w-full max-w-md mx-auto"
                >
                  <div className="text-lg font-semibold text-[#111111]">Resume.pdf</div>
                  <div className="text-sm font-mono text-[#635BFF] animate-pulse">Analyzing...</div>
                  <div className="w-full h-2 bg-[#E5E5DE] rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#635BFF]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              )}

              {uploadState === 'complete' && (
                <motion.div 
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="text-xl font-bold text-green-700">Analysis Complete</div>
                  <div className="text-4xl font-bold text-[#111111] mt-2">87<span className="text-xl text-[#666666]">/100</span></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Split Screen AI Analysis Demo */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Left: Original */}
          <div className="bg-[#F7F7F2] rounded-3xl p-8 border border-[#E5E5DE]">
            <div className="text-xs font-mono uppercase tracking-widest text-[#666666] mb-6 pb-4 border-b border-[#E5E5DE]">Original Resume Extract</div>
            
            <div className="space-y-6 opacity-70">
              <div>
                <h4 className="font-bold text-[#111111]">Software Developer</h4>
                <p className="text-sm text-[#666666]">Tech Corp • 2023 - Present</p>
              </div>
              <ul className="list-disc list-inside text-sm text-[#111111] space-y-4">
                <li>Collaborated with team to build features.</li>
                <li className="relative bg-red-50 text-red-900 p-2 rounded -ml-2 outline outline-1 outline-red-200">
                  <span className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">!</span>
                  Worked on web applications.
                </li>
                <li>Fixed bugs and attended meetings.</li>
              </ul>
            </div>
          </div>

          {/* Right: AI Analysis */}
          <div className="bg-white rounded-3xl p-8 border border-[#E5E5DE] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#635BFF]/10 blur-[50px] rounded-full" />
            <div className="text-xs font-mono uppercase tracking-widest text-[#635BFF] mb-6 pb-4 border-b border-[#F0F0EA] flex items-center justify-between">
              <span>AI Intelligence</span>
              <div className="flex gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#635BFF] animate-pulse"/><div className="w-1.5 h-1.5 rounded-full bg-[#635BFF] animate-pulse animation-delay-200"/><div className="w-1.5 h-1.5 rounded-full bg-[#635BFF] animate-pulse animation-delay-400"/></div>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-amber-600 font-bold text-xs">!</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#111111] mb-1">Weak Bullet Detected</h4>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    "Worked on web applications" is vague and lacks measurable impact. Let's rewrite this using the XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]).
                  </p>
                </div>
              </div>

              <div className="bg-[#F7F7F2] p-6 rounded-2xl border border-[#E5E5DE] mt-6">
                <div className="text-xs font-bold text-[#635BFF] mb-3">AI Suggestion</div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {/* Typewriter effect simulation */}
                  <p className="text-[#111111] font-medium leading-relaxed">
                    "Built and optimized scalable React applications, reducing average page load time by 32% and increasing user retention."
                  </p>
                </motion.div>
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-1.5 bg-[#111111] text-white text-xs font-bold rounded-md hover:bg-[#635BFF] transition-colors">Apply Fix</button>
                  <button className="px-4 py-1.5 bg-white text-[#111111] border border-[#E5E5DE] text-xs font-bold rounded-md">Regenerate</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
