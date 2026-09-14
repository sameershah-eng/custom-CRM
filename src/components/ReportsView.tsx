import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Award, Target, ArrowUpRight } from 'lucide-react';
import { Deal } from '../types';

interface ReportsViewProps {
  deals: Deal[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ deals }) => {
  const reps = [
    { name: 'Elena Rostova', dealsClosed: 4, quota: 400000, actual: 444000, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80' },
    { name: 'Marcus Chen', dealsClosed: 3, quota: 350000, actual: 316000, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
    { name: 'Alex Rivera', dealsClosed: 3, quota: 250000, actual: 232000, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80' },
    { name: 'Sarah Jenkins', dealsClosed: 2, quota: 200000, actual: 104000, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' },
  ];

  return (
    <div id="reports-view-container" className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-white border-stone-200/80 dark:bg-neutral-900 dark:border-neutral-800">
          <span className="text-xs text-stone-500 dark:text-neutral-400">Quarterly Attainment</span>
          <div className="text-2xl font-bold font-mono text-stone-900 dark:text-neutral-100 mt-1">91.3%</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +6.4% vs Q2 target
          </p>
        </div>

        <div className="p-4 rounded-xl border bg-white border-stone-200/80 dark:bg-neutral-900 dark:border-neutral-800">
          <span className="text-xs text-stone-500 dark:text-neutral-400">Average Sales Velocity</span>
          <div className="text-2xl font-bold font-mono text-stone-900 dark:text-neutral-100 mt-1">26.4 Days</div>
          <p className="text-[11px] text-stone-400 dark:text-neutral-500 mt-1">
            Time from Qualified to Won
          </p>
        </div>

        <div className="p-4 rounded-xl border bg-white border-stone-200/80 dark:bg-neutral-900 dark:border-neutral-800">
          <span className="text-xs text-stone-500 dark:text-neutral-400">Average Deal Size (ACV)</span>
          <div className="text-2xl font-bold font-mono text-stone-900 dark:text-neutral-100 mt-1">$78,500</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% YoY
          </p>
        </div>
      </div>

      {/* Rep Leaderboard */}
      <div className="p-5 rounded-xl border bg-white border-stone-200/80 dark:bg-neutral-900 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-stone-900 dark:text-neutral-100 mb-4">
          Rep Attainment & Quota Leaderboard
        </h3>
        <div className="space-y-4">
          {reps.map((rep) => {
            const pct = Math.min(100, Math.round((rep.actual / rep.quota) * 100));
            return (
              <div key={rep.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={rep.avatar} alt={rep.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="font-semibold text-stone-800 dark:text-neutral-200">{rep.name}</span>
                    <span className="text-stone-400">({rep.dealsClosed} deals)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-stone-600 dark:text-neutral-300">
                      ${rep.actual.toLocaleString()} / ${rep.quota.toLocaleString()}
                    </span>
                    <span className={`font-mono text-xs font-bold ${pct >= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-600 dark:text-neutral-300'}`}>
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-stone-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
