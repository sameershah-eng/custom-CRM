import React, { useState } from 'react';
import { Activity, SelectedRecord, Contact, Deal } from '../types';
import { Calendar, Phone, Mail, FileText, CheckCircle2, Search, Filter } from 'lucide-react';

interface ActivitiesViewProps {
  activities: Activity[];
  deals: Deal[];
  contacts: Contact[];
  onSelectRecord: (record: SelectedRecord) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activities,
  deals,
  contacts,
  onSelectRecord,
}) => {
  const [filterType, setFilterType] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = activities.filter(a => {
    const matchesType = filterType === 'all' || a.type === filterType;
    const matchesQuery = !query || 
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase()) ||
      a.relatedTo.name.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div id="activities-view-container" className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity notes, meeting logs, emails..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border bg-white border-stone-200 text-stone-900 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100 placeholder-stone-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {['all', 'meeting', 'call', 'email', 'note', 'stage_change'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                filterType === t
                  ? 'bg-stone-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                  : 'text-stone-500 hover:text-stone-900 dark:text-neutral-400 hover:bg-stone-100 dark:hover:bg-neutral-800'
              }`}
            >
              {t === 'stage_change' ? 'Stage Updates' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white border-stone-200/80 dark:bg-neutral-900 dark:border-neutral-800 divide-y divide-stone-100 dark:divide-neutral-800 p-4">
        {filtered.map((act) => {
          const iconMap = {
            meeting: Calendar,
            call: Phone,
            email: Mail,
            note: FileText,
            stage_change: CheckCircle2,
          };
          const Icon = iconMap[act.type] || FileText;

          return (
            <div key={act.id} className="py-4 first:pt-2 last:pb-2 flex items-start gap-3.5">
              <img
                src={act.author.avatar}
                alt={act.author.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-stone-900 dark:text-neutral-100">
                      {act.author.name}
                    </span>
                    <span className="text-[11px] text-stone-400 dark:text-neutral-500">
                      logged a {act.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 dark:text-neutral-500">
                    {act.timestamp}
                  </span>
                </div>

                <p className="text-xs font-semibold text-stone-800 dark:text-neutral-200 mt-1">
                  {act.title}
                </p>
                <p className="text-xs text-stone-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  {act.description}
                </p>

                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  <span className="text-stone-400">Related to:</span>
                  <button
                    onClick={() => {
                      if (act.relatedTo.type === 'deal') {
                        const d = deals.find(x => x.id === act.relatedTo.id);
                        if (d) onSelectRecord({ type: 'deal', data: d });
                      } else if (act.relatedTo.type === 'contact') {
                        const c = contacts.find(x => x.id === act.relatedTo.id);
                        if (c) onSelectRecord({ type: 'contact', data: c });
                      }
                    }}
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {act.relatedTo.name}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
