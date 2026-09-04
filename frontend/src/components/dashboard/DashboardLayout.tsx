import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dash-bg text-dash-text-primary overflow-hidden font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Topbar onOpenCommandPalette={() => setCmdPaletteOpen(true)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
      
      <CommandPalette 
        isOpen={cmdPaletteOpen} 
        onClose={() => setCmdPaletteOpen(false)} 
      />
    </div>
  );
}
