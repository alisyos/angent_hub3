'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Users, 
  Bot, 
  DollarSign,
  MessageSquare,
  HelpCircle,
  Package,
  ArrowUpRight,
  Star,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react';
import { mockUsers } from '@/data/admin';
import { mockPayments } from '@/data/admin';
import { mockInquiries } from '@/data/admin';
import { mockFAQs } from '@/data/admin';
import { aiAgents, categories } from '@/data/agents';
import { creditPackages } from '@/data/agents';
import Link from 'next/link';

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('7d');
  const [customDateRange, setCustomDateRange] = useState<{ startDate: string; endDate: string } | null>(null);

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
      endDate.setHours(23, 59, 59, 999); // 종료일의 끝까지 포함
      return { startDate, endDate };
    }
    
    return { startDate, endDate: now };
  };

  const { startDate, endDate } = getDateRange();

  // AdminLayout에서 호출되는 기간 변경 핸들러
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
  };

  // 커스텀 날짜 범위 설정 핸들러
  const handleCustomDateRange = (dateRange: { startDate: string; endDate: string }) => {
    setCustomDateRange(dateRange);
    setDateRange('custom');
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

  // 기간 내 결제 데이터 필터링
  const periodPayments = mockPayments.filter(payment => {
    const paymentDate = new Date(payment.createdAt);
    return paymentDate >= startDate && paymentDate <= endDate;
  });

  // 사용자 통계 계산 (기간 무관)
  const userStats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === 'active').length,
    general: mockUsers.filter(u => u.type === 'general_user').length,
    generalActive: mockUsers.filter(u => u.type === 'general_user' && u.status === 'active').length,
    generalInactive: mockUsers.filter(u => u.type === 'general_user' && u.status !== 'active').length,
    company: mockUsers.filter(u => u.type === 'company_admin' || u.type === 'company_employee').length,
    companyActive: mockUsers.filter(u => (u.type === 'company_admin' || u.type === 'company_employee') && u.status === 'active').length,
    companyInactive: mockUsers.filter(u => (u.type === 'company_admin' || u.type === 'company_employee') && u.status !== 'active').length
  };

  // 기간별 결제 통계 계산
  const paymentStats = {
    periodRevenue: periodPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    periodTransactions: periodPayments.filter(p => p.status === 'completed').length,
    periodRefunds: periodPayments.filter(p => p.status === 'refunded').length,
    totalRevenue: mockPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  // 문의 통계 계산
  const inquiryStats = {
    total: mockInquiries.length,
    pending: mockInquiries.filter(i => i.status === 'pending').length,
    completed: mockInquiries.filter(i => i.status === 'completed').length
  };

  // FAQ 통계 계산
  const faqStats = {
    total: mockFAQs.length,
    published: mockFAQs.filter(f => f.isPublished).length,
    draft: mockFAQs.filter(f => !f.isPublished).length
  };

  // 에이전트 통계 계산
  const agentStats = {
    total: aiAgents.length,
    active: aiAgents.filter(a => a.isActive).length,
    periodUsage: 1234 // Mock 데이터 - 기간 내 사용횟수
  };

  // 크레딧 패키지 통계
  const packageStats = {
    total: creditPackages.length,
    active: creditPackages.filter(p => p.isActive).length,
    popular: creditPackages.filter(p => p.popular).length
  };

  // 카테고리 통계
  const categoryStats = {
    total: categories.length,
    active: categories.filter(c => c.isActive).length
  };

  // 인기 에이전트 Top 5 (성공률 포함)
  const topAgents = aiAgents
    .map(agent => ({
      ...agent,
      usage: Math.floor(Math.random() * 1000) + 100, // Mock usage data
      successRate: Math.floor(Math.random() * 20) + 80 // Mock success rate (80-99%)
    }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5);

  const StatCard = ({ icon: Icon, title, value, subtitle, onClick }: {
    icon: React.ComponentType<any>;
    title: string;
    value: string;
    subtitle?: string;
    onClick?: () => void;
  }) => (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-32 transition-all hover:shadow-md ${
        onClick ? 'cursor-pointer hover:border-blue-300' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout
      title="관리자 대시보드"
      description="플랫폼 전체 현황을 한눈에 확인하세요"
      timePeriod={getCurrentPeriodText()}
      onTimePeriodChange={handleTimePeriodChange}
      customDateRange={customDateRange || undefined}
      onCustomDateRange={handleCustomDateRange}
    >

        {/* 핵심 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/users">
            <StatCard
              icon={Users}
              title="총 사용자"
              value={userStats.total.toLocaleString()}
              subtitle={`활성: ${userStats.active}명`}
            />
          </Link>
          
          <Link href="/admin/payments">
            <StatCard
              icon={DollarSign}
              title="총 매출"
              value={`${Math.round(paymentStats.periodRevenue / 10000)}만원`}
              subtitle={`기간 내 매출`}
            />
          </Link>

          <Link href="/admin/agents">
            <StatCard
              icon={Bot}
              title="AI 에이전트"
              value={`${agentStats.active}/${agentStats.total}`}
              subtitle={`기간 내 사용: ${agentStats.periodUsage.toLocaleString()}회`}
            />
          </Link>

          <Link href="/admin/inquiries">
            <StatCard
              icon={MessageSquare}
              title="문의 현황"
              value={inquiryStats.pending.toString()}
              subtitle={`대기중 / 전체 ${inquiryStats.total}건`}
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* 빠른 통계 */}
          <div className="space-y-6">
            {/* 서비스 현황 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">서비스 현황</h3>
              <div className="space-y-4">
                <Link href="/admin/credit-packages" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">크레딧 패키지</p>
                      <p className="text-xs text-gray-500">{packageStats.active}개 활성</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link href="/admin/faq" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">FAQ</p>
                      <p className="text-xs text-gray-500">{faqStats.published}개 게시</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </Link>

                <Link href="/admin/categories" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">카테고리</p>
                      <p className="text-xs text-gray-500">{categoryStats.active}개 활성</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* 상세 통계 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 사용자 유형별 분포 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">사용자 유형별 분포</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">일반 사용자</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">활성</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{userStats.generalActive}명</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-600">비활성</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{userStats.generalInactive}명</span>
                    </div>
                    <div className="pt-1 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">소계</span>
                        <span className="text-sm font-bold text-blue-600">{userStats.general}명</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">회사 사용자</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">활성</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{userStats.companyActive}명</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <span className="text-sm text-gray-600">비활성</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{userStats.companyInactive}명</span>
                    </div>
                    <div className="pt-1 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">소계</span>
                        <span className="text-sm font-bold text-green-600">{userStats.company}명</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 결제 현황 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">결제 현황 ({getCurrentPeriodText()})</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">총 거래건수</span>
                    <span className="text-sm font-medium text-gray-900">{paymentStats.periodTransactions}건</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">환불건수</span>
                    <span className="text-sm font-medium text-gray-900">{paymentStats.periodRefunds}건</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">기간 내 매출</span>
                    <span className="text-sm font-medium text-green-600">
                      {Math.round(paymentStats.periodRevenue / 10000)}만원
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">환불률</span>
                    <span className="text-sm font-medium text-gray-900">
                      {paymentStats.periodTransactions > 0 ? Math.round((paymentStats.periodRefunds / paymentStats.periodTransactions) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 인기 AI 에이전트 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">인기 AI 에이전트 TOP 5</h2>
            <Link href="/admin/agents" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              전체 보기
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    순위
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    에이전트명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사용횟수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    성공률
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topAgents.map((agent, index) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 && <Star className="w-4 h-4 text-yellow-400 mr-1" />}
                        <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                      <div className="text-sm text-gray-500">{agent.creditCost} 크레딧</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        agent.category === '일반사무' ? 'bg-blue-100 text-blue-800' :
                        agent.category === '마케팅/광고' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {agent.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agent.usage.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agent.successRate}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        agent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {agent.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </AdminLayout>
  );
} 