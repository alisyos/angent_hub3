'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Users, 
  Bot, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react';

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('7d');

  // Mock data for admin dashboard
  const stats = {
    totalUsers: 2847,
    activeUsers: 1923,
    totalAgents: 10,
    activeAgents: 10,
    totalCreditsUsed: 47582,
    totalRevenue: 8950000,
    pendingInquiries: 23,
    resolvedInquiries: 156
  };

  const recentActivities = [
    { id: 1, type: 'user_signup', user: '김철수', time: '2분 전', details: '회사 계정으로 가입' },
    { id: 2, type: 'credit_purchase', user: '이영희', time: '5분 전', details: '1000 크레딧 구매' },
    { id: 3, type: 'agent_execution', user: '박민수', time: '8분 전', details: '회의록 자동화 AI 실행' },
    { id: 4, type: 'inquiry', user: '정수진', time: '12분 전', details: '결제 관련 문의 접수' },
    { id: 5, type: 'agent_execution', user: '최동현', time: '15분 전', details: 'PPT 슬라이드 생성기 실행' }
  ];

  const topAgents = [
    { name: '회의록 자동화 AI', usage: 1245, revenue: 124500 },
    { name: 'AI 블로그 생성기', usage: 987, revenue: 148050 },
    { name: 'PPT 슬라이드 생성기', usage: 756, revenue: 189000 },
    { name: '리뷰 분석 AI', usage: 634, revenue: 95100 },
    { name: '키워드 분석 AI', usage: 523, revenue: 62760 }
  ];

  const StatCard = ({ icon: Icon, title, value, change, changeType }: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative';
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
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
      timePeriod={dateRange === '1d' ? '최근 1일' : 
                  dateRange === '7d' ? '최근 7일' :
                  dateRange === '30d' ? '최근 30일' : '최근 90일'}
      onTimePeriodChange={(period) => {
        if (period === '최근 1일') setDateRange('1d');
        else if (period === '최근 7일') setDateRange('7d');
        else if (period === '최근 30일') setDateRange('30d');
        else if (period === '최근 90일') setDateRange('90d');
      }}
    >

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="총 사용자"
            value={stats.totalUsers.toLocaleString()}
            change="+12.5%"
            changeType="positive"
          />
          <StatCard
            icon={Users}
            title="활성 사용자"
            value={stats.activeUsers.toLocaleString()}
            change="+8.2%"
            changeType="positive"
          />
          <StatCard
            icon={Bot}
            title="AI 에이전트"
            value={`${stats.activeAgents}/${stats.totalAgents}`}
            change="100% 활성"
            changeType="positive"
          />
          <StatCard
            icon={DollarSign}
            title="총 매출"
            value={`${(stats.totalRevenue / 1000000).toFixed(1)}M원`}
            change="+23.1%"
            changeType="positive"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">최근 활동</h2>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user}
                      </p>
                      <p className="text-sm text-gray-600">{activity.details}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  모든 활동 보기
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Credit Usage */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">크레딧 사용량</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">총 사용량</span>
                  <span className="font-semibold">{stats.totalCreditsUsed.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '73%' }}></div>
                </div>
                <p className="text-xs text-gray-500">전월 대비 +15% 증가</p>
              </div>
            </div>

            {/* Inquiry Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">문의 현황</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">대기중</span>
                  </div>
                  <span className="font-semibold text-yellow-600">{stats.pendingInquiries}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">해결완료</span>
                  </div>
                  <span className="font-semibold text-green-600">{stats.resolvedInquiries}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm">
                  새 에이전트 추가
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm">
                  사용자 관리
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm">
                  문의 관리
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm">
                  매출 분석
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Agents */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">인기 AI 에이전트</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      에이전트명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용횟수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      수익
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topAgents.map((agent, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{agent.usage.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{agent.revenue.toLocaleString()}원</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          활성
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </AdminLayout>
  );
} 