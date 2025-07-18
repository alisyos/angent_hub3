'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useModal } from '@/contexts/ModalContext';
import CompanyLayout from '@/components/CompanyLayout';
import ConfirmModal from '@/components/ConfirmModal';
import { 
  Building,
  CreditCard,
  Save,
  Upload,
  Shield,
  Copy,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  X,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { CompanyInfo, CompanyLogo } from '@/types/company';

function CompanySettingsContent() {
  const { showModal } = useModal();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('company');

  // 회사 정보 상태
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '테크 스타트업',
    companyName: '테크 스타트업',
    businessNumber: '123-45-67890',
    ceo: '김대표',
    ceoName: '김대표',
    address: '서울특별시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    email: 'contact@techstartup.com',
    website: 'https://techstartup.com',
    industry: '소프트웨어 개발',
    employeeCount: '10-50명',
    companySize: '10-50명',
    establishedYear: '2020',
    description: '혁신적인 소프트웨어 솔루션을 개발하는 스타트업입니다.',
    logo: {
      id: 1,
      companyId: 1,
      fileName: 'logo.png',
      originalName: 'company_logo.png',
      filePath: '/logo.png',
      fileSize: 6865, // 6.7KB 
      mimeType: 'image/png',
      uploadedAt: '2024-01-10T10:00:00Z',
      isActive: true
    }
  });

  // 로고 관련 상태
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [showLogoDeleteConfirm, setShowLogoDeleteConfirm] = useState(false);

  // 결제 설정 상태
  const [billingSettings, setBillingSettings] = useState({
    defaultPaymentMethod: 'corporate_card',
    billingCycle: 'monthly',
    autoRecharge: false,
    rechargeAmount: 100000,
    rechargeThreshold: 10000,
    receiveInvoice: true,
    invoiceEmail: 'billing@techstartup.com',
    issueTaxInvoice: false,
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });

  // 회사 코드 상태
  const [companyCode, setCompanyCode] = useState({
    id: 1,
    code: 'TECH2024',
    name: '',
    description: '',
    isVisible: false,
    createdAt: '2024-01-01',
    isCreated: false
  });
  const [showCompanyCode, setShowCompanyCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newCodeData, setNewCodeData] = useState({
    name: '',
    description: ''
  });

  // 초기 탭 설정
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['company', 'billing', 'code'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // 초기 데이터 로드
  useEffect(() => {
    // 저장된 회사 로고 정보 불러오기
    const savedCompanyLogo = localStorage.getItem('companyLogo');
    if (savedCompanyLogo) {
      try {
        const logoData = JSON.parse(savedCompanyLogo);
        setCompanyInfo(prev => ({ ...prev, logo: logoData }));
        setLogoPreview(logoData.filePath);
      } catch (error) {
        console.error('Failed to parse company logo:', error);
      }
    }
  }, []);

  // 탭 메뉴 설정
  const tabs = [
    { id: 'company', name: '회사 정보', icon: Building },
    { id: 'billing', name: '결제 설정', icon: CreditCard },
    { id: 'code', name: '회사 코드', icon: Shield }
  ];

  // 회사 정보 관련 함수
  const handleSaveCompanyInfo = () => {
    // 회사 정보와 로고 정보를 함께 저장
    console.log('Company info saved:', companyInfo);
    
    // 로고 정보가 있으면 localStorage에 저장
    if (companyInfo.logo) {
      localStorage.setItem('companyLogo', JSON.stringify(companyInfo.logo));
    }

    showModal({
      title: '저장 완료',
      message: '회사 정보가 저장되었습니다.',
      type: 'success'
    });

    // 헤더 업데이트를 위해 페이지 새로고침 (실제 환경에서는 상태 관리를 사용)
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleSaveBillingSettings = () => {
    console.log('Billing settings saved:', billingSettings);
    showModal({
      title: '저장 완료',
      message: '결제 설정이 저장되었습니다.',
      type: 'success'
    });
  };

  const handleCompanyInfoChange = (field: string, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleBillingChange = (field: string, value: string | boolean) => {
    setBillingSettings(prev => ({ ...prev, [field]: value }));
  };

  // 로고 관련 함수
  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      showModal({
        title: '오류',
        message: '이미지 파일만 업로드 가능합니다.',
        type: 'error'
      });
      return;
    }

    // 파일 크기 검증 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showModal({
        title: '오류',
        message: '파일 크기가 5MB를 초과할 수 없습니다.',
        type: 'error'
      });
      return;
    }

    setLogoFile(file);

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
      // 현재는 로컬 저장소에 저장하는 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));

      const logoData: CompanyLogo = {
        id: Date.now(),
        companyId: 1,
        fileName: `company_logo_${Date.now()}.${logoFile.name.split('.').pop()}`,
        originalName: logoFile.name,
        filePath: logoPreview || '',
        fileSize: logoFile.size,
        mimeType: logoFile.type,
        uploadedAt: new Date().toISOString(),
        isActive: true
      };

      // 로컬 저장소에 저장
      localStorage.setItem('companyLogo', JSON.stringify(logoData));

      setCompanyInfo(prev => ({ ...prev, logo: logoData }));
      setLogoFile(null);

      showModal({
        title: '업로드 완료',
        message: '회사 로고가 성공적으로 업로드되었습니다.',
        type: 'success'
      });
    } catch (error) {
      showModal({
        title: '업로드 실패',
        message: '로고 업로드 중 오류가 발생했습니다.',
        type: 'error'
      });
    } finally {
      setLogoUploading(false);
    }
  };

  const handleLogoRemove = () => {
    setShowLogoDeleteConfirm(true);
  };

  const handleConfirmLogoRemove = () => {
    localStorage.removeItem('companyLogo');
    setCompanyInfo(prev => ({ ...prev, logo: undefined }));
    setLogoPreview(null);
    setLogoFile(null);
    
    showModal({
      title: '삭제 완료',
      message: '회사 로고가 삭제되었습니다.',
      type: 'success'
    });
  };

  // 회사 코드 관련 함수
  const handleToggleVisibility = () => {
    setCompanyCode(prev => ({ ...prev, isVisible: !prev.isVisible }));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(companyCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  // URL 파라미터에서 탭 확인
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['company', 'billing', 'code'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <CompanyLayout 
      title="설정"
      description="회사 정보와 시스템 설정을 관리하세요"
      hideTimePeriod={true}
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
                  onClick={() => setActiveTab(tab.id)}
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

        {/* 회사 정보 */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            {/* 회사 로고 섹션 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">회사 로고</h3>
              
              <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
                {/* 현재 로고 표시 */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {companyInfo.logo || logoPreview ? (
                      <img
                        src={logoPreview || companyInfo.logo?.filePath}
                        alt="회사 로고"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">로고 없음</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 로고 업로드 영역 */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      로고 파일 선택
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, GIF 파일 (최대 5MB)
                    </p>
                  </div>

                  {/* 업로드 버튼 */}
                  {logoFile && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleLogoUpload}
                        disabled={logoUploading}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(companyInfo.logo?.filePath || null);
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        취소
                      </button>
                    </div>
                  )}

                  {/* 현재 로고 삭제 버튼 */}
                  {companyInfo.logo && !logoFile && (
                    <button
                      onClick={handleLogoRemove}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>로고 삭제</span>
                    </button>
                  )}

                  {/* 로고 정보 */}
                  {companyInfo.logo && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">현재 로고 정보</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>파일명: {companyInfo.logo.originalName}</p>
                        <p>크기: {(companyInfo.logo.fileSize / 1024).toFixed(1)} KB</p>
                        <p>업로드일: {new Date(companyInfo.logo.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 기본 정보 섹션 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">기본 정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회사명
                  </label>
                  <input
                    type="text"
                    value={companyInfo.name}
                    onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    사업자등록번호
                  </label>
                  <input
                    type="text"
                    value={companyInfo.businessNumber}
                    onChange={(e) => handleCompanyInfoChange('businessNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대표자명
                  </label>
                  <input
                    type="text"
                    value={companyInfo.ceo}
                    onChange={(e) => handleCompanyInfoChange('ceo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직원 수
                  </label>
                  <input
                    type="text"
                    value={companyInfo.employeeCount}
                    onChange={(e) => handleCompanyInfoChange('employeeCount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    업종
                  </label>
                  <input
                    type="text"
                    value={companyInfo.industry}
                    onChange={(e) => handleCompanyInfoChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    value={companyInfo.phone}
                    onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    웹사이트
                  </label>
                  <input
                    type="url"
                    value={companyInfo.website}
                    onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    주소
                  </label>
                  <input
                    type="text"
                    value={companyInfo.address}
                    onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회사 소개
                  </label>
                  <textarea
                    value={companyInfo.description}
                    onChange={(e) => handleCompanyInfoChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveCompanyInfo}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  <span>저장하기</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 결제 설정 */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">결제 설정</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="issueTaxInvoice"
                    checked={billingSettings.issueTaxInvoice}
                    onChange={(e) => handleBillingChange('issueTaxInvoice', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="issueTaxInvoice" className="text-sm font-medium text-gray-700">
                    세금계산서 발행 요청
                  </label>
                </div>
                
                {billingSettings.issueTaxInvoice && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        담당자명
                      </label>
                      <input
                        type="text"
                        value={billingSettings.contactName}
                        onChange={(e) => handleBillingChange('contactName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        담당자 전화번호
                      </label>
                      <input
                        type="tel"
                        value={billingSettings.contactPhone}
                        onChange={(e) => handleBillingChange('contactPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        담당자 이메일
                      </label>
                      <input
                        type="email"
                        value={billingSettings.contactEmail}
                        onChange={(e) => handleBillingChange('contactEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveBillingSettings}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>저장하기</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 회사 코드 */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            {/* 회사 코드가 없는 경우 */}
            {!companyCode.isCreated ? (
              <>
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
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
      </div>

      {/* 코드 변경 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">코드 변경 확인</h3>
              <button
                onClick={handleCancelCodeChange}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                회사 코드를 변경하면 기존 코드는 즉시 무효화됩니다.
              </p>
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-900">주의사항</h4>
                    <p className="text-sm text-amber-800 mt-1">
                      직원들에게 새로운 코드를 공유해야 합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelCodeChange}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmCodeChange}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                변경하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 로고 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showLogoDeleteConfirm}
        onClose={() => setShowLogoDeleteConfirm(false)}
        onConfirm={handleConfirmLogoRemove}
        title="로고 삭제 확인"
        message="정말로 회사 로고를 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        type="danger"
      />
    </CompanyLayout>
  );
}

export default function CompanySettings() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanySettingsContent />
    </Suspense>
  );
}