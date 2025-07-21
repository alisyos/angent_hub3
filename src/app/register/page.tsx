'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useModal } from '@/contexts/ModalContext';
import Footer from '@/components/Footer';
import ScreenDefinitionButton from '@/components/ScreenDefinitionButton';
import { getScreenDefinition } from '@/data/screenDefinitions';
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Phone, 
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Shield,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function Register() {
  const { showModal } = useModal();
  const [accountType, setAccountType] = useState<'individual' | 'company'>('individual');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailVerification, setEmailVerification] = useState({
    isCodeSent: false,
    isVerified: false,
    isSending: false,
    timer: 0,
    code: ''
  });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    name: '',
    phone: '',
    companyCode: '',
    businessNumber: '',
    address: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  });
  const [errors, setErrors] = useState({
    passwordMismatch: false,
    verificationCode: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 비밀번호 확인 검증
    if (name === 'confirmPassword' || name === 'password') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      setErrors(prev => ({
        ...prev,
        passwordMismatch: confirmPassword !== '' && password !== confirmPassword
      }));
    }
  };

  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      showModal({
        title: '입력 필요',
        message: '이메일 주소를 입력해주세요.',
        type: 'warning'
      });
      return;
    }

    setEmailVerification(prev => ({ ...prev, isSending: true }));

    // 실제로는 백엔드 API 호출
    setTimeout(() => {
      setEmailVerification(prev => ({
        ...prev,
        isCodeSent: true,
        isSending: false,
        timer: 300 // 5분
      }));

      // 타이머 시작
      const countdown = setInterval(() => {
        setEmailVerification(prev => {
          if (prev.timer <= 1) {
            clearInterval(countdown);
            return { ...prev, timer: 0, isCodeSent: false };
          }
          return { ...prev, timer: prev.timer - 1 };
        });
      }, 1000);
    }, 2000);
  };

  const handleVerifyCode = () => {
    // 실제로는 백엔드에서 코드 검증
    const isValid = formData.verificationCode === '123456'; // 데모용

    if (isValid) {
      setEmailVerification(prev => ({
        ...prev,
        isVerified: true,
        timer: 0
      }));
      setErrors(prev => ({ ...prev, verificationCode: false }));
    } else {
      setErrors(prev => ({ ...prev, verificationCode: true }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검증
    if (!emailVerification.isVerified) {
      showModal({
        title: '인증 필요',
        message: '이메일 인증을 완료해주세요.',
        type: 'warning'
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, passwordMismatch: true }));
      return;
    }

    console.log('Registration attempt:', { accountType, ...formData });
    showModal({
      title: '가입 완료',
      message: '회원가입이 완료되었습니다!',
      type: 'success'
    });
  };

  const handleSocialRegister = (provider: string) => {
    showModal({
      title: '기능 개발 중',
      message: `${provider} 소셜 회원가입 기능은 개발 중입니다.`,
      type: 'info'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">AI 에이전트 허브</h1>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">회원가입</h2>
          <p className="mt-2 text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              로그인하기
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          
          {/* 소셜 회원가입 */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">간편 회원가입</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={() => handleSocialRegister('Google')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="ml-2">Google로 가입하기</span>
              </button>

              <button
                onClick={() => handleSocialRegister('카카오')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-yellow-300 text-sm font-medium text-gray-900 hover:bg-yellow-400 transition-colors"
              >
                <span className="text-lg">💬</span>
                <span className="ml-2">카카오로 가입하기</span>
              </button>

              <button
                onClick={() => handleSocialRegister('네이버')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-green-500 text-sm font-medium text-white hover:bg-green-600 transition-colors"
              >
                <span className="font-bold">N</span>
                <span className="ml-2">네이버로 가입하기</span>
              </button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는 이메일로 가입</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              계정 유형
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccountType('individual')}
                className={`flex items-center justify-center px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
                  accountType === 'individual'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                개인
              </button>
              <button
                type="button"
                onClick={() => setAccountType('company')}
                className={`flex items-center justify-center px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
                  accountType === 'company'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Building2 className="w-4 h-4 mr-2" />
                회사
              </button>
            </div>
            {accountType === 'company' && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>회사 관리자 계정</strong>을 생성하려면 <a href="/contact" className="font-medium underline hover:text-blue-600">문의하기</a>를 통해 문의해주세요.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이메일 주소 및 인증 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일 주소
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={emailVerification.isVerified}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      emailVerification.isVerified 
                        ? 'bg-green-50 border-green-300 text-green-800' 
                        : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {emailVerification.isVerified && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  disabled={emailVerification.isSending || emailVerification.isVerified || !formData.email}
                  className={`px-4 py-2 border border-l-0 rounded-r-md text-sm font-medium transition-colors ${
                    emailVerification.isVerified
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : emailVerification.isSending
                      ? 'bg-gray-100 text-gray-500 border-gray-300'
                      : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {emailVerification.isVerified ? (
                    '인증완료'
                  ) : emailVerification.isSending ? (
                    '발송중...'
                  ) : emailVerification.isCodeSent ? (
                    '재발송'
                  ) : (
                    '인증코드 발송'
                  )}
                </button>
              </div>
            </div>

            {/* 인증 코드 입력 */}
            {emailVerification.isCodeSent && !emailVerification.isVerified && (
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                  인증 코드
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      required
                      value={formData.verificationCode}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.verificationCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={!formData.verificationCode}
                    className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:bg-gray-300 transition-colors"
                  >
                    인증확인
                  </button>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  {emailVerification.timer > 0 && (
                    <div className="flex items-center text-sm text-orange-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(emailVerification.timer)} 후 만료
                    </div>
                  )}
                  {errors.verificationCode && (
                    <div className="flex items-center text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      인증 코드가 올바르지 않습니다
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  데모: 인증 코드 &quot;123456&quot;을 입력하세요
                </p>
              </div>
            )}

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="8자 이상 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.passwordMismatch ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.passwordMismatch && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  비밀번호가 일치하지 않습니다
                </div>
              )}
              {formData.confirmPassword && !errors.passwordMismatch && (
                <div className="mt-1 flex items-center text-sm text-green-600">
                  <Check className="w-4 h-4 mr-1" />
                  비밀번호가 일치합니다
                </div>
              )}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {accountType === 'individual' ? '이름' : '담당자명'}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={accountType === 'individual' ? '홍길동' : '담당자 이름'}
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                전화번호
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="010-1234-5678"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                휴대폰 번호를 입력하세요 (숫자만 입력 또는 하이픈 포함)
              </p>
            </div>

            {accountType === 'company' && (
              <div>
                <label htmlFor="companyCode" className="block text-sm font-medium text-gray-700">
                  회사코드
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="companyCode"
                    name="companyCode"
                    type="text"
                    required
                    value={formData.companyCode}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="회사 관리자에게 받은 코드를 입력하세요"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  회사 관리자로부터 받은 회사코드를 입력해주세요
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
                  <span className="text-red-500">*</span> 서비스 이용약관에 동의합니다
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="agreePrivacy"
                  name="agreePrivacy"
                  type="checkbox"
                  required
                  checked={formData.agreePrivacy}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agreePrivacy" className="ml-2 block text-sm text-gray-900">
                  <span className="text-red-500">*</span> 개인정보 처리방침에 동의합니다
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="agreeMarketing"
                  name="agreeMarketing"
                  type="checkbox"
                  checked={formData.agreeMarketing}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeMarketing" className="ml-2 block text-sm text-gray-900">
                  마케팅 정보 수신에 동의합니다 (선택)
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!emailVerification.isVerified || errors.passwordMismatch}
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                  !emailVerification.isVerified || errors.passwordMismatch
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                회원가입
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">가입 혜택</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>가입 즉시 500 크레딧 지급</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>모든 AI 에이전트 무료 체험</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      {/* 화면 정의 플로팅 버튼 */}
      {(() => {
        const screenDef = getScreenDefinition('/register');
        return screenDef ? (
          <ScreenDefinitionButton 
            pageTitle={screenDef.title}
            definition={screenDef.definition}
          />
        ) : null;
      })()}
    </div>
  );
}
