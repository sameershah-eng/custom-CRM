export type DealStage = 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export type ContactStatus = 'Lead' | 'Active' | 'Customer' | 'Churned';

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  title: string;
  company: string;
  companyId: string;
  status: ContactStatus;
  owner: {
    name: string;
    avatar: string;
    email: string;
  };
  lastContacted: string;
  value?: number;
  location: string;
  notesCount: number;
  tags: string[];
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  domain: string;
  industry: string;
  size: string;
  tier: 'Enterprise' | 'Mid-Market' | 'Growth' | 'Startup';
  arr: number;
  openDeals: number;
  location: string;
  owner: string;
}

export interface Deal {
  id: string;
  name: string;
  value: number;
  stage: DealStage;
  company: string;
  companyId: string;
  contactName: string;
  contactEmail: string;
  owner: {
    name: string;
    avatar: string;
  };
  expectedCloseDate: string;
  probability: number;
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'stage_change';
  title: string;
  description: string;
  timestamp: string;
  author: {
    name: string;
    avatar: string;
  };
  relatedTo: {
    type: 'contact' | 'deal' | 'company';
    id: string;
    name: string;
  };
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
  iconName: string;
}

export type ActiveTab = 'dashboard' | 'contacts' | 'companies' | 'deals' | 'activities' | 'reports' | 'settings';

export interface SelectedRecord {
  type: 'contact' | 'deal' | 'company';
  data: Contact | Deal | Company;
}
