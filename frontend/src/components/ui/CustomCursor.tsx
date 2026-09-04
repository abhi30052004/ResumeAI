import React, { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };
    
    const render = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(render);
    };
    
    requestAnimationFrame(render);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const onMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };
    const onMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
      if (dotRef.current) dotRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef}
        className={`hidden md:flex fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] transition-all duration-300 ease-out items-center justify-center will-change-transform ${
          isHovering 
            ? 'scale-[1.8] bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30' 
            : 'scale-100 border-2 border-indigo-500/50'
        }`}
        style={{ left: 0, top: 0, opacity: 1 }}
      />
      <div 
        ref={dotRef}
        className={`hidden md:block fixed top-0 left-0 w-2 h-2 bg-indigo-600 rounded-full pointer-events-none z-[10000] transition-opacity duration-300 will-change-transform ${
          isHovering ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ left: 0, top: 0, opacity: 1 }}
      />
    </>
  );
}
