import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, AlertCircle } from 'lucide-react';

export function JobMatching() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2500);
  };

  // Background blobs animation
  const blobAnimation = {
    x: [0, 40, 0, -40, 0],
    y: [0, -30, -60, -30, 0],
    scale: [1, 1.1, 0.9, 1.05, 1],
    transition: { duration: 18, repeat: Infinity, ease: "linear" }
  };

  return (
    <section id="matching" className="py-32 bg-[#F8FAFC] relative overflow-hidden border-t border-slate-100 text-slate-900">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={blobAnimation}
          className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#635BFF]/15 to-[#A07CFF]/15 blur-[100px] mix-blend-multiply opacity-60"
        />
        <motion.div
          animate={{ ...blobAnimation, transition: { duration: 22, repeat: Infinity, ease: "linear" } }}
          className="absolute bottom-[20%] left-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-[#27C93F]/10 to-[#8EE09C]/10 blur-[100px] mix-blend-multiply opacity-50"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-70" />
      </div>

      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center relative z-10">

        {/* Text Side */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 leading-[0.9] mb-8 drop-shadow-sm uppercase">
              KNOW YOUR JOB MATCH<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] to-[#A07CFF]">BEFORE YOU APPLY.</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg text-slate-600 font-normal max-w-md mb-12 leading-relaxed space-y-4"
          >
            <p className="font-bold text-slate-900 text-xl">See how your profile aligns with a job.</p>
            <p>Paste a job description or upload one, and ProfileIQ compares it with your professional profile.</p>
            <p className="text-base text-slate-500 mt-4 border-t border-slate-200 pt-4">
              ProfileIQ doesn't just give you a number. It explains <strong>why your profile matches</strong>, what you're missing, and where you can improve.
            </p>
          </motion.div>
        </div>

        {/* Interactive Matcher */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
          className="bg-white/60 backdrop-blur-2xl rounded-[2rem] p-8 md:p-12 border border-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative overflow-hidden"
        >
          {/* Subtle glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <Target className="w-4 h-4 text-[#635BFF]" />
                    Target Role
                  </div>
                  <div className="bg-white/80 p-6 rounded-2xl border border-white shadow-sm relative overflow-hidden">
                    <div className="w-1/2 h-4 bg-slate-200 rounded mb-4" />
                    <div className="w-full h-3 bg-slate-100 rounded mb-3" />
                    <div className="w-5/6 h-3 bg-slate-100 rounded mb-3" />
                    <div className="w-4/6 h-3 bg-slate-100 rounded" />

                    {isAnalyzing && (
                      <motion.div
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#635BFF] to-transparent shadow-[0_0_15px_rgba(99,91,255,0.8)]"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-4 rounded-xl bg-[#635BFF] text-white font-bold tracking-widest uppercase text-sm hover:bg-[#5247ed] transition-all relative overflow-hidden shadow-[0_10px_20px_rgba(99,91,255,0.2)] hover:shadow-[0_10px_30px_rgba(99,91,255,0.4)] disabled:opacity-80 cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center justify-center gap-2 animate-pulse">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing Job Match...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Analyze Job Match <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    )}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">AI / ML Engineer</div>
                      <div className="text-sm text-slate-500 font-medium">Target Role</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono uppercase tracking-widest text-[#635BFF] font-bold mb-1">Job Match</div>
                      <div className="text-5xl font-bold text-slate-900 drop-shadow-sm">87<span className="text-2xl text-slate-400">%</span></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-green-50/80 p-5 rounded-2xl border border-green-200/50 shadow-inner">
                      <div className="text-xs font-bold text-green-700 uppercase mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Matched Skills
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'Python', 'REST APIs', 'SQL', 'AI/ML', 'Git'].map(skill => (
                          <span key={skill} className="px-2.5 py-1 bg-white text-green-700 text-xs font-bold rounded-lg border border-green-100 shadow-sm">{skill}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-[#635BFF]/5 p-5 rounded-2xl border border-[#635BFF]/10 shadow-inner">
                      <div className="text-xs font-bold text-[#635BFF] uppercase mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Relevant Experience
                      </div>
                      <ul className="text-sm text-[#635BFF] font-medium space-y-1 list-disc list-inside">
                        <li>Full-stack development</li>
                        <li>AI-powered applications</li>
                        <li>Backend API development</li>
                      </ul>
                    </div>

                    <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/50 shadow-inner">
                      <div className="text-xs font-bold text-amber-700 uppercase mb-3 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> Skills to strengthen
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['AWS', 'Docker', 'Kubernetes'].map(skill => (
                          <span key={skill} className="px-2.5 py-1 bg-white text-amber-700 text-xs font-bold rounded-lg border border-amber-100 shadow-sm">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowResults(false)}
                    className="w-full py-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm cursor-pointer"
                  >
                    Test Another Role
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
