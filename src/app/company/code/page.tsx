'use client';

import { useState } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { 
  Copy,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';

export default function CompanyCode() {
  const [companyCodes, setCompanyCodes] = useState([
    { 
      id: 1, 
      code: 'COMP2024001', 
      name: '메인 회사 코드',
      description: '전체 직원을 위한 기본 회사 코드',
      isVisible: false, 
      createdAt: '2024-01-15',
      expiresAt: '2024-12-31',
      usageCount: 45,
      maxUsage: 100,
      status: 'active'
    },
    { 
      id: 2, 
      code: 'COMP2024002', 
      name: '신입사원 코드',
      description: '신입사원 전용 회사 코드',
      isVisible: false, 
      createdAt: '2024-01-20',
      expiresAt: '2024-06-30',
      usageCount: 12,
      maxUsage: 50,
      status: 'active'
    },
    { 
      id: 3, 
      code: 'COMP2024003', 
      name: '임시 코드',
      description: '임시 직원을 위한 제한된 코드',
      isVisible: false, 
      createdAt: '2024-01-10',
      expiresAt: '2024-03-31',
      usageCount: 8,
      maxUsage: 20,
      status: 'expired'
    }
  ]);

  const [showNewCodeForm, setShowNewCodeForm] = useState(false);
  const [newCode, setNewCode] = useState({
    name: '',
    description: '',
    expiresAt: '',
    maxUsage: 100
  });

  const handleToggleVisibility = (id: number) => {
    setCompanyCodes(codes => 
      codes.map(code => 
        code.id === id ? { ...code, isVisible: !code.isVisible } : code
      )
    );
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // 복사 완료 알림 표시 로직 추가
  };

  const handleGenerateNewCode = () => {
    const newCodeValue = `COMP${Date.now().toString().slice(-6)}`;
    const newCodeData = {
      id: Date.now(),
      code: newCodeValue,
      name: newCode.name,
      description: newCode.description,
      isVisible: false,
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: newCode.expiresAt,
      usageCount: 0,
      maxUsage: newCode.maxUsage,
      status: 'active' as const
    };
    
    setCompanyCodes([...companyCodes, newCodeData]);
    setShowNewCodeForm(false);
    setNewCode({ name: '', description: '', expiresAt: '', maxUsage: 100 });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'disabled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'expired': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'disabled': return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '활성';
      case 'expired': return '만료';
      case 'disabled': return '비활성';
      default: return '알 수 없음';
    }
  };

  return (
    <CompanyLayout 
      title="회사 코드 관리"
      description="직원 가입을 위한 회사 코드를 생성하고 관리하세요"
      actions={
        <button 
          onClick={() => setShowNewCodeForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>새 코드 생성</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* 코드 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">회사 코드 목록</h2>
          
          <div className="space-y-4">
            {companyCodes.map((code) => (
              <div key={code.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{code.name}</div>
                      <div className="text-xs text-gray-500">{code.description}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(code.status)}
                      <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${getStatusColor(code.status)}`}>
                        {getStatusText(code.status)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleVisibility(code.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      {code.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">코드:</span>
                      <div className="flex items-center space-x-2">
                        <code className="px-2 py-1 bg-gray-100 text-gray-900 rounded text-sm">
                          {code.isVisible ? code.code : '••••••••••••'}
                        </code>
                        <button
                          onClick={() => handleCopyCode(code.code)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">생성일:</span>
                      <div className="font-medium">{code.createdAt}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">만료일:</span>
                      <div className="font-medium">{code.expiresAt}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">사용량:</span>
                      <div className="font-medium">{code.usageCount} / {code.maxUsage}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">사용률:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{Math.round((code.usageCount / code.maxUsage) * 100)}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(code.usageCount / code.maxUsage) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 새 코드 생성 폼 */}
        {showNewCodeForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">새 회사 코드 생성</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    코드 이름
                  </label>
                  <input
                    type="text"
                    value={newCode.name}
                    onChange={(e) => setNewCode({ ...newCode, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 2024년 상반기 신입사원 코드"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    만료일
                  </label>
                  <input
                    type="date"
                    value={newCode.expiresAt}
                    onChange={(e) => setNewCode({ ...newCode, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  코드 설명
                </label>
                <textarea
                  value={newCode.description}
                  onChange={(e) => setNewCode({ ...newCode, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이 코드의 용도를 설명해주세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  최대 사용 횟수
                </label>
                <input
                  type="number"
                  value={newCode.maxUsage}
                  onChange={(e) => setNewCode({ ...newCode, maxUsage: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="1000"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewCodeForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleGenerateNewCode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  코드 생성
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 코드 사용 안내 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">회사 코드 사용 안내</h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">직원 가입 절차</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    신규 직원이 회원가입 시 회사 코드를 입력하면 자동으로 회사 계정으로 등록됩니다.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">코드 관리 팁</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 코드는 정기적으로 갱신하는 것이 좋습니다</li>
                  <li>• 부서별로 다른 코드를 사용할 수 있습니다</li>
                  <li>• 임시 직원용 코드는 짧은 만료일을 설정하세요</li>
                  <li>• 사용량을 모니터링하여 적절히 조절하세요</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">보안 권장사항</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 코드를 공개적으로 노출하지 마세요</li>
                  <li>• 필요한 직원에게만 코드를 공유하세요</li>
                  <li>• 퇴직한 직원이 사용한 코드는 비활성화하세요</li>
                  <li>• 의심스러운 활동이 있으면 즉시 코드를 변경하세요</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 코드 통계 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">코드 사용 통계</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">전체 코드</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600">활성 코드</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">65</div>
              <div className="text-sm text-gray-600">총 사용 횟수</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">월별 코드 사용 현황</h4>
            <div className="space-y-2">
              {[
                { month: '2024-01', count: 25 },
                { month: '2024-02', count: 32 },
                { month: '2024-03', count: 8 }
              ].map((stat) => (
                <div key={stat.month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{stat.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(stat.count / 32) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stat.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
} 