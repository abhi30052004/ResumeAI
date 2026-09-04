import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'text'>('default');
  const [cursorText, setCursorText] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const cursorDataElement = target.closest('[data-cursor]');
      if (cursorDataElement) {
        setCursorState('text');
        setCursorText(cursorDataElement.getAttribute('data-cursor') || '');
        return;
      }

      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive')
      ) {
        setCursorState('hover');
      } else {
        setCursorState('default');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
      animate={{
        x: mousePosition.x - (cursorState === 'text' ? 40 : cursorState === 'hover' ? 24 : 6),
        y: mousePosition.y - (cursorState === 'text' ? 40 : cursorState === 'hover' ? 24 : 6),
        width: cursorState === 'text' ? 80 : cursorState === 'hover' ? 48 : 12,
        height: cursorState === 'text' ? 80 : cursorState === 'hover' ? 48 : 12,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 28,
        mass: 0.5,
      }}
    >
      <motion.div 
        className="w-full h-full rounded-full bg-[#111111] flex items-center justify-center overflow-hidden shadow-sm"
        animate={{
          backgroundColor: cursorState === 'text' ? '#635BFF' : '#111111'
        }}
      >
        <AnimatePresence>
          {cursorState === 'text' && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white text-[10px] font-bold tracking-widest text-center px-2 leading-tight"
            >
              {cursorText}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
