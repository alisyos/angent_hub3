'use client';

import { useState } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { 
  Users,
  Bot,
  CreditCard,
  PlusCircle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { employeeData, departmentData, companyStats, agentUsageData } from '@/data/company';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function CompanyDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('최근 7일');
  
  // 대시보드에서는 상위 5명의 직원만 표시 (사용량 기준)
  const topEmployeesByUsage = [...employeeData]
    .filter(emp => emp.creditsUsed > 0)
    .sort((a, b) => b.creditsUsed - a.creditsUsed)
    .slice(0, 5);

  // 부서별 사용 현황 (상위 5개 부서)
  const topDepartmentsByUsage = [...departmentData]
    .filter(dept => dept.creditsUsed > 0)
    .sort((a, b) => b.creditsUsed - a.creditsUsed)
    .slice(0, 5);

  // 인기 AI 에이전트 (상위 5개)
  const topAgents = agentUsageData.slice(0, 5);

  // 크레딧 충전 내역 (2025년 7월 8일 기준 최근 데이터)
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
    { id: 15, amount: 30000, description: '프로 패키지', date: '2025-03-20', balance: 35000, paymentMethod: '카드', invoice: '2025-015', credits: 3200 }
  ];

  // 기간별 크레딧 충전 현황 계산
  const getCreditChargeStats = () => {
    let filtered = [...creditPurchaseHistory];
    const now = new Date();
    let startDate = new Date();

    switch (selectedPeriod) {
      case '최근 1일':
        startDate.setDate(now.getDate() - 7);
        break;
      case '최근 7일':
        startDate.setDate(now.getDate() - 7);
        break;
      case '최근 30일':
        startDate.setDate(now.getDate() - 30);
        break;
      case '최근 90일':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate = new Date('2023-01-01');
    }

    filtered = filtered.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });

    const totalAmount = filtered.reduce((sum, item) => sum + item.amount, 0);
    const totalCount = filtered.length;

    return { totalAmount, totalCount };
  };

  // 기간별 그래프 데이터 (크레딧 사용량과 사용횟수 포함)
  const getChartData = () => {
    switch (selectedPeriod) {
      case '최근 1일':
        // 최근 7일간의 크레딧 사용량
        return [
          { period: '01-14', usage: 720, count: 45 },
          { period: '01-15', usage: 850, count: 52 },
          { period: '01-16', usage: 920, count: 58 },
          { period: '01-17', usage: 780, count: 48 },
          { period: '01-18', usage: 1050, count: 65 },
          { period: '01-19', usage: 1180, count: 72 },
          { period: '01-20', usage: 1320, count: 78 }
        ];
      case '최근 7일':
        // 최근 10주간의 크레딧 사용량
        return [
          { period: '10주전', usage: 4200, count: 280 },
          { period: '9주전', usage: 4800, count: 320 },
          { period: '8주전', usage: 5100, count: 340 },
          { period: '7주전', usage: 4950, count: 330 },
          { period: '6주전', usage: 5300, count: 353 },
          { period: '5주전', usage: 5700, count: 380 },
          { period: '4주전', usage: 5850, count: 390 },
          { period: '3주전', usage: 6200, count: 413 },
          { period: '2주전', usage: 5900, count: 393 },
          { period: '1주전', usage: 6500, count: 433 }
        ];
      case '최근 30일':
      case '최근 90일':
        // 최근 12개월의 크레딧 사용량
        return [
          { period: '1월', usage: 18500, count: 1233 },
          { period: '2월', usage: 22000, count: 1467 },
          { period: '3월', usage: 19800, count: 1320 },
          { period: '4월', usage: 24500, count: 1633 },
          { period: '5월', usage: 27200, count: 1813 },
          { period: '6월', usage: 25800, count: 1720 },
          { period: '7월', usage: 29100, count: 1940 },
          { period: '8월', usage: 31500, count: 2100 },
          { period: '9월', usage: 28900, count: 1927 },
          { period: '10월', usage: 33200, count: 2213 },
          { period: '11월', usage: 35800, count: 2387 },
          { period: '12월', usage: 38400, count: 2560 }
        ];
      default:
        return [];
    }
  };

  return (
    <CompanyLayout 
      title="회사 관리 대시보드"
      description="AI 에이전트 사용 현황과 직원 관리를 한눈에 확인하세요"
      timePeriod={selectedPeriod}
      onTimePeriodChange={setSelectedPeriod}
    >
      <div className="space-y-8">
        {/* 상단 메인 섹션 - 좌측 카드 3개, 우측 그래프 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-80 mb-40">
          {/* 좌측 카드 섹션 */}
          <div className="flex flex-col justify-between space-y-3 h-full">
            {/* 크레딧 사용량 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-1 relative">
              <button 
                onClick={() => window.location.href = '/company/analytics?tab=employee'}
                className="absolute top-4 right-4 text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>전체 보기</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <div className="flex items-center justify-between h-full pr-16">
                <div>
                  <p className="text-sm font-medium text-gray-600">크레딧 사용량</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{companyStats.totalCreditsUsed.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">잔여: {companyStats.totalCreditsRemaining.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            
            {/* 크레딧 충전 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-1 relative">
              <button 
                onClick={() => window.location.href = '/company/credits'}
                className="absolute top-4 right-4 text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>전체 보기</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <div className="flex items-center justify-between h-full pr-16">
                <div>
                  <p className="text-sm font-medium text-gray-600">크레딧 충전</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{getCreditChargeStats().totalAmount.toLocaleString()}원</p>
                  <p className="text-sm text-orange-600 mt-1">{getCreditChargeStats().totalCount}회 충전</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <PlusCircle className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>

            {/* 총 직원 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-1 relative">
              <button 
                onClick={() => window.location.href = '/company/employees'}
                className="absolute top-4 right-4 text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>전체 보기</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <div className="flex items-center justify-between h-full pr-16">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 직원</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{companyStats.totalEmployees}</p>
                  <p className="text-sm text-green-600 mt-1">활성: {companyStats.activeEmployees}명</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* 우측 그래프 섹션 */}
          <div className="lg:col-span-2 h-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">크레딧 사용량 현황</h2>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="period" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        fontSize: '12px'
                      }}
                      formatter={(value, name) => [
                        name === 'usage' ? value.toLocaleString() + ' 크레딧' : value.toLocaleString() + ' 회',
                        name === 'usage' ? '크레딧 사용량' : '사용 횟수'
                      ]}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="usage" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                      name="크레딧 사용량"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="count" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                      name="사용 횟수"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* 주요 콘텐츠 섹션 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* 직원별 사용 현황 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">직원별 사용 현황</h2>
              <button 
                onClick={() => window.location.href = '/company/analytics?tab=employee'}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
              >
                <span>전체 보기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {topEmployeesByUsage.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{employee.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{employee.name}</h3>
                          <p className="text-xs text-gray-500">{employee.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-blue-600">{employee.creditsUsed}</span>
                        <span className="text-xs text-gray-500 ml-1">크레딧</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>주요 사용: {employee.mostUsedAgent}</span>
                      <span>최근 활동: {employee.lastActive}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 부서별 사용 현황 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">부서별 사용 현황</h2>
              <button 
                onClick={() => window.location.href = '/company/analytics?tab=team'}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
              >
                <span>전체 보기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {topDepartmentsByUsage.map((department) => (
                <div key={department.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">{department.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{department.name}</h3>
                          <p className="text-xs text-gray-500">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              department.status === '전체 허용' ? 'bg-green-100 text-green-600' :
                              department.status === '일부 허용' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                              {department.status}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-purple-600">{department.creditsUsed}</span>
                        <span className="text-xs text-gray-500 ml-1">크레딧</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>주요 사용: {department.topAgent}</span>
                      <span>사용량: {department.usageCount}회</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 인기 AI 에이전트 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">인기 AI 에이전트</h2>
            <button 
              onClick={() => window.location.href = '/company/analytics?tab=agent'}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
            >
              <span>전체 보기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {topAgents.map((agent) => (
              <div key={agent.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-500">{agent.category}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{agent.name}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{agent.usageCount}회 사용</span>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>{agent.creditsUsed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
