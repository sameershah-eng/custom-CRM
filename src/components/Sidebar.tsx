import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Kanban, 
  Activity as ActivityIcon, 
  BarChart3, 
  Settings, 
  ChevronDown, 
  ChevronsUpDown, 
  Command, 
  Sparkles,
  LogOut,
  Moon,
  Sun,
  X
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  openCommandPalette: () => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
  dealsCount: number;
  contactsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  openCommandPalette,
  isMobileOpen,
  closeMobile,
  dealsCount,
  contactsCount
}) => {
  const [currentWorkspace, setCurrentWorkspace] = useState('Acme Growth Ops');
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  const workspaces = [
    { name: 'Acme Growth Ops', tier: 'Enterprise Tier', active: true },
    { name: 'Orbit Ventures Seed', tier: 'Venture Portfolio', active: false },
    { name: 'ScaleOps Lab Staging', tier: 'Internal Sandbox', active: false },
  ];

  interface NavItem {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Contacts', icon: Users, badge: contactsCount },
    { id: 'companies', label: 'Companies', icon: Building2, badge: 8 },
    { id: 'deals', label: 'Deals & Pipeline', icon: Kanban, badge: dealsCount },
    { id: 'activities', label: 'Activities', icon: ActivityIcon },
    { id: 'reports', label: 'Reports & Forecast', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          id="sidebar-mobile-backdrop"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r transition-transform duration-200 ease-in-out lg:static lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-stone-50/90 border-stone-200/80 text-stone-900 
          dark:bg-neutral-900/95 dark:border-neutral-800 dark:text-neutral-100`}
      >
        {/* Workspace Switcher */}
        <div className="p-3 border-b border-stone-200/60 dark:border-neutral-800">
          <div className="relative">
            <button
              id="workspace-switcher-button"
              onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors
                hover:bg-stone-200/60 dark:hover:bg-neutral-800/80 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-semibold text-sm shadow-xs flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold tracking-tight leading-tight truncate text-stone-900 dark:text-neutral-100">
                    {currentWorkspace}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-neutral-400 leading-tight">
                    Scale Team • Pro
                  </p>
                </div>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-stone-400 dark:text-neutral-500 group-hover:text-stone-600 dark:group-hover:text-neutral-300 flex-shrink-0 ml-1" />
            </button>

            {/* Workspace Dropdown */}
            {workspaceMenuOpen && (
              <div 
                id="workspace-dropdown-menu"
                className="absolute left-0 right-0 top-full mt-1.5 p-1.5 rounded-xl border shadow-lg z-50
                  bg-white border-stone-200 text-stone-900
                  dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
              >
                <p className="px-2 py-1 text-[10px] font-semibold tracking-wider text-stone-400 dark:text-neutral-400 uppercase">
                  Switch Workspace
                </p>
                {workspaces.map((ws) => (
                  <button
                    key={ws.name}
                    id={`workspace-item-${ws.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => {
                      setCurrentWorkspace(ws.name);
                      setWorkspaceMenuOpen(false);
                    }}
                    className={`w-full flex flex-col items-start px-2 py-1.5 rounded-lg text-xs transition-colors
                      ${currentWorkspace === ws.name 
                        ? 'bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-950/50 dark:text-indigo-300' 
                        : 'hover:bg-stone-100 dark:hover:bg-neutral-700/60 text-stone-700 dark:text-neutral-300'}`}
                  >
                    <span>{ws.name}</span>
                    <span className="text-[10px] text-stone-400 dark:text-neutral-400">{ws.tier}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick command palette button in sidebar */}
          <button
            id="sidebar-quick-search"
            onClick={openCommandPalette}
            className="w-full mt-2.5 flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg border transition-all
              bg-white/80 border-stone-200/80 text-stone-500 hover:text-stone-800 hover:border-stone-300
              dark:bg-neutral-800/60 dark:border-neutral-700/60 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:border-neutral-600"
          >
            <span className="flex items-center gap-2">
              <Command className="w-3.5 h-3.5 text-stone-400 dark:text-neutral-400" />
              <span>Quick jump...</span>
            </span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-neutral-700 text-stone-500 dark:text-neutral-300 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <p className="px-2.5 pb-1.5 text-[11px] font-semibold tracking-wider text-stone-400 dark:text-neutral-500 uppercase">
            Platform
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id as ActiveTab);
                  closeMobile();
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all group
                  ${isActive 
                    ? 'bg-stone-900 text-white shadow-xs dark:bg-neutral-100 dark:text-neutral-900' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800/60'}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive 
                      ? 'text-white dark:text-neutral-900' 
                      : 'text-stone-400 group-hover:text-stone-700 dark:text-neutral-500 dark:group-hover:text-neutral-300'
                  }`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
                    isActive
                      ? 'bg-stone-800 text-stone-200 dark:bg-neutral-200 dark:text-neutral-800'
                      : 'bg-stone-200/80 text-stone-600 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Stats Mini Card */}
        <div className="px-3 pb-3">
          <div className="p-3 rounded-xl border bg-white/70 border-stone-200/70 dark:bg-neutral-800/40 dark:border-neutral-800">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-stone-500 dark:text-neutral-400 font-medium">Monthly Target</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">85% Met</span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-neutral-700 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '85%' }} />
            </div>
            <p className="text-[10px] text-stone-400 dark:text-neutral-500 mt-1.5">
              $427k of $500k quota closed
            </p>
          </div>
        </div>

        {/* User Profile & Theme Toggle Footer */}
        <div className="p-3 border-t border-stone-200/60 dark:border-neutral-800 bg-stone-100/60 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Jordan Miller"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-300 dark:ring-neutral-700"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold leading-tight text-stone-900 dark:text-neutral-100 truncate">
                  Jordan Miller
                </p>
                <p className="text-[10px] text-stone-500 dark:text-neutral-400 truncate">
                  Head of Revenue Ops
                </p>
              </div>
            </div>

            {/* Dark mode button */}
            <button
              id="sidebar-theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200/70 
                dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
