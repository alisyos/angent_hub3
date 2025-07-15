// 회사 관련 타입 정의

export interface CompanyInfo {
  id?: number;
  name: string;
  companyName: string;
  businessNumber: string;
  ceo: string;
  ceoName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  industry: string;
  employeeCount: string;
  companySize: string;
  establishedYear: string;
  description: string;
  logo?: CompanyLogo;
}

export interface CompanyLogo {
  id?: number;
  companyId?: number;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  isActive: boolean;
}

export interface CompanySettings {
  companyInfo: CompanyInfo;
  billingSettings: BillingSettings;
  companyCode: CompanyCode;
}

export interface BillingSettings {
  defaultPaymentMethod: string;
  billingCycle: string;
  autoRecharge: boolean;
  rechargeAmount: number;
  rechargeThreshold: number;
  receiveInvoice: boolean;
  invoiceEmail: string;
  issueTaxInvoice: boolean;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

export interface CompanyCode {
  id: number;
  code: string;
  name: string;
  description: string;
  isVisible: boolean;
  createdAt: string;
  isCreated: boolean;
}

export interface LogoUploadResponse {
  success: boolean;
  message: string;
  logo?: CompanyLogo;
  error?: string;
} 