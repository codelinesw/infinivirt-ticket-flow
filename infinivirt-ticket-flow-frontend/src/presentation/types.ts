// Enums & Roles
export type Role = 'ADMIN' | 'AGENT' | 'SUPERVISOR' | 'CLIENT';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// User Model
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  clientId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Client / Tenant Model
export interface ClientTenant {
  id: string;
  name: string;
  domain?: string;
}

// Comment Model
export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  author: User;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

// Ticket Model
export interface Ticket {
  id: string;
  ticketNumber: string; // e.g., TKN-1024
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  clientId: string;
  client?: ClientTenant;
  createdById: string;
  createdBy?: User;
  assignedToId?: string | null;
  assignedTo?: User | null;
  comments?: TicketComment[];
  createdAt: string;
  updatedAt: string;
}

// Notification Model
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// API Responses
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}