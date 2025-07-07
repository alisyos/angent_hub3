'use client';

import { useState } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { 
  Building,
  Shield,
  Bell,
  CreditCard,
  Save,
  Upload,
  Settings as SettingsIcon
} from 'lucide-react';

export default function CompanySettings() {
  const [activeTab, setActiveTab] = useState('company');
  const [companyInfo, setCompanyInfo] = useState({
    name: '테크이노베이션 주식회사',
    businessNumber: '123-45-67890',
    address: '서울특별시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    email: 'info@techinnovation.com',
    website: 'https://techinnovation.com',
    ceo: '김대표',
    employeeCount: '150명',
    industry: '소프트웨어 개발',
    description: 'AI 기반 솔루션을 제공하는 테크 기업입니다.'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    creditAlert: true,
    usageReport: true,
    systemUpdate: false,
    securityAlert: true,
    monthlyReport: true,
    weeklyReport: false,
    emailNotification: true,
    smsNotification: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'medium',
    loginNotification: true,
    failedLoginAlert: true,
    deviceVerification: true,
    ipWhitelist: '',
    auditLog: true
  });

  const tabs = [
    { id: 'company', name: '회사 정보', icon: Building },
    { id: 'security', name: '보안 설정', icon: Shield },
    { id: 'notifications', name: '알림 설정', icon: Bell },
    { id: 'billing', name: '결제 설정', icon: CreditCard },
    { id: 'advanced', name: '고급 설정', icon: SettingsIcon }
  ];

  const handleSaveSettings = () => {
    // 설정 저장 로직
    console.log('Settings saved');
  };

  const handleCompanyInfoChange = (field: string, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (setting: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSecurityChange = (setting: string, value: string | number | boolean) => {
    setSecuritySettings(prev => ({ ...prev, [setting]: value }));
  };

  return (
    <CompanyLayout 
      title="설정"
      description="회사 정보와 시스템 설정을 관리하세요"
      actions={
        <button 
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>설정 저장</span>
        </button>
      }
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">기본 정보</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">회사명</label>
                    <input
                      type="text"
                      value={companyInfo.name}
                      onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사업자등록번호</label>
                    <input
                      type="text"
                      value={companyInfo.businessNumber}
                      onChange={(e) => handleCompanyInfoChange('businessNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
                  <input
                    type="text"
                    value={companyInfo.address}
                    onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                    <input
                      type="tel"
                      value={companyInfo.phone}
                      onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                    <input
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">웹사이트</label>
                  <input
                    type="url"
                    value={companyInfo.website}
                    onChange={(e) => handleCompanyInfoChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">대표자</label>
                    <input
                      type="text"
                      value={companyInfo.ceo}
                      onChange={(e) => handleCompanyInfoChange('ceo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">직원 수</label>
                    <input
                      type="text"
                      value={companyInfo.employeeCount}
                      onChange={(e) => handleCompanyInfoChange('employeeCount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">업종</label>
                    <input
                      type="text"
                      value={companyInfo.industry}
                      onChange={(e) => handleCompanyInfoChange('industry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">회사 설명</label>
                  <textarea
                    value={companyInfo.description}
                    onChange={(e) => handleCompanyInfoChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">로고 및 브랜딩</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">회사 로고</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building className="w-8 h-8 text-gray-400" />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>로고 업로드</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">권장 크기: 200x200px, 최대 용량: 5MB</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 보안 설정 */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">인증 설정</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">2단계 인증</div>
                    <div className="text-sm text-gray-500">로그인 시 추가 보안 인증 요구</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="twoFactorAuth" className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">로그인 알림</div>
                    <div className="text-sm text-gray-500">새로운 기기에서 로그인 시 알림</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="loginNotification"
                      checked={securitySettings.loginNotification}
                      onChange={(e) => handleSecurityChange('loginNotification', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="loginNotification" className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">로그인 실패 알림</div>
                    <div className="text-sm text-gray-500">로그인 실패 시 관리자에게 알림</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="failedLoginAlert"
                      checked={securitySettings.failedLoginAlert}
                      onChange={(e) => handleSecurityChange('failedLoginAlert', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="failedLoginAlert" className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">세션 타임아웃 (분)</label>
                  <select
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={15}>15분</option>
                    <option value={30}>30분</option>
                    <option value={60}>1시간</option>
                    <option value={120}>2시간</option>
                    <option value={480}>8시간</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호 정책</label>
                  <select
                    value={securitySettings.passwordPolicy}
                    onChange={(e) => handleSecurityChange('passwordPolicy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="basic">기본 (최소 8자)</option>
                    <option value="medium">중간 (8자 이상, 영문+숫자)</option>
                    <option value="strong">강력 (8자 이상, 영문+숫자+특수문자)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">접근 제어</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IP 화이트리스트</label>
                  <textarea
                    value={securitySettings.ipWhitelist}
                    onChange={(e) => handleSecurityChange('ipWhitelist', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="허용할 IP 주소를 입력하세요 (한 줄에 하나씩)&#10;예: 192.168.1.0/24&#10;10.0.0.1"
                  />
                  <p className="text-sm text-gray-500 mt-2">지정된 IP 주소에서만 접근 허용</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">기기 인증</div>
                    <div className="text-sm text-gray-500">새로운 기기에서 접근 시 인증 요구</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="deviceVerification"
                      checked={securitySettings.deviceVerification}
                      onChange={(e) => handleSecurityChange('deviceVerification', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="deviceVerification" className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">감사 로그</div>
                    <div className="text-sm text-gray-500">모든 사용자 활동 로그 기록</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="auditLog"
                      checked={securitySettings.auditLog}
                      onChange={(e) => handleSecurityChange('auditLog', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="auditLog" className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 알림 설정 */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">시스템 알림</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">크레딧 부족 알림</div>
                    <div className="text-sm text-gray-500">크레딧이 부족할 때 알림</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="creditAlert"
                      checked={notificationSettings.creditAlert}
                      onChange={(e) => handleNotificationChange('creditAlert', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="creditAlert" className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">사용량 보고서</div>
                    <div className="text-sm text-gray-500">정기적인 사용량 보고서 수신</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="usageReport"
                      checked={notificationSettings.usageReport}
                      onChange={(e) => handleNotificationChange('usageReport', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="usageReport" className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">시스템 업데이트</div>
                    <div className="text-sm text-gray-500">새로운 기능 및 업데이트 안내</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="systemUpdate"
                      checked={notificationSettings.systemUpdate}
                      onChange={(e) => handleNotificationChange('systemUpdate', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="systemUpdate" className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">보안 알림</div>
                    <div className="text-sm text-gray-500">보안 관련 중요 알림</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="securityAlert"
                      checked={notificationSettings.securityAlert}
                      onChange={(e) => handleNotificationChange('securityAlert', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="securityAlert" className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">리포트 설정</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">월간 리포트</div>
                    <div className="text-sm text-gray-500">매월 사용량 및 성과 리포트</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="monthlyReport"
                      checked={notificationSettings.monthlyReport}
                      onChange={(e) => handleNotificationChange('monthlyReport', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="monthlyReport" className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">주간 리포트</div>
                    <div className="text-sm text-gray-500">매주 사용량 요약 리포트</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="weeklyReport"
                      checked={notificationSettings.weeklyReport}
                      onChange={(e) => handleNotificationChange('weeklyReport', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="weeklyReport" className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">알림 방법</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">이메일 알림</div>
                    <div className="text-sm text-gray-500">등록된 이메일로 알림 수신</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emailNotification"
                      checked={notificationSettings.emailNotification}
                      onChange={(e) => handleNotificationChange('emailNotification', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="emailNotification" className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">SMS 알림</div>
                    <div className="text-sm text-gray-500">휴대폰으로 중요 알림 수신</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="smsNotification"
                      checked={notificationSettings.smsNotification}
                      onChange={(e) => handleNotificationChange('smsNotification', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="smsNotification" className="text-sm text-gray-700">활성화</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 결제 설정 */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">결제 수단</h3>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">신용카드 •••• 1234</div>
                        <div className="text-sm text-gray-500">만료일: 12/25</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">기본</span>
                      <button className="text-sm text-blue-600 hover:text-blue-800">편집</button>
                    </div>
                  </div>
                </div>
                
                <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700">
                  + 새 결제 수단 추가
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">청구서 설정</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">청구서 수신 이메일</label>
                  <input
                    type="email"
                    value={companyInfo.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">청구 주소</label>
                  <textarea
                    value={companyInfo.address}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="auto-payment"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="auto-payment" className="text-sm text-gray-700">
                      자동 결제 활성화
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="invoice-email"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="invoice-email" className="text-sm text-gray-700">
                      청구서 이메일 발송
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="tax-invoice"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tax-invoice" className="text-sm text-gray-700">
                      세금계산서 발급
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 고급 설정 */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">API 설정</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API 키</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="password"
                      value="sk-••••••••••••••••••••••••••••••••••••••••"
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      재발급
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">웹훅 URL</label>
                  <input
                    type="url"
                    placeholder="https://your-domain.com/webhook"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API 사용 한도 (요청/시간)</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="1000">1,000</option>
                    <option value="5000">5,000</option>
                    <option value="10000">10,000</option>
                    <option value="unlimited">무제한</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">데이터 관리</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">데이터 보관 기간</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="30">30일</option>
                    <option value="90">90일</option>
                    <option value="180">180일</option>
                    <option value="365">1년</option>
                    <option value="unlimited">무제한</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="data-backup"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="data-backup" className="text-sm text-gray-700">
                      자동 데이터 백업
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="data-encryption"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="data-encryption" className="text-sm text-gray-700">
                      데이터 암호화
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="gdpr-compliance"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="gdpr-compliance" className="text-sm text-gray-700">
                      GDPR 준수
                    </label>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-red-900">데이터 삭제</div>
                      <div className="text-sm text-red-700">모든 회사 데이터를 영구적으로 삭제합니다</div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                      데이터 삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CompanyLayout>
  );
} 