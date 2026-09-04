import React, { useEffect } from 'react';
import { Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopbarProps {
  onOpenCommandPalette: () => void;
}

export function Topbar({ onOpenCommandPalette }: TopbarProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenCommandPalette]);

  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-dash-border bg-dash-bg/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
      <div className="flex-1" />
      
      {/* Search trigger */}
      <div className="flex-1 flex justify-center max-w-md w-full px-4">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center justify-between w-full h-10 px-4 bg-dash-card border border-dash-border rounded-xl text-sm text-dash-text-secondary hover:border-dash-accent/50 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search size={16} className="text-dash-text-secondary group-hover:text-dash-accent transition-colors" />
            <span>Search anything...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-dash-secondary rounded text-xs font-medium text-dash-text-secondary border border-dash-border">
            <span className="text-[10px]">⌘</span> K
          </kbd>
        </button>
      </div>

      <div className="flex-1 flex justify-end items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-dash-text-secondary hover:text-dash-text-primary hover:bg-dash-secondary rounded-full transition-colors">
          <Bell size={20} />
          {/* Notification Dot */}
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-dash-accent rounded-full border-2 border-dash-bg"
          />
        </button>

        {/* Profile Dropdown Trigger (Simple for now) */}
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img 
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Abhijit&backgroundColor=F0F0EA" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-dash-border"
          />
        </button>
      </div>
    </header>
  );
}
