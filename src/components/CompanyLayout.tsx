'use client';

import { ReactNode, useState, useEffect } from 'react';
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
  customDateRange?: { startDate: string; endDate: string };
  onCustomDateRange?: (dateRange: { startDate: string; endDate: string }) => void;
}

export default function CompanyLayout({ 
  children, 
  title, 
  description, 
  actions, 
  hideTimePeriod = false, 
  timePeriod = '최근 7일',
  onTimePeriodChange,
  customDateRange,
  onCustomDateRange
}: CompanyLayoutProps) {
  const [internalSelectedPeriod, setInternalSelectedPeriod] = useState('최근 7일');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  // 권한 체크 - 회사 일반 사용자는 회사 관리 페이지에 접근 불가
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        const userInfo = JSON.parse(savedUserInfo);
        if (userInfo.isLoggedIn && userInfo.role === '회사일반사용자') {
          // 회사 일반 사용자는 회사 관리 페이지에 접근 불가
          window.location.href = '/';
          return;
        }
      } catch (error) {
        console.error('Failed to parse user info:', error);
      }
    }
  }, []);

  // 커스텀 날짜 범위 설정
  useEffect(() => {
    if (customDateRange) {
      setCustomStartDate(customDateRange.startDate);
      setCustomEndDate(customDateRange.endDate);
    }
  }, [customDateRange]);
  
  const currentPeriod = timePeriod || internalSelectedPeriod;
  
  const handlePeriodChange = (period: string) => {
    if (period === '직접입력') {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
    }
    
    if (onTimePeriodChange) {
      onTimePeriodChange(period);
    } else {
      setInternalSelectedPeriod(period);
    }
  };

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate && onCustomDateRange) {
      onCustomDateRange({
        startDate: customStartDate,
        endDate: customEndDate
      });
      setShowCustomDatePicker(false);
    }
  };

  const handleCustomDateReset = () => {
    setShowCustomDatePicker(false);
    setCustomStartDate('');
    setCustomEndDate('');
    const resetPeriod = '최근 7일';
    if (onTimePeriodChange) {
      onTimePeriodChange(resetPeriod);
    } else {
      setInternalSelectedPeriod(resetPeriod);
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
                  <div className="relative">
                    <select
                      value={currentPeriod}
                      onChange={(e) => handlePeriodChange(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="최근 7일">최근 7일</option>
                      <option value="최근 30일">최근 30일</option>
                      <option value="직접입력">직접입력</option>
                    </select>
                    
                    {/* 커스텀 날짜 선택 모달 */}
                    {showCustomDatePicker && (
                      <div className="absolute top-full right-0 mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-72">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">기간 직접 선택</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">시작일</label>
                            <input
                              type="date"
                              value={customStartDate}
                              onChange={(e) => setCustomStartDate(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">종료일</label>
                            <input
                              type="date"
                              value={customEndDate}
                              onChange={(e) => setCustomEndDate(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleCustomDateSubmit}
                              disabled={!customStartDate || !customEndDate}
                              className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              적용
                            </button>
                            <button
                              onClick={handleCustomDateReset}
                              className="flex-1 px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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