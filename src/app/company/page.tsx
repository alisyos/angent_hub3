'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Users, 
  Bot, 
  CreditCard, 
  TrendingUp, 
  BarChart3,
  Settings,
  UserPlus,
  Download
} from 'lucide-react';

export default function CompanyDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const companyStats = {
    totalEmployees: 45,
    activeEmployees: 38,
    totalCreditsUsed: 12500,
    totalCreditsRemaining: 7500,
    mostUsedAgent: '회의록 자동화 AI'
  };

  const employeeUsage = [
    { name: '김철수', department: '개발팀', creditsUsed: 450, mostUsedAgent: '회의록 자동화 AI', lastActive: '2024-01-20' },
    { name: '이영희', department: '마케팅팀', creditsUsed: 380, mostUsedAgent: 'SNS 이벤트 기획 AI', lastActive: '2024-01-20' },
    { name: '박민수', department: '기획팀', creditsUsed: 320, mostUsedAgent: 'PPT 슬라이드 생성기', lastActive: '2024-01-19' },
    { name: '정수진', department: '디자인팀', creditsUsed: 290, mostUsedAgent: '카드뉴스 생성 AI', lastActive: '2024-01-19' },
    { name: '최동현', department: '영업팀', creditsUsed: 250, mostUsedAgent: '이메일 자동 작성 AI', lastActive: '2024-01-18' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">회사 관리자 대시보드</h1>
              <p className="mt-2 text-sm text-gray-600">
                회사 내 AI 에이전트 사용 현황을 관리하고 분석하세요
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1d">최근 1일</option>
                <option value="7d">최근 7일</option>
                <option value="30d">최근 30일</option>
                <option value="90d">최근 90일</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>직원 초대</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <p className="text-sm font-medium text-gray-600">인기 에이전트</p>
                <p className="text-lg font-bold text-gray-900 mt-2">{companyStats.mostUsedAgent}</p>
                <p className="text-sm text-blue-600 mt-1">145회 사용</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">비용 절감</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">2.4M원</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +24% 효율성
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">직원별 사용 현황</h2>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>내보내기</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {employeeUsage.map((employee, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900">{employee.name}</h3>
                      <span className="text-sm font-bold text-blue-600">{employee.creditsUsed}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{employee.department}</span>
                      <span>최근: {employee.lastActive}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      주요 사용: {employee.mostUsedAgent}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">크레딧 관리</h2>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  크레딧 충전
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>설정</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{companyStats.totalCreditsUsed.toLocaleString()}</div>
                <div className="text-sm text-gray-600">이번 달 사용량</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{companyStats.totalCreditsRemaining.toLocaleString()}</div>
                <div className="text-sm text-gray-600">잔여 크레딧</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">62%</div>
                <div className="text-sm text-gray-600">이번 달 사용률</div>
              </div>
            </div>
            
            <div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '62%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0</span>
                <span>20,000 크레딧</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
