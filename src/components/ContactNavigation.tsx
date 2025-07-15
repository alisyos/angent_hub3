'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MessageSquare,
  Plus,
  HelpCircle
} from 'lucide-react';

const navigationItems = [
  { id: 'inquiry', name: '문의하기', href: '/contact/inquiry', icon: MessageSquare },
  { id: 'agent-request', name: '에이전트 추가신청', href: '/contact/agent-request', icon: Plus },
];

interface ContactNavigationProps {
  className?: string;
}

export default function ContactNavigation({ className = '' }: ContactNavigationProps) {
  const pathname = usePathname();

  return (
    <aside className={`w-64 bg-white border-r border-gray-200 min-h-screen ${className}`}>
      {/* 고객지원 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">고객지원</h2>
            <p className="text-xs text-gray-500">문의 및 신청</p>
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
                      ? 'bg-green-600 text-white shadow-lg transform scale-105'
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

      {/* 도움말 정보 */}
      <div className="p-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">도움말</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <p>• 문의 답변은 영업일 기준 1-2일 소요</p>
            <p>• 에이전트 추가신청 검토는 3-5일 소요</p>
            <p>• 긴급 문의는 전화로 연락바랍니다</p>
          </div>
        </div>
      </div>
    </aside>
  );
} 