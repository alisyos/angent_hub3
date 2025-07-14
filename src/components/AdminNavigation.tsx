'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3,
  Users, 
  MessageSquare,
  HelpCircle,
  DollarSign,
  Bot,
  Shield,
  Package,
  Grid3X3
} from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', name: '대시보드', href: '/admin', icon: BarChart3 },
  { id: 'users', name: '사용자 관리', href: '/admin/users', icon: Users },
  { id: 'inquiries', name: '문의 관리', href: '/admin/inquiries', icon: MessageSquare },
  { id: 'faq', name: 'FAQ 관리', href: '/admin/faq', icon: HelpCircle },
  { id: 'payments', name: '결제 관리', href: '/admin/payments', icon: DollarSign },
  { id: 'credit-packages', name: '크레딧 패키지 관리', href: '/admin/credit-packages', icon: Package },
  { id: 'categories', name: '카테고리 관리', href: '/admin/categories', icon: Grid3X3 },
  { id: 'agents', name: '에이전트 관리', href: '/admin/agents', icon: Bot },
];

interface AdminNavigationProps {
  className?: string;
}

export default function AdminNavigation({ className = '' }: AdminNavigationProps) {
  const pathname = usePathname();

  return (
    <aside className={`w-64 bg-white border-r border-gray-200 min-h-screen ${className}`}>
      {/* 관리자 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">관리자</h2>
            <p className="text-xs text-gray-500">시스템 관리</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`relative flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-102'
                  }`}
                >
                  {/* 활성 상태 표시 바 */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                  )}
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                  <span className={`${isActive ? 'font-semibold' : ''}`}>{item.name}</span>
                  {/* 활성 상태 표시 점 */}
                  {isActive && (
                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>



      {/* 빠른 통계 */}
      <div className="p-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">빠른 통계</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">총 사용자</span>
              <span className="font-medium text-gray-900">2,847</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">미처리 문의</span>
              <span className="font-medium text-orange-600">23</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">활성 에이전트</span>
              <span className="font-medium text-green-600">10/10</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
} 