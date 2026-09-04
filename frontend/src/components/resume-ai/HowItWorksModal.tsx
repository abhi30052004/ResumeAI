import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Target, X, CheckCircle2, ChevronRight } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Upload Resume",
      description: "Upload your existing resume in PDF or Word format.",
      icon: <Upload className="w-8 h-8 text-indigo-500" />
    },
    {
      title: "2. AI Analysis",
      description: "Our AI scans, scores, and rewrites your resume for maximum impact.",
      icon: <Sparkles className="w-8 h-8 text-purple-500" />
    },
    {
      title: "3. Land Interviews",
      description: "Download your ATS-friendly resume and apply with confidence.",
      icon: <Target className="w-8 h-8 text-emerald-500" />
    }
  ];

  // Auto-play the steps when modal opens
  useEffect(() => {
    if (!isOpen) {
      setActiveStep(0);
      return;
    }
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-slate-100 text-slate-500 hover:text-slate-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Steps List */}
          <div className="w-full md:w-1/3 bg-slate-50 p-8 border-r border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">How it works</h3>
            
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`flex gap-4 transition-all duration-300 ${activeStep === index ? 'opacity-100 translate-x-2' : 'opacity-40 cursor-pointer hover:opacity-70'}`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="mt-1">
                    {activeStep > index ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${activeStep === index ? 'border-indigo-600 text-indigo-600' : 'border-slate-300 text-slate-400'}`}>
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-bold ${activeStep === index ? 'text-slate-900' : 'text-slate-500'}`}>{step.title}</h4>
                    {activeStep === index && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-sm text-slate-500 mt-1"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Animated Visualizations */}
          <div className="w-full md:w-2/3 bg-white p-8 flex items-center justify-center min-h-[400px] relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div 
                  key="step0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-32 h-40 bg-slate-100 rounded-xl border-2 border-dashed border-indigo-300 flex items-center justify-center mb-6 relative overflow-hidden group">
                    <motion.div 
                      animate={{ y: [20, -20, 20] }} 
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Upload className="w-12 h-12 text-indigo-400" />
                    </motion.div>
                    {/* Simulated document lines */}
                    <div className="absolute top-8 left-6 right-6 h-2 bg-slate-200 rounded-full" />
                    <div className="absolute top-14 left-6 right-10 h-2 bg-slate-200 rounded-full" />
                    <div className="absolute top-20 left-6 right-8 h-2 bg-slate-200 rounded-full" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">Upload your PDF</h4>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="relative w-64 h-64 flex items-center justify-center"
                >
                  {/* Neural network / AI scanning effect */}
                  <div className="absolute inset-0 rounded-full border-2 border-purple-200 animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-indigo-200 animate-[spin_15s_linear_infinite_reverse]" />
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }} 
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/40 z-10"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  {/* Floating particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-indigo-400 rounded-full"
                      animate={{ 
                        x: [0, Math.cos(i * 60) * 100], 
                        y: [0, Math.sin(i * 60) * 100],
                        opacity: [1, 0]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
                    >
                      <Target className="w-16 h-16 text-emerald-600" />
                    </motion.div>
                    
                    {/* Confetti / Success dots */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{ backgroundColor: i % 2 === 0 ? '#10b981' : '#6366f1' }}
                        initial={{ opacity: 0, scale: 0, x: '50%', y: '50%' }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                          x: `calc(50% + ${Math.cos((i * 45 * Math.PI) / 180) * 80}px)`,
                          y: `calc(50% + ${Math.sin((i * 45 * Math.PI) / 180) * 80}px)`
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    ))}
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">You're Hired!</h4>
                  <p className="text-slate-500 mt-2">Your optimized resume is ready to win interviews.</p>
                  
                  <button 
                    onClick={onClose}
                    className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    Get Started <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
