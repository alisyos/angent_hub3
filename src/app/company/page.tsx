'use client';

import { useState } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { 
  Users, 
  Bot, 
  CreditCard, 
  TrendingUp, 
  BarChart3,
  Download,
  Settings,
  ArrowRight,
  Calendar,
  Clock,
  Target,
  AlertCircle
} from 'lucide-react';

export default function CompanyDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const companyStats = {
    totalEmployees: 45,
    activeEmployees: 38,
    totalCreditsUsed: 12500,
    totalCreditsRemaining: 7500,
    mostUsedAgent: '회의록 자동화 AI',
    efficiency: 87.5,
    costSavings: 2400000,
    efficiencyIncrease: 24
  };

  const employeeUsage = [
    { id: 1, name: '김철수', department: '개발팀', creditsUsed: 450, mostUsedAgent: '회의록 자동화 AI', lastActive: '2024-01-20', email: 'kim@company.com', status: 'active' },
    { id: 2, name: '이영희', department: '마케팅팀', creditsUsed: 380, mostUsedAgent: 'SNS 이벤트 기획 AI', lastActive: '2024-01-20', email: 'lee@company.com', status: 'active' },
    { id: 3, name: '박민수', department: '기획팀', creditsUsed: 320, mostUsedAgent: 'PPT 슬라이드 생성기', lastActive: '2024-01-19', email: 'park@company.com', status: 'active' },
    { id: 4, name: '정수진', department: '디자인팀', creditsUsed: 290, mostUsedAgent: '카드뉴스 생성 AI', lastActive: '2024-01-19', email: 'jung@company.com', status: 'active' },
    { id: 5, name: '최동현', department: '영업팀', creditsUsed: 250, mostUsedAgent: '이메일 자동 작성 AI', lastActive: '2024-01-18', email: 'choi@company.com', status: 'inactive' }
  ];

  const topAgents = [
    { name: '회의록 자동화 AI', usage: 145, efficiency: 94, category: '일반사무' },
    { name: 'PPT 슬라이드 생성기', usage: 128, efficiency: 91, category: '일반사무' },
    { name: 'SNS 이벤트 기획 AI', usage: 98, efficiency: 89, category: '마케팅/광고' },
    { name: '카드뉴스 생성 AI', usage: 87, efficiency: 88, category: '콘텐츠 제작' },
    { name: '이메일 자동 작성 AI', usage: 76, efficiency: 92, category: '일반사무' }
  ];

  const weeklyData = [
    { date: '01-15', usage: 1200, efficiency: 85 },
    { date: '01-16', usage: 1350, efficiency: 87 },
    { date: '01-17', usage: 1180, efficiency: 89 },
    { date: '01-18', usage: 1420, efficiency: 91 },
    { date: '01-19', usage: 1380, efficiency: 88 },
    { date: '01-20', usage: 1650, efficiency: 92 },
    { date: '01-21', usage: 1520, efficiency: 90 }
  ];

  const alerts = [
    { type: 'warning', message: '마케팅팀 크레딧 사용량이 80%에 도달했습니다', time: '2시간 전' },
    { type: 'info', message: '새로운 AI 에이전트가 추가되었습니다', time: '1일 전' },
    { type: 'success', message: '월간 효율성 목표를 달성했습니다', time: '2일 전' }
  ];

  return (
    <CompanyLayout 
      title="회사 관리 대시보드"
      description="AI 에이전트 사용 현황과 직원 관리를 한눈에 확인하세요"
      actions={
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>크레딧 충전</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>리포트 다운로드</span>
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* 핵심 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 직원</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{companyStats.totalEmployees}</p>
                <p className="text-sm text-green-600 mt-1">활성: {companyStats.activeEmployees}명</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">크레딧 사용량</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{companyStats.totalCreditsUsed.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">잔여: {companyStats.totalCreditsRemaining.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">평균 효율성</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{companyStats.efficiency}%</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{companyStats.efficiencyIncrease}% 향상
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">비용 절감</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">₩{(companyStats.costSavings / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  이번 달 절감액
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 주요 콘텐츠 섹션 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* 직원별 사용 현황 */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">직원별 사용 현황</h2>
                <div className="flex items-center space-x-3">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>내보내기</span>
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                    <span>전체 보기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {employeeUsage.map((employee) => (
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
          </div>

          {/* 사이드바 - 알림 및 빠른 액션 */}
          <div className="space-y-6">
            {/* 크레딧 현황 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">크레딧 현황</h3>
                <Settings className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">이번 달 사용량</span>
                  <span className="text-sm font-medium text-gray-900">{companyStats.totalCreditsUsed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">잔여 크레딧</span>
                  <span className="text-sm font-medium text-green-600">{companyStats.totalCreditsRemaining.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">사용률</span>
                  <span className="text-sm font-medium text-blue-600">62%</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>20,000</span>
                </div>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>크레딧 충전</span>
              </button>
            </div>

            {/* 알림 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 알림</h3>
              
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    alert.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
                    alert.type === 'info' ? 'bg-blue-50 border-l-4 border-blue-400' :
                    'bg-green-50 border-l-4 border-green-400'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <AlertCircle className={`w-4 h-4 mt-0.5 ${
                        alert.type === 'warning' ? 'text-yellow-600' :
                        alert.type === 'info' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 인기 AI 에이전트 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">인기 AI 에이전트</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
              <span>전체 보기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {topAgents.map((agent, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-500">{agent.category}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{agent.name}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{agent.usage}회 사용</span>
                  <span>{agent.efficiency}% 효율</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 주간 사용량 트렌드 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">주간 사용량 트렌드</h2>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">2024년 1월 3주차</span>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{day.date}</div>
                <div 
                  className="w-full bg-blue-100 rounded-full flex items-end justify-center text-xs font-medium text-blue-600 hover:bg-blue-200 transition-colors cursor-pointer"
                  style={{ height: `${Math.max(40, (day.usage / 1650) * 100)}px` }}
                >
                  {day.usage}
                </div>
                <div className="text-xs text-gray-500 mt-1">{day.efficiency}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
