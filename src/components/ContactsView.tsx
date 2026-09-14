import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  MoreHorizontal, 
  UserPlus, 
  Download, 
  Trash2, 
  Mail, 
  Phone, 
  Tag, 
  CheckSquare, 
  Square, 
  ChevronLeft, 
  ChevronRight, 
  Building,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Contact, ContactStatus, SelectedRecord } from '../types';

interface ContactsViewProps {
  contacts: Contact[];
  onSelectRecord: (record: SelectedRecord) => void;
  onAddContact: () => void;
}

type SortField = 'name' | 'company' | 'value' | 'lastContacted' | 'status';
type SortDirection = 'asc' | 'desc';

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  onSelectRecord,
  onAddContact,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [ownerFilter, setOwnerFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Extract unique owners for dropdown
  const owners = useMemo(() => {
    const set = new Set(contacts.map(c => c.owner.name));
    return Array.from(set);
  }, [contacts]);

  // Filtering & Sorting
  const filteredContacts = useMemo(() => {
    return contacts
      .filter((contact) => {
        const matchesSearch = 
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || contact.status === statusFilter;
        const matchesOwner = ownerFilter === 'ALL' || contact.owner.name === ownerFilter;

        return matchesSearch && matchesStatus && matchesOwner;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'name') {
          cmp = a.name.localeCompare(b.name);
        } else if (sortField === 'company') {
          cmp = a.company.localeCompare(b.company);
        } else if (sortField === 'status') {
          cmp = a.status.localeCompare(b.status);
        } else if (sortField === 'value') {
          cmp = (a.value || 0) - (b.value || 0);
        } else if (sortField === 'lastContacted') {
          cmp = a.lastContacted.localeCompare(b.lastContacted);
        }
        return sortDirection === 'asc' ? cmp : -cmp;
      });
  }, [contacts, searchQuery, statusFilter, ownerFilter, sortField, sortDirection]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / pageSize));
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredContacts.slice(start, start + pageSize);
  }, [filteredContacts, currentPage, pageSize]);

  // Handle Sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedContacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedContacts.map(c => c.id));
    }
  };

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'Customer':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
      case 'Lead':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'Churned':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700';
    }
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-stone-400 opacity-60" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
      : <ArrowDown className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />;
  };

  return (
    <div id="contacts-view-container" className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="contacts-search-input"
            type="text"
            placeholder="Search by name, title, email, or company..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border transition-all
              bg-white border-stone-200 text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
              dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filters & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-lg border border-stone-200/80 bg-white dark:bg-neutral-900 dark:border-neutral-800 text-xs">
            {['ALL', 'Lead', 'Active', 'Customer', 'Churned'].map((st) => (
              <button
                key={st}
                id={`status-filter-${st.toLowerCase()}`}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === st
                    ? 'bg-stone-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}
          </div>

          {/* Owner Filter Dropdown */}
          <select
            id="contacts-owner-filter"
            value={ownerFilter}
            onChange={(e) => {
              setOwnerFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs rounded-lg border bg-white border-stone-200 text-stone-700
              dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300 focus:outline-none"
          >
            <option value="ALL">All Owners</option>
            {owners.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>

          {/* Add Contact Button */}
          <button
            id="contacts-add-new-btn"
            onClick={onAddContact}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white
              bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Bar when items selected */}
      {selectedIds.length > 0 && (
        <div 
          id="contacts-bulk-action-bar"
          className="flex items-center justify-between p-2.5 px-4 rounded-xl border bg-indigo-50/80 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900 text-xs text-indigo-950 dark:text-indigo-200 animate-in fade-in slide-in-from-top-1"
        >
          <span className="font-semibold">
            {selectedIds.length} contact{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Exported ${selectedIds.length} contacts to CSV.`)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-neutral-800 border border-indigo-200 dark:border-neutral-700 hover:bg-stone-50 font-medium"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Export CSV
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-medium text-stone-600 dark:text-neutral-300"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Contacts Table Card */}
      <div className="rounded-xl border bg-white border-stone-200/80 shadow-xs dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200/80 dark:border-neutral-800 bg-stone-50/70 dark:bg-neutral-800/40 text-stone-500 dark:text-neutral-400">
                <th className="py-3 px-4 w-10">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center text-stone-400 hover:text-stone-700 dark:hover:text-neutral-200"
                    aria-label="Select all contacts"
                  >
                    {selectedIds.length > 0 && selectedIds.length === paginatedContacts.length ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th 
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-stone-900 dark:hover:text-neutral-200 select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Contact Name</span>
                    {renderSortIndicator('name')}
                  </div>
                </th>
                <th 
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-stone-900 dark:hover:text-neutral-200 select-none"
                  onClick={() => handleSort('company')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Company & Role</span>
                    {renderSortIndicator('company')}
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold">Email & Phone</th>
                <th 
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-stone-900 dark:hover:text-neutral-200 select-none"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    {renderSortIndicator('status')}
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold">Account Owner</th>
                <th 
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-stone-900 dark:hover:text-neutral-200 select-none"
                  onClick={() => handleSort('lastContacted')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Last Contacted</span>
                    {renderSortIndicator('lastContacted')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-stone-900 dark:hover:text-neutral-200 select-none"
                  onClick={() => handleSort('value')}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Pipeline Est.</span>
                    {renderSortIndicator('value')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-neutral-800/80">
              {paginatedContacts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400 dark:text-neutral-500">
                    <p className="font-medium text-stone-600 dark:text-neutral-400">No contacts found</p>
                    <p className="text-[11px] mt-1">Try adjusting your search query or filter tags.</p>
                  </td>
                </tr>
              ) : (
                paginatedContacts.map((contact) => {
                  const isSelected = selectedIds.includes(contact.id);
                  return (
                    <tr
                      key={contact.id}
                      id={`contact-row-${contact.id}`}
                      onClick={() => onSelectRecord({ type: 'contact', data: contact })}
                      className={`group cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-indigo-50/40 dark:bg-indigo-950/20' 
                          : 'hover:bg-stone-50/80 dark:hover:bg-neutral-800/40'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4" onClick={(e) => toggleSelectRow(contact.id, e)}>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-300 dark:text-neutral-600 group-hover:text-stone-400" />
                        )}
                      </td>

                      {/* Name & Avatar */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-200 dark:ring-neutral-700 flex-shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-stone-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {contact.name}
                            </p>
                            <p className="text-[11px] text-stone-400 dark:text-neutral-500">
                              {contact.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Company & Role */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-stone-800 dark:text-neutral-200">
                            {contact.company}
                          </span>
                          <span className="text-[11px] text-stone-400 dark:text-neutral-500">
                            {contact.title}
                          </span>
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="text-stone-700 dark:text-neutral-300 font-mono text-[11px]">
                            {contact.email}
                          </span>
                          <span className="text-[11px] text-stone-400 dark:text-neutral-500">
                            {contact.phone}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>

                      {/* Owner */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={contact.owner.avatar}
                            alt={contact.owner.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-stone-700 dark:text-neutral-300">
                            {contact.owner.name.split(' ')[0]}
                          </span>
                        </div>
                      </td>

                      {/* Last Contacted */}
                      <td className="py-3 px-3 text-stone-500 dark:text-neutral-400">
                        {contact.lastContacted}
                      </td>

                      {/* Value */}
                      <td className="py-3 px-4 text-right font-mono font-medium text-stone-900 dark:text-neutral-100">
                        {contact.value ? `$${contact.value.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-stone-200/70 dark:border-neutral-800 text-xs text-stone-500 dark:text-neutral-400 bg-stone-50/40 dark:bg-neutral-900">
          <div>
            Showing <span className="font-semibold text-stone-800 dark:text-neutral-200">
              {filteredContacts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span> to <span className="font-semibold text-stone-800 dark:text-neutral-200">
              {Math.min(currentPage * pageSize, filteredContacts.length)}
            </span> of <span className="font-semibold text-stone-800 dark:text-neutral-200">
              {filteredContacts.length}
            </span> contacts
          </div>

          <div className="flex items-center gap-1">
            <button
              id="contacts-prev-page-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-stone-200 dark:border-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-neutral-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-[11px] font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              id="contacts-next-page-btn"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-stone-200 dark:border-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-neutral-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
