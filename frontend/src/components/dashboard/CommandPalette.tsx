import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, FileText, Briefcase, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const commands = [
  { id: 'analyze', icon: Sparkles, label: 'Analyze Resume', path: '/dashboard/analysis', description: 'Get your AI score' },
  { id: 'matches', icon: Briefcase, label: 'Open Job Matches', path: '/dashboard/matches', description: 'See jobs tailored to you' },
  { id: 'edit', icon: FileText, label: 'Edit Resume', path: '/dashboard/resume', description: 'Make changes to your profile' },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCommand = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dash-bg/60 backdrop-blur-sm z-50"
          />

          {/* Palette */}
          <div className="fixed inset-0 pointer-events-none z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-xl bg-dash-card rounded-2xl shadow-2xl border border-dash-border overflow-hidden pointer-events-auto"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 h-16 border-b border-dash-border">
                <Search className="text-dash-text-secondary" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search PROFILE IQ..."
                  className="flex-1 bg-transparent border-none outline-none text-dash-text-primary placeholder:text-dash-text-secondary/70 text-lg"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-dash-secondary rounded text-xs font-medium text-dash-text-secondary">
                  ESC
                </kbd>
              </div>

              {/* Commands List */}
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                <div className="px-3 py-2 text-xs font-semibold text-dash-text-secondary uppercase tracking-wider">
                  Suggestions
                </div>
                {commands.map((command, idx) => (
                  <button
                    key={command.id}
                    onClick={() => handleCommand(command.path)}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-dash-secondary/50 text-left transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-dash-bg flex items-center justify-center text-dash-text-secondary group-hover:text-dash-accent group-hover:bg-dash-accent/10 transition-colors">
                      <command.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-dash-text-primary group-hover:text-dash-accent transition-colors">
                        {command.label}
                      </div>
                      <div className="text-xs text-dash-text-secondary">
                        {command.description}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-dash-text-secondary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </button>
                ))}
              </div>

              <div className="px-4 py-3 bg-dash-secondary/30 border-t border-dash-border flex items-center justify-between text-xs text-dash-text-secondary">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><kbd className="bg-dash-secondary px-1.5 py-0.5 rounded border border-dash-border">↑</kbd><kbd className="bg-dash-secondary px-1.5 py-0.5 rounded border border-dash-border">↓</kbd> Navigate</span>
                  <span className="flex items-center gap-1"><kbd className="bg-dash-secondary px-1.5 py-0.5 rounded border border-dash-border">↵</kbd> Open</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
