import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'text' | 'drag'>('default');
  const [cursorText, setCursorText] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Smooth springs for the follower circle
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const cursorDataElement = target.closest('[data-cursor]');
      if (cursorDataElement) {
        const type = cursorDataElement.getAttribute('data-cursor');
        if (type === 'DRAG') {
          setCursorState('drag');
        } else {
          setCursorState('text');
          setCursorText(type || '');
        }
        return;
      }

      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a')
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
  }, [isMobile, cursorX, cursorY]);

  if (isMobile) return null;

  const isText = cursorState === 'text';
  const isDrag = cursorState === 'drag';
  const isHover = cursorState === 'hover';

  return (
    <>
      {/* 1. Small central dot (instant tracking) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#111111] rounded-full pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          opacity: isText || isDrag ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />

      {/* 2. Large follower circle (spring tracking) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] flex items-center justify-center border border-[#111111]/20 rounded-full"
        style={{ x: cursorX, y: cursorY }}
        animate={{
          x: cursorX.get() - (isText || isDrag ? 40 : isHover ? 24 : 16),
          y: cursorY.get() - (isText || isDrag ? 40 : isHover ? 24 : 16),
          width: isText || isDrag ? 80 : isHover ? 48 : 32,
          height: isText || isDrag ? 80 : isHover ? 48 : 32,
          backgroundColor: isText || isDrag ? '#635BFF' : 'transparent',
          borderColor: isText || isDrag ? '#635BFF' : 'rgba(17,17,17,0.2)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <AnimatePresence mode="wait">
          {isText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-white text-[9px] font-bold tracking-widest text-center px-2 leading-tight uppercase"
            >
              {cursorText}
            </motion.span>
          )}
          {isDrag && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-white text-[10px] font-bold tracking-widest text-center px-2 uppercase"
            >
              DRAG
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
