'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CompanyLayout from '@/components/CompanyLayout';
import Modal from '@/components/Modal';
import AdminPagination from '@/components/admin/AdminPagination';
import { aiAgents } from '@/data/agents';
import { 
  Users,
  Building,
  Activity,
  Clock,
  Eye
} from 'lucide-react';

interface AnalyticsData {
  // 직원별 분석 데이터
  employeeStats: {
    name: string;
    department: string;
    totalCredits: number;
    usageCount: number;
    mostUsedAgent: string;
    lastActivity: string;
    agentUsage: { agentName: string; usageCount: number; credits: number }[];
  }[];
  
  // 부서별 분석 데이터
  departmentStats: {
    name: string;
    totalCredits: number;
    usageCount: number;
    mostUsedAgent: string;
    agentUsage: { agentName: string; usageCount: number; credits: number }[];
  }[];
  
  // 에이전트별 분석 데이터
  agentStats: {
    name: string;
    totalCredits: number;
    usageCount: number;
    userCount: number;
    userUsage: { userName: string; department: string; usageCount: number; credits: number }[];
  }[];
}

function CompanyAnalyticsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('employee');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [dateRange, setDateRange] = useState('7d');
  const [customDateRange, setCustomDateRange] = useState<{ startDate: string; endDate: string } | null>(null);

  // 모달 상태
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    type: 'employee' | 'department' | 'agent' | null;
    data: any;
  }>({
    isOpen: false,
    type: null,
    data: null
  });

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
    setCurrentPage(1);
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

  // AI 에이전트 이름 목록 생성
  const agentNames = aiAgents.map(agent => agent.name);

  const mockData: AnalyticsData = {
    employeeStats: [
      { 
        name: '김철수', 
        department: '개발팀', 
        totalCredits: 250, 
        usageCount: 25, 
        mostUsedAgent: '회의록 자동화 AI', 
        lastActivity: '2024-01-15',
        agentUsage: [
          { agentName: '회의록 자동화 AI', usageCount: 8, credits: 80 },
          { agentName: '이메일 작성 AI', usageCount: 10, credits: 80 },
          { agentName: 'AI PPT 슬라이드 생성기', usageCount: 4, credits: 100 },
          { agentName: '음성파일 기반 문서 자동화 AI', usageCount: 3, credits: 90 }
        ]
      },
      { 
        name: '이영희', 
        department: '마케팅팀', 
        totalCredits: 380, 
        usageCount: 22, 
        mostUsedAgent: '리뷰 분석 AI', 
        lastActivity: '2024-01-14',
        agentUsage: [
          { agentName: '리뷰 분석 AI', usageCount: 8, credits: 120 },
          { agentName: 'SNS 이벤트 기획 AI', usageCount: 6, credits: 108 },
          { agentName: '키워드 분석 AI', usageCount: 5, credits: 60 },
          { agentName: 'AI 카드뉴스 생성기', usageCount: 3, credits: 60 }
        ]
      },
      { 
        name: '박민수', 
        department: '디자인팀', 
        totalCredits: 320, 
        usageCount: 18, 
        mostUsedAgent: 'AI 카드뉴스 생성기', 
        lastActivity: '2024-01-13',
        agentUsage: [
          { agentName: 'AI 카드뉴스 생성기', usageCount: 7, credits: 140 },
          { agentName: 'AI 블로그 생성기', usageCount: 6, credits: 90 },
          { agentName: '광고 문구 분석 및 제안 AI', usageCount: 3, credits: 60 },
          { agentName: 'AI PPT 슬라이드 생성기', usageCount: 2, credits: 50 }
        ]
      },
      { 
        name: '최수진', 
        department: '개발팀', 
        totalCredits: 210, 
        usageCount: 21, 
        mostUsedAgent: '이메일 작성 AI', 
        lastActivity: '2024-01-15',
        agentUsage: [
          { agentName: '이메일 작성 AI', usageCount: 12, credits: 96 },
          { agentName: '회의록 자동화 AI', usageCount: 6, credits: 60 },
          { agentName: 'AI PPT 슬라이드 생성기', usageCount: 2, credits: 50 },
          { agentName: '음성파일 기반 문서 자동화 AI', usageCount: 1, credits: 30 }
        ]
      },
      { 
        name: '정호영', 
        department: '기획팀', 
        totalCredits: 160, 
        usageCount: 16, 
        mostUsedAgent: 'AI PPT 슬라이드 생성기', 
        lastActivity: '2024-01-12',
        agentUsage: [
          { agentName: 'AI PPT 슬라이드 생성기', usageCount: 5, credits: 125 },
          { agentName: '회의록 자동화 AI', usageCount: 3, credits: 30 },
          { agentName: '이메일 작성 AI', usageCount: 8, credits: 64 }
        ]
      }
    ],
    departmentStats: [
      { 
        name: '개발팀', 
        totalCredits: 460, 
        usageCount: 46, 
        mostUsedAgent: '회의록 자동화 AI',
        agentUsage: [
          { agentName: '회의록 자동화 AI', usageCount: 14, credits: 140 },
          { agentName: '이메일 작성 AI', usageCount: 22, credits: 176 },
          { agentName: 'AI PPT 슬라이드 생성기', usageCount: 6, credits: 150 },
          { agentName: '음성파일 기반 문서 자동화 AI', usageCount: 4, credits: 120 }
        ]
      },
      { 
        name: '마케팅팀', 
        totalCredits: 380, 
        usageCount: 22, 
        mostUsedAgent: '리뷰 분석 AI',
        agentUsage: [
          { agentName: '리뷰 분석 AI', usageCount: 8, credits: 120 },
          { agentName: 'SNS 이벤트 기획 AI', usageCount: 6, credits: 108 },
          { agentName: '키워드 분석 AI', usageCount: 5, credits: 60 },
          { agentName: 'AI 카드뉴스 생성기', usageCount: 3, credits: 60 }
        ]
      },
      { 
        name: '디자인팀', 
        totalCredits: 320, 
        usageCount: 18, 
        mostUsedAgent: 'AI 카드뉴스 생성기',
        agentUsage: [
          { agentName: 'AI 카드뉴스 생성기', usageCount: 7, credits: 140 },
          { agentName: 'AI 블로그 생성기', usageCount: 6, credits: 90 },
          { agentName: '광고 문구 분석 및 제안 AI', usageCount: 3, credits: 60 },
          { agentName: 'AI PPT 슬라이드 생성기', usageCount: 2, credits: 50 }
        ]
      },
      { 
        name: '기획팀', 
        totalCredits: 160, 
        usageCount: 16, 
        mostUsedAgent: 'AI PPT 슬라이드 생성기',
        agentUsage: [
          { agentName: 'AI PPT 슬라이드 생성기', usageCount: 5, credits: 125 },
          { agentName: '회의록 자동화 AI', usageCount: 3, credits: 30 },
          { agentName: '이메일 작성 AI', usageCount: 8, credits: 64 }
        ]
      }
    ],
    agentStats: [
      { 
        name: '회의록 자동화 AI', 
        totalCredits: 170, 
        usageCount: 17, 
        userCount: 3,
        userUsage: [
          { userName: '김철수', department: '개발팀', usageCount: 8, credits: 80 },
          { userName: '최수진', department: '개발팀', usageCount: 6, credits: 60 },
          { userName: '정호영', department: '기획팀', usageCount: 3, credits: 30 }
        ]
      },
      { 
        name: '이메일 작성 AI', 
        totalCredits: 240, 
        usageCount: 30, 
        userCount: 3,
        userUsage: [
          { userName: '김철수', department: '개발팀', usageCount: 10, credits: 80 },
          { userName: '최수진', department: '개발팀', usageCount: 12, credits: 96 },
          { userName: '정호영', department: '기획팀', usageCount: 8, credits: 64 }
        ]
      },
      { 
        name: '리뷰 분석 AI', 
        totalCredits: 120, 
        usageCount: 8, 
        userCount: 1,
        userUsage: [
          { userName: '이영희', department: '마케팅팀', usageCount: 8, credits: 120 }
        ]
      },
      { 
        name: 'AI 카드뉴스 생성기', 
        totalCredits: 200, 
        usageCount: 10, 
        userCount: 2,
        userUsage: [
          { userName: '박민수', department: '디자인팀', usageCount: 7, credits: 140 },
          { userName: '이영희', department: '마케팅팀', usageCount: 3, credits: 60 }
        ]
      },
      { 
        name: 'AI PPT 슬라이드 생성기', 
        totalCredits: 325, 
        usageCount: 13, 
        userCount: 3,
        userUsage: [
          { userName: '김철수', department: '개발팀', usageCount: 4, credits: 100 },
          { userName: '박민수', department: '디자인팀', usageCount: 2, credits: 50 },
          { userName: '정호영', department: '기획팀', usageCount: 5, credits: 125 },
          { userName: '최수진', department: '개발팀', usageCount: 2, credits: 50 }
        ]
      }
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

  // 기간 필터링된 데이터 가져오기
  const getFilteredData = () => {
    // 실제로는 여기서 API 호출하여 필터링된 데이터를 가져와야 함
    return mockData;
  };

  // 페이지네이션 관련 함수
  const getCurrentData = () => {
    const filteredData = getFilteredData();
    if (activeTab === 'employee') return filteredData.employeeStats;
    if (activeTab === 'team') return filteredData.departmentStats;
    if (activeTab === 'agent') return filteredData.agentStats;
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

  const handleAnalyticsFilterChange = (field: string, value: string) => {
    // This function is no longer needed as filtering is handled by CompanyLayout
  };

  // 요약 데이터 계산
  const getSummaryData = () => {
    const filteredData = getFilteredData();
    
    const totalUsageCount = filteredData.employeeStats.reduce((sum, emp) => sum + emp.usageCount, 0);
    const totalCredits = filteredData.employeeStats.reduce((sum, emp) => sum + emp.totalCredits, 0);
    const totalUsers = filteredData.employeeStats.length;

    return {
      totalUsageCount,
      totalCredits,
      totalUsers
    };
  };

  const summaryData = getSummaryData();

  // 자세히 보기 모달 열기
  const openDetailModal = (type: 'employee' | 'department' | 'agent', data: any) => {
    setDetailModal({
      isOpen: true,
      type,
      data
    });
  };

  // 자세히 보기 모달 닫기
  const closeDetailModal = () => {
    setDetailModal({
      isOpen: false,
      type: null,
      data: null
    });
  };

  return (
    <CompanyLayout 
      title="분석 및 리포트"
      description="회사의 AI 에이전트 사용 현황을 분석하고 리포트를 생성하세요"
      timePeriod={getCurrentPeriodText()}
      onTimePeriodChange={handleTimePeriodChange}
      customDateRange={customDateRange || undefined}
      onCustomDateRange={handleCustomDateRange}
    >
      <div className="space-y-6">
        {/* 기간 선택 섹션 */}
        {/* This section is now handled by CompanyLayout */}

        {/* 요약 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600">총 사용 횟수</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {summaryData.totalUsageCount.toLocaleString()}회
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600">총 사용 크레딧</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {summaryData.totalCredits.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600">총 사용자 수</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {summaryData.totalUsers}명
            </p>
          </div>
        </div>

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
              <h3 className="text-lg font-semibold text-gray-900">직원별 에이전트 사용 분석</h3>
              <p className="text-sm text-gray-600 mt-1">
                직원들의 AI 에이전트 사용 현황 및 패턴을 분석 합니다.
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
                      사용 횟수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용 크레딧
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      주사용 에이전트
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      최근 활동
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      자세히 보기
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.usageCount}회
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.totalCredits.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.mostUsedAgent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee.lastActivity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openDetailModal('employee', employee)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">보기</span>
                        </button>
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
              <h3 className="text-lg font-semibold text-gray-900">부서별 에이전트 사용 분석</h3>
              <p className="text-sm text-gray-600 mt-1">
                부서별 AI 에이전트 사용 현황과 성과를 분석합니다.
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
                      사용 횟수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용 크레딧
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      주사용 에이전트
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      자세히 보기
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
                        {department.usageCount}회
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {department.totalCredits.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {department.mostUsedAgent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openDetailModal('department', department)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">보기</span>
                        </button>
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
              <h3 className="text-lg font-semibold text-gray-900">에이전트별 사용 분석</h3>
              <p className="text-sm text-gray-600 mt-1">
                각 AI 에이전트의 사용 현황과 인기도를 분석합니다.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI에이전트
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용 횟수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용 크레딧
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용자수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      자세히 보기
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
                            <div className="text-sm text-gray-500">
                              {aiAgents.find(a => a.name === agent.name)?.category || '기타'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agent.usageCount}회
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agent.totalCredits.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agent.userCount}명
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => openDetailModal('agent', agent)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">보기</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 페이지네이션 */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={getCurrentData().length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={(items) => {
            setItemsPerPage(items);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* 자세히 보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={closeDetailModal}
        title={`${detailModal.type === 'employee' ? '직원' : detailModal.type === 'department' ? '부서' : 'AI 에이전트'} 상세 정보`}
      >
        {detailModal.data && (
          <div className="space-y-4">
            {detailModal.type === 'employee' && (
              <>
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900">{detailModal.data.name}</h4>
                  <p className="text-sm text-gray-600">{detailModal.data.department}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">AI 에이전트별 사용 현황</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left">에이전트명</th>
                          <th className="px-3 py-2 text-left">사용 횟수</th>
                          <th className="px-3 py-2 text-left">사용 크레딧</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {detailModal.data.agentUsage.map((usage: any, index: number) => (
                          <tr key={index}>
                            <td className="px-3 py-2">{usage.agentName}</td>
                            <td className="px-3 py-2">{usage.usageCount}회</td>
                            <td className="px-3 py-2">{usage.credits}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            
            {detailModal.type === 'department' && (
              <>
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900">{detailModal.data.name}</h4>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">AI 에이전트별 사용 현황</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left">에이전트명</th>
                          <th className="px-3 py-2 text-left">사용 횟수</th>
                          <th className="px-3 py-2 text-left">사용 크레딧</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {detailModal.data.agentUsage.map((usage: any, index: number) => (
                          <tr key={index}>
                            <td className="px-3 py-2">{usage.agentName}</td>
                            <td className="px-3 py-2">{usage.usageCount}회</td>
                            <td className="px-3 py-2">{usage.credits}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            
            {detailModal.type === 'agent' && (
              <>
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900">{detailModal.data.name}</h4>
                  <p className="text-sm text-gray-600">
                    {aiAgents.find(a => a.name === detailModal.data.name)?.category || '기타'}
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">사용자별 사용 현황</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left">사용자명</th>
                          <th className="px-3 py-2 text-left">부서</th>
                          <th className="px-3 py-2 text-left">사용 횟수</th>
                          <th className="px-3 py-2 text-left">사용 크레딧</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {detailModal.data.userUsage.map((usage: any, index: number) => (
                          <tr key={index}>
                            <td className="px-3 py-2">{usage.userName}</td>
                            <td className="px-3 py-2">{usage.department}</td>
                            <td className="px-3 py-2">{usage.usageCount}회</td>
                            <td className="px-3 py-2">{usage.credits}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
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