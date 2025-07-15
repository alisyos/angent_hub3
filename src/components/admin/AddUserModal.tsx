'use client';

import { useState } from 'react';
import { X, Building2, User, CreditCard, CheckCircle, AlertCircle, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { CompanyLogo } from '@/types/company';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => void;
}

export default function AddUserModal({ isOpen, onClose, onSubmit }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    // 계정 정보
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    type: 'company_admin',
    status: 'active',
    credits: 1000,
    
    // 회사 정보
    companyName: '',
    businessNumber: '',
    ceo: '',
    employeeCount: '',
    industry: '',
    companyPhone: '',
    companyEmail: '',
    website: '',
    address: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 로고 관련 상태
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<CompanyLogo | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 기본 정보 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^0\d{1,2}-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
    }

    // 회사 정보 검증
    if (!formData.companyName.trim()) {
      newErrors.companyName = '회사명을 입력해주세요.';
    }
    
    if (!formData.businessNumber.trim()) {
      newErrors.businessNumber = '사업자등록번호를 입력해주세요.';
    } else if (!/^\d{3}-\d{2}-\d{5}$/.test(formData.businessNumber)) {
      newErrors.businessNumber = '올바른 사업자등록번호 형식이 아닙니다. (예: 123-45-67890)';
    }
    
    if (!formData.ceo.trim()) {
      newErrors.ceo = '대표자명을 입력해주세요.';
    }
    
    if (!formData.companyPhone.trim()) {
      newErrors.companyPhone = '회사 전화번호를 입력해주세요.';
    } else if (!/^0\d{1,2}-\d{3,4}-\d{4}$/.test(formData.companyPhone)) {
      newErrors.companyPhone = '올바른 전화번호 형식이 아닙니다. (예: 02-1234-5678)';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = '주소를 입력해주세요.';
    }
    
    if (formData.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = '올바른 이메일 형식이 아닙니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 사용자 데이터 구조화
      const userData = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name,
        type: formData.type,
        credits: formData.credits,
        profileImage: '',
        status: formData.status,
        registeredAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        totalCreditsUsed: 0,
        totalSpent: 0,
        companyInfo: {
          name: formData.companyName,
          businessNumber: formData.businessNumber,
          address: formData.address,
          phone: formData.companyPhone,
          employeeCount: parseInt(formData.employeeCount) || 0,
          subscriptionPlan: 'Professional',
          totalEmployees: [],
          logo: companyLogo
        },
        activityLogs: []
      };

      await onSubmit(userData);
      onClose();
      
      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        type: 'company_admin',
        status: 'active',
        credits: 1000,
        companyName: '',
        businessNumber: '',
        ceo: '',
        employeeCount: '',
        industry: '',
        companyPhone: '',
        companyEmail: '',
        website: '',
        address: '',
        description: ''
      });
      
      // 로고 상태 초기화
      setCompanyLogo(null);
      setLogoPreview(null);
      setLogoFile(null);
      
    } catch (error) {
      console.error('사용자 추가 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">새 회사관리자 추가</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 계정 정보 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              계정 정보
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
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="admin@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="8자 이상"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="비밀번호 재입력"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호 <span className="text-red-500">*</span>
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
                  계정 상태
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  초기 크레딧
                </label>
                <input
                  type="number"
                  value={formData.credits}
                  onChange={(e) => handleInputChange('credits', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>

          {/* 회사 정보 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              회사 정보
            </h3>
            
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
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.companyName ? 'border-red-300' : 'border-gray-300'
                  }`}
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
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.businessNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
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
                  대표자명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ceo}
                  onChange={(e) => handleInputChange('ceo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.ceo ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="홍길동"
                />
                {errors.ceo && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.ceo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  직원 수
                </label>
                <input
                  type="text"
                  value={formData.employeeCount}
                  onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="150명"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="소프트웨어 개발"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.companyPhone}
                  onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.companyPhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="02-1234-5678"
                />
                {errors.companyPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.companyPhone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={formData.companyEmail}
                  onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.companyEmail ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="info@company.com"
                />
                {errors.companyEmail && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.companyEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  웹사이트
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://company.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="서울시 강남구 테헤란로 123"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  회사 소개
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="회사에 대한 간단한 소개를 입력하세요..."
                />
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  추가 중...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  사용자 추가
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 