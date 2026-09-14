import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  Bell, 
  Plus, 
  Moon, 
  Sun, 
  ChevronRight, 
  UserPlus, 
  FilePlus, 
  SlidersHorizontal 
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  openCommandPalette: () => void;
  toggleMobileSidebar: () => void;
  onNewContact: () => void;
  onNewDeal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  isDarkMode,
  setIsDarkMode,
  openCommandPalette,
  toggleMobileSidebar,
  onNewContact,
  onNewDeal,
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const titles: Record<ActiveTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Executive Overview', subtitle: 'Pipeline velocity and revenue performance' },
    contacts: { title: 'Contacts Directory', subtitle: 'Prospects, active leads, and accounts' },
    companies: { title: 'Organizations', subtitle: 'Client companies and enterprise accounts' },
    deals: { title: 'Deals & Pipeline', subtitle: 'Kanban board across deal qualification stages' },
    activities: { title: 'Activity Timeline', subtitle: 'Recent calls, meetings, notes, and emails' },
    reports: { title: 'Forecasting & Reports', subtitle: 'Historical revenue pacing and conversions' },
    settings: { title: 'Workspace Settings', subtitle: 'Team permissions, custom stages, and CRM config' },
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header 
      id="app-main-header"
      className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 border-b backdrop-blur-md transition-colors
        bg-white/80 border-stone-200/80 
        dark:bg-neutral-900/80 dark:border-neutral-800"
    >
      {/* Left: Mobile trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-sidebar-toggle-btn"
          onClick={toggleMobileSidebar}
          aria-label="Toggle navigation menu"
          className="lg:hidden p-1.5 -ml-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-stone-400 dark:text-neutral-500 hidden sm:inline">CRM</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-neutral-600 hidden sm:inline" />
          <span className="font-semibold text-stone-900 dark:text-neutral-100 text-sm">
            {current.title}
          </span>
        </div>
      </div>

      {/* Right: Search, Theme, Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Bar */}
        <button
          id="header-command-palette-btn"
          onClick={openCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border transition-all
            bg-stone-100/70 hover:bg-stone-100 border-stone-200/80 text-stone-500 hover:text-stone-800
            dark:bg-neutral-800/70 dark:hover:bg-neutral-800 dark:border-neutral-700/80 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <Search className="w-3.5 h-3.5 text-stone-400" />
          <span className="hidden md:inline">Search contacts, deals, companies...</span>
          <span className="md:hidden">Search...</span>
          <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-neutral-700 font-mono text-stone-500 dark:text-neutral-300 border border-stone-200 dark:border-neutral-600">
            ⌘K
          </kbd>
        </button>

        {/* Dark mode button */}
        <button
          id="header-theme-toggle-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
          className="p-1.5 rounded-lg border border-stone-200/70 hover:bg-stone-100 text-stone-600
            dark:border-neutral-800 dark:hover:bg-neutral-800 dark:text-neutral-300 transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          id="header-notifications-btn"
          onClick={() => setHasUnread(false)}
          aria-label="Notifications"
          className="relative p-1.5 rounded-lg border border-stone-200/70 hover:bg-stone-100 text-stone-600
            dark:border-neutral-800 dark:hover:bg-neutral-800 dark:text-neutral-300 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {hasUnread && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-neutral-900" />
          )}
        </button>

        {/* Add Record Dropdown */}
        <div className="relative">
          <button
            id="header-add-record-btn"
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white
              bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Record</span>
          </button>

          {showAddMenu && (
            <div
              id="header-add-dropdown"
              className="absolute right-0 top-full mt-1.5 w-44 p-1 rounded-xl border shadow-xl z-50
                bg-white border-stone-200 text-stone-900
                dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                id="header-add-deal-action"
                onClick={() => {
                  setShowAddMenu(false);
                  onNewDeal();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg hover:bg-stone-100 dark:hover:bg-neutral-700/70 text-left transition-colors font-medium"
              >
                <FilePlus className="w-4 h-4 text-indigo-500" />
                <span>Create New Deal</span>
              </button>
              <button
                id="header-add-contact-action"
                onClick={() => {
                  setShowAddMenu(false);
                  onNewContact();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg hover:bg-stone-100 dark:hover:bg-neutral-700/70 text-left transition-colors font-medium"
              >
                <UserPlus className="w-4 h-4 text-emerald-500" />
                <span>Add Contact</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
