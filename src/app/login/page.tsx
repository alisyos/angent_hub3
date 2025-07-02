'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Footer from '@/components/Footer';

// 테스트 계정 정보
const testAccounts = [
  {
    email: "admin@test.com",
    password: "admin123",
    role: "관리자",
    name: "관리자",
    credits: 1000
  },
  {
    email: "company@test.com", 
    password: "company123",
    role: "회사관리자",
    name: "회사관리자",
    credits: 500
  },
  {
    email: "user@test.com",
    password: "user123", 
    role: "일반사용자",
    name: "일반사용자",
    credits: 100
  },
  {
    email: "employee@test.com",
    password: "employee123", 
    role: "회사일반사용자",
    name: "회사일반사용자",
    credits: 200
  }
];

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // 테스트 계정 확인
    const account = testAccounts.find(
      acc => acc.email === formData.email && acc.password === formData.password
    );

    if (account) {
      // 로그인 성공 - 사용자 정보를 localStorage에 저장
      const userInfo = {
        email: account.email,
        name: account.name,
        role: account.role,
        credits: account.credits,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      // 역할에 따른 리디렉션
      setTimeout(() => {
        setIsLoading(false);
        
        switch (account.role) {
          case '관리자':
            router.push('/admin');
            break;
          case '회사관리자':
            router.push('/company');
            break;
          case '회사일반사용자':
            router.push('/company');
            break;
          case '일반사용자':
          default:
            router.push('/');
            break;
        }
      }, 1000);
    } else {
      // 로그인 실패
      setTimeout(() => {
        setIsLoading(false);
        setError('이메일 또는 비밀번호가 잘못되었습니다.');
      }, 1000);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} 로그인 기능은 개발 중입니다.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-bg bg-clip-text text-transparent">
            AI 에이전트 허브
          </h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              회원가입
            </a>
          </p>
        </div>
      </div>

      {/* 테스트 계정 안내 */}
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">🧪 테스트 계정</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div><strong>관리자:</strong> admin@test.com / admin123</div>
            <div><strong>회사관리자:</strong> company@test.com / company123</div>
            <div><strong>일반사용자:</strong> user@test.com / user123</div>
            <div><strong>회사일반사용자:</strong> employee@test.com / employee123</div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일 주소
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="your@email.com"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="비밀번호를 입력하세요"
                />
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  로그인 상태 유지
                </label>
              </div>

              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  비밀번호를 잊으셨나요?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="ml-2">Google로 로그인</span>
              </button>

              <button
                onClick={() => handleSocialLogin('카카오')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-yellow-300 text-sm font-medium text-gray-900 hover:bg-yellow-400"
              >
                <span className="text-lg">💬</span>
                <span className="ml-2">카카오로 로그인</span>
              </button>

              <button
                onClick={() => handleSocialLogin('네이버')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-green-500 text-sm font-medium text-white hover:bg-green-600"
              >
                <span className="font-bold">N</span>
                <span className="ml-2">네이버로 로그인</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 