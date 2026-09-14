import React, { useState } from 'react';
import { X, DollarSign, Building2, User, Calendar, Tag } from 'lucide-react';
import { Deal, Contact, DealStage, ContactStatus } from '../types';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStage?: DealStage;
  onSave: (deal: Omit<Deal, 'id'>) => void;
}

export const NewDealModal: React.FC<NewDealModalProps> = ({
  isOpen,
  onClose,
  defaultStage = 'Lead',
  onSave,
}) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('50000');
  const [company, setCompany] = useState('Vercelify Dynamics');
  const [stage, setStage] = useState<DealStage>(defaultStage);
  const [contactName, setContactName] = useState('Elena Vance');
  const [contactEmail, setContactEmail] = useState('elena@company.com');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      value: parseInt(value, 10) || 10000,
      stage,
      company,
      companyId: 'comp-1',
      contactName,
      contactEmail,
      owner: {
        name: 'Jordan Miller',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },
      expectedCloseDate: '2026-11-30',
      probability: stage === 'Won' ? 100 : stage === 'Negotiation' ? 80 : 40,
      priority,
      tags: ['Inbound', 'Q4 Expansion'],
    });

    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-neutral-800">
          <h3 className="text-base font-bold text-stone-900 dark:text-neutral-100">Create New Deal</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-neutral-800 text-stone-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-stone-600 dark:text-neutral-400 font-medium mb-1">Deal Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise SLA Migration"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2 rounded-lg border border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 dark:text-neutral-400 font-medium mb-1">Deal Value ($)</label>
              <input
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
                className="w-full p-2 rounded-lg border border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
              />
            </div>
            <div>
              <label className="block text-stone-600 dark:text-neutral-400 font-medium mb-1">Stage</label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as DealStage)}
                className="w-full p-2 rounded-lg border border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="Lead">Lead</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-stone-600 dark:text-neutral-400 font-medium mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              className="w-full p-2 rounded-lg border border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-neutral-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 dark:text-neutral-400 font-medium mb-1">Contact Name</label>
              <input
                type="text"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                className="w-full p-2 rounded-lg border border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-stone-600 dark:text-neutral-400 font-medium mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 hover:bg-stone-100 dark:hover:bg-neutral-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              Create Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface NewContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Omit<Contact, 'id'>) => void;
}

export const NewContactModal: React.FC<NewContactModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('+1 (555) 019-2831');
  const [status, setStatus] = useState<ContactStatus>('Lead');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSave({
      name: name.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      email: email.trim(),
      phone,
      title: title || 'Director',
      company: company || 'Acme Partner Corp',
      companyId: 'comp-1',
      status,
      owner: {
        name: 'Jordan Miller',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        email: 'jordan@orbitcrm.com',
      },
      lastContacted: 'Just now',
      value: 30000,
      location: 'San Francisco, CA',
      notesCount: 0,
      tags: ['Inbound Lead'],
    });

    setName('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-neutral-800">
          <h3 className="text-base font-bold text-stone-900 dark:text-neutral-100">Add New Contact</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-neutral-800 text-stone-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-stone-600 dark:text-neutral-400 font-medium mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rachel Adams"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2 rounded-lg border border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-neutral-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-600 dark:text-neutral-400 font-medium mb-1">Work Email *</label>
            <input
              type="email"
              required
              placeholder="rachel@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 rounded-lg border border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-neutral-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 dark:text-neutral-400 font-medium mb-1">Company</label>
              <input
                type="text"
                placeholder="Acme Co"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full p-2 rounded-lg border border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-stone-600 dark:text-neutral-400 font-medium mb-1">Job Title</label>
              <input
                type="text"
                placeholder="VP Engineering"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2 rounded-lg border border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 dark:text-neutral-400 font-medium mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-2 rounded-lg border border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-neutral-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-stone-600 dark:text-neutral-400 font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ContactStatus)}
                className="w-full p-2 rounded-lg border border-stone-200 dark:border-neutral-700 bg-stone-50 dark:bg-neutral-800 text-stone-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="Lead">Lead</option>
                <option value="Active">Active</option>
                <option value="Customer">Customer</option>
                <option value="Churned">Churned</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-neutral-700 hover:bg-stone-100 dark:hover:bg-neutral-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
