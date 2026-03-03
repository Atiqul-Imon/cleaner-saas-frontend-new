/** API types - aligned with backend Prisma models */

export type UserRole = 'OWNER' | 'CLEANER' | 'ADMIN';

export type JobStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';

export type JobType = 'ONE_OFF' | 'RECURRING';

export type InvoiceStatus = 'PAID' | 'UNPAID';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
}

export interface ClientNotes {
  accessInfo?: string;
  keySafe?: string;
  alarmCode?: string;
  pets?: string;
  preferences?: string;
}

export interface Client {
  id: string;
  name: string;
  phone?: string | null;
  address?: string | null;
  notes?: ClientNotes | null;
  businessId?: string;
  createdAt: string;
  jobs?: { id: string; type: string; scheduledDate: string; status: string }[];
}

export interface JobChecklistItem {
  id: string;
  itemText: string;
  completed: boolean;
}

export interface JobPhoto {
  id: string;
  imageUrl: string;
  photoType: 'BEFORE' | 'AFTER';
  timestamp: string;
}

export interface Job {
  id: string;
  businessId: string;
  clientId: string;
  client?: {
    id: string;
    name: string;
    phone?: string | null;
    address?: string | null;
    notes?: ClientNotes | null;
  };
  type: JobType;
  frequency?: string | null;
  status: JobStatus;
  scheduledDate: string;
  scheduledTime?: string | null;
  reminderEnabled?: boolean;
  reminderTime?: string | null;
  cleanerId?: string | null;
  cleaner?: { id: string; email: string; name?: string | null } | null;
  checklist?: JobChecklistItem[];
  photos?: JobPhoto[];
  invoice?: { id: string; invoiceNumber: string } | null;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  totalAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  client?: { id: string; name: string; phone?: string | null };
  business?: { name?: string };
  job?: { id: string };
  createdAt: string;
}

export interface DashboardStats {
  todayJobs: number;
  todayJobsList: Job[];
  monthlyEarnings?: number;
  unpaidInvoices?: number;
  totalJobs?: number;
  totalClients?: number;
  totalInvoices?: number;
  role: UserRole;
  upcomingJobs?: Job[];
  inProgressJobs?: Job[];
  recentJobs?: Job[];
  recentClients?: Client[];
  recentInvoices?: Invoice[];
}
