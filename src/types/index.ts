export interface User {
  id: string;
  email: string;
  role: "MEMBER" | "SECRETARY" | "TREASURER" | "ADMIN";
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Member {
  id: string;
  userId: string;
  membershipNumber: string;
  categoryId: string;
  wing: "CONTRIBUTION" | "INVESTMENT" | "BOTH";
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
  phone: string;
  address: string;
  balance: number;
}

export interface MembershipCategory {
  id: string;
  name: string;
  description: string;
  monthlyFee: number;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
}

export interface PaymentType {
  id: string;
  name: string;
  description: string;
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  type: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  date: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface Receipt {
  id: string;
  paymentId: string;
  url: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  coverImage: string;
}

export interface GalleryImage {
  id: string;
  albumId: string;
  url: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  timestamp: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface Permission {
  id: string;
  name: string;
}

export interface DashboardStats {
  outstandingBalance: number;
  totalContributions: number;
  totalPayments: number;
  memberSince: string;
}

export interface TreasurerDashboard {
  incomeToday: number;
  incomeWeek: number;
  incomeMonth: number;
  incomeYear: number;
  outstandingMembersCount: number;
}

export interface SecretaryDashboard {
  pendingApprovals: number;
  recentRegistrations: number;
  totalMembers: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
