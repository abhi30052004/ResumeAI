import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  Search, 
  Briefcase, 
  TrendingUp, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
  ShieldAlert,
  Building,
  FolderKanban,
  MessageSquare
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/employees', label: 'Employees', icon: Users },
  { path: '/admin/managers', label: 'Managers', icon: ShieldAlert },
  { path: '/admin/clients', label: 'Clients', icon: Building },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
];

const managerNavItems = [
  { path: '/manager', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/manager/team', label: 'My Team', icon: Users },
  { path: '/manager/projects', label: 'Projects', icon: FolderKanban },
  { path: '/manager/jds', label: 'Job Descriptions', icon: FileText },
  { path: '/manager/applications', label: 'Applications', icon: Briefcase },
  { path: '/manager/messages', label: 'Messages', icon: MessageSquare },
];

const employeeNavItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/dashboard/resume', label: 'My Resume', icon: FileText },
  { path: '/dashboard/opportunities', label: 'Opportunities', icon: Search },
  { path: '/dashboard/applications', label: 'My Applications', icon: Briefcase },
  { path: '/dashboard/projects', label: 'My Projects', icon: FolderKanban },
  { path: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
];

const bottomNavItems = [
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
  { path: '/dashboard/help', label: 'Help & Support', icon: HelpCircle },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const toggleCollapsed = () => setCollapsed(!collapsed);

  let navItems = employeeNavItems;
  if (user?.role === 'admin') navItems = adminNavItems;
  if (user?.role === 'manager') navItems = managerNavItems;

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-screen sticky top-0 left-0 bg-dash-bg border-r border-dash-border flex flex-col z-20 shrink-0"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-dash-border">
        <AnimatePresence mode="popLayout">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
            >
              <div className="w-8 h-8 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-bold">
                T
              </div>
              <span className="font-semibold text-dash-text-primary text-lg tracking-tight">AI Talent</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {collapsed && (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-bold">
                T
              </div>
            </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapsed}
        className="absolute -right-3 top-20 bg-white border border-dash-border rounded-full p-1 text-dash-text-secondary hover:text-dash-text-primary hover:bg-dash-secondary transition-colors shadow-sm z-50"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          // For the root dashboard/manager/admin paths, do exact match. For sub-pages, use startsWith
          const isActive = item.path === '/dashboard' || item.path === '/admin' || item.path === '/manager'
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard' || item.path === '/admin' || item.path === '/manager'}
              className={twMerge(
                clsx(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group overflow-hidden whitespace-nowrap",
                  isActive ? "text-dash-accent font-medium" : "text-dash-text-secondary hover:text-dash-text-primary hover:bg-dash-secondary/50",
                  collapsed && "justify-center px-0"
                )
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-dash-accent/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-dash-accent rounded-r-full"
                />
              )}
              
              <item.icon size={20} className={clsx("shrink-0 relative z-10", isActive && "text-dash-accent")} />
              
              <AnimatePresence mode="popLayout">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="relative z-10 text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Nav */}
      <div className="p-3 border-t border-dash-border flex flex-col gap-1">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => twMerge(
              clsx(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group overflow-hidden whitespace-nowrap",
                isActive ? "text-dash-accent font-medium" : "text-dash-text-secondary hover:text-dash-text-primary hover:bg-dash-secondary/50",
                collapsed && "justify-center px-0"
              )
            )}
          >
            <item.icon size={20} className="shrink-0" />
            <AnimatePresence mode="popLayout">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
        
        {/* Profile */}
        <div className={clsx("mt-4 flex flex-col gap-2 border-t border-dash-border pt-4", collapsed && "items-center")}>
          <div className={clsx("flex items-center gap-3 px-2 py-2 overflow-hidden whitespace-nowrap", collapsed && "justify-center px-0")}>
            <img 
              src={user?.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.full_name || 'User'}&backgroundColor=F0F0EA`} 
              alt="Profile" 
              className="w-9 h-9 rounded-full bg-dash-secondary border border-dash-border shrink-0"
            />
            <AnimatePresence mode="popLayout">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col"
                >
                  <span className="text-sm font-medium text-dash-text-primary">{user?.full_name || 'User'}</span>
                  <span className="text-xs text-dash-text-secondary capitalize">{user?.role || 'Employee'}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={logout}
            className={clsx("flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors group overflow-hidden whitespace-nowrap w-full", collapsed && "justify-center px-0")}
          >
            <LogOut size={20} className="shrink-0" />
            <AnimatePresence mode="popLayout">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm font-medium"
                >
                  Log out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
