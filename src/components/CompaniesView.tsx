import React, { useState } from 'react';
import { Building2, Globe, Users, DollarSign, ExternalLink, Search, ArrowUpRight } from 'lucide-react';
import { Company, SelectedRecord } from '../types';

interface CompaniesViewProps {
  companies: Company[];
  onSelectRecord: (record: SelectedRecord) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({
  companies,
  onSelectRecord,
}) => {
  const [search, setSearch] = useState('');

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase()) ||
    c.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="companies-view-container" className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search organizations by name, industry, or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border bg-white border-stone-200 text-stone-900 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="text-xs text-stone-500 dark:text-neutral-400">
          Showing <span className="font-semibold text-stone-900 dark:text-neutral-100">{filtered.length}</span> companies
        </div>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((company) => (
          <div
            key={company.id}
            id={`company-card-${company.id}`}
            onClick={() => onSelectRecord({ type: 'company', data: company })}
            className="p-4 rounded-xl border bg-white border-stone-200/80 shadow-2xs hover:shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700/80 dark:bg-neutral-900 dark:border-neutral-800 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-stone-100 to-stone-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center font-bold text-stone-700 dark:text-neutral-200 text-sm ring-1 ring-stone-200 dark:ring-neutral-700">
                  {company.name.slice(0, 2).toUpperCase()}
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                  company.tier === 'Enterprise'
                    ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                    : 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
                }`}>
                  {company.tier}
                </span>
              </div>

              <h3 className="font-semibold text-sm text-stone-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {company.name}
              </h3>
              <p className="text-xs text-stone-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                <Globe className="w-3 h-3 text-stone-400" />
                <span>{company.domain}</span>
              </p>

              <div className="mt-3 space-y-1.5 text-xs text-stone-600 dark:text-neutral-300">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 dark:text-neutral-500">Industry</span>
                  <span>{company.industry}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 dark:text-neutral-500">Team Size</span>
                  <span>{company.size}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-stone-900 dark:text-neutral-100">
                ${company.arr.toLocaleString()} ARR
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                {company.openDeals} deals <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
