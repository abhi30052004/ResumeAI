import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../utils/cn';

export function MagneticButton({ 
  children, 
  className,
  variant = 'primary',
  ...props 
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> & { variant?: 'primary' | 'secondary' }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Spring physics for magnetic pull
  const x = useSpring(0, { stiffness: 400, damping: 30, mass: 0.5 });
  const y = useSpring(0, { stiffness: 400, damping: 30, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Magnetic pull limit
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX * 0.2);
    y.set(distanceY * 0.2);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      style={{ x, y }}
      className={cn(
        "relative flex items-center justify-center overflow-hidden whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF]",
        className
      )}
      {...props}
    >
      {/* Content wrapper to slightly offset against the button pull for parallax */}
      <motion.div 
        style={{ x: useTransform(x, v => v * 0.5), y: useTransform(y, v => v * 0.5) }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        {children}
      </motion.div>
    </motion.button>
  );
}
