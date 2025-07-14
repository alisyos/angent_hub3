import { AIAgent, User as BaseUser, CompanyInfo } from './agent';

// === 사용자 관리 관련 타입 ===
export interface User extends BaseUser {
  lastLoginAt: string;
  totalCreditsUsed: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'suspended';
  registeredAt: string;
  companyInfo?: CompanyDetails;
  employees?: User[]; // 회사 관리자인 경우
  activityLogs: UserActivityLog[];
}

export interface AdminUser extends User {
  lastLoginAt: string;
  totalCreditsUsed: number;
  totalSpent: number;
  status: 'active' | 'suspended' | 'inactive';
  registeredAt: string;
  phone?: string;
  companyInfo?: CompanyDetails;
  employees?: User[]; // 회사 관리자인 경우
  activityLogs: UserActivityLog[];
}

export interface CompanyDetails extends CompanyInfo {
  businessNumber: string;
  address: string;
  phone: string;
  employeeCount: number;
  subscriptionPlan: string;
  totalEmployees: User[];
  ceo?: string;
  industry?: string;
  email?: string;
  website?: string;
  description?: string;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'agent_use' | 'credit_purchase' | 'profile_update';
  details: string;
  timestamp: string;
  ipAddress: string;
}

// === AI 에이전트 관리 관련 타입 ===
export interface AgentAdmin extends AIAgent {
  statistics: AgentStatistics;
  settings: AgentSettings;
  logs: AgentLog[];
  order: number; // 표시 순서
  customImage?: string; // 커스텀 이미지 (base64)
}

export interface AgentStatistics {
  totalUsage: number;
  successRate: number;
  averageProcessingTime: number;
  revenue: number;
  userRating: number;
  monthlyUsage: number[];
  errorCount: number;
}

export interface AgentSettings {
  isEnabled: boolean;
  maxConcurrentUsers: number;
  maintenanceMode: boolean;
  apiKeys: string[];
  rateLimit: number;
  timeout: number;
}

export interface AgentLog {
  id: string;
  agentId: string;
  userId: string;
  status: 'success' | 'error' | 'timeout';
  processingTime: number;
  timestamp: string;
  errorMessage?: string;
  inputSize: number;
  outputSize: number;
}

// === FAQ 관리 관련 타입 ===
export interface FAQAdmin {
  id: string;
  category: string;
  question: string;
  answer: string;
  isPublished: boolean;
  order: number; // 표시 순서
  createdAt: string;
  updatedAt: string;
  createdBy: string; // 작성자
  updatedBy?: string;
  tags: string[];
}

export interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  isActive: boolean;
}

// === 문의 관리 관련 타입 ===
export interface InquiryAdmin {
  id: string;
  type: 'service' | 'technical' | 'billing' | 'account' | 'other';
  title: string;
  content: string;
  attachments: AttachmentFile[];
  user: {
    id: string;
    name: string;
    email: string;
    type: 'general_user' | 'company_admin' | 'company_employee' | 'admin';
  };
  status: 'pending' | 'completed';
  assignedTo?: string; // 담당자 ID
  responses: InquiryResponse[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  tags: string[];
  category: string;
  isInternal: boolean; // 내부 문의 여부
}

export interface InquiryResponse {
  id: string;
  inquiryId: string;
  content: string;
  attachments: AttachmentFile[];
  author: {
    id: string;
    name: string;
    role: 'admin' | 'user';
  };
  isInternal: boolean; // 내부 메모 여부
  createdAt: string;
  updatedAt?: string;
}

export interface AttachmentFile {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  downloadUrl: string;
}

// === 결제 관리 관련 타입 ===
export interface PaymentAdmin {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    type: 'general_user' | 'company_admin' | 'company_employee' | 'admin';
    companyName?: string; // 회사관리자인 경우 회사명
  };
  type: 'credit_purchase' | 'subscription' | 'refund';
  productName: string; // 상품명 (크레딧 패키지명)
  amount: number;
  credits: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: 'card' | 'bank' | 'kakaopay' | 'naverpay' | 'toss';
  taxInvoiceStatus?: 'not_applicable' | 'pending' | 'issued'; // 세금계산서 상태 (발행안함, 발행 전, 발행완료)
  transactionId: string;
  receiptUrl?: string;
  createdAt: string;
  completedAt?: string;
  refundedAt?: string;
  refundReason?: string;
  refundedBy?: string;
  gateway: string; // PG사
  gatewayTransactionId?: string;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  dailyRevenue: number;
  refundRate: number;
  topPaymentMethods: PaymentMethodStats[];
  revenueByPlan: PlanRevenueStats[];
  monthlyGrowth: number;
  averageOrderValue: number;
}

export interface PaymentMethodStats {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface PlanRevenueStats {
  planName: string;
  revenue: number;
  count: number;
  percentage: number;
}

// === 공통 분석 타입 ===
export interface AdminDashboardStats {
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  agents: {
    total: number;
    active: number;
    totalUsage: number;
    revenue: number;
  };
  inquiries: {
    total: number;
    pending: number;
    resolved: number;
    averageResponseTime: number;
  };
  payments: {
    totalRevenue: number;
    monthlyRevenue: number;
    totalTransactions: number;
    refundRate: number;
  };
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

// === 필터 및 검색 타입 ===
export interface AdminFilter {
  search?: string;
  status?: string;
  type?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// === 관리자 권한 관련 타입 ===
export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: AdminPermission[];
  isSystem: boolean; // 시스템 기본 역할 여부
}

// === 시스템 설정 타입 ===
export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  category: string;
  isPublic: boolean; // 공개 설정 여부
  updatedAt: string;
  updatedBy: string;
}

// === 알림 관련 타입 ===
export interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

// === API 응답 타입 ===
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
} 