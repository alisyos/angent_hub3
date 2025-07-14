'use client';

import { useState } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { 
  Calendar
} from 'lucide-react';

export default function CompanyCredits() {
  const [dateRange, setDateRange] = useState('7d');
  const [customDateRange, setCustomDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 기간에 따른 날짜 계산
  const getDateRange = () => {
    const now = new Date();
    let startDate = new Date();
    
    if (dateRange === '7d') {
      startDate.setDate(now.getDate() - 7);
    } else if (dateRange === '30d') {
      startDate.setDate(now.getDate() - 30);
    } else if (dateRange === 'custom' && customDateRange) {
      startDate = new Date(customDateRange.startDate);
      const endDate = new Date(customDateRange.endDate);
      endDate.setHours(23, 59, 59, 999);
      return { startDate, endDate };
    }
    
    return { startDate, endDate: now };
  };

  const { startDate, endDate } = getDateRange();

  // CompanyLayout에서 호출되는 기간 변경 핸들러
  const handleTimePeriodChange = (period: string) => {
    if (period === '최근 7일') {
      setDateRange('7d');
      setCustomDateRange(null);
    } else if (period === '최근 30일') {
      setDateRange('30d');
      setCustomDateRange(null);
    } else if (period === '직접입력') {
      setDateRange('custom');
    }
    setCurrentPage(1); // 필터 변경시 첫 페이지로 이동
  };

  // 커스텀 날짜 범위 설정 핸들러
  const handleCustomDateRange = (dateRange: { startDate: string; endDate: string }) => {
    setCustomDateRange(dateRange);
    setDateRange('custom');
    setCurrentPage(1);
  };

  // 현재 선택된 기간 텍스트 반환
  const getCurrentPeriodText = () => {
    if (dateRange === '7d') return '최근 7일';
    if (dateRange === '30d') return '최근 30일';
    if (dateRange === 'custom' && customDateRange) {
      const start = new Date(customDateRange.startDate).toLocaleDateString('ko-KR');
      const end = new Date(customDateRange.endDate).toLocaleDateString('ko-KR');
      return `${start} ~ ${end}`;
    }
    return '직접입력';
  };

  // 회사 크레딧 충전 내역 (2025년 7월 8일 기준 최근 데이터)
  const creditPurchaseHistory = [
    { id: 1, amount: 50000, description: '엔터프라이즈 패키지', date: '2025-07-08', balance: 62500, paymentMethod: '카드', invoice: '2025-001', credits: 5000 },
    { id: 2, amount: 30000, description: '프로 패키지', date: '2025-07-05', balance: 37500, paymentMethod: '계좌이체', invoice: '2025-002', credits: 3000 },
    { id: 3, amount: 20000, description: '스탠다드 패키지', date: '2025-07-02', balance: 25000, paymentMethod: '카드', invoice: '2025-003', credits: 2000 },
    { id: 4, amount: 100000, description: '연간 패키지', date: '2025-06-28', balance: 105000, paymentMethod: '계좌이체', invoice: '2025-004', credits: 12000 },
    { id: 5, amount: 15000, description: '베이직 패키지', date: '2025-06-25', balance: 20000, paymentMethod: '카드', invoice: '2025-005', credits: 1500 },
    { id: 6, amount: 40000, description: '프리미엄 패키지', date: '2025-06-20', balance: 45000, paymentMethod: '계좌이체', invoice: '2025-006', credits: 4500 },
    { id: 7, amount: 25000, description: '스탠다드 패키지', date: '2025-06-15', balance: 30000, paymentMethod: '카드', invoice: '2025-007', credits: 2500 },
    { id: 8, amount: 60000, description: '엔터프라이즈 패키지', date: '2025-06-10', balance: 65000, paymentMethod: '카드', invoice: '2025-008', credits: 6500 },
    { id: 9, amount: 35000, description: '프로 패키지', date: '2025-05-20', balance: 40000, paymentMethod: '계좌이체', invoice: '2025-009', credits: 3500 },
    { id: 10, amount: 50000, description: '엔터프라이즈 패키지', date: '2025-05-15', balance: 55000, paymentMethod: '카드', invoice: '2025-010', credits: 5500 },
    { id: 11, amount: 22000, description: '스탠다드 패키지', date: '2025-05-05', balance: 27000, paymentMethod: '카드', invoice: '2025-011', credits: 2200 },
    { id: 12, amount: 80000, description: '연간 패키지', date: '2025-04-25', balance: 85000, paymentMethod: '계좌이체', invoice: '2025-012', credits: 9000 },
    { id: 13, amount: 18000, description: '베이직 패키지', date: '2025-04-15', balance: 23000, paymentMethod: '카드', invoice: '2025-013', credits: 1800 },
    { id: 14, amount: 45000, description: '프리미엄 패키지', date: '2025-04-10', balance: 50000, paymentMethod: '계좌이체', invoice: '2025-014', credits: 4800 },
    { id: 15, amount: 30000, description: '프로 패키지', date: '2025-03-20', balance: 35000, paymentMethod: '카드', invoice: '2025-015', credits: 3200 },
    { id: 16, amount: -25000, description: '프로 패키지 환불', date: '2025-07-03', balance: 15000, paymentMethod: '환불', invoice: '2025-R001', credits: -2500 },
    { id: 17, amount: -15000, description: '베이직 패키지 환불', date: '2025-06-18', balance: 18500, paymentMethod: '환불', invoice: '2025-R002', credits: -1500 },
    { id: 18, amount: -40000, description: '프리미엄 패키지 환불', date: '2025-05-28', balance: 30000, paymentMethod: '환불', invoice: '2025-R003', credits: -4000 }
  ];

  // 크레딧 충전 내역 관련 함수들
  const getFilteredCreditHistory = () => {
    let filtered = [...creditPurchaseHistory];

    // 기간 필터링
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPaginatedCreditHistory = () => {
    const filtered = getFilteredCreditHistory();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredCreditHistory().length / itemsPerPage);
  };

  const getTotalAmount = () => {
    return getFilteredCreditHistory().reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalCredits = () => {
    return getFilteredCreditHistory().reduce((sum, item) => sum + item.credits, 0);
  };

  return (
    <CompanyLayout 
      title="크레딧 충전 내역"
      description="회사 크레딧 충전 이력을 확인하고 관리하세요"
      timePeriod={getCurrentPeriodText()}
      onTimePeriodChange={handleTimePeriodChange}
      customDateRange={customDateRange || undefined}
      onCustomDateRange={handleCustomDateRange}
    >
      <div className="space-y-6">
        {/* 요약 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600">총 충전 금액</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {getTotalAmount().toLocaleString()}원
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600">충전 횟수</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {getFilteredCreditHistory().length}회
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600">충전 크레딧</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {getTotalCredits().toLocaleString()}
            </p>
          </div>
        </div>

        {/* 충전 내역 테이블 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">크레딧 충전 내역</h3>
            <p className="text-sm text-gray-600 mt-1">
              총 {getFilteredCreditHistory().length}건의 충전 내역이 있습니다.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    충전일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    패키지명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    충전 금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    결제 방법
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    충전 크레딧
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    충전 후 잔여 크레딧
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getPaginatedCreditHistory().map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {item.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {item.amount >= 0 ? '+' : ''}{item.amount.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.paymentMethod === '카드' 
                          ? 'bg-blue-100 text-blue-800' 
                          : item.paymentMethod === '환불'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                      {item.credits >= 0 ? '+' : ''}{item.credits.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <AdminPagination
            currentPage={currentPage}
            totalPages={getTotalPages()}
            totalItems={getFilteredCreditHistory().length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>
    </CompanyLayout>
  );
} 