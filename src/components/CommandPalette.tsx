import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Users, 
  Kanban, 
  Building2, 
  ArrowRight, 
  Plus, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  Activity, 
  BarChart3, 
  Settings,
  X
} from 'lucide-react';
import { Contact, Deal, Company, SelectedRecord, ActiveTab } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  deals: Deal[];
  companies: Company[];
  onSelectRecord: (record: SelectedRecord) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onToggleTheme: () => void;
  onNewDeal: () => void;
  onNewContact: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  contacts,
  deals,
  companies,
  onSelectRecord,
  onNavigateTab,
  onToggleTheme,
  onNewDeal,
  onNewContact,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter items
  const q = query.toLowerCase().trim();

  // Navigation commands
  const navCommands = [
    { id: 'nav-dash', label: 'Go to Dashboard', icon: LayoutDashboard, action: () => onNavigateTab('dashboard') },
    { id: 'nav-contacts', label: 'Go to Contacts Table', icon: Users, action: () => onNavigateTab('contacts') },
    { id: 'nav-deals', label: 'Go to Deals Pipeline Kanban', icon: Kanban, action: () => onNavigateTab('deals') },
    { id: 'nav-activities', label: 'Go to Activity Stream', icon: Activity, action: () => onNavigateTab('activities') },
    { id: 'nav-reports', label: 'Go to Reports & Forecasting', icon: BarChart3, action: () => onNavigateTab('reports') },
  ].filter(c => !q || c.label.toLowerCase().includes(q));

  // Action commands
  const actionCommands = [
    { id: 'act-new-deal', label: 'Create New Opportunity / Deal', icon: Plus, action: onNewDeal },
    { id: 'act-new-contact', label: 'Add New Contact Record', icon: Plus, action: onNewContact },
    { id: 'act-theme', label: 'Toggle Light / Dark Mode', icon: Sun, action: onToggleTheme },
  ].filter(c => !q || c.label.toLowerCase().includes(q));

  // Records
  const matchedDeals = deals.filter(d => 
    !q || d.name.toLowerCase().includes(q) || d.company.toLowerCase().includes(q)
  ).slice(0, 4);

  const matchedContacts = contacts.filter(c => 
    !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  ).slice(0, 4);

  const matchedCompanies = companies.filter(c => 
    !q || c.name.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q)
  ).slice(0, 3);

  // Flattened list for keyboard selection
  type FlatItem = {
    id: string;
    type: 'nav' | 'action' | 'deal' | 'contact' | 'company';
    label: string;
    sublabel?: string;
    execute: () => void;
  };

  const flatItems: FlatItem[] = [
    ...matchedDeals.map(d => ({
      id: `deal-${d.id}`,
      type: 'deal' as const,
      label: d.name,
      sublabel: `${d.company} • $${d.value.toLocaleString()} (${d.stage})`,
      execute: () => {
        onSelectRecord({ type: 'deal', data: d });
        onClose();
      }
    })),
    ...matchedContacts.map(c => ({
      id: `contact-${c.id}`,
      type: 'contact' as const,
      label: c.name,
      sublabel: `${c.company} • ${c.email}`,
      execute: () => {
        onSelectRecord({ type: 'contact', data: c });
        onClose();
      }
    })),
    ...matchedCompanies.map(comp => ({
      id: `comp-${comp.id}`,
      type: 'company' as const,
      label: comp.name,
      sublabel: `${comp.industry} • ${comp.size} employees`,
      execute: () => {
        onSelectRecord({ type: 'company', data: comp });
        onClose();
      }
    })),
    ...actionCommands.map(a => ({
      id: a.id,
      type: 'action' as const,
      label: a.label,
      execute: () => {
        a.action();
        onClose();
      }
    })),
    ...navCommands.map(n => ({
      id: n.id,
      type: 'nav' as const,
      label: n.label,
      execute: () => {
        n.action();
        onClose();
      }
    })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, flatItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + flatItems.length) % Math.max(1, flatItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatItems[selectedIndex]) {
        flatItems[selectedIndex].execute();
      }
    }
  };

  return (
    <div
      id="command-palette-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 sm:pt-28 px-4 animate-in fade-in"
    >
      <div
        id="command-palette-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150
          bg-white border-stone-200 text-stone-900
          dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200/80 dark:border-neutral-800 gap-3">
          <Search className="w-4 h-4 text-stone-400 dark:text-neutral-400 flex-shrink-0" />
          <input
            ref={inputRef}
            id="command-palette-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search deals, contacts, companies..."
            className="w-full bg-transparent text-sm focus:outline-none placeholder-stone-400 dark:placeholder-neutral-500"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-neutral-800 text-stone-500 dark:text-neutral-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 text-xs divide-y divide-stone-100 dark:divide-neutral-800/60">
          {flatItems.length === 0 ? (
            <div className="p-8 text-center text-stone-400 dark:text-neutral-500">
              No matching records or actions found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {flatItems.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                const iconMap = {
                  deal: Kanban,
                  contact: Users,
                  company: Building2,
                  action: Plus,
                  nav: ArrowRight,
                };
                const Icon = iconMap[item.type];

                return (
                  <button
                    key={item.id}
                    id={`cmd-item-${item.id}`}
                    onClick={() => item.execute()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-stone-100 text-stone-900 dark:bg-neutral-800 dark:text-neutral-100'
                        : 'text-stone-700 hover:bg-stone-50 dark:text-neutral-300 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                        item.type === 'deal' 
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                          : item.type === 'contact'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : item.type === 'company'
                          ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400'
                          : 'bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-xs leading-snug truncate">
                          {item.label}
                        </p>
                        {item.sublabel && (
                          <p className="text-[11px] text-stone-400 dark:text-neutral-500 truncate">
                            {item.sublabel}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-stone-400">
                      <span className="capitalize px-1.5 py-0.2 rounded bg-stone-100 dark:bg-neutral-800">
                        {item.type}
                      </span>
                      {isSelected && <ArrowRight className="w-3 h-3 text-indigo-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-stone-50 dark:bg-neutral-800/60 border-t border-stone-200/80 dark:border-neutral-800 flex items-center justify-between text-[11px] text-stone-400 dark:text-neutral-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Dismiss</span>
          </div>
          <span>Custom CRM QuickJump</span>
        </div>
      </div>
    </div>
  );
};
