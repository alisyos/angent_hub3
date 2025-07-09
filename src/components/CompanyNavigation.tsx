'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart,
  Users, 
  CreditCard,
  TrendingUp,
  Settings,
  Building
} from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', name: '대시보드', href: '/company', icon: BarChart },
  { id: 'employees', name: '직원/부서 관리', href: '/company/employees', icon: Users },
  { id: 'credits', name: '크레딧 충전내역', href: '/company/credits', icon: CreditCard },
  { id: 'analytics', name: '분석 및 리포트', href: '/company/analytics', icon: TrendingUp },
  { id: 'settings', name: '설정', href: '/company/settings', icon: Settings }
];

interface CompanyNavigationProps {
  className?: string;
}

export default function CompanyNavigation({ className = '' }: CompanyNavigationProps) {
  const pathname = usePathname();

  return (
    <aside className={`w-64 bg-white border-r border-gray-200 min-h-screen ${className}`}>
      {/* 회사 관리 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">회사 관리</h2>
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
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
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


    </aside>
  );
} 