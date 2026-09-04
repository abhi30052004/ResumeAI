import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fast loading simulation
    const intervals = [0, 25, 50, 75, 100];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < intervals.length) {
        setProgress(intervals[currentIndex]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 800); // Wait for exit animation
        }, 300);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#F7F7F2] overflow-hidden"
          exit={{ 
            clipPath: 'inset(0 0 100% 0)', // Slide up transition
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold tracking-tighter text-[#111111]"
            >
              ABH
            </motion.h1>
            
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#666666]">
                Loading Experience
              </span>
              <div className="flex items-center gap-4">
                <div className="w-32 h-[1px] bg-[#E5E5DE] relative overflow-hidden">
                  <motion.div 
                    className="absolute top-0 left-0 bottom-0 bg-[#635BFF]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2, ease: "linear" }}
                  />
                </div>
                <span className="text-xs font-mono font-medium text-[#111111] w-8">
                  {progress}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
