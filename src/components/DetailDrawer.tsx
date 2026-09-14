import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  ExternalLink, 
  Tag, 
  Send, 
  Clock, 
  User, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  Edit3,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { SelectedRecord, Deal, Contact, Company, Activity } from '../types';

interface DetailDrawerProps {
  selectedRecord: SelectedRecord | null;
  onClose: () => void;
  activities: Activity[];
  onAddNote: (relatedId: string, relatedType: 'contact' | 'deal' | 'company', text: string) => void;
  onUpdateStage?: (dealId: string, stage: any) => void;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  selectedRecord,
  onClose,
  activities,
  onAddNote,
  onUpdateStage,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'notes' | 'properties'>('timeline');
  const [newNote, setNewNote] = useState('');
  const [quickActionNotice, setQuickActionNotice] = useState<string | null>(null);

  if (!selectedRecord) return null;

  const { type, data } = selectedRecord;
  const isDeal = type === 'deal';
  const isContact = type === 'contact';
  const isCompany = type === 'company';

  const dealData = isDeal ? (data as Deal) : null;
  const contactData = isContact ? (data as Contact) : null;
  const companyData = isCompany ? (data as Company) : null;

  const recordId = data.id;
  const recordName = isDeal ? dealData!.name : isContact ? contactData!.name : companyData!.name;

  // Filter activities for this record
  const recordActivities = activities.filter(
    a => a.relatedTo.id === recordId || (isDeal && dealData && a.relatedTo.name === dealData.company)
  );

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(recordId, type, newNote.trim());
    setNewNote('');
    setQuickActionNotice('Note recorded on activity feed');
    setTimeout(() => setQuickActionNotice(null), 3000);
  };

  const triggerAction = (actionName: string) => {
    setQuickActionNotice(`${actionName} action triggered for ${recordName}`);
    setTimeout(() => setQuickActionNotice(null), 3000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        id="detail-drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Container */}
      <aside
        id="detail-drawer-panel"
        className="fixed top-0 bottom-0 right-0 z-50 w-full sm:max-w-xl md:max-w-2xl border-l flex flex-col shadow-2xl transition-transform animate-in slide-in-from-right duration-200
          bg-white border-stone-200 text-stone-900
          dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200/80 dark:border-neutral-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-300">
                {type}
              </span>
              {isDeal && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                  {dealData?.stage} Stage
                </span>
              )}
              {isContact && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {contactData?.status}
                </span>
              )}
            </div>

            <h2 className="text-lg font-bold text-stone-900 dark:text-neutral-100 leading-tight">
              {recordName}
            </h2>

            <p className="text-xs text-stone-500 dark:text-neutral-400 mt-0.5">
              {isDeal && `Company: ${dealData?.company} • Expected close: ${dealData?.expectedCloseDate}`}
              {isContact && `${contactData?.title} at ${contactData?.company}`}
              {isCompany && `${companyData?.industry} • ${companyData?.size} employees`}
            </p>
          </div>

          <button
            id="detail-drawer-close-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close detail panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Toast */}
        {quickActionNotice && (
          <div className="px-6 py-2 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-medium border-b border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
            <span>{quickActionNotice}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        )}

        {/* Action Buttons Toolbar */}
        <div className="px-4 sm:px-6 py-3 border-b border-stone-200/60 dark:border-neutral-800/80 bg-stone-50/50 dark:bg-neutral-900/50 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => triggerAction('Email client')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs font-medium bg-white dark:bg-neutral-800 hover:bg-stone-100 dark:hover:bg-neutral-700/80 text-stone-700 dark:text-neutral-200 shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            <span>Send Email</span>
          </button>
          <button
            onClick={() => triggerAction('Log phone call')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs font-medium bg-white dark:bg-neutral-800 hover:bg-stone-100 dark:hover:bg-neutral-700/80 text-stone-700 dark:text-neutral-200 shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            <span>Log Call</span>
          </button>
          <button
            onClick={() => triggerAction('Schedule sync')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 text-xs font-medium bg-white dark:bg-neutral-800 hover:bg-stone-100 dark:hover:bg-neutral-700/80 text-stone-700 dark:text-neutral-200 shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Schedule Meeting</span>
          </button>
        </div>

        {/* Primary Meta Stats Bar */}
        <div className="p-4 sm:p-6 grid grid-cols-3 gap-3 border-b border-stone-200/60 dark:border-neutral-800 text-xs">
          <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-neutral-800/50 border border-stone-200/60 dark:border-neutral-800">
            <span className="text-stone-400 dark:text-neutral-500 text-[11px] block">
              {isDeal ? 'Deal Value' : isContact ? 'Pipeline Est.' : 'Annual ARR'}
            </span>
            <span className="text-sm font-bold font-mono text-stone-900 dark:text-neutral-100 mt-0.5 block">
              {isDeal && `$${dealData?.value.toLocaleString()}`}
              {isContact && (contactData?.value ? `$${contactData.value.toLocaleString()}` : '$0')}
              {isCompany && `$${companyData?.arr.toLocaleString()}`}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-neutral-800/50 border border-stone-200/60 dark:border-neutral-800">
            <span className="text-stone-400 dark:text-neutral-500 text-[11px] block">
              Owner
            </span>
            <span className="text-xs font-medium text-stone-800 dark:text-neutral-200 mt-1 block truncate">
              {isDeal && dealData?.owner.name}
              {isContact && contactData?.owner.name}
              {isCompany && companyData?.owner}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-neutral-800/50 border border-stone-200/60 dark:border-neutral-800">
            <span className="text-stone-400 dark:text-neutral-500 text-[11px] block">
              {isDeal ? 'Probability' : isContact ? 'Last Touch' : 'Open Deals'}
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
              {isDeal && `${dealData?.probability}% win probability`}
              {isContact && contactData?.lastContacted}
              {isCompany && `${companyData?.openDeals} active`}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-stone-200/80 dark:border-neutral-800 flex items-center gap-6 text-xs">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'timeline'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            Activity Timeline ({recordActivities.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            Notes & Comments
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'properties'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            Attributes
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {/* Quick Note Input Box */}
              <form onSubmit={handlePostNote} className="space-y-2">
                <div className="relative">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log a note, call summary, or next step for this record..."
                    rows={2}
                    className="w-full p-2.5 text-xs rounded-lg border border-stone-200 dark:border-neutral-800 bg-stone-50 dark:bg-neutral-800/40 focus:bg-white dark:focus:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-stone-400"
                  />
                  <div className="flex items-center justify-end mt-1">
                    <button
                      type="submit"
                      disabled={!newNote.trim()}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post Note</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Feed Items */}
              <div className="divide-y divide-stone-100 dark:divide-neutral-800 pt-2">
                {recordActivities.length === 0 ? (
                  <div className="py-8 text-center text-stone-400 dark:text-neutral-500 text-xs">
                    No activity logs recorded yet. Use the box above to log your first update.
                  </div>
                ) : (
                  recordActivities.map((act) => (
                    <div key={act.id} className="py-3 flex items-start gap-3">
                      <img
                        src={act.author.avatar}
                        alt={act.author.name}
                        className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-stone-900 dark:text-neutral-100">
                            {act.author.name}
                          </span>
                          <span className="text-[10px] text-stone-400 dark:text-neutral-500">
                            {act.timestamp}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-stone-800 dark:text-neutral-200 mt-0.5">
                          {act.title}
                        </p>
                        <p className="text-xs text-stone-600 dark:text-neutral-400 mt-1 leading-relaxed">
                          {act.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-stone-200/80 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-800/40 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-stone-800 dark:text-neutral-200">
                  <span>Executive Meeting Notes</span>
                  <span className="text-[10px] text-stone-400">Sep 10</span>
                </div>
                <p className="text-stone-600 dark:text-neutral-400 text-xs leading-relaxed">
                  Key decision maker expressed high intent to sign before fiscal quarter close. Custom security addendum required for multi-cloud deployments.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-stone-200/80 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-800/40 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-stone-800 dark:text-neutral-200">
                  <span>Procurement Pre-screening</span>
                  <span className="text-[10px] text-stone-400">Sep 04</span>
                </div>
                <p className="text-stone-600 dark:text-neutral-400 text-xs leading-relaxed">
                  Budget code verified with VP Finance. Invoicing net-30 confirmed acceptable.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'properties' && (
            <div className="space-y-3 text-xs divide-y divide-stone-100 dark:divide-neutral-800">
              <div className="flex items-center justify-between py-2">
                <span className="text-stone-500 dark:text-neutral-400">Record ID</span>
                <span className="font-mono text-stone-800 dark:text-neutral-200">{recordId}</span>
              </div>
              {isContact && (
                <>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-stone-500 dark:text-neutral-400">Email Address</span>
                    <span className="font-mono text-stone-800 dark:text-neutral-200">{contactData?.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-stone-500 dark:text-neutral-400">Phone</span>
                    <span className="text-stone-800 dark:text-neutral-200">{contactData?.phone}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-stone-500 dark:text-neutral-400">HQ Location</span>
                    <span className="text-stone-800 dark:text-neutral-200">{contactData?.location}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-stone-500 dark:text-neutral-400">Tags</span>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {contactData?.tags.map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-neutral-800 text-[10px]">{t}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {isDeal && (
                <>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-stone-500 dark:text-neutral-400">Primary Contact</span>
                    <span className="text-stone-800 dark:text-neutral-200">{dealData?.contactName} ({dealData?.contactEmail})</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-stone-500 dark:text-neutral-400">Deal Priority</span>
                    <span className="font-semibold text-stone-800 dark:text-neutral-200">{dealData?.priority}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-stone-500 dark:text-neutral-400">Target Close</span>
                    <span className="text-stone-800 dark:text-neutral-200">{dealData?.expectedCloseDate}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
