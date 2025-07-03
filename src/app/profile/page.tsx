'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  BarChart3, 
  History,
  Edit,
  Save,
  X,
  Calendar,
  Bot,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// interface UserInfo {
//   email: string;
//   name: string;
//   role: string;
//   credits: number;
//   isLoggedIn: boolean;
//   loginTime: string;
// }

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  // const [loggedInUser, setLoggedInUser] = useState<UserInfo | null>(null);
  const [passwordChange, setPasswordChange] = useState({
    isChanging: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    error: '',
    success: false
  });

  const [creditFilter, setCreditFilter] = useState({
    startDate: '',
    endDate: '',
    type: 'all', // 'all', 'purchase', 'usage'
    period: 'all' // 'all', 'week', 'month', 'custom'
  });

  const [usageFilter, setUsageFilter] = useState({
    startDate: '',
    endDate: '',
    category: 'all', // 'all', '일반사무', '마케팅/광고', '콘텐츠 제작'
    period: 'all' // 'all', 'week', 'month', 'custom'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [usageCurrentPage, setUsageCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '010-1234-5678',
    accountType: 'individual',
    company: '',
    joinDate: '2024-01-15',
    credits: 0
  });

  const creditHistory = [
    { id: 1, type: 'purchase', amount: 1000, description: '스타터 패키지', date: '2024-01-20', balance: 1250 },
    { id: 2, type: 'usage', amount: -50, description: '회의록 자동화 AI', date: '2024-01-19', balance: 250 },
    { id: 3, type: 'usage', amount: -30, description: '이메일 자동 작성 AI', date: '2024-01-18', balance: 300 },
    { id: 4, type: 'usage', amount: -80, description: 'PPT 슬라이드 생성기', date: '2024-01-17', balance: 330 },
    { id: 5, type: 'purchase', amount: 500, description: '베이직 패키지', date: '2024-01-15', balance: 250 },
    { id: 6, type: 'usage', amount: -25, description: '데이터 분석 AI', date: '2024-01-14', balance: 275 },
    { id: 7, type: 'usage', amount: -40, description: '소셜 미디어 콘텐츠 AI', date: '2024-01-13', balance: 300 },
    { id: 8, type: 'purchase', amount: 300, description: '미니 패키지', date: '2024-01-12', balance: 340 },
    { id: 9, type: 'usage', amount: -60, description: '카드뉴스 생성 AI', date: '2024-01-11', balance: 40 },
    { id: 10, type: 'usage', amount: -35, description: '광고 문구 생성 AI', date: '2024-01-10', balance: 100 },
    { id: 11, type: 'purchase', amount: 800, description: '프로 패키지', date: '2024-01-09', balance: 135 },
    { id: 12, type: 'usage', amount: -45, description: '블로그 글 작성 AI', date: '2024-01-08', balance: 90 },
    { id: 13, type: 'usage', amount: -55, description: '프레젠테이션 생성기', date: '2024-01-07', balance: 135 },
    { id: 14, type: 'usage', amount: -20, description: '번역 AI', date: '2024-01-06', balance: 190 },
    { id: 15, type: 'purchase', amount: 200, description: '라이트 패키지', date: '2024-01-05', balance: 210 },
    { id: 16, type: 'usage', amount: -30, description: '요약 AI', date: '2024-01-04', balance: 10 },
    { id: 17, type: 'usage', amount: -65, description: '인포그래픽 생성 AI', date: '2024-01-03', balance: 40 },
    { id: 18, type: 'purchase', amount: 600, description: '스탠다드 패키지', date: '2024-01-02', balance: 105 },
    { id: 19, type: 'usage', amount: -40, description: '마케팅 전략 AI', date: '2024-01-01', balance: 45 },
    { id: 20, type: 'usage', amount: -25, description: '키워드 분석 AI', date: '2023-12-31', balance: 85 },
    { id: 21, type: 'purchase', amount: 1500, description: '프리미엄 패키지', date: '2023-12-30', balance: 110 },
    { id: 22, type: 'usage', amount: -70, description: '동영상 스크립트 AI', date: '2023-12-29', balance: 40 },
    { id: 23, type: 'usage', amount: -35, description: '제품 설명 AI', date: '2023-12-28', balance: 110 },
    { id: 24, type: 'usage', amount: -45, description: '이벤트 기획 AI', date: '2023-12-27', balance: 145 },
    { id: 25, type: 'purchase', amount: 400, description: '에센셜 패키지', date: '2023-12-26', balance: 190 }
  ];

  const usageStats = [
    { agent: '회의록 자동화 AI', usage: 12, credits: 600, category: '일반사무', dates: ['2024-01-20', '2024-01-19', '2024-01-18', '2024-01-17', '2024-01-16', '2024-01-15', '2024-01-14', '2024-01-13', '2024-01-12', '2024-01-11', '2024-01-10', '2024-01-09'] },
    { agent: 'PPT 슬라이드 생성기', usage: 8, credits: 640, category: '일반사무', dates: ['2024-01-17', '2024-01-15', '2024-01-12', '2024-01-10', '2024-01-08', '2024-01-05', '2024-01-03', '2024-01-01'] },
    { agent: '이메일 자동 작성 AI', usage: 15, credits: 450, category: '일반사무', dates: ['2024-01-18', '2024-01-16', '2024-01-14', '2024-01-12', '2024-01-10', '2024-01-08', '2024-01-06', '2024-01-04', '2024-01-02', '2023-12-31', '2023-12-29', '2023-12-27', '2023-12-25', '2023-12-23', '2023-12-21'] },
    { agent: 'SNS 이벤트 기획 AI', usage: 5, credits: 250, category: '마케팅/광고', dates: ['2024-01-15', '2024-01-10', '2024-01-05', '2023-12-30', '2023-12-25'] },
    { agent: '카드뉴스 생성 AI', usage: 3, credits: 180, category: '콘텐츠 제작', dates: ['2024-01-11', '2024-01-02', '2023-12-28'] },
    { agent: '음성파일 기반 문서 자동화 AI', usage: 6, credits: 180, category: '일반사무', dates: ['2024-01-19', '2024-01-14', '2024-01-09', '2024-01-04', '2023-12-30', '2023-12-25'] },
    { agent: '리뷰 분석 AI', usage: 9, credits: 135, category: '마케팅/광고', dates: ['2024-01-18', '2024-01-15', '2024-01-12', '2024-01-08', '2024-01-05', '2024-01-01', '2023-12-28', '2023-12-25', '2023-12-22'] },
    { agent: '키워드 분석 AI', usage: 7, credits: 84, category: '마케팅/광고', dates: ['2024-01-17', '2024-01-13', '2024-01-10', '2024-01-06', '2024-01-03', '2023-12-31', '2023-12-27'] },
    { agent: '광고 문구 분석 및 제안 AI', usage: 4, credits: 80, category: '마케팅/광고', dates: ['2024-01-16', '2024-01-11', '2024-01-07', '2024-01-02'] },
    { agent: 'AI 블로그 생성기', usage: 11, credits: 165, category: '콘텐츠 제작', dates: ['2024-01-20', '2024-01-17', '2024-01-14', '2024-01-11', '2024-01-08', '2024-01-05', '2024-01-02', '2023-12-30', '2023-12-27', '2023-12-24', '2023-12-21'] },
    { agent: '데이터 분석 AI', usage: 8, credits: 200, category: '일반사무', dates: ['2024-01-19', '2024-01-16', '2024-01-13', '2024-01-10', '2024-01-07', '2024-01-04', '2024-01-01', '2023-12-29'] },
    { agent: '소셜 미디어 콘텐츠 AI', usage: 6, credits: 120, category: '마케팅/광고', dates: ['2024-01-18', '2024-01-14', '2024-01-11', '2024-01-08', '2024-01-05', '2024-01-02'] },
    { agent: '번역 AI', usage: 13, credits: 260, category: '일반사무', dates: ['2024-01-20', '2024-01-18', '2024-01-16', '2024-01-14', '2024-01-12', '2024-01-10', '2024-01-08', '2024-01-06', '2024-01-04', '2024-01-02', '2023-12-31', '2023-12-29', '2023-12-27'] },
    { agent: '요약 AI', usage: 10, credits: 200, category: '일반사무', dates: ['2024-01-19', '2024-01-17', '2024-01-15', '2024-01-13', '2024-01-11', '2024-01-09', '2024-01-07', '2024-01-05', '2024-01-03', '2024-01-01'] },
    { agent: '인포그래픽 생성 AI', usage: 5, credits: 325, category: '콘텐츠 제작', dates: ['2024-01-16', '2024-01-12', '2024-01-08', '2024-01-04', '2023-12-31'] },
    { agent: '마케팅 전략 AI', usage: 7, credits: 280, category: '마케팅/광고', dates: ['2024-01-18', '2024-01-14', '2024-01-10', '2024-01-06', '2024-01-02', '2023-12-29', '2023-12-25'] },
    { agent: '동영상 스크립트 AI', usage: 4, credits: 280, category: '콘텐츠 제작', dates: ['2024-01-15', '2024-01-09', '2024-01-03', '2023-12-28'] },
    { agent: '제품 설명 AI', usage: 9, credits: 315, category: '마케팅/광고', dates: ['2024-01-20', '2024-01-17', '2024-01-14', '2024-01-11', '2024-01-08', '2024-01-05', '2024-01-02', '2023-12-30', '2023-12-27'] },
    { agent: '이벤트 기획 AI', usage: 6, credits: 270, category: '마케팅/광고', dates: ['2024-01-19', '2024-01-15', '2024-01-11', '2024-01-07', '2024-01-03', '2023-12-30'] },
    { agent: '고객 상담 AI', usage: 12, credits: 480, category: '일반사무', dates: ['2024-01-20', '2024-01-18', '2024-01-16', '2024-01-14', '2024-01-12', '2024-01-10', '2024-01-08', '2024-01-06', '2024-01-04', '2024-01-02', '2023-12-31', '2023-12-29'] },
    { agent: '보고서 생성 AI', usage: 8, credits: 400, category: '일반사무', dates: ['2024-01-19', '2024-01-16', '2024-01-13', '2024-01-10', '2024-01-07', '2024-01-04', '2024-01-01', '2023-12-28'] },
    { agent: '웹사이트 콘텐츠 AI', usage: 5, credits: 200, category: '콘텐츠 제작', dates: ['2024-01-17', '2024-01-12', '2024-01-07', '2024-01-02', '2023-12-28'] },
    { agent: '챗봇 응답 AI', usage: 14, credits: 420, category: '일반사무', dates: ['2024-01-20', '2024-01-19', '2024-01-18', '2024-01-17', '2024-01-16', '2024-01-15', '2024-01-14', '2024-01-13', '2024-01-12', '2024-01-11', '2024-01-10', '2024-01-09', '2024-01-08', '2024-01-07'] },
    { agent: 'SEO 최적화 AI', usage: 7, credits: 280, category: '마케팅/광고', dates: ['2024-01-18', '2024-01-14', '2024-01-10', '2024-01-06', '2024-01-02', '2023-12-29', '2023-12-25'] },
    { agent: '뉴스레터 생성 AI', usage: 6, credits: 180, category: '콘텐츠 제작', dates: ['2024-01-16', '2024-01-11', '2024-01-06', '2024-01-01', '2023-12-27', '2023-12-22'] }
  ];

  useEffect(() => {
    // 로그인한 사용자 정보 불러오기
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo);
        if (parsed.isLoggedIn) {
          // setLoggedInUser(parsed);
          // 프로필 정보에 로그인 정보 반영
          setUserInfo({
            name: parsed.role === '일반사용자' ? '김일반' : 
                  parsed.role === '회사관리자' ? '박회사' : 
                  parsed.role === '회사일반사용자' ? '이직원' : '이관리',
            email: parsed.email,
            phone: '010-1234-5678',
            accountType: (parsed.role === '회사관리자' || parsed.role === '회사일반사용자') ? 'company' : 'individual',
            company: (parsed.role === '회사관리자' || parsed.role === '회사일반사용자') ? '테스트 회사' : '',
            joinDate: '2024-01-15',
            credits: parsed.credits
          });
        }
      } catch (error) {
        console.error('Failed to parse user info:', error);
      }
    }
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    // API call to save user info
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
  };

  const handlePasswordChange = () => {
    setPasswordChange(prev => ({ 
      ...prev, 
      error: '', 
      success: false 
    }));

    // 입력 검증
    if (!passwordChange.currentPassword) {
      setPasswordChange(prev => ({ ...prev, error: '현재 비밀번호를 입력해주세요.' }));
      return;
    }

    if (!passwordChange.newPassword) {
      setPasswordChange(prev => ({ ...prev, error: '새 비밀번호를 입력해주세요.' }));
      return;
    }

    if (passwordChange.newPassword.length < 8) {
      setPasswordChange(prev => ({ ...prev, error: '새 비밀번호는 8자 이상이어야 합니다.' }));
      return;
    }

    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      setPasswordChange(prev => ({ ...prev, error: '새 비밀번호가 일치하지 않습니다.' }));
      return;
    }

    if (passwordChange.currentPassword === passwordChange.newPassword) {
      setPasswordChange(prev => ({ ...prev, error: '현재 비밀번호와 새 비밀번호가 같습니다.' }));
      return;
    }

    // 현재 비밀번호 확인 (임시로 로그인 계정별 비밀번호 확인)
    const testPasswords: { [key: string]: string } = {
      'admin@test.com': 'admin123',
      'company@test.com': 'company123',
      'user@test.com': 'user123',
      'employee@test.com': 'employee123'
    };

    const currentUserPassword = testPasswords[userInfo.email];
    if (passwordChange.currentPassword !== currentUserPassword) {
      setPasswordChange(prev => ({ ...prev, error: '현재 비밀번호가 올바르지 않습니다.' }));
      return;
    }

    // 비밀번호 변경 처리 (실제로는 API 호출)
    setPasswordChange(prev => ({ ...prev, isChanging: true }));
    
    setTimeout(() => {
      setPasswordChange({
        isChanging: false,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
        error: '',
        success: true
      });

      // 성공 메시지 자동 숨김
      setTimeout(() => {
        setPasswordChange(prev => ({ ...prev, success: false }));
      }, 3000);
    }, 1500);
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordChange(prev => ({
      ...prev,
      [field]: value,
      error: '',
      success: false
    }));
  };

  // 크레딧 내역 필터링 및 페이지네이션
  const getFilteredCreditHistory = () => {
    let filtered = [...creditHistory];

    // 유형 필터링
    if (creditFilter.type !== 'all') {
      filtered = filtered.filter(item => item.type === creditFilter.type);
    }

    // 기간 필터링
    let startDate = '';
    let endDate = '';

    if (creditFilter.period === 'week') {
      // 1주일 전부터 오늘까지
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      startDate = weekAgo.toISOString().split('T')[0];
      endDate = today.toISOString().split('T')[0];
    } else if (creditFilter.period === 'month') {
      // 1개월 전부터 오늘까지
      const today = new Date();
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      startDate = monthAgo.toISOString().split('T')[0];
      endDate = today.toISOString().split('T')[0];
    } else if (creditFilter.period === 'custom') {
      // 직접 입력한 날짜 사용
      startDate = creditFilter.startDate;
      endDate = creditFilter.endDate;
    }

    if (startDate) {
      filtered = filtered.filter(item => item.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(item => item.date <= endDate);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredHistory = getFilteredCreditHistory();
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 필터링된 데이터의 합계 계산
  const getFilteredSummary = () => {
    const totalPurchase = filteredHistory
      .filter(item => item.type === 'purchase')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const totalUsage = filteredHistory
      .filter(item => item.type === 'usage')
      .reduce((sum, item) => sum + Math.abs(item.amount), 0);

    return { totalPurchase, totalUsage };
  };

  const { totalPurchase, totalUsage } = getFilteredSummary();

  const handleFilterChange = (field: string, value: string) => {
    if (field === 'period') {
      // 기간 선택이 변경되면 커스텀 날짜 초기화
      setCreditFilter(prev => ({ 
        ...prev, 
        [field]: value,
        startDate: '',
        endDate: ''
      }));
    } else {
      setCreditFilter(prev => ({ ...prev, [field]: value }));
    }
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'credits') {
      // 크레딧 탭으로 변경 시 필터 초기화
      setCreditFilter({
        startDate: '',
        endDate: '',
        type: 'all',
        period: 'all'
      });
      setCurrentPage(1);
    } else if (tab === 'usage') {
      // 사용 통계 탭으로 변경 시 필터 초기화
      setUsageFilter({
        startDate: '',
        endDate: '',
        category: 'all',
        period: 'all'
      });
      setUsageCurrentPage(1);
    }
  };

  // 사용 통계 필터링 함수
  const getFilteredUsageStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return usageStats.filter(stat => {
      // 카테고리 필터링
      if (usageFilter.category !== 'all' && stat.category !== usageFilter.category) {
        return false;
      }
      return true;
    }).map(stat => {
      let filteredDates = stat.dates;

      // 기간 필터링
      if (usageFilter.period !== 'all') {
        filteredDates = stat.dates.filter(date => {
          const itemDate = new Date(date);
          
          if (usageFilter.period === 'week') {
            return itemDate >= weekAgo;
          } else if (usageFilter.period === 'month') {
            return itemDate >= monthAgo;
          } else if (usageFilter.period === 'custom' && usageFilter.startDate && usageFilter.endDate) {
            const startDate = new Date(usageFilter.startDate);
            const endDate = new Date(usageFilter.endDate);
            return itemDate >= startDate && itemDate <= endDate;
          }
          return true;
        });
      }

      const filteredUsage = filteredDates.length;
      const filteredCredits = Math.round((filteredUsage / stat.usage) * stat.credits);

      return {
        ...stat,
        usage: filteredUsage,
        credits: filteredCredits,
        dates: filteredDates
      };
    }).filter(stat => stat.usage > 0);
  };

  // 사용 통계 합계 계산 함수
  const getFilteredUsageSummary = () => {
    const filteredStats = getFilteredUsageStats();
    const totalUsage = filteredStats.reduce((sum, stat) => sum + stat.usage, 0);
    const totalCredits = filteredStats.reduce((sum, stat) => sum + stat.credits, 0);
    const mostUsedAgent = filteredStats.length > 0 
      ? filteredStats.reduce((max, stat) => stat.usage > max.usage ? stat : max).agent
      : '-';

    return { totalUsage, totalCredits, mostUsedAgent };
  };

  // 사용 통계 필터 변경 핸들러
  const handleUsageFilterChange = (field: string, value: string) => {
    if (field === 'period') {
      // 기간 선택이 변경되면 커스텀 날짜 초기화
      setUsageFilter(prev => ({ 
        ...prev, 
        [field]: value,
        startDate: '',
        endDate: ''
      }));
    } else {
      setUsageFilter(prev => ({ ...prev, [field]: value }));
    }
    setUsageCurrentPage(1); // 필터 변경 시 첫 페이지로
  };

  // 사용 통계 페이지 변경 핸들러
  const handleUsagePageChange = (page: number) => {
    setUsageCurrentPage(page);
  };

  // 페이징된 사용 통계 데이터 가져오기
  const getPaginatedUsageStats = () => {
    const filteredStats = getFilteredUsageStats();
    const startIndex = (usageCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredStats.slice(startIndex, endIndex);
  };

  // 사용 통계 총 페이지 수 계산
  const getUsageTotalPages = () => {
    const filteredStats = getFilteredUsageStats();
    return Math.ceil(filteredStats.length / itemsPerPage);
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
              onClick={() => handleTabChange('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              계정 정보
            </button>
            <button
              onClick={() => handleTabChange('credits')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'credits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              크레딧 내역
            </button>
            <button
              onClick={() => handleTabChange('usage')}
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
                  <h2 className="text-lg font-semibold text-gray-900">계정 정보</h2>
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

                  {/* 비밀번호 변경 섹션 */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">비밀번호 변경</h3>
                    
                    {passwordChange.success && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          <p className="text-sm text-green-800">비밀번호가 성공적으로 변경되었습니다.</p>
                        </div>
                      </div>
                    )}

                    {passwordChange.error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center">
                          <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                          <p className="text-sm text-red-800">{passwordChange.error}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">현재 비밀번호</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type={passwordChange.showCurrentPassword ? 'text' : 'password'}
                            value={passwordChange.currentPassword}
                            onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="현재 비밀번호를 입력하세요"
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordChange(prev => ({ ...prev, showCurrentPassword: !prev.showCurrentPassword }))}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {passwordChange.showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type={passwordChange.showNewPassword ? 'text' : 'password'}
                            value={passwordChange.newPassword}
                            onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordChange(prev => ({ ...prev, showNewPassword: !prev.showNewPassword }))}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {passwordChange.showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호 확인</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type={passwordChange.showConfirmPassword ? 'text' : 'password'}
                            value={passwordChange.confirmPassword}
                            onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="새 비밀번호를 다시 입력하세요"
                          />
                          <button
                            type="button"
                            onClick={() => setPasswordChange(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {passwordChange.showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handlePasswordChange}
                          disabled={passwordChange.isChanging || !passwordChange.currentPassword || !passwordChange.newPassword || !passwordChange.confirmPassword}
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {passwordChange.isChanging ? '변경 중...' : '비밀번호 변경'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">사용 정보</h3>
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


            </div>
          </div>
        )}

        {/* Credits Tab */}
        {activeTab === 'credits' && (
          <div className="space-y-6">
            {/* 필터 및 합계 영역 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  크레딧 사용 내역
                </h2>
              </div>

              {/* 필터 컨트롤 */}
              <div className="space-y-3 mb-6">
                {/* 첫 번째 행: 유형 선택 */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700 w-12">유형</label>
                  <select
                    value={creditFilter.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">전체</option>
                    <option value="purchase">충전</option>
                    <option value="usage">사용</option>
                  </select>
                </div>

                {/* 두 번째 행: 기간 선택 */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700 w-12">기간</label>
                  <select
                    value={creditFilter.period}
                    onChange={(e) => handleFilterChange('period', e.target.value)}
                    className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">전체</option>
                    <option value="week">1주일</option>
                    <option value="month">1개월</option>
                    <option value="custom">직접입력</option>
                  </select>
                </div>

                {/* 직접입력 선택 시에만 날짜 입력 필드 표시 */}
                {creditFilter.period === 'custom' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-16">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">시작 날짜</label>
                      <input
                        type="date"
                        value={creditFilter.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">종료 날짜</label>
                      <input
                        type="date"
                        value={creditFilter.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 합계 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">총 충전</p>
                  <p className="text-xl font-bold text-green-600">+{totalPurchase.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">총 사용</p>
                  <p className="text-xl font-bold text-red-600">-{totalUsage.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">순 변동</p>
                  <p className={`text-xl font-bold ${(totalPurchase - totalUsage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(totalPurchase - totalUsage) >= 0 ? '+' : ''}{(totalPurchase - totalUsage).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* 내역 테이블 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    총 {filteredHistory.length}건의 내역
                  </h3>
                  {filteredHistory.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredHistory.length)} / {filteredHistory.length}
                    </span>
                  )}
                </div>
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
                    {paginatedHistory.length > 0 ? (
                      paginatedHistory.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.type === 'purchase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.type === 'purchase' ? '충전' : '사용'}
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <History className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="text-center">
                              <h3 className="text-sm font-medium text-gray-900 mb-1">검색 결과가 없습니다</h3>
                              <p className="text-sm text-gray-500">
                                선택한 조건에 해당하는 크레딧 내역이 없습니다.<br/>
                                다른 조건으로 검색해보세요.
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              {filteredHistory.length > 0 && totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        이전
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        다음
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>

                    <div className="text-sm text-gray-500">
                      페이지 {currentPage} / {totalPages}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <div className="space-y-6">
            {/* 필터 영역 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  사용 통계
                </h2>
              </div>

              {/* 필터 컨트롤 */}
              <div className="space-y-3 mb-6">
                {/* 첫 번째 행: 카테고리 선택 */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700 w-12">카테고리</label>
                  <select
                    value={usageFilter.category}
                    onChange={(e) => handleUsageFilterChange('category', e.target.value)}
                    className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">전체</option>
                    <option value="일반사무">일반사무</option>
                    <option value="마케팅/광고">마케팅/광고</option>
                    <option value="콘텐츠 제작">콘텐츠 제작</option>
                  </select>
                </div>

                {/* 두 번째 행: 기간 선택 */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700 w-12">기간</label>
                  <select
                    value={usageFilter.period}
                    onChange={(e) => handleUsageFilterChange('period', e.target.value)}
                    className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">전체</option>
                    <option value="week">1주일</option>
                    <option value="month">1개월</option>
                    <option value="custom">직접입력</option>
                  </select>
                </div>

                {/* 직접입력 선택 시에만 날짜 입력 필드 표시 */}
                {usageFilter.period === 'custom' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-16">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">시작 날짜</label>
                      <input
                        type="date"
                        value={usageFilter.startDate}
                        onChange={(e) => handleUsageFilterChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">종료 날짜</label>
                      <input
                        type="date"
                        value={usageFilter.endDate}
                        onChange={(e) => handleUsageFilterChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 통계 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">총 사용 크레딧</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{getFilteredUsageSummary().totalCredits.toLocaleString()}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">총 사용 횟수</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{getFilteredUsageSummary().totalUsage}회</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">최다 사용 에이전트</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">{getFilteredUsageSummary().mostUsedAgent}</p>
                  </div>
                  <Bot className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* AI 에이전트별 사용 현황 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">AI 에이전트별 사용 현황</h2>
                  <div className="flex items-center space-x-4">
                    {getFilteredUsageStats().length > 0 && (
                      <span className="text-sm text-gray-500">
                        {((usageCurrentPage - 1) * itemsPerPage) + 1}-{Math.min(usageCurrentPage * itemsPerPage, getFilteredUsageStats().length)} / {getFilteredUsageStats().length}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">총 {getFilteredUsageStats().length}개 에이전트</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {getPaginatedUsageStats().length > 0 ? (
                  <div className="space-y-4">
                    {getPaginatedUsageStats().map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-900">{stat.agent}</h3>
                            <span className="text-sm font-bold text-blue-600">{stat.usage}회</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{stat.category}</span>
                            <span>{stat.credits.toLocaleString()} 크레딧 사용</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bot className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">검색 결과가 없습니다</h3>
                    <p className="text-sm text-gray-500">
                      선택한 조건에 해당하는 사용 통계가 없습니다.<br/>
                      다른 조건으로 검색해보세요.
                    </p>
                  </div>
                )}
              </div>

              {/* 페이지네이ション */}
              {getFilteredUsageStats().length > 0 && getUsageTotalPages() > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUsagePageChange(usageCurrentPage - 1)}
                        disabled={usageCurrentPage === 1}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        이전
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: getUsageTotalPages() }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handleUsagePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              usageCurrentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handleUsagePageChange(usageCurrentPage + 1)}
                        disabled={usageCurrentPage === getUsageTotalPages()}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        다음
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>

                    <div className="text-sm text-gray-500">
                      페이지 {usageCurrentPage} / {getUsageTotalPages()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
