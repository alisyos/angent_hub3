'use client';

import { useState } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { 
  Copy,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  X
} from 'lucide-react';

export default function CompanyCode() {
  // Single company code state
  const [companyCode, setCompanyCode] = useState({
    id: 1,
    code: 'COMP2024001',
    name: '회사 인증 코드',
    description: '직원 가입을 위한 회사 인증 코드',
    isVisible: false,
    createdAt: '2024-01-15',
    isCreated: true // indicates if code has been created
  });

  const [newCodeData, setNewCodeData] = useState({
    name: '회사 인증 코드',
    description: '직원 가입을 위한 회사 인증 코드'
  });

  // 확인 모달 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleToggleVisibility = () => {
    setCompanyCode(prev => ({ ...prev, isVisible: !prev.isVisible }));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(companyCode.code);
    // TODO: Add toast notification for copy success
  };

  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmCodeChange = () => {
    const newCodeValue = `COMP${Date.now().toString().slice(-6)}`;
    setCompanyCode(prev => ({
      ...prev,
      code: newCodeValue,
      createdAt: new Date().toISOString().split('T')[0]
    }));
    setShowConfirmModal(false);
  };

  const handleCancelCodeChange = () => {
    setShowConfirmModal(false);
  };

  const handleCreateInitialCode = () => {
    const newCodeValue = `COMP${Date.now().toString().slice(-6)}`;
    setCompanyCode({
      id: 1,
      code: newCodeValue,
      name: newCodeData.name,
      description: newCodeData.description,
      isVisible: false,
      createdAt: new Date().toISOString().split('T')[0],
      isCreated: true
    });
  };

  // If no code exists yet, show creation form
  if (!companyCode.isCreated) {
    return (
      <CompanyLayout 
        title="회사 코드 관리"
        description="직원 가입을 위한 회사 인증 코드를 생성하세요"
        hideTimePeriod={true}
      >
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">회사 인증 코드 생성</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  코드 이름
                </label>
                <input
                  type="text"
                  value={newCodeData.name}
                  onChange={(e) => setNewCodeData({ ...newCodeData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 회사 인증 코드"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  코드 설명
                </label>
                <textarea
                  value={newCodeData.description}
                  onChange={(e) => setNewCodeData({ ...newCodeData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="직원 가입을 위한 회사 인증 코드"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleCreateInitialCode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={!newCodeData.name.trim()}
                >
                  코드 생성
                </button>
              </div>
            </div>
          </div>

          {/* 안내 정보 */}
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
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">보안 권장사항</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 코드를 공개적으로 노출하지 마세요</li>
                  <li>• 필요한 직원에게만 코드를 공유하세요</li>
                  <li>• 코드가 유출되었다고 의심되면 즉시 코드를 변경하세요</li>
                  <li>• 정기적으로 코드를 갱신하는 것을 권장합니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout 
      title="회사 코드 관리"
      description="직원 가입을 위한 회사 인증 코드를 관리하세요"
      hideTimePeriod={true}
    >
      <div className="space-y-6">
        {/* 회사 코드 정보 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">회사 인증 코드</h2>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                활성
              </span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <div className="text-lg font-medium text-gray-900">{companyCode.name}</div>
                <div className="text-sm text-gray-500">{companyCode.description}</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">회사 코드:</span>
                  <div className="flex items-center space-x-2">
                    <code className="px-3 py-2 bg-gray-100 text-gray-900 rounded text-sm font-mono">
                      {companyCode.isVisible ? companyCode.code : '••••••••••••'}
                    </code>
                    <button
                      onClick={handleToggleVisibility}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title={companyCode.isVisible ? "코드 숨기기" : "코드 보기"}
                    >
                      {companyCode.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleCopyCode}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="코드 복사"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div>
                    <span>생성일: </span>
                    <span className="font-medium">{companyCode.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* 코드 보안 관리 통합 */}
              <div className="pt-6 border-t border-gray-200">
                <div className="space-y-4">
                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-900">코드 보안 유지</h4>
                        <p className="text-sm text-amber-800 mt-1">
                          회사 코드가 유출되었다고 의심되는 경우 즉시 새로운 코드로 변경하세요.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      onClick={handleShowConfirmModal}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      새 코드로 변경
                    </button>
                    <p className="text-sm text-gray-600 mt-2">
                      기존 코드는 즉시 무효화되며, 새로운 코드가 생성됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 사용 안내 */}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">코드 관리 가이드</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 코드는 직원 인증 목적으로만 사용됩니다</li>
                  <li>• 하나의 코드로 모든 직원이 가입할 수 있습니다</li>
                  <li>• 보안이 우려될 때 새 코드로 변경하세요</li>
                  <li>• 정기적인 코드 갱신을 권장합니다</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900">보안 권장사항</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 코드를 공개적으로 노출하지 마세요</li>
                  <li>• 필요한 직원에게만 코드를 공유하세요</li>
                  <li>• 퇴직한 직원이 알고 있는 코드는 변경하세요</li>
                  <li>• 정기적인 코드 갱신을 권장합니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 코드 변경 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleCancelCodeChange}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-md rounded-lg border border-red-200 bg-white p-6 shadow-xl">
              {/* Close button */}
              <button
                onClick={handleCancelCodeChange}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title */}
              <h3 className="mb-4 text-lg font-semibold text-red-600">
                회사 코드 변경 확인
              </h3>

              {/* Content */}
              <div className="mb-6 text-gray-700">
                <div className="bg-red-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-800">
                        정말로 회사 코드를 변경하시겠습니까?
                      </p>
                      <p className="text-sm text-red-700 mt-2">
                        • 기존 코드는 즉시 무효화됩니다<br/>
                        • 새로운 코드가 자동으로 생성됩니다<br/>
                        • 직원들에게 새로운 코드를 안내해야 합니다
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelCodeChange}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmCodeChange}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  코드 변경
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CompanyLayout>
  );
} 