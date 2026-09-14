import React, { useState } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  DollarSign, 
  Calendar, 
  Tag, 
  Sparkles, 
  Building2, 
  GripVertical,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Deal, DealStage, SelectedRecord } from '../types';

interface DealsKanbanViewProps {
  deals: Deal[];
  onMoveDealStage: (dealId: string, newStage: DealStage) => void;
  onSelectRecord: (record: SelectedRecord) => void;
  onAddDeal: (stage?: DealStage) => void;
}

const STAGES: { id: DealStage; label: string; color: string; borderAccent: string }[] = [
  { id: 'Lead', label: 'Lead', color: 'bg-slate-500', borderAccent: 'hover:border-slate-400' },
  { id: 'Qualified', label: 'Qualified', color: 'bg-sky-500', borderAccent: 'hover:border-sky-400' },
  { id: 'Proposal', label: 'Proposal', color: 'bg-indigo-500', borderAccent: 'hover:border-indigo-400' },
  { id: 'Negotiation', label: 'Negotiation', color: 'bg-amber-500', borderAccent: 'hover:border-amber-400' },
  { id: 'Won', label: 'Won', color: 'bg-emerald-500', borderAccent: 'hover:border-emerald-400' },
  { id: 'Lost', label: 'Lost', color: 'bg-rose-500', borderAccent: 'hover:border-rose-400' },
];

export const DealsKanbanView: React.FC<DealsKanbanViewProps> = ({
  deals,
  onMoveDealStage,
  onSelectRecord,
  onAddDeal,
}) => {
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val.toLocaleString()}`;
  };

  const getPriorityStyle = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'High':
        return 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900';
      case 'Medium':
        return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900';
      case 'Low':
        return 'text-stone-600 bg-stone-100 border-stone-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700';
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stage: DealStage) => {
    // Only reset if leaving the column container
    if (dragOverStage === stage) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (dealId) {
      onMoveDealStage(dealId, targetStage);
    }
    setDraggedDealId(null);
    setDragOverStage(null);
  };

  const handleDragEnd = () => {
    setDraggedDealId(null);
    setDragOverStage(null);
  };

  return (
    <div id="deals-kanban-container" className="p-4 sm:p-6 max-w-full mx-auto space-y-4">
      {/* Kanban Subheader */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-neutral-100">
            Pipeline Opportunity Board
          </h2>
          <p className="text-xs text-stone-500 dark:text-neutral-400">
            Drag cards between stages to update deal lifecycle in real-time
          </p>
        </div>
        <button
          id="kanban-create-deal-btn"
          onClick={() => onAddDeal('Lead')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Opportunity</span>
        </button>
      </div>

      {/* Horizontal Scrollable Board */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 min-h-[calc(100vh-210px)]">
        {STAGES.map((col) => {
          const colDeals = deals.filter((d) => d.stage === col.id);
          const colTotal = colDeals.reduce((sum, d) => sum + d.value, 0);
          const isTarget = dragOverStage === col.id;

          return (
            <div
              key={col.id}
              id={`kanban-column-${col.id.toLowerCase()}`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex-shrink-0 w-80 rounded-xl border flex flex-col transition-all duration-200
                ${isTarget 
                  ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20 dark:bg-indigo-950/30 dark:border-indigo-700' 
                  : 'bg-stone-100/60 border-stone-200/70 dark:bg-neutral-900/50 dark:border-neutral-800'}`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-stone-200/60 dark:border-neutral-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <span className="text-xs font-semibold text-stone-900 dark:text-neutral-100">
                    {col.label}
                  </span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full font-mono bg-white dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 text-stone-600 dark:text-neutral-400 font-medium">
                    {colDeals.length}
                  </span>
                </div>

                {/* Live total sum for column */}
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-stone-800 dark:text-neutral-200">
                    {formatCurrency(colTotal)}
                  </span>
                </div>
              </div>

              {/* Column Cards List */}
              <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto min-h-[140px]">
                {colDeals.length === 0 ? (
                  <div className="h-28 rounded-lg border border-dashed border-stone-300 dark:border-neutral-800 flex flex-col items-center justify-center text-center p-3 text-stone-400 dark:text-neutral-600">
                    <p className="text-xs">No deals in {col.label}</p>
                    <button
                      onClick={() => onAddDeal(col.id)}
                      className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Plus className="w-3 h-3" /> Add deal
                    </button>
                  </div>
                ) : (
                  colDeals.map((deal) => {
                    const isBeingDragged = draggedDealId === deal.id;

                    return (
                      <div
                        key={deal.id}
                        id={`deal-card-${deal.id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelectRecord({ type: 'deal', data: deal })}
                        className={`p-3 rounded-lg border bg-white shadow-2xs cursor-grab active:cursor-grabbing transition-all select-none
                          border-stone-200/90 hover:border-stone-300 hover:shadow-xs
                          dark:bg-neutral-800/90 dark:border-neutral-700/80 dark:hover:border-neutral-600
                          ${isBeingDragged ? 'opacity-40 scale-95' : 'opacity-100'}`}
                      >
                        {/* Header: Company & Priority */}
                        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-neutral-400 mb-1.5">
                          <span className="font-medium truncate max-w-[170px] text-stone-600 dark:text-neutral-300">
                            {deal.company}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getPriorityStyle(deal.priority)}`}>
                            {deal.priority}
                          </span>
                        </div>

                        {/* Deal Name */}
                        <h4 className="text-xs font-semibold text-stone-900 dark:text-neutral-100 leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {deal.name}
                        </h4>

                        {/* Value & Probability */}
                        <div className="flex items-baseline justify-between mt-2.5">
                          <span className="text-sm font-bold text-stone-900 dark:text-neutral-100 font-mono">
                            ${deal.value.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-stone-500 dark:text-neutral-400 font-mono">
                            {deal.probability}% prob
                          </span>
                        </div>

                        {/* Tags */}
                        {deal.tags && deal.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {deal.tags.slice(0, 2).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 dark:bg-neutral-700/60 dark:text-neutral-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer: Owner Avatar & Date */}
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100 dark:border-neutral-700/60 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <img
                              src={deal.owner.avatar}
                              alt={deal.owner.name}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-stone-200 dark:ring-neutral-700"
                              title={deal.owner.name}
                            />
                            <span className="text-stone-600 dark:text-neutral-400 text-[10px]">
                              {deal.owner.name.split(' ')[0]}
                            </span>
                          </div>
                          <span className="text-stone-400 dark:text-neutral-500 text-[10px]">
                            {deal.expectedCloseDate}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Column Footer: Quick add */}
              <div className="p-2 border-t border-stone-200/50 dark:border-neutral-800/60">
                <button
                  onClick={() => onAddDeal(col.id)}
                  className="w-full flex items-center justify-center gap-1 py-1.5 text-xs rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Deal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
