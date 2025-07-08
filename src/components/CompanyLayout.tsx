'use client';

import { ReactNode, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CompanyNavigation from '@/components/CompanyNavigation';

interface CompanyLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
  hideTimePeriod?: boolean;
  timePeriod?: string;
  onTimePeriodChange?: (period: string) => void;
}

export default function CompanyLayout({ 
  children, 
  title, 
  description, 
  actions, 
  hideTimePeriod = false, 
  timePeriod = '최근 7일',
  onTimePeriodChange 
}: CompanyLayoutProps) {
  const [internalSelectedPeriod, setInternalSelectedPeriod] = useState('최근 7일');
  
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
        {/* 좌측 사이드바 */}
        <CompanyNavigation />
        
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
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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