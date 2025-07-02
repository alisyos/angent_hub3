'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  CreditCard, 
  BarChart3, 
  History,
  Settings,
  Edit,
  Save,
  X,
  Calendar,
  TrendingUp,
  Bot
} from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [userInfo, setUserInfo] = useState({
    name: '김철수',
    email: 'kimcs@example.com',
    phone: '010-1234-5678',
    accountType: 'individual',
    company: '',
    joinDate: '2024-01-15',
    credits: 1250
  });

  const creditHistory = [
    { id: 1, type: 'purchase', amount: 1000, description: '스타터 패키지', date: '2024-01-20', balance: 1250 },
    { id: 2, type: 'usage', amount: -50, description: '회의록 자동화 AI', date: '2024-01-19', balance: 250 },
    { id: 3, type: 'usage', amount: -30, description: '이메일 자동 작성 AI', date: '2024-01-18', balance: 300 },
    { id: 4, type: 'usage', amount: -80, description: 'PPT 슬라이드 생성기', date: '2024-01-17', balance: 330 },
    { id: 5, type: 'bonus', amount: 500, description: '가입 축하 보너스', date: '2024-01-15', balance: 250 }
  ];

  const usageStats = [
    { agent: '회의록 자동화 AI', usage: 12, credits: 600, category: '일반사무' },
    { agent: 'PPT 슬라이드 생성기', usage: 8, credits: 640, category: '일반사무' },
    { agent: '이메일 자동 작성 AI', usage: 15, credits: 450, category: '일반사무' },
    { agent: 'SNS 이벤트 기획 AI', usage: 5, credits: 250, category: '마케팅/광고' },
    { agent: '카드뉴스 생성 AI', usage: 3, credits: 180, category: '콘텐츠 제작' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // API call to save user info
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">프로필 관리</h1>
          <p className="mt-2 text-sm text-gray-600">
            개인정보 및 사용 현황을 확인하고 관리하세요
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              개인정보
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'credits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              크레딧 내역
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'usage'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              사용 통계
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">개인정보</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                      <span>편집</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4" />
                        <span>저장</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        <X className="w-4 h-4" />
                        <span>취소</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                      {isEditing ? (
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            value={userInfo.name}
                            onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{userInfo.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{userInfo.email}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                      {isEditing ? (
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="tel"
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{userInfo.phone}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">계정 유형</label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {userInfo.accountType === 'individual' ? '개인' : '회사'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 정보</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">가입일</span>
                    <span className="text-sm font-medium text-gray-900">{userInfo.joinDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">보유 크레딧</span>
                    <span className="text-lg font-bold text-blue-600">{userInfo.credits.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">이번 달 사용량</span>
                    <span className="text-sm font-medium text-gray-900">2,120</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <span>크레딧 충전</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm flex items-center space-x-2">
                    <History className="w-4 h-4 text-blue-600" />
                    <span>사용 내역</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span>설정</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credits Tab */}
        {activeTab === 'credits' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">크레딧 사용 내역</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">내용</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">변동량</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">잔액</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {creditHistory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.type === 'purchase' ? 'bg-green-100 text-green-800' :
                          item.type === 'bonus' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.type === 'purchase' ? '충전' : item.type === 'bonus' ? '보너스' : '사용'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={item.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">총 사용량</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">2,120</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">이번 달 사용</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">43회</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">선호 에이전트</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">회의록 자동화</p>
                  </div>
                  <Bot className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">AI 에이전트별 사용 현황</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {usageStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-900">{stat.agent}</h3>
                          <span className="text-sm font-bold text-blue-600">{stat.usage}회</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{stat.category}</span>
                          <span>{stat.credits} 크레딧 사용</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
