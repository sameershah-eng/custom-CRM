/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * ARCHITECTURAL OVERVIEW & DESIGN DECISIONS:
 * 
 * 1. Aesthetic Archetype:
 *    - Modeled on Linear, Attio, and Notion: soft neutral background canvas (stone-50 in light mode,
 *      neutral-950 in dark mode), single confident indigo accent, high-contrast typography,
 *      and mathematically nested rounded corners.
 * 
 * 2. Centralized State Architecture:
 *    - All relational CRM records (deals, contacts, companies, activities) are managed in top-level
 *      reactive state so mutations (moving kanban stages, posting notes in drawer, creating records)
 *      immediately synchronize live across the Dashboard metrics, Kanban columns, and timeline feeds.
 * 
 * 3. Interaction Mechanics:
 *    - Kanban drag-and-drop utilizes HTML5 drag events with visual drop-targets and stage calculation.
 *    - Detail drawer acts as a contextual overlay that works symmetrically across deals, contacts,
 *      and organizations with real-time note creation.
 *    - Global Command Palette (Cmd+K / Ctrl+K) provides unified fuzzy jump navigation and quick actions.
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ContactsView } from './components/ContactsView';
import { DealsKanbanView } from './components/DealsKanbanView';
import { CompaniesView } from './components/CompaniesView';
import { ActivitiesView } from './components/ActivitiesView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { DetailDrawer } from './components/DetailDrawer';
import { CommandPalette } from './components/CommandPalette';
import { NewDealModal, NewContactModal } from './components/Modals';

import { ActiveTab, SelectedRecord, Deal, Contact, Company, Activity, DealStage } from './types';
import { MOCK_CONTACTS, MOCK_COMPANIES, MOCK_DEALS, MOCK_ACTIVITIES } from './mockData';

export default function App() {
  // Navigation & Viewport State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Command Palette & Detail Drawer
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SelectedRecord | null>(null);

  // Modals for Record Creation
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [newDealDefaultStage, setNewDealDefaultStage] = useState<DealStage>('Lead');
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);

  // CRM Reactive State
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);

  // Dark mode effect on root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Keyboard shortcut listener for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Kanban Stage Mutation Handler
  const handleMoveDealStage = (dealId: string, newStage: DealStage) => {
    let dealName = '';
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          dealName = d.name;
          const newProb = newStage === 'Won' ? 100 : newStage === 'Lost' ? 0 : newStage === 'Negotiation' ? 80 : 50;
          return { ...d, stage: newStage, probability: newProb };
        }
        return d;
      })
    );

    // Automatically record activity event
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      type: 'stage_change',
      title: `Opportunity advanced to ${newStage}`,
      description: `${dealName || 'Deal'} updated to stage "${newStage}". Quota forecasts adjusted.`,
      timestamp: 'Just now',
      author: {
        name: 'Jordan Miller',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },
      relatedTo: {
        type: 'deal',
        id: dealId,
        name: dealName || 'Deal',
      },
    };
    setActivities((prev) => [newAct, ...prev]);

    // If currently open in drawer, update reference
    if (selectedRecord?.type === 'deal' && selectedRecord.data.id === dealId) {
      setSelectedRecord((prev) =>
        prev
          ? {
              ...prev,
              data: {
                ...(prev.data as Deal),
                stage: newStage,
              },
            }
          : null
      );
    }
  };

  // Add Note from Detail Drawer
  const handleAddNote = (relatedId: string, relatedType: 'contact' | 'deal' | 'company', noteText: string) => {
    let relatedName = '';
    if (relatedType === 'deal') {
      relatedName = deals.find((d) => d.id === relatedId)?.name || 'Deal';
    } else if (relatedType === 'contact') {
      relatedName = contacts.find((c) => c.id === relatedId)?.name || 'Contact';
    } else {
      relatedName = companies.find((c) => c.id === relatedId)?.name || 'Company';
    }

    const newAct: Activity = {
      id: `act-${Date.now()}`,
      type: 'note',
      title: 'Note logged by Jordan Miller',
      description: noteText,
      timestamp: 'Just now',
      author: {
        name: 'Jordan Miller',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },
      relatedTo: {
        type: relatedType,
        id: relatedId,
        name: relatedName,
      },
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Create new Deal handler
  const handleSaveNewDeal = (newDealData: Omit<Deal, 'id'>) => {
    const createdDeal: Deal = {
      ...newDealData,
      id: `d-${Date.now()}`,
    };
    setDeals((prev) => [createdDeal, ...prev]);

    const newAct: Activity = {
      id: `act-${Date.now()}`,
      type: 'meeting',
      title: `Created opportunity: ${createdDeal.name}`,
      description: `Targeting $${createdDeal.value.toLocaleString()} in ${createdDeal.stage} stage.`,
      timestamp: 'Just now',
      author: createdDeal.owner,
      relatedTo: {
        type: 'deal',
        id: createdDeal.id,
        name: createdDeal.name,
      },
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Create new Contact handler
  const handleSaveNewContact = (newContactData: Omit<Contact, 'id'>) => {
    const createdContact: Contact = {
      ...newContactData,
      id: `c-${Date.now()}`,
    };
    setContacts((prev) => [createdContact, ...prev]);
  };

  return (
    <div className="min-h-screen w-full flex bg-stone-100/70 text-stone-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors selection:bg-indigo-500/20 selection:text-indigo-600">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        openCommandPalette={() => setIsCommandPaletteOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        closeMobile={() => setIsMobileSidebarOpen(false)}
        dealsCount={deals.length}
        contactsCount={contacts.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          openCommandPalette={() => setIsCommandPaletteOpen(true)}
          toggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onNewContact={() => setIsNewContactOpen(true)}
          onNewDeal={() => {
            setNewDealDefaultStage('Lead');
            setIsNewDealOpen(true);
          }}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              deals={deals}
              contacts={contacts}
              activities={activities}
              onSelectRecord={setSelectedRecord}
              goToTab={setActiveTab}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsView
              contacts={contacts}
              onSelectRecord={setSelectedRecord}
              onAddContact={() => setIsNewContactOpen(true)}
            />
          )}

          {activeTab === 'deals' && (
            <DealsKanbanView
              deals={deals}
              onMoveDealStage={handleMoveDealStage}
              onSelectRecord={setSelectedRecord}
              onAddDeal={(stage) => {
                setNewDealDefaultStage(stage || 'Lead');
                setIsNewDealOpen(true);
              }}
            />
          )}

          {activeTab === 'companies' && (
            <CompaniesView
              companies={companies}
              onSelectRecord={setSelectedRecord}
            />
          )}

          {activeTab === 'activities' && (
            <ActivitiesView
              activities={activities}
              deals={deals}
              contacts={contacts}
              onSelectRecord={setSelectedRecord}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView deals={deals} />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Slide-over Detail Drawer */}
      <DetailDrawer
        selectedRecord={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        activities={activities}
        onAddNote={handleAddNote}
      />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        contacts={contacts}
        deals={deals}
        companies={companies}
        onSelectRecord={setSelectedRecord}
        onNavigateTab={setActiveTab}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onNewDeal={() => {
          setNewDealDefaultStage('Lead');
          setIsNewDealOpen(true);
        }}
        onNewContact={() => setIsNewContactOpen(true)}
      />

      {/* New Opportunity Modal */}
      <NewDealModal
        isOpen={isNewDealOpen}
        onClose={() => setIsNewDealOpen(false)}
        defaultStage={newDealDefaultStage}
        onSave={handleSaveNewDeal}
      />

      {/* New Contact Modal */}
      <NewContactModal
        isOpen={isNewContactOpen}
        onClose={() => setIsNewContactOpen(false)}
        onSave={handleSaveNewContact}
      />
    </div>
  );
}
