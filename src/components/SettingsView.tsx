import React from 'react';
import { Shield, Bell, Users, Database, Sliders, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div id="settings-view-container" className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 text-xs">
      <div className="p-5 rounded-xl border bg-white border-stone-200/80 dark:bg-neutral-900 dark:border-neutral-800 space-y-4">
        <h3 className="text-sm font-semibold text-stone-900 dark:text-neutral-100 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-500" />
          Pipeline Stages & Win Probability Config
        </h3>
        <p className="text-stone-500 dark:text-neutral-400">
          Default deal stages, gating validation rules, and automated quota probability scoring.
        </p>

        <div className="space-y-2 pt-2">
          {[
            { stage: 'Lead', prob: '20%', req: 'Initial Discovery Call', color: 'bg-slate-500' },
            { stage: 'Qualified', prob: '40%', req: 'BANT Budget Verified', color: 'bg-sky-500' },
            { stage: 'Proposal', prob: '60%', req: 'Technical Architecture Sign-off', color: 'bg-indigo-500' },
            { stage: 'Negotiation', prob: '80%', req: 'Legal & Procurement Redlines', color: 'bg-amber-500' },
            { stage: 'Won', prob: '100%', req: 'Signed Contract / Payment Terms', color: 'bg-emerald-500' },
            { stage: 'Lost', prob: '0%', req: 'Loss Reason Logged', color: 'bg-rose-500' },
          ].map((item) => (
            <div key={item.stage} className="flex items-center justify-between p-2.5 rounded-lg border border-stone-100 dark:border-neutral-800 bg-stone-50/50 dark:bg-neutral-800/40">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="font-semibold text-stone-800 dark:text-neutral-200">{item.stage}</span>
                <span className="text-stone-400">({item.req})</span>
              </div>
              <span className="font-mono font-medium text-stone-600 dark:text-neutral-300">{item.prob} default</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-xl border bg-white border-stone-200/80 dark:bg-neutral-900 dark:border-neutral-800 space-y-4">
        <h3 className="text-sm font-semibold text-stone-900 dark:text-neutral-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-500" />
          Active Team Roles & Access Controls
        </h3>
        <p className="text-stone-500 dark:text-neutral-400">
          User roles, regional quota allocations, and row-level privacy.
        </p>

        <div className="divide-y divide-stone-100 dark:divide-neutral-800">
          {[
            { name: 'Jordan Miller', email: 'jordan@orbitcrm.com', role: 'Super Admin & Ops Lead', status: 'Active' },
            { name: 'Elena Rostova', email: 'elena@orbitcrm.com', role: 'Strategic Enterprise AE', status: 'Active' },
            { name: 'Marcus Chen', email: 'marcus@orbitcrm.com', role: 'Commercial Sales Lead', status: 'Active' },
            { name: 'Alex Rivera', email: 'alex@orbitcrm.com', role: 'Mid-Market AE', status: 'Active' },
            { name: 'Sarah Jenkins', email: 'sarah@orbitcrm.com', role: 'Growth Account Exec', status: 'Active' },
          ].map((u) => (
            <div key={u.email} className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-800 dark:text-neutral-200">{u.name}</p>
                <p className="text-stone-400">{u.email} • {u.role}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                {u.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
