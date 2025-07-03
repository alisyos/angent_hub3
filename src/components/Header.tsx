'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, CreditCard, Menu, X, LogOut, Settings } from 'lucide-react';

interface UserInfo {
  email: string;
  name: string;
  role: string;
  credits: number;
  isLoggedIn: boolean;
  loginTime: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // 로그인 상태 확인
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo);
        if (parsed.isLoggedIn) {
          setUserInfo(parsed);
        }
      } catch (error) {
        console.error('Failed to parse user info:', error);
        localStorage.removeItem('userInfo');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    window.location.href = '/login';
  };

  const getNavigation = () => {
    if (!userInfo) {
      return [
        { name: '에이전트', href: '/' },
        { name: '크레딧 충전', href: '/credits' },
        { name: 'FAQ', href: '/faq' },
        { name: '문의하기', href: '/contact' },
      ];
    }

    const baseNav = [
      { name: '에이전트', href: '/' },
      { name: '크레딧 충전', href: '/credits' },
      { name: 'FAQ', href: '/faq' },
      { name: '문의하기', href: '/contact' },
    ];

    // 역할별 추가 메뉴
    switch (userInfo.role) {
      case '관리자':
        return [
          ...baseNav,
          { name: '관리자', href: '/admin' },
        ];
      case '회사관리자':
        return [
          ...baseNav,
          { name: '회사 관리', href: '/company' },
        ];
      case '회사일반사용자':
        return [
          ...baseNav,
          { name: '회사 현황', href: '/company' },
        ];
      default:
        return baseNav;
    }
  };

  const navigation = getNavigation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
                      <Link href="/" className="text-xl font-bold gradient-bg bg-clip-text text-transparent">
            AI 에이전트 허브
          </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {userInfo ? (
              <>
                {/* Credits Display */}
                <div className="flex items-center space-x-2 bg-amber-50 px-3 py-1 rounded-full">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">{userInfo.credits.toLocaleString()}</span>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{userInfo.email}</p>
                      <p className="text-xs text-gray-500">{userInfo.role}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href="/profile"
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="프로필"
                      >
                        <User className="w-4 h-4" />
                      </a>
                      <button
                        onClick={handleLogout}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="로그아웃"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  로그인
                </a>
                <a
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  회원가입
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                {item.name}
              </a>
            ))}
            
            {userInfo ? (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <User className="w-8 h-8 text-gray-400 bg-gray-100 rounded-full p-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{userInfo.email}</p>
                      <p className="text-xs text-gray-500">{userInfo.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-amber-50 px-3 py-2 rounded-lg mb-3">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">{userInfo.credits.toLocaleString()} 크레딧</span>
                  </div>
                  <div className="space-y-1">
                    <a
                      href="/profile"
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      프로필 설정
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 mt-4 px-3 space-y-1">
                <a
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  로그인
                </a>
                <a
                  href="/register"
                  className="block px-3 py-2 text-base font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  회원가입
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 