import React, { useState } from 'react';
import { 
  DollarSign, 
  Trophy, 
  UserPlus, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Calendar, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  Filter, 
  Sparkles,
  Layers
} from 'lucide-react';
import { Contact, Deal, Activity, SelectedRecord } from '../types';
import { FUNNEL_STAGES, REVENUE_MONTHS } from '../mockData';

interface DashboardViewProps {
  deals: Deal[];
  contacts: Contact[];
  activities: Activity[];
  onSelectRecord: (record: SelectedRecord) => void;
  goToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  deals,
  contacts,
  activities,
  onSelectRecord,
  goToTab,
}) => {
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Compute live metrics from deals & contacts
  const totalPipelineValue = deals
    .filter(d => d.stage !== 'Won' && d.stage !== 'Lost')
    .reduce((sum, d) => sum + d.value, 0);

  const dealsWonMonth = deals
    .filter(d => d.stage === 'Won')
    .reduce((sum, d) => sum + d.value, 0);

  const wonDealsCount = deals.filter(d => d.stage === 'Won').length;

  const filteredActivities = activityFilter === 'all'
    ? activities
    : activities.filter(a => a.type === activityFilter);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val.toLocaleString()}`;
  };

  const metricCards = [
    {
      id: 'pipeline-value',
      title: 'Total Pipeline Value',
      value: formatCurrency(totalPipelineValue),
      subtext: 'across 10 active opportunities',
      change: '+14.2%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      id: 'deals-won',
      title: 'Deals Won this Month',
      value: formatCurrency(dealsWonMonth),
      subtext: `${wonDealsCount} contracts closed in Sep`,
      change: '+28.4%',
      isPositive: true,
      icon: Trophy,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      id: 'new-contacts',
      title: 'Active Contacts',
      value: contacts.length.toString(),
      subtext: 'Across 8 enterprise orgs',
      change: '+12.5%',
      isPositive: true,
      icon: UserPlus,
      color: 'text-sky-600 dark:text-sky-400',
      bgColor: 'bg-sky-50 dark:bg-sky-950/40',
    },
    {
      id: 'conversion-rate',
      title: 'Win Conversion Rate',
      value: '24.8%',
      subtext: 'Qualified-to-won velocity',
      change: '+3.2%',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    },
  ];

  const maxRevenue = Math.max(...REVENUE_MONTHS.map(m => m.revenue));

  return (
    <div id="dashboard-view-container" className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              id={`metric-card-${card.id}`}
              className="p-4 rounded-xl border bg-white border-stone-200/80 shadow-xs hover:shadow-sm transition-all
                dark:bg-neutral-900 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-medium text-stone-500 dark:text-neutral-400">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-lg ${card.bgColor} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-stone-900 dark:text-neutral-100">
                  {card.value}
                </span>
                <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {card.change}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 dark:text-neutral-500 mt-1">
                {card.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Analytics Row: Pipeline Funnel + Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pipeline Funnel Visualization (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl border bg-white border-stone-200/80 shadow-xs dark:bg-neutral-900 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-neutral-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                Pipeline Funnel Stages
              </h3>
              <p className="text-xs text-stone-500 dark:text-neutral-400">
                Conversion drop-off across active deal progression stages
              </p>
            </div>
            <button
              onClick={() => goToTab('deals')}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Open Kanban <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {FUNNEL_STAGES.map((stage, idx) => {
              const widthPct = Math.max(22, 100 - idx * 16);
              const stageColors = [
                'bg-slate-500',
                'bg-sky-500',
                'bg-indigo-500',
                'bg-amber-500',
                'bg-emerald-500',
              ];

              return (
                <div key={stage.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${stageColors[idx]}`} />
                      <span className="font-semibold text-stone-800 dark:text-neutral-200">
                        {stage.stage}
                      </span>
                      <span className="text-stone-400 dark:text-neutral-500">
                        ({stage.count} deals)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-stone-600 dark:text-neutral-400 font-medium">
                        {formatCurrency(stage.value)}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded font-mono bg-stone-100 text-stone-600 dark:bg-neutral-800 dark:text-neutral-300">
                        {stage.conversion}
                      </span>
                    </div>
                  </div>

                  {/* Funnel Step Bar */}
                  <div className="h-3 w-full bg-stone-100 dark:bg-neutral-800/80 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${stageColors[idx]}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Micro takeaway */}
          <div className="mt-5 p-3 rounded-lg bg-stone-50 dark:bg-neutral-800/50 border border-stone-200/50 dark:border-neutral-700/50 flex items-center justify-between text-xs text-stone-600 dark:text-neutral-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Highest drop-off: Proposal → Negotiation (36% clearance)
            </span>
            <span className="text-[11px] text-stone-400 dark:text-neutral-400">
              Avg cycle: 28 days
            </span>
          </div>
        </div>

        {/* Revenue Trend Chart (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl border bg-white border-stone-200/80 shadow-xs dark:bg-neutral-900 dark:border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-neutral-100">
                Revenue Trajectory
              </h3>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-stone-500 dark:text-neutral-400">
                  <span className="w-2 h-2 rounded bg-indigo-500" /> Closed
                </span>
                <span className="flex items-center gap-1 text-stone-500 dark:text-neutral-400">
                  <span className="w-2 h-2 rounded bg-stone-300 dark:bg-neutral-600" /> Quota
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-500 dark:text-neutral-400 mb-5">
              Monthly booked ARR vs projected baseline (in $k)
            </p>

            {/* Custom SVG Bar Chart with Hover State */}
            <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 border-b border-stone-200 dark:border-neutral-800">
              {REVENUE_MONTHS.map((item, idx) => {
                const heightPct = (item.revenue / maxRevenue) * 100;
                const projHeightPct = (item.projected / maxRevenue) * 100;
                const isHovered = hoveredBarIndex === idx;

                return (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-10 z-10 px-2 py-1 rounded bg-stone-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-[10px] font-mono shadow-md whitespace-nowrap">
                        ${item.revenue}k (Quota: ${item.projected}k)
                      </div>
                    )}

                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Projected bar */}
                      <div
                        className="w-2 sm:w-2.5 rounded-t bg-stone-200 dark:bg-neutral-700 transition-all duration-300"
                        style={{ height: `${projHeightPct}%` }}
                      />
                      {/* Actual closed bar */}
                      <div
                        className={`w-3 sm:w-4 rounded-t transition-all duration-300 ${
                          idx === REVENUE_MONTHS.length - 1
                            ? 'bg-indigo-600 dark:bg-indigo-500'
                            : 'bg-indigo-400/80 dark:bg-indigo-500/70 group-hover:bg-indigo-500'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-stone-500 dark:text-neutral-400 mt-2 font-medium">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-stone-500 dark:text-neutral-400">Current Q3 Total</span>
            <span className="font-semibold text-stone-900 dark:text-neutral-100 font-mono">
              $1,097,000 (+18.4% QoQ)
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Activity Feed & Priority Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity Feed (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl border bg-white border-stone-200/80 shadow-xs dark:bg-neutral-900 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-neutral-100">
                Live Activity Stream
              </h3>
              <p className="text-xs text-stone-500 dark:text-neutral-400">
                Real-time team engagements and milestone events
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 text-[11px]">
              {['all', 'meeting', 'call', 'email', 'stage_change'].map((type) => (
                <button
                  key={type}
                  onClick={() => setActivityFilter(type)}
                  className={`px-2 py-1 rounded-md transition-colors capitalize ${
                    activityFilter === type
                      ? 'bg-stone-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium'
                      : 'text-stone-500 hover:text-stone-900 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-stone-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {type === 'stage_change' ? 'Stage' : type}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-neutral-800">
            {filteredActivities.slice(0, 5).map((act) => {
              const iconMap = {
                meeting: Calendar,
                call: Phone,
                email: Mail,
                note: FileText,
                stage_change: CheckCircle2,
              };
              const ActIcon = iconMap[act.type] || Clock;

              return (
                <div 
                  key={act.id} 
                  className="py-3 flex items-start gap-3 hover:bg-stone-50/60 dark:hover:bg-neutral-800/30 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <img
                    src={act.author.avatar}
                    alt={act.author.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-stone-900 dark:text-neutral-100 truncate">
                        {act.title}
                      </p>
                      <span className="text-[10px] text-stone-400 dark:text-neutral-500 flex-shrink-0">
                        {act.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-neutral-300 mt-0.5 line-clamp-2">
                      {act.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                      <span className="inline-flex items-center gap-1 text-stone-400 dark:text-neutral-500">
                        <ActIcon className="w-3 h-3" />
                        <span className="capitalize">{act.type.replace('_', ' ')}</span>
                      </span>
                      <span className="text-stone-300 dark:text-neutral-700">•</span>
                      <button
                        onClick={() => {
                          if (act.relatedTo.type === 'deal') {
                            const found = deals.find(d => d.id === act.relatedTo.id);
                            if (found) onSelectRecord({ type: 'deal', data: found });
                          } else if (act.relatedTo.type === 'contact') {
                            const found = contacts.find(c => c.id === act.relatedTo.id);
                            if (found) onSelectRecord({ type: 'contact', data: found });
                          }
                        }}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium truncate"
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

        {/* High Priority Deals Watchlist (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl border bg-white border-stone-200/80 shadow-xs dark:bg-neutral-900 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-stone-900 dark:text-neutral-100">
                Key Opportunities
              </h3>
              <p className="text-xs text-stone-500 dark:text-neutral-400">
                Deals above $50k in negotiation & proposal
              </p>
            </div>
            <button
              onClick={() => goToTab('deals')}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all ({deals.length})
            </button>
          </div>

          <div className="space-y-2.5 mt-3">
            {deals
              .filter(d => d.value >= 50000 && d.stage !== 'Won' && d.stage !== 'Lost')
              .slice(0, 4)
              .map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => onSelectRecord({ type: 'deal', data: deal })}
                  className="p-3 rounded-lg border border-stone-200/70 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-800/80 bg-stone-50/40 dark:bg-neutral-800/40 cursor-pointer transition-all hover:bg-white dark:hover:bg-neutral-800 group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-stone-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-[200px]">
                      {deal.name}
                    </h4>
                    <span className="text-xs font-bold text-stone-900 dark:text-neutral-100 font-mono">
                      {formatCurrency(deal.value)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-stone-500 dark:text-neutral-400">
                    <span>{deal.company}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded font-medium bg-stone-200/70 dark:bg-neutral-700 text-stone-700 dark:text-neutral-300 text-[10px]">
                        {deal.stage}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {deal.probability}% win prob
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
