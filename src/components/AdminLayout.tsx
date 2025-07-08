'use client';

import { ReactNode, useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminNavigation from '@/components/AdminNavigation';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
  hideTimePeriod?: boolean;
  timePeriod?: string;
  onTimePeriodChange?: (period: string) => void;
}

export default function AdminLayout({ 
  children, 
  title, 
  description, 
  actions, 
  hideTimePeriod = false, 
  timePeriod = '최근 7일',
  onTimePeriodChange 
}: AdminLayoutProps) {
  const [internalSelectedPeriod, setInternalSelectedPeriod] = useState('최근 7일');
  
  // 권한 체크 - 관리자만 관리자 페이지에 접근 가능
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        const userInfo = JSON.parse(savedUserInfo);
        if (!userInfo.isLoggedIn || userInfo.role !== '관리자') {
          // 관리자가 아니면 메인 페이지로 리다이렉트
          alert('관리자만 접근할 수 있는 페이지입니다.');
          window.location.href = '/';
          return;
        }
      } catch (error) {
        console.error('Failed to parse user info:', error);
        window.location.href = '/login';
      }
    } else {
      // 로그인 정보가 없으면 로그인 페이지로 리다이렉트
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
    }
  }, []);
  
  const currentPeriod = timePeriod || internalSelectedPeriod;
  const handlePeriodChange = (period: string) => {
    if (onTimePeriodChange) {
      onTimePeriodChange(period);
    } else {
      setInternalSelectedPeriod(period);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* 좌측 관리자 사이드바 */}
        <AdminNavigation />
        
        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 p-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {description && (
                  <p className="mt-2 text-sm text-gray-600">{description}</p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {!hideTimePeriod && (
                  <select
                    value={currentPeriod}
                    onChange={(e) => handlePeriodChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="최근 1일">최근 1일</option>
                    <option value="최근 7일">최근 7일</option>
                    <option value="최근 30일">최근 30일</option>
                    <option value="최근 90일">최근 90일</option>
                  </select>
                )}
                {actions}
              </div>
            </div>
          </div>

          {/* 페이지 콘텐츠 */}
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
} 