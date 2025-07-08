'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CompanyLayout from '@/components/CompanyLayout';
import { 
  Users,
  Building,
  Activity,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AnalyticsData {
  // 직원별 분석 데이터
  employeeStats: {
    name: string;
    department: string;
    totalCredits: number;
    avgCreditsPerDay: number;
    mostUsedAgent: string;
    activeHours: string;
    efficiency: number;
    lastActivity: string;
  }[];
  
  // 부서별 분석 데이터
  departmentStats: {
    name: string;
    totalCredits: number;
    employeeCount: number;
    avgCreditsPerEmployee: number;
    mostUsedAgent: string;
    efficiency: number;
    growth: number;
  }[];
  
  // 에이전트별 분석 데이터
  agentStats: {
    name: string;
    category: string;
    totalUsage: number;
    uniqueUsers: number;
    avgSessionTime: string;
    popularityScore: number;
    rating: number;
  }[];
}

function CompanyAnalyticsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('employee');
  const [currentPage, setCurrentPage] = useState(1);
  const [timePeriod, setTimePeriod] = useState('최근 7일');
  
  const itemsPerPage = 10;

  const mockData: AnalyticsData = {
    employeeStats: [
      { name: '김철수', department: '개발팀', totalCredits: 2500, avgCreditsPerDay: 125, mostUsedAgent: 'ChatGPT', activeHours: '09:00-18:00', efficiency: 92, lastActivity: '2024-01-15' },
      { name: '이영희', department: '마케팅팀', totalCredits: 2200, avgCreditsPerDay: 110, mostUsedAgent: 'Claude', activeHours: '10:00-19:00', efficiency: 88, lastActivity: '2024-01-14' },
      { name: '박민수', department: '디자인팀', totalCredits: 1800, avgCreditsPerDay: 90, mostUsedAgent: 'Midjourney', activeHours: '09:30-18:30', efficiency: 85, lastActivity: '2024-01-13' },
      { name: '최수진', department: '개발팀', totalCredits: 2100, avgCreditsPerDay: 105, mostUsedAgent: 'GitHub Copilot', activeHours: '08:00-17:00', efficiency: 94, lastActivity: '2024-01-15' },
      { name: '정호영', department: '기획팀', totalCredits: 1600, avgCreditsPerDay: 80, mostUsedAgent: 'Notion AI', activeHours: '10:00-19:00', efficiency: 82, lastActivity: '2024-01-12' },
      { name: '윤서연', department: '마케팅팀', totalCredits: 1900, avgCreditsPerDay: 95, mostUsedAgent: 'Canva AI', activeHours: '09:00-18:00', efficiency: 89, lastActivity: '2024-01-14' },
      { name: '강동혁', department: '영업팀', totalCredits: 1500, avgCreditsPerDay: 75, mostUsedAgent: 'Salesforce AI', activeHours: '09:00-18:00', efficiency: 78, lastActivity: '2024-01-11' },
      { name: '송미래', department: '디자인팀', totalCredits: 1700, avgCreditsPerDay: 85, mostUsedAgent: 'Figma AI', activeHours: '10:00-19:00', efficiency: 87, lastActivity: '2024-01-13' },
      { name: '임진우', department: '개발팀', totalCredits: 2300, avgCreditsPerDay: 115, mostUsedAgent: 'CodeT5', activeHours: '08:30-17:30', efficiency: 91, lastActivity: '2024-01-15' },
      { name: '한소영', department: '기획팀', totalCredits: 1400, avgCreditsPerDay: 70, mostUsedAgent: 'Miro AI', activeHours: '09:30-18:30', efficiency: 80, lastActivity: '2024-01-12' },
      { name: '장현석', department: '영업팀', totalCredits: 1300, avgCreditsPerDay: 65, mostUsedAgent: 'HubSpot AI', activeHours: '08:00-17:00', efficiency: 75, lastActivity: '2024-01-11' },
      { name: '오혜진', department: '마케팅팀', totalCredits: 2000, avgCreditsPerDay: 100, mostUsedAgent: 'Buffer AI', activeHours: '10:00-19:00', efficiency: 86, lastActivity: '2024-01-14' },
    ],
    departmentStats: [
      { name: '개발팀', totalCredits: 6900, employeeCount: 3, avgCreditsPerEmployee: 2300, mostUsedAgent: 'ChatGPT', efficiency: 92, growth: 15 },
      { name: '마케팅팀', totalCredits: 6100, employeeCount: 3, avgCreditsPerEmployee: 2033, mostUsedAgent: 'Claude', efficiency: 88, growth: 12 },
      { name: '디자인팀', totalCredits: 3500, employeeCount: 2, avgCreditsPerEmployee: 1750, mostUsedAgent: 'Midjourney', efficiency: 86, growth: 8 },
      { name: '기획팀', totalCredits: 3000, employeeCount: 2, avgCreditsPerEmployee: 1500, mostUsedAgent: 'Notion AI', efficiency: 81, growth: 5 },
      { name: '영업팀', totalCredits: 2800, employeeCount: 2, avgCreditsPerEmployee: 1400, mostUsedAgent: 'Salesforce AI', efficiency: 77, growth: 3 },
    ],
    agentStats: [
      { name: 'ChatGPT', category: '텍스트 AI', totalUsage: 8500, uniqueUsers: 45, avgSessionTime: '12분', popularityScore: 95, rating: 4.8 },
      { name: 'Claude', category: '텍스트 AI', totalUsage: 7200, uniqueUsers: 38, avgSessionTime: '15분', popularityScore: 88, rating: 4.7 },
      { name: 'Midjourney', category: '이미지 AI', totalUsage: 4500, uniqueUsers: 25, avgSessionTime: '8분', popularityScore: 78, rating: 4.6 },
      { name: 'GitHub Copilot', category: '코드 AI', totalUsage: 3800, uniqueUsers: 18, avgSessionTime: '20분', popularityScore: 82, rating: 4.9 },
      { name: 'Notion AI', category: '생산성 AI', totalUsage: 3200, uniqueUsers: 32, avgSessionTime: '10분', popularityScore: 72, rating: 4.5 },
      { name: 'Canva AI', category: '디자인 AI', totalUsage: 2800, uniqueUsers: 22, avgSessionTime: '18분', popularityScore: 68, rating: 4.4 },
      { name: 'Salesforce AI', category: '비즈니스 AI', totalUsage: 2400, uniqueUsers: 15, avgSessionTime: '14분', popularityScore: 65, rating: 4.3 },
      { name: 'Figma AI', category: '디자인 AI', totalUsage: 2200, uniqueUsers: 12, avgSessionTime: '16분', popularityScore: 62, rating: 4.2 },
      { name: 'CodeT5', category: '코드 AI', totalUsage: 1800, uniqueUsers: 8, avgSessionTime: '25분', popularityScore: 58, rating: 4.1 },
      { name: 'Miro AI', category: '협업 AI', totalUsage: 1600, uniqueUsers: 10, avgSessionTime: '11분', popularityScore: 55, rating: 4.0 },
    ]
  };

  const tabs = [
    { id: 'employee', name: '직원별 분석', icon: Users },
    { id: 'team', name: '부서별 분석', icon: Building },
    { id: 'agent', name: '에이전트별 분석', icon: Activity },
  ];

  // URL 파라미터에서 탭 확인
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['employee', 'team', 'agent'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // 페이지네이션 관련 함수
  const getCurrentData = () => {
    if (activeTab === 'employee') return mockData.employeeStats;
    if (activeTab === 'team') return mockData.departmentStats;
    if (activeTab === 'agent') return mockData.agentStats;
    return [];
  };

  const totalPages = Math.ceil(getCurrentData().length / itemsPerPage);
  const currentData = getCurrentData().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
    // 여기서 실제 데이터를 다시 불러와야 함
  };

  return (
    <CompanyLayout 
      title="분석 및 리포트"
      description="회사의 AI 사용 현황을 분석하고 리포트를 생성하세요"
      timePeriod={timePeriod}
      onTimePeriodChange={handleTimePeriodChange}
    >
      <div className="space-y-6">
        {/* 탭 메뉴 */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 직원별 분석 */}
        {activeTab === 'employee' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">직원별 AI 사용 분석</h3>
              <p className="text-sm text-gray-600 mt-1">
                직원들의 AI 사용 패턴과 효율성을 분석합니다.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      직원 정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용 크레딧
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      주요 AI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      활동 시간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      효율성
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      최근 활동
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(currentData as AnalyticsData['employeeStats']).map((employee, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {employee.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {employee.totalCredits.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          일평균 {employee.avgCreditsPerDay}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.mostUsedAgent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {employee.activeHours}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${employee.efficiency}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-900">{employee.efficiency}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.lastActivity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 부서별 분석 */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">부서별 AI 사용 분석</h3>
              <p className="text-sm text-gray-600 mt-1">
                부서별 AI 사용 현황과 성과를 분석합니다.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      부서명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      총 크레딧
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      직원 수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      평균 사용량
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      주요 AI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      효율성
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      성장률
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(currentData as AnalyticsData['departmentStats']).map((department, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">
                              {department.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{department.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {department.totalCredits.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {department.employeeCount}명
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {department.avgCreditsPerEmployee.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {department.mostUsedAgent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${department.efficiency}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-900">{department.efficiency}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          department.growth > 10 
                            ? 'bg-green-100 text-green-800' 
                            : department.growth > 5 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          +{department.growth}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 에이전트별 분석 */}
        {activeTab === 'agent' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">AI 에이전트별 사용 분석</h3>
              <p className="text-sm text-gray-600 mt-1">
                각 AI 에이전트의 사용 현황과 인기도를 분석합니다.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI 에이전트
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      총 사용량
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용자 수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      평균 세션 시간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      인기도
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      평점
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(currentData as AnalyticsData['agentStats']).map((agent, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                            <div className="text-sm text-gray-500">{agent.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agent.totalUsage.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agent.uniqueUsers}명
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agent.avgSessionTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${agent.popularityScore}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-900">{agent.popularityScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-yellow-400">★</span>
                          <span className="ml-1 text-sm text-gray-900">{agent.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-700">
              {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, getCurrentData().length)} / {getCurrentData().length}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </CompanyLayout>
  );
}

export default function CompanyAnalytics() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanyAnalyticsContent />
    </Suspense>
  );
}