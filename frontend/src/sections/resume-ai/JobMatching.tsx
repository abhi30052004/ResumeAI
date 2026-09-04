import { useState } from 'react';
import { motion } from 'framer-motion';

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

  return (
    <section id="matching" className="py-32 bg-[#FFFFFF] relative overflow-hidden border-t border-[#E5E5DE]">
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-20 items-center">
        
        {/* Text Side */}
        <div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#111111] leading-[0.9] mb-8">
            Don't just improve<br/>
            your resume.<br/>
            <span className="text-[#635BFF]">Match it to the job.</span>
          </h2>
          <p className="text-xl text-[#666666] font-light max-w-md mb-12">
            Paste a job description and Resume AI will instantly compare your experience, highlighting missing keywords and skills needed to pass the ATS.
          </p>
        </div>

        {/* Interactive Matcher */}
        <div className="bg-[#F7F7F2] rounded-[2rem] p-8 md:p-12 border border-[#E5E5DE] shadow-sm relative">
          
          {!showResults ? (
            <div className="space-y-6">
              <div className="text-sm font-bold text-[#111111] uppercase tracking-wider">Target Role</div>
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5DE] shadow-sm relative">
                <div className="w-1/2 h-4 bg-[#F0F0EA] rounded mb-4" />
                <div className="w-full h-3 bg-[#F0F0EA] rounded mb-2" />
                <div className="w-5/6 h-3 bg-[#F0F0EA] rounded mb-2" />
                <div className="w-4/6 h-3 bg-[#F0F0EA] rounded" />
                
                {isAnalyzing && (
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-1 bg-[#635BFF]"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-4 rounded-full bg-[#111111] text-white font-bold tracking-widest uppercase text-sm hover:bg-[#635BFF] transition-colors relative overflow-hidden"
              >
                {isAnalyzing ? (
                  <span className="animate-pulse">Analyzing Description...</span>
                ) : (
                  "Analyze Match Score →"
                )}
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold text-[#111111]">Senior Frontend Developer</div>
                  <div className="text-sm text-[#666666]">Tech Company</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono uppercase tracking-widest text-[#635BFF] font-bold">Match Score</div>
                  <div className="text-4xl font-bold text-[#111111]">94%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-green-200">
                  <div className="text-xs font-bold text-green-700 uppercase mb-2">Strong Matches</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">React ✓</span>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">TypeScript ✓</span>
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">Next.js ✓</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-amber-200">
                  <div className="text-xs font-bold text-amber-700 uppercase mb-2">Missing Skills (3)</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md">Docker</span>
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md">GraphQL</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowResults(false)}
                className="w-full py-4 rounded-full bg-white border border-[#E5E5DE] text-[#111111] font-bold text-sm hover:border-[#111111] transition-colors"
              >
                Test Another Role
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}
