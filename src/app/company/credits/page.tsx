'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CompanyLayout from '@/components/CompanyLayout';
import { 
  CreditCard,
  Plus,
  User,
  Users,
  Building,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function CompanyCredits() {
  const router = useRouter();
  const [showAllocationForm, setShowAllocationForm] = useState(false);
  const [allocationType, setAllocationType] = useState<'individual' | 'department' | 'bulk'>('individual');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [allocationAmount, setAllocationAmount] = useState(100);

  const employees = [
    { id: 1, name: '김철수', department: '개발팀', currentCredits: 150, allocation: 200 },
    { id: 2, name: '이영희', department: '마케팅팀', currentCredits: 80, allocation: 150 },
    { id: 3, name: '박민수', department: '기획팀', currentCredits: 120, allocation: 180 },
    { id: 4, name: '정수진', department: '디자인팀', currentCredits: 95, allocation: 160 },
    { id: 5, name: '최동현', department: '영업팀', currentCredits: 60, allocation: 140 }
  ];

  const departments = [
    { name: '개발팀', totalCredits: 1200, allocatedCredits: 800, employees: 12 },
    { name: '마케팅팀', totalCredits: 900, allocatedCredits: 720, employees: 8 },
    { name: '기획팀', totalCredits: 600, allocatedCredits: 480, employees: 6 },
    { name: '디자인팀', totalCredits: 500, allocatedCredits: 380, employees: 5 },
    { name: '영업팀', totalCredits: 800, allocatedCredits: 560, employees: 9 }
  ];

  const handleAllocation = () => {
    // 할당 로직 구현
    setShowAllocationForm(false);
    setSelectedEmployees([]);
    setAllocationAmount(100);
  };

  const handleRechargeRedirect = () => {
    router.push('/credits');
  };

  return (
    <CompanyLayout 
      title="크레딧 관리"
      description="직원들의 크레딧 할당 및 사용 현황을 관리하세요"
      actions={
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRechargeRedirect}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>크레딧 충전</span>
          </button>
          <button 
            onClick={() => setShowAllocationForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>크레딧 할당</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 크레딧 현황 대시보드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">총 보유 크레딧</p>
                <p className="text-2xl font-bold text-gray-900">15,200</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">할당된 크레딧</p>
                <p className="text-2xl font-bold text-gray-900">8,940</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">사용된 크레딧</p>
                <p className="text-2xl font-bold text-gray-900">6,260</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">미할당 크레딧</p>
                <p className="text-2xl font-bold text-gray-900">6,260</p>
              </div>
            </div>
          </div>
        </div>

        {/* 크레딧 할당 폼 */}
        {showAllocationForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">크레딧 할당</h3>
            
            <div className="space-y-6">
              {/* 할당 유형 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">할당 유형</label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setAllocationType('individual')}
                    className={`flex items-center space-x-2 p-4 border rounded-lg ${
                      allocationType === 'individual' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>개별 할당</span>
                  </button>
                  <button
                    onClick={() => setAllocationType('department')}
                    className={`flex items-center space-x-2 p-4 border rounded-lg ${
                      allocationType === 'department' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building className="w-5 h-5" />
                    <span>부서별 할당</span>
                  </button>
                  <button
                    onClick={() => setAllocationType('bulk')}
                    className={`flex items-center space-x-2 p-4 border rounded-lg ${
                      allocationType === 'bulk' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>일괄 할당</span>
                  </button>
                </div>
              </div>

              {/* 개별 할당 */}
              {allocationType === 'individual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">직원 선택</label>
                  <div className="space-y-2">
                    {employees.map((employee) => (
                      <div key={employee.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <input
                          type="checkbox"
                          id={`employee-${employee.id}`}
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEmployees([...selectedEmployees, employee.id]);
                            } else {
                              setSelectedEmployees(selectedEmployees.filter(id => id !== employee.id));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`employee-${employee.id}`} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                              <div className="text-xs text-gray-500">{employee.department}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-900">현재: {employee.currentCredits}</div>
                              <div className="text-xs text-gray-500">할당: {employee.allocation}</div>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 부서별 할당 */}
              {allocationType === 'department' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">부서 선택</label>
                  <div className="space-y-2">
                    {departments.map((dept) => (
                      <div key={dept.name} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <input
                          type="checkbox"
                          id={`dept-${dept.name}`}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`dept-${dept.name}`} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                              <div className="text-xs text-gray-500">{dept.employees}명</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-900">총 크레딧: {dept.totalCredits}</div>
                              <div className="text-xs text-gray-500">할당: {dept.allocatedCredits}</div>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 할당 금액 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">할당 크레딧</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={allocationAmount}
                    onChange={(e) => setAllocationAmount(parseInt(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="10000"
                  />
                  <div className="flex space-x-2">
                    {[50, 100, 200, 500].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setAllocationAmount(amount)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAllocationForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleAllocation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  할당하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 직원별 크레딧 현황 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">직원별 크레딧 현황</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직원</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">현재 크레딧</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">할당된 크레딧</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용률</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용 한도</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => {
                  const usageRate = Math.round(((employee.allocation - employee.currentCredits) / employee.allocation) * 100);
                  return (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.department}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.currentCredits}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.allocation}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900">{usageRate}%</div>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                usageRate > 80 ? 'bg-red-600' : usageRate > 60 ? 'bg-yellow-600' : 'bg-green-600'
                              }`}
                              style={{ width: `${usageRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">무제한</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-2">편집</button>
                        <button className="text-green-600 hover:text-green-900">할당</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 부서별 크레딧 현황 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">부서별 크레딧 현황</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => {
              const usageRate = Math.round((dept.allocatedCredits / dept.totalCredits) * 100);
              return (
                <div key={dept.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{dept.name}</h4>
                      <p className="text-xs text-gray-500">{dept.employees}명</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{dept.allocatedCredits} / {dept.totalCredits}</div>
                      <div className="text-xs text-gray-500">{usageRate}% 사용</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        usageRate > 80 ? 'bg-red-600' : usageRate > 60 ? 'bg-yellow-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${usageRate}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">평균: {Math.round(dept.allocatedCredits / dept.employees)} 크레딧/명</span>
                    <button className="text-xs text-blue-600 hover:text-blue-800">크레딧 할당</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 사용 한도 설정 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">사용 한도 설정</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  일일 사용 한도
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 50"
                  />
                  <span className="text-sm text-gray-500">크레딧/일</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  월간 사용 한도
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 1000"
                  />
                  <span className="text-sm text-gray-500">크레딧/월</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto-allocation"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="auto-allocation" className="text-sm text-gray-700">
                  크레딧 부족 시 자동 할당 (최대 200 크레딧)
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notification"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notification" className="text-sm text-gray-700">
                  크레딧 부족 시 관리자에게 알림
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="usage-report"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="usage-report" className="text-sm text-gray-700">
                  주간 사용량 리포트 발송
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                설정 저장
              </button>
            </div>
          </div>
        </div>

        {/* 크레딧 충전 안내 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">크레딧이 부족하신가요?</h3>
              <p className="text-blue-700 mt-1">
                크레딧 충전 페이지에서 간편하게 크레딧을 충전하세요.
              </p>
            </div>
            <button 
              onClick={handleRechargeRedirect}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>크레딧 충전하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
} 