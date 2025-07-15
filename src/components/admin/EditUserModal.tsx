'use client';

import { useState } from 'react';
import { AdminUser } from '@/types/admin';
import { CompanyLogo } from '@/types/company';
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
  Shield,
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  EyeOff,
  Key
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
    
    // 비밀번호 정보
    newPassword: '',
    confirmPassword: '',
    
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
  
  // 비밀번호 관련 상태
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // 로고 관련 상태
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(user.companyInfo?.logo?.filePath || null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<CompanyLogo | null>(user.companyInfo?.logo || null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 기본 정보 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }
    

    
    if (formData.phone && !/^0\d{1,2}-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
    }

    // 비밀번호 검증 (변경하는 경우만)
    if (formData.newPassword) {
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
      } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.newPassword)) {
        newErrors.newPassword = '비밀번호는 영문과 숫자를 포함해야 합니다.';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      }
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

  // 로고 관련 함수들
  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, logo: '이미지 파일만 업로드 가능합니다.' }));
      return;
    }

    // 파일 크기 검증 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, logo: '파일 크기가 5MB를 초과할 수 없습니다.' }));
      return;
    }

    setLogoFile(file);
    setErrors(prev => ({ ...prev, logo: '' }));

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    setLogoUploading(true);
    
    try {
      // 실제 구현에서는 서버에 업로드
      await new Promise(resolve => setTimeout(resolve, 1000));

      const logoData: CompanyLogo = {
        id: Date.now(),
        companyId: Date.now(),
        fileName: `company_logo_${Date.now()}.${logoFile.name.split('.').pop()}`,
        originalName: logoFile.name,
        filePath: logoPreview || '',
        fileSize: logoFile.size,
        mimeType: logoFile.type,
        uploadedAt: new Date().toISOString(),
        isActive: true
      };

      setCompanyLogo(logoData);
      setLogoFile(null);
    } catch (error) {
      setErrors(prev => ({ ...prev, logo: '로고 업로드 중 오류가 발생했습니다.' }));
    } finally {
      setLogoUploading(false);
    }
  };

  const handleLogoRemove = () => {
    if (window.confirm('정말로 회사 로고를 삭제하시겠습니까?')) {
      setCompanyLogo(null);
      setLogoPreview(null);
      setLogoFile(null);
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
        // 비밀번호가 입력된 경우만 포함
        ...(formData.newPassword && { password: formData.newPassword }),
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
          totalEmployees: user.companyInfo?.totalEmployees || [],
          logo: companyLogo || undefined
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

          {/* 비밀번호 변경 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2" />
              비밀번호 변경
            </h3>
            
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                비밀번호를 변경하지 않으려면 이 섹션을 비워두세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  새 비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.newPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="새 비밀번호 입력"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.newPassword}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  8자 이상, 영문과 숫자 포함
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="새 비밀번호 재입력"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
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

              {/* 회사 로고 섹션 */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-4">회사 로고</h4>
                
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 space-y-4 lg:space-y-0">
                  {/* 현재 로고 표시 */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                      {companyLogo || logoPreview ? (
                        <img
                          src={logoPreview || companyLogo?.filePath}
                          alt="회사 로고"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">로고 없음</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 로고 업로드 영역 */}
                  <div className="flex-1 space-y-3">
                    {canEditCompanyInfo ? (
                      <>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, GIF 파일 (최대 5MB)
                          </p>
                          {errors.logo && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.logo}
                            </p>
                          )}
                        </div>

                        {/* 업로드 버튼 */}
                        {logoFile && (
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={handleLogoUpload}
                              disabled={logoUploading}
                              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              {logoUploading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>업로드 중...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  <span>로고 업로드</span>
                                </>
                              )}
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => {
                                setLogoFile(null);
                                setLogoPreview(companyLogo?.filePath || null);
                              }}
                              className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                            >
                              취소
                            </button>
                          </div>
                        )}

                        {/* 현재 로고 삭제 버튼 */}
                        {companyLogo && !logoFile && (
                          <button
                            type="button"
                            onClick={handleLogoRemove}
                            className="flex items-center space-x-2 px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>로고 삭제</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        회사 관리자만 로고를 수정할 수 있습니다.
                      </p>
                    )}

                    {/* 로고 정보 */}
                    {companyLogo && (
                      <div className="bg-white rounded-lg p-3 border">
                        <h5 className="text-xs font-medium text-gray-900 mb-1">로고 정보</h5>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>파일명: {companyLogo.originalName}</p>
                          <p>크기: {(companyLogo.fileSize / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

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