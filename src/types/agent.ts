export interface AIAgent {
  id: string;
  name: string;
  category: AgentCategory;
  description: string;
  inputs: AgentInput[];
  outputs: string[];
  creditCost: number;
  icon: string;
  hashtags: string[];
  isActive: boolean;
}

export interface AgentInput {
  name: string;
  type: 'text' | 'file' | 'select' | 'multiselect' | 'number';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export type AgentCategory = '일반사무' | '마케팅/광고' | '콘텐츠 제작';

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'general_user' | 'company_admin' | 'company_employee' | 'admin';
  credits: number;
  profileImage?: string;
  company?: CompanyInfo;
}

export interface CompanyInfo {
  name: string;
  businessNumber?: string;
  logo?: string;
  department?: string;
  position?: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  bonus?: number;
  popular?: boolean;
} 