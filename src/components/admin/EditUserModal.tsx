'use client';

import { useState } from 'react';
import { AdminUser } from '@/types/admin';
import { 
  X, 
  AlertCircle, 
  Save, 
  User, 
  Building2,
  Phone,
  Mail,
  FileText,
  Users,
  Shield
} from 'lucide-react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser;
  onSave: (userData: Partial<AdminUser>) => void;
}

export default function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    // 사용자 기본 정보
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    status: user.status,
    
    // 회사 정보
    companyName: user.companyInfo?.name || '',
    businessNumber: user.companyInfo?.businessNumber || '',
    ceo: user.companyInfo?.ceo || '',
    employeeCount: user.companyInfo?.employeeCount || 0,
    industry: user.companyInfo?.industry || '',
    companyPhone: user.companyInfo?.phone || '',
    companyEmail: user.companyInfo?.email || '',
    website: user.companyInfo?.website || '',
    address: user.companyInfo?.address || '',
    description: user.companyInfo?.description || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 기본 정보 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }
    

    
    if (formData.phone && !/^0\d{1,2}-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
    }

    // 회사 정보 검증 (회사 계정인 경우)
    if (user.type === 'company_admin' || user.type === 'company_employee') {
      if (!formData.companyName.trim()) {
        newErrors.companyName = '회사명을 입력해주세요.';
      }
      
      if (!formData.businessNumber.trim()) {
        newErrors.businessNumber = '사업자등록번호를 입력해주세요.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 사용자 데이터 구조화
      const userData: Partial<AdminUser> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        companyInfo: (user.type === 'company_admin' || user.type === 'company_employee') ? {
          ...user.companyInfo,
          name: formData.companyName,
          businessNumber: formData.businessNumber,
          ceo: formData.ceo,
          employeeCount: formData.employeeCount,
          industry: formData.industry,
          phone: formData.companyPhone,
          email: formData.companyEmail,
          website: formData.website,
          address: formData.address,
          description: formData.description,
          subscriptionPlan: user.companyInfo?.subscriptionPlan || 'Basic',
          totalEmployees: user.companyInfo?.totalEmployees || []
        } : undefined
      };

      await onSave(userData);
      onClose();
      
    } catch (error) {
      console.error('사용자 수정 실패:', error);
      setErrors({ submit: '사용자 수정에 실패했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserTypeLabel = (type: string) => {
    const labels = {
      general_user: '일반사용자',
      company_admin: '회사관리자',
      company_employee: '회사일반사용자',
      admin: '관리자'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const canEditCompanyInfo = user.type === 'company_admin';
  const canDeactivate = user.type !== 'general_user';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {user.name} 정보 수정
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 사용자 기본 정보 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              사용자 기본 정보
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="홍길동"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                  {formData.email}
                </div>
                <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="010-1234-5678"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  계정 유형
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {getUserTypeLabel(user.type)}
                </div>
                <p className="text-xs text-gray-500 mt-1">계정 유형은 변경할 수 없습니다</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상태 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">활성</option>
                  {canDeactivate && <option value="inactive">비활성</option>}
                  <option value="suspended">정지</option>
                </select>
                {!canDeactivate && (
                  <p className="text-xs text-gray-500 mt-1">일반 사용자는 비활성화할 수 없습니다</p>
                )}
              </div>
            </div>
          </div>

          {/* 회사 정보 */}
          {(user.type === 'company_admin' || user.type === 'company_employee') && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                회사 정보
              </h3>
              
              {!canEditCompanyInfo && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    회사 일반사용자는 회사 정보를 확인만 할 수 있습니다. 수정은 회사 관리자를 통해 가능합니다.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회사명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    disabled={!canEditCompanyInfo}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.companyName ? 'border-red-300' : 'border-gray-300'
                    } ${!canEditCompanyInfo ? 'bg-gray-50' : ''}`}
                    placeholder="(주)회사명"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사업자등록번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.businessNumber}
                    onChange={(e) => handleInputChange('businessNumber', e.target.value)}
                    disabled={!canEditCompanyInfo}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.businessNumber ? 'border-red-300' : 'border-gray-300'
                    } ${!canEditCompanyInfo ? 'bg-gray-50' : ''}`}
                    placeholder="123-45-67890"
                  />
                  {errors.businessNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.businessNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대표자명
                  </label>
                  <input
                    type="text"
                    value={formData.ceo}
                    onChange={(e) => handleInputChange('ceo', e.target.value)}
                    disabled={!canEditCompanyInfo}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !canEditCompanyInfo ? 'bg-gray-50' : ''
                    }`}
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직원 수
                  </label>
                  <input
                    type="number"
                    value={formData.employeeCount}
                    onChange={(e) => handleInputChange('employeeCount', parseInt(e.target.value) || 0)}
                    disabled={!canEditCompanyInfo}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !canEditCompanyInfo ? 'bg-gray-50' : ''
                    }`}
                    placeholder="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    업종
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    disabled={!canEditCompanyInfo}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !canEditCompanyInfo ? 'bg-gray-50' : ''
                    }`}
                    placeholder="IT 서비스"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    value={formData.companyPhone}
                    onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                    disabled={!canEditCompanyInfo}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !canEditCompanyInfo ? 'bg-gray-50' : ''
                    }`}
                    placeholder="02-1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                    disabled={!canEditCompanyInfo}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !canEditCompanyInfo ? 'bg-gray-50' : ''
                    }`}
                    placeholder="info@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    웹사이트
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    disabled={!canEditCompanyInfo}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !canEditCompanyInfo ? 'bg-gray-50' : ''
                    }`}
                    placeholder="https://www.company.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    주소
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!canEditCompanyInfo}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !canEditCompanyInfo ? 'bg-gray-50' : ''
                    }`}
                    placeholder="서울특별시 강남구 테헤란로 123"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회사 소개
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={!canEditCompanyInfo}
                    rows={4}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !canEditCompanyInfo ? 'bg-gray-50' : ''
                    }`}
                    placeholder="회사에 대한 간단한 설명을 입력하세요..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 