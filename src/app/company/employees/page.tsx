'use client';

import { useState } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { 
  Download,
  Users,
  Settings
} from 'lucide-react';

export default function CompanyEmployees() {
  const employeeUsage = [
    { id: 1, name: '김철수', department: '개발팀', creditsUsed: 450, mostUsedAgent: '회의록 자동화 AI', lastActive: '2024-01-20', email: 'kim@company.com', status: 'active' },
    { id: 2, name: '이영희', department: '마케팅팀', creditsUsed: 380, mostUsedAgent: 'SNS 이벤트 기획 AI', lastActive: '2024-01-20', email: 'lee@company.com', status: 'active' },
    { id: 3, name: '박민수', department: '기획팀', creditsUsed: 320, mostUsedAgent: 'PPT 슬라이드 생성기', lastActive: '2024-01-19', email: 'park@company.com', status: 'active' },
    { id: 4, name: '정수진', department: '디자인팀', creditsUsed: 290, mostUsedAgent: '카드뉴스 생성 AI', lastActive: '2024-01-19', email: 'jung@company.com', status: 'active' },
    { id: 5, name: '최동현', department: '영업팀', creditsUsed: 250, mostUsedAgent: '이메일 자동 작성 AI', lastActive: '2024-01-18', email: 'choi@company.com', status: 'inactive' }
  ];

  return (
    <CompanyLayout 
      title="직원 관리"
      description="회사 직원들의 정보와 권한을 관리하세요"
    >
      <div className="space-y-6">
        {/* 직원 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">직원 목록</h2>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>내보내기</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직원</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">크레딧 사용</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최근 활동</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeUsage.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.creditsUsed}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.lastActive}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                        employee.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-2">편집</button>
                      <button className="text-green-600 hover:text-green-900 mr-2">권한</button>
                      <button className="text-red-600 hover:text-red-900">비활성화</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 권한 관리 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">AI 에이전트 권한 관리</h3>
          
          <div className="space-y-6">
            {/* 개별 직원 권한 설정 */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">개별 직원 권한 설정</h4>
              <div className="space-y-4">
                {employeeUsage.map((employee) => (
                  <div key={employee.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-xs text-gray-500">{employee.department}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                          전체 허용
                        </button>
                        <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                          전체 제한
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { name: '회의록 자동화 AI', category: '일반사무', cost: 10 },
                        { name: '이메일 작성 AI', category: '일반사무', cost: 8 },
                        { name: 'PPT 슬라이드 생성기', category: '일반사무', cost: 25 },
                        { name: '리뷰 분석 AI', category: '마케팅/광고', cost: 15 },
                        { name: 'SNS 이벤트 기획 AI', category: '마케팅/광고', cost: 18 },
                        { name: '카드뉴스 생성기', category: '콘텐츠 제작', cost: 20 }
                      ].map((agent) => (
                        <div key={agent.name} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`${employee.id}-${agent.name}`}
                            defaultChecked={Math.random() > 0.3}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`${employee.id}-${agent.name}`} className="text-xs text-gray-700">
                            {agent.name} ({agent.cost} 크레딧)
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 부서별 권한 설정 */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">부서별 권한 설정</h4>
              <div className="space-y-4">
                {['개발팀', '마케팅팀', '기획팀', '디자인팀', '영업팀'].map((dept) => (
                  <div key={dept} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-gray-900">{dept}</div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          권한 적용
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { name: '회의록 자동화 AI', category: '일반사무', cost: 10 },
                        { name: '이메일 작성 AI', category: '일반사무', cost: 8 },
                        { name: 'PPT 슬라이드 생성기', category: '일반사무', cost: 25 },
                        { name: '리뷰 분석 AI', category: '마케팅/광고', cost: 15 },
                        { name: 'SNS 이벤트 기획 AI', category: '마케팅/광고', cost: 18 },
                        { name: '카드뉴스 생성기', category: '콘텐츠 제작', cost: 20 }
                      ].map((agent) => (
                        <div key={agent.name} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`${dept}-${agent.name}`}
                            defaultChecked={
                              (dept === '마케팅팀' && agent.category === '마케팅/광고') ||
                              (dept === '디자인팀' && agent.category === '콘텐츠 제작') ||
                              (agent.category === '일반사무')
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`${dept}-${agent.name}`} className="text-xs text-gray-700">
                            {agent.name} ({agent.cost} 크레딧)
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 권한 정책 설정 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">권한 정책 설정</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기본 권한 정책
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="allow-all">모든 에이전트 허용</option>
                  <option value="allow-basic">기본 에이전트만 허용</option>
                  <option value="department-based">부서별 맞춤 허용</option>
                  <option value="deny-all">모든 에이전트 제한</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  고비용 에이전트 정책 (25 크레딧 이상)
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="allow">허용</option>
                  <option value="manager-approval">관리자 승인 필요</option>
                  <option value="deny">제한</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="weekend-restriction"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="weekend-restriction" className="text-sm text-gray-700">
                  주말 및 공휴일 사용 제한
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="time-restriction"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="time-restriction" className="text-sm text-gray-700">
                  업무 시간 외 사용 제한 (09:00 - 18:00)
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="approval-required"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="approval-required" className="text-sm text-gray-700">
                  신규 에이전트 사용 시 관리자 승인 필요
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                정책 저장
              </button>
            </div>
          </div>
        </div>

        {/* 부서 관리 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">부서 관리</h3>
          
          <div className="space-y-6">
            {/* 부서 목록 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">부서 목록</h4>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>새 부서 추가</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: '개발팀', members: 12, headCount: 15, manager: '김개발', credits: 450 },
                  { name: '마케팅팀', members: 8, headCount: 10, manager: '이마케팅', credits: 380 },
                  { name: '기획팀', members: 6, headCount: 8, manager: '박기획', credits: 320 },
                  { name: '디자인팀', members: 5, headCount: 6, manager: '정디자인', credits: 290 },
                  { name: '영업팀', members: 9, headCount: 12, manager: '최영업', credits: 250 }
                ].map((dept) => (
                  <div key={dept.name} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-gray-900">{dept.name}</h5>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">팀장</span>
                        <span className="font-medium">{dept.manager}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">인원</span>
                        <span className="font-medium">{dept.members} / {dept.headCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">크레딧 사용</span>
                        <span className="font-medium text-blue-600">{dept.credits}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <button className="text-xs text-blue-600 hover:text-blue-800">직원 관리</button>
                        <button className="text-xs text-green-600 hover:text-green-800">크레딧 할당</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 부서별 통계 */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">부서별 통계</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">부서</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">인원</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">크레딧 사용</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평균 사용량</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">효율성</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { name: '개발팀', members: 12, credits: 450, avgCredits: 37.5, efficiency: 92 },
                      { name: '마케팅팀', members: 8, credits: 380, avgCredits: 47.5, efficiency: 87 },
                      { name: '기획팀', members: 6, credits: 320, avgCredits: 53.3, efficiency: 85 },
                      { name: '디자인팀', members: 5, credits: 290, avgCredits: 58.0, efficiency: 90 },
                      { name: '영업팀', members: 9, credits: 250, avgCredits: 27.8, efficiency: 78 }
                    ].map((dept) => (
                      <tr key={dept.name}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dept.members}명</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dept.credits}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{dept.avgCredits.toFixed(1)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm text-gray-900">{dept.efficiency}%</div>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${dept.efficiency}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-2">편집</button>
                          <button className="text-green-600 hover:text-green-900">분석</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
} 