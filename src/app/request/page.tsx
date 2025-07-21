'use client';

import { useState } from 'react';
import { 
  FileText, 
  Map, 
  Users, 
  ArrowRight, 
  PlayCircle,
  ChevronRight,
  Building2,
  Shield,
  UserCheck,
  Globe,
  Navigation,
  GitBranch,
  Database,
  Server,
  Smartphone,
  Monitor,
  Cloud,
  Lock,
  CreditCard,
  Bot
} from 'lucide-react';
import ScreenDefinitionButton from '@/components/ScreenDefinitionButton';
import { getScreenDefinition } from '@/data/screenDefinitions';

const tabs = [
  { id: 'prd', name: 'PRD', icon: FileText },
  { id: 'sitemap', name: '사이트맵', icon: Map },
  { id: 'access', name: '접근 권한', icon: Users },
  { id: 'flow', name: '시스템 플로우', icon: GitBranch },
  { id: 'navigation', name: '네비게이션', icon: ArrowRight },
  { id: 'scenarios', name: '이용 시나리오', icon: PlayCircle }
];

export default function RequestPage() {
  const [activeTab, setActiveTab] = useState('prd');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'prd':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">프로젝트 PRD (Product Requirements Document)</h2>
              </div>
              <p className="text-gray-700">AI 에이전트 허브 플랫폼의 상세 기능 명세서</p>
            </div>

            <div className="grid gap-6">
              {/* 프로젝트 개요 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">🎯 프로젝트 개요</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">목표</h4>
                    <p className="text-gray-600">다양한 업무 지원 AI 에이전트를 통합한 크레딧 기반 플랫폼 구축</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">핵심 가치</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>업무 효율성 향상을 위한 AI 도구 통합</li>
                      <li>투명한 크레딧 기반 과금 시스템</li>
                      <li>다중 사용자 유형 지원 (개인/회사)</li>
                      <li>관리자 중심의 플랫폼 운영 체계</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 핵심 기능 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">🚀 핵심 기능</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-blue-600 mb-3">AI 에이전트 시스템</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 10개 AI 에이전트 (7개 활성화)</li>
                      <li>• 3개 카테고리: 일반사무, 마케팅/광고, 콘텐츠 제작</li>
                      <li>• 다양한 입력 타입 지원 (텍스트, 파일, 선택형)</li>
                      <li>• 크레딧 기반 사용량 제어</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600 mb-3">사용자 관리 시스템</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 4가지 사용자 유형 지원</li>
                      <li>• 회사별 직원 관리</li>
                      <li>• 부서별 권한 관리</li>
                      <li>• 사용량 분석 및 리포트</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-600 mb-3">크레딧 시스템</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 7개 크레딧 패키지</li>
                      <li>• 보너스 크레딧 제공</li>
                      <li>• 다양한 결제 수단</li>
                      <li>• 회사별 크레딧 관리</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-600 mb-3">관리 시스템</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 플랫폼 관리자 대시보드</li>
                      <li>• 회사 관리자 시스템</li>
                      <li>• 고객 지원 및 FAQ</li>
                      <li>• 통계 및 분석 도구</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 기술 요구사항 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">⚙️ 기술 요구사항</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Frontend</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Next.js 15+ (App Router)</li>
                      <li>• React 19+</li>
                      <li>• TypeScript 5+</li>
                      <li>• Tailwind CSS</li>
                      <li>• 반응형 디자인</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Backend</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Next.js API Routes</li>
                      <li>• 데이터베이스 연동</li>
                      <li>• 인증/인가 시스템</li>
                      <li>• AI 모델 연동</li>
                      <li>• 결제 시스템 연동</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">인프라</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Vercel 배포</li>
                      <li>• PostgreSQL/MongoDB</li>
                      <li>• 파일 스토리지</li>
                      <li>• 모니터링 시스템</li>
                      <li>• 보안 설정</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 성능 요구사항 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">📊 성능 요구사항</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">사용자 경험</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 페이지 로딩 시간: 3초 이내</li>
                      <li>• AI 에이전트 응답 시간: 30초 이내</li>
                      <li>• 모바일 최적화 완료</li>
                      <li>• 접근성 표준 준수</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">시스템 성능</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 동시 사용자: 1,000명 이상</li>
                      <li>• 가용성: 99.9% 이상</li>
                      <li>• 데이터 백업 및 복구</li>
                      <li>• 확장 가능한 아키텍처</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sitemap':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Map className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">전체 사이트맵</h2>
              </div>
              <p className="text-gray-700">AI 에이전트 허브 플랫폼의 전체 페이지 구조</p>
            </div>

            <div className="grid gap-6">
              {/* 공통 페이지 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  공통 페이지
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-800">메인 영역</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li>• <code>/</code> - 메인 대시보드 (AI 에이전트 그리드)</li>
                      <li>• <code>/agent/[id]</code> - AI 에이전트 실행 페이지</li>
                      <li>• <code>/credits</code> - 크레딧 충전 페이지</li>
                      <li>• <code>/profile</code> - 사용자 프로필 관리</li>
                      <li>• <code>/faq</code> - 자주 묻는 질문</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-800">인증 영역</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li>• <code>/login</code> - 로그인</li>
                      <li>• <code>/register</code> - 회원가입</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-gray-800">고객 지원</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li>• <code>/contact</code> - 고객 지원 메인</li>
                      <li>• <code>/contact/inquiry</code> - 일반 문의</li>
                      <li>• <code>/contact/agent-request</code> - 에이전트 추가 신청</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 관리자 시스템 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  관리자 시스템
                </h3>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-medium text-gray-800 mb-2">플랫폼 관리 (<code>/admin/*</code>)</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• <code>/admin</code> - 관리자 대시보드</li>
                      <li>• <code>/admin/users</code> - 사용자 관리</li>
                      <li>• <code>/admin/payments</code> - 결제 관리</li>
                      <li>• <code>/admin/agents</code> - AI 에이전트 관리</li>
                    </ul>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• <code>/admin/categories</code> - 카테고리 관리</li>
                      <li>• <code>/admin/credit-packages</code> - 크레딧 패키지 관리</li>
                      <li>• <code>/admin/faq</code> - FAQ 관리</li>
                      <li>• <code>/admin/inquiries</code> - 문의 관리</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 회사 관리 시스템 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  회사 관리 시스템
                </h3>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-800 mb-2">회사 관리 (<code>/company/*</code>)</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• <code>/company</code> - 회사 대시보드</li>
                      <li>• <code>/company/employees</code> - 직원 관리</li>
                      <li>• <code>/company/analytics</code> - 분석 및 리포트</li>
                    </ul>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• <code>/company/credits</code> - 회사 크레딧 관리</li>
                      <li>• <code>/company/settings</code> - 회사 설정</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 페이지 계층 구조 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">📁 페이지 계층 구조</h3>
                <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                  <div className="space-y-1">
                    <div>📁 <span className="text-blue-600">app/</span></div>
                    <div className="ml-4">📄 page.tsx <span className="text-gray-500">(메인 대시보드)</span></div>
                    <div className="ml-4">📄 layout.tsx <span className="text-gray-500">(루트 레이아웃)</span></div>
                    <div className="ml-4">📁 <span className="text-blue-600">agent/</span></div>
                    <div className="ml-8">📁 <span className="text-blue-600">[id]/</span></div>
                    <div className="ml-12">📄 page.tsx <span className="text-gray-500">(에이전트 실행)</span></div>
                    <div className="ml-4">📁 <span className="text-blue-600">admin/</span></div>
                    <div className="ml-8">📄 page.tsx <span className="text-gray-500">(관리자 대시보드)</span></div>
                    <div className="ml-8">📁 <span className="text-blue-600">users/</span>, <span className="text-blue-600">payments/</span>, <span className="text-blue-600">agents/</span> ...</div>
                    <div className="ml-4">📁 <span className="text-blue-600">company/</span></div>
                    <div className="ml-8">📄 page.tsx <span className="text-gray-500">(회사 대시보드)</span></div>
                    <div className="ml-8">📁 <span className="text-blue-600">employees/</span>, <span className="text-blue-600">analytics/</span> ...</div>
                    <div className="ml-4">📁 <span className="text-blue-600">contact/</span></div>
                    <div className="ml-8">📁 <span className="text-blue-600">inquiry/</span>, <span className="text-blue-600">agent-request/</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'access':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">접근 권한 및 사용자 그룹</h2>
              </div>
              <p className="text-gray-700">사용자 유형별 권한 체계 및 접근 가능 기능</p>
            </div>

            <div className="grid gap-6">
              {/* 사용자 그룹 정의 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">👥 사용자 그룹 정의</h3>
                <div className="grid gap-6">
                  {[
                    {
                      type: 'admin',
                      name: '플랫폼 관리자',
                      description: '플랫폼 전체를 관리하는 최고 권한 사용자',
                      color: 'red',
                      icon: Shield,
                      features: [
                        '모든 페이지 접근 가능',
                        '사용자 계정 관리',
                        'AI 에이전트 관리',
                        '결제 및 크레딧 관리',
                        '시스템 설정 관리',
                        '통계 및 분석'
                      ]
                    },
                    {
                      type: 'company_admin',
                      name: '회사 관리자',
                      description: '회사 내 직원 및 리소스를 관리하는 사용자',
                      color: 'blue',
                      icon: Building2,
                      features: [
                        '회사 대시보드 접근',
                        '직원 계정 생성/관리',
                        '부서별 권한 설정',
                        '회사 크레딧 관리',
                        '사용량 분석 및 리포트',
                        '회사 설정 관리'
                      ]
                    },
                    {
                      type: 'company_employee',
                      name: '회사 일반 사용자',
                      description: '회사 정책 내에서 AI 에이전트를 사용하는 직원',
                      color: 'green',
                      icon: UserCheck,
                      features: [
                        'AI 에이전트 사용',
                        '개인 프로필 관리',
                        '사용 내역 조회',
                        '즐겨찾기 관리',
                        '제한된 크레딧 사용',
                        '회사 정책 준수'
                      ]
                    },
                    {
                      type: 'general_user',
                      name: '일반 사용자',
                      description: '개인적으로 AI 에이전트를 사용하는 사용자',
                      color: 'yellow',
                      icon: Users,
                      features: [
                        'AI 에이전트 사용',
                        '개인 크레딧 충전',
                        '프로필 관리',
                        '사용 내역 조회',
                        '즐겨찾기 관리',
                        '고객 지원 이용'
                      ]
                    }
                  ].map((group) => (
                    <div key={group.type} className={`border-l-4 border-${group.color}-500 bg-${group.color}-50 p-4 rounded-r-lg`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 bg-${group.color}-100 rounded-lg flex items-center justify-center`}>
                          <group.icon className={`w-4 h-4 text-${group.color}-600`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{group.name}</h4>
                          <p className="text-sm text-gray-600">{group.description}</p>
                        </div>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {group.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* 페이지별 접근 권한 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">🔐 페이지별 접근 권한</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-800">페이지</th>
                        <th className="text-center py-3 px-4 font-medium text-red-600">관리자</th>
                        <th className="text-center py-3 px-4 font-medium text-blue-600">회사관리자</th>
                        <th className="text-center py-3 px-4 font-medium text-green-600">회사직원</th>
                        <th className="text-center py-3 px-4 font-medium text-yellow-600">일반사용자</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { page: '메인 대시보드 (/)', admin: '✅', company_admin: '✅', company_employee: '✅', general_user: '✅' },
                        { page: 'AI 에이전트 실행', admin: '✅', company_admin: '✅', company_employee: '✅', general_user: '✅' },
                        { page: '크레딧 충전', admin: '✅', company_admin: '✅', company_employee: '❌', general_user: '✅' },
                        { page: '프로필 관리', admin: '✅', company_admin: '✅', company_employee: '✅', general_user: '✅' },
                        { page: '관리자 시스템', admin: '✅', company_admin: '❌', company_employee: '❌', general_user: '❌' },
                        { page: '회사 관리 시스템', admin: '✅', company_admin: '✅', company_employee: '❌', general_user: '❌' },
                        { page: '고객 지원', admin: '✅', company_admin: '✅', company_employee: '✅', general_user: '✅' },
                        { page: 'FAQ', admin: '✅', company_admin: '✅', company_employee: '✅', general_user: '✅' }
                      ].map((row, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-800">{row.page}</td>
                          <td className="text-center py-3 px-4">{row.admin}</td>
                          <td className="text-center py-3 px-4">{row.company_admin}</td>
                          <td className="text-center py-3 px-4">{row.company_employee}</td>
                          <td className="text-center py-3 px-4">{row.general_user}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 권한 상속 구조 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">🔗 권한 상속 구조</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">권한 계층</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded">관리자</span>
                      <ChevronRight className="w-4 h-4" />
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">회사 관리자</span>
                      <ChevronRight className="w-4 h-4" />
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">회사 직원</span>
                      <ChevronRight className="w-4 h-4" />
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">일반 사용자</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>• 상위 권한 사용자는 하위 권한 사용자의 모든 기능을 사용할 수 있습니다.</p>
                    <p>• 회사 관리자는 자신의 회사 직원에 대해서만 관리 권한을 가집니다.</p>
                    <p>• 일반 사용자는 개인 계정으로만 이용 가능합니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'flow':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">시스템 플로우</h2>
              </div>
              <p className="text-gray-700">AI 에이전트 허브 플랫폼의 전체 시스템 아키텍처 및 데이터 흐름</p>
            </div>

            <div className="grid gap-6">
              {/* 전체 시스템 아키텍처 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-600" />
                  전체 시스템 아키텍처
                </h3>
                
                <div className="space-y-6">
                  {/* Frontend Layer */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Monitor className="w-6 h-6 text-blue-600" />
                      <h4 className="font-medium text-blue-800">Frontend Layer</h4>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Smartphone className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">Web Client</span>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Next.js 15 (React 19)</li>
                          <li>• TypeScript</li>
                          <li>• Tailwind CSS</li>
                          <li>• 반응형 디자인</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">사용자 인터페이스</span>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• 대시보드</li>
                          <li>• AI 에이전트 UI</li>
                          <li>• 관리자 패널</li>
                          <li>• 회사 관리 시스템</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">인증 & 상태관리</span>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• JWT 토큰</li>
                          <li>• React Context</li>
                          <li>• 세션 관리</li>
                          <li>• 권한 제어</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* API Layer */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Server className="w-6 h-6 text-green-600" />
                      <h4 className="font-medium text-green-800">API Layer</h4>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                          <GitBranch className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">API Routes</span>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• /api/auth/*</li>
                          <li>• /api/agents/*</li>
                          <li>• /api/credits/*</li>
                          <li>• /api/admin/*</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">인증 서비스</span>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• JWT 검증</li>
                          <li>• 권한 확인</li>
                          <li>• 세션 관리</li>
                          <li>• OAuth 연동</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">AI 서비스</span>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• OpenAI API</li>
                          <li>• Claude API</li>
                          <li>• 결과 처리</li>
                          <li>• 파일 변환</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">결제 서비스</span>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Stripe API</li>
                          <li>• 토스페이먼츠</li>
                          <li>• 웹훅 처리</li>
                          <li>• 크레딧 관리</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Data Layer */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Database className="w-6 h-6 text-purple-600" />
                      <h4 className="font-medium text-purple-800">Data Layer</h4>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Database className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">Primary DB</span>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• PostgreSQL</li>
                          <li>• 사용자 데이터</li>
                          <li>• 크레딧 내역</li>
                          <li>• 설정 정보</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Cloud className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">File Storage</span>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• AWS S3</li>
                          <li>• 사용자 파일</li>
                          <li>• AI 결과물</li>
                          <li>• 이미지 자산</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Server className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">Cache Layer</span>
                        </div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Redis</li>
                          <li>• 세션 캐시</li>
                          <li>• API 응답</li>
                          <li>• 사용자 상태</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 사용자 플로우 다이어그램 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-green-600" />
                  사용자 플로우 다이어그램
                </h3>

                <div className="space-y-8">
                  {/* 인증 플로우 */}
                  <div>
                    <h4 className="font-medium text-blue-600 mb-4">🔐 인증 플로우</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                            <UserCheck className="w-6 h-6 text-blue-600" />
                          </div>
                          <span className="text-center font-medium">로그인 요청</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                            <Shield className="w-6 h-6 text-green-600" />
                          </div>
                          <span className="text-center font-medium">인증 검증</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                            <Database className="w-6 h-6 text-purple-600" />
                          </div>
                          <span className="text-center font-medium">사용자 정보<br/>조회</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                            <Lock className="w-6 h-6 text-orange-600" />
                          </div>
                          <span className="text-center font-medium">JWT 토큰<br/>발급</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                            <Monitor className="w-6 h-6 text-green-600" />
                          </div>
                          <span className="text-center font-medium">대시보드<br/>리다이렉트</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI 에이전트 실행 플로우 */}
                  <div>
                    <h4 className="font-medium text-green-600 mb-4">🤖 AI 에이전트 실행 플로우</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
                              <Bot className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-xs text-center font-medium">에이전트<br/>선택</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-1">
                              <CreditCard className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="text-xs text-center font-medium">크레딧<br/>확인</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-1">
                              <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-xs text-center font-medium">입력 데이터<br/>처리</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-1">
                              <Cloud className="w-5 h-5 text-orange-600" />
                            </div>
                            <span className="text-xs text-center font-medium">AI API<br/>호출</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-1">
                              <Server className="w-5 h-5 text-red-600" />
                            </div>
                            <span className="text-xs text-center font-medium">결과<br/>처리</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-1">
                              <Database className="w-5 h-5 text-teal-600" />
                            </div>
                            <span className="text-xs text-center font-medium">크레딧<br/>차감</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-1">
                              <Monitor className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="text-xs text-center font-medium">결과<br/>표시</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 결제 플로우 */}
                  <div>
                    <h4 className="font-medium text-purple-600 mb-4">💳 결제 플로우</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                          </div>
                          <span className="text-center font-medium">패키지 선택</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                            <Lock className="w-6 h-6 text-green-600" />
                          </div>
                          <span className="text-center font-medium">결제 수단<br/>선택</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                            <Server className="w-6 h-6 text-purple-600" />
                          </div>
                          <span className="text-center font-medium">결제 처리<br/>(외부 API)</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                            <Database className="w-6 h-6 text-orange-600" />
                          </div>
                          <span className="text-center font-medium">크레딧<br/>충전</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                            <Monitor className="w-6 h-6 text-green-600" />
                          </div>
                          <span className="text-center font-medium">완료 알림</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 데이터 플로우 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  데이터 플로우
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">📊 데이터 입력 흐름</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">1</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">사용자 입력</div>
                          <div className="text-xs text-gray-600">텍스트, 파일, 선택값</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold text-sm">2</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">데이터 검증</div>
                          <div className="text-xs text-gray-600">형식 확인, 크기 제한</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-bold text-sm">3</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">전처리</div>
                          <div className="text-xs text-gray-600">포맷 변환, 정규화</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-sm">4</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">AI 처리</div>
                          <div className="text-xs text-gray-600">외부 API 호출</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">📤 데이터 출력 흐름</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-bold text-sm">1</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">결과 수신</div>
                          <div className="text-xs text-gray-600">AI API 응답</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-teal-600 font-bold text-sm">2</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">후처리</div>
                          <div className="text-xs text-gray-600">포맷 변환, 검증</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-bold text-sm">3</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">DB 저장</div>
                          <div className="text-xs text-gray-600">사용 내역, 크레딧 차감</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-yellow-600 font-bold text-sm">4</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">사용자 표시</div>
                          <div className="text-xs text-gray-600">UI 렌더링, 다운로드</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 보안 및 에러 처리 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  보안 및 에러 처리 플로우
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-red-600 mb-3">🔒 보안 체크포인트</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                        <Lock className="w-4 h-4 text-red-500" />
                        <span>JWT 토큰 검증 (모든 API)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <Shield className="w-4 h-4 text-orange-500" />
                        <span>권한 레벨 확인</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                        <UserCheck className="w-4 h-4 text-yellow-500" />
                        <span>크레딧 잔액 검증</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <Database className="w-4 h-4 text-green-500" />
                        <span>입력 데이터 검증</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <Server className="w-4 h-4 text-blue-500" />
                        <span>Rate Limiting</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-blue-600 mb-3">⚠️ 에러 처리</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                        <span className="w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">!</span>
                        <span>크레딧 부족 → 충전 페이지 리다이렉트</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <span className="w-4 h-4 bg-orange-500 rounded-full text-xs text-white flex items-center justify-center">!</span>
                        <span>AI API 오류 → 재시도 또는 대체 처리</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                        <span className="w-4 h-4 bg-yellow-500 rounded-full text-xs text-white flex items-center justify-center">!</span>
                        <span>파일 업로드 실패 → 재업로드 안내</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <span className="w-4 h-4 bg-green-500 rounded-full text-xs text-white flex items-center justify-center">!</span>
                        <span>네트워크 오류 → 연결 상태 확인</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <span className="w-4 h-4 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">!</span>
                        <span>권한 없음 → 로그인 페이지 이동</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'navigation':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">화면 간 이동 경로 및 네비게이션</h2>
              </div>
              <p className="text-gray-700">사용자 유형별 화면 이동 패턴 및 네비게이션 구조</p>
            </div>

            <div className="grid gap-6">
              {/* 메인 네비게이션 구조 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  메인 네비게이션 구조
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-blue-600 mb-3">공통 헤더 네비게이션</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 로고 (메인 페이지로 이동)</li>
                      <li>• 크레딧 잔액 표시</li>
                      <li>• 사용자 프로필 드롭다운</li>
                      <li>• 로그아웃 버튼</li>
                      <li>• 알림 센터 (계획)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600 mb-3">사이드바 네비게이션</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 카테고리별 필터</li>
                      <li>• 즐겨찾기 폴더</li>
                      <li>• 접기/펼치기 토글</li>
                      <li>• 검색 필터</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 사용자별 네비게이션 패턴 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">🧭 사용자별 네비게이션 패턴</h3>
                
                {/* 일반 사용자 */}
                <div className="mb-6 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <h4 className="font-medium text-yellow-800 mb-3">일반 사용자 경로</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">시작</span>
                      <span>로그인</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>메인 대시보드</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>AI 에이전트 선택</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>결과 확인</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">충전</span>
                      <span>크레딧 충전</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>결제 수단 선택</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>결제 완료</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">관리</span>
                      <span>프로필</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>사용 내역</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>즐겨찾기 관리</span>
                    </div>
                  </div>
                </div>

                {/* 회사 직원 */}
                <div className="mb-6 p-4 border border-green-200 rounded-lg bg-green-50">
                  <h4 className="font-medium text-green-800 mb-3">회사 직원 경로</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">시작</span>
                      <span>로그인</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>메인 대시보드</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>허용된 에이전트만 사용</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">제한</span>
                      <span>크레딧 충전 불가</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>회사 정책 준수</span>
                    </div>
                  </div>
                </div>

                {/* 회사 관리자 */}
                <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="font-medium text-blue-800 mb-3">회사 관리자 경로</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">관리</span>
                      <span>회사 대시보드</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>직원 관리</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>사용량 분석</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">설정</span>
                      <span>회사 설정</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>부서별 권한</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>크레딧 관리</span>
                    </div>
                  </div>
                </div>

                {/* 플랫폼 관리자 */}
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-800 mb-3">플랫폼 관리자 경로</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">전체</span>
                      <span>관리자 대시보드</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>시스템 관리</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>통계 분석</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">운영</span>
                      <span>AI 에이전트 관리</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>사용자 관리</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                      <span>결제 관리</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 네비게이션 컴포넌트 구조 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">🏗️ 네비게이션 컴포넌트 구조</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Header.tsx</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 로고 및 브랜딩</li>
                        <li>• 사용자 정보</li>
                        <li>• 크레딧 표시</li>
                        <li>• 프로필 드롭다운</li>
                      </ul>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">AdminNavigation.tsx</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 관리자 메뉴</li>
                        <li>• 시스템 상태</li>
                        <li>• 빠른 액션</li>
                        <li>• 알림 배지</li>
                      </ul>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">CompanyNavigation.tsx</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 회사 메뉴</li>
                        <li>• 직원 현황</li>
                        <li>• 사용량 요약</li>
                        <li>• 빠른 설정</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">FavoritesSection.tsx (사이드바)</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 즐겨찾기 폴더 구조</li>
                      <li>• 카테고리 필터</li>
                      <li>• 검색 기능</li>
                      <li>• 접기/펼치기 상태 관리</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'scenarios':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">사용자 이용 시나리오</h2>
              </div>
              <p className="text-gray-700">실제 사용 상황별 상세 시나리오 및 기대 효과</p>
            </div>

            <div className="grid gap-6">
              {/* 시나리오 1: 일반 사용자 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  일반 사용자: 프리랜서 마케터
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">배경 상황</h4>
                    <p className="text-sm text-gray-600">
                      김프리는 개인 마케팅 컨설턴트로 다양한 클라이언트의 마케팅 업무를 지원합니다. 
                      효율적인 업무 처리를 위해 AI 도구가 필요하지만, 구독형 서비스는 부담스럽습니다.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">📅 이용 과정</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                          <span>회원가입 후 체험 패키지(25크레딧) 구매</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                          <span>리뷰 분석 AI로 클라이언트 제품 리뷰 분석 (15크레딧)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                          <span>키워드 분석 AI로 트렌드 조사 (12크레딧)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                          <span>만족 후 추천 패키지(350크레딧) 구매</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                          <span>자주 사용하는 에이전트를 즐겨찾기에 추가</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">💡 기대 효과</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• 리뷰 분석 시간 80% 단축</li>
                        <li>• 키워드 리서치 효율성 증대</li>
                        <li>• 클라이언트 만족도 향상</li>
                        <li>• 프로젝트 단가 상승 가능</li>
                        <li>• 필요한 만큼만 결제하여 비용 절약</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 시나리오 2: 회사 관리자 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  회사 관리자: 중소기업 마케팅팀
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">배경 상황</h4>
                    <p className="text-sm text-gray-600">
                      ㈜혁신마케팅의 팀장 박매니저는 10명의 마케터를 관리합니다. 
                      팀원들의 업무 효율성을 높이고 AI 도구 사용을 체계적으로 관리하고 싶습니다.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">🏢 이용 과정</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                          <span>회사 관리자 계정으로 회원가입</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                          <span>엔터프라이즈 패키지(1200크레딧) 구매</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                          <span>직원 계정 생성 및 부서별 권한 설정</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                          <span>마케팅팀은 마케팅 에이전트만 사용 허용</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                          <span>월별 사용량 리포트 확인 및 예산 관리</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">📊 관리 기능</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• 팀별 크레딧 사용량 모니터링</li>
                        <li>• 직원별 AI 에이전트 사용 통계</li>
                        <li>• 부서별 접근 권한 관리</li>
                        <li>• 월별/분기별 사용 리포트</li>
                        <li>• ROI 분석 및 효과 측정</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 시나리오 3: 회사 직원 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  회사 직원: 신입 마케터
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">배경 상황</h4>
                    <p className="text-sm text-gray-600">
                      신입사원 이주니어는 마케팅 업무가 서툴러 AI 도구의 도움이 필요합니다. 
                      회사에서 제공하는 AI 에이전트를 활용하여 업무 능력을 향상시키고 싶습니다.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">👨‍💼 이용 과정</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                          <span>팀장이 생성한 직원 계정으로 로그인</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                          <span>마케팅 카테고리 에이전트만 사용 가능</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                          <span>리뷰 분석 AI로 신제품 리뷰 분석</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                          <span>광고 문구 AI로 캠페인 아이디어 발굴</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                          <span>사용 내역이 팀장에게 자동 리포트</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">🎯 학습 효과</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• 마케팅 업무 프로세스 학습</li>
                        <li>• AI 도구 활용법 습득</li>
                        <li>• 데이터 분석 능력 향상</li>
                        <li>• 업무 자신감 증대</li>
                        <li>• 팀 생산성 기여</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 시나리오 4: 플랫폼 관리자 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  플랫폼 관리자: 운영팀
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">배경 상황</h4>
                    <p className="text-sm text-gray-600">
                      플랫폼 운영자 최어드민은 전체 플랫폼의 원활한 운영을 위해 
                      사용자 관리, 콘텐츠 관리, 시스템 모니터링을 담당합니다.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">⚙️ 일일 업무</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                          <span>대시보드에서 플랫폼 전체 현황 확인</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                          <span>신규 사용자 가입 승인 및 관리</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                          <span>AI 에이전트 성능 모니터링</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                          <span>고객 문의 및 신청 처리</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                          <span>새로운 AI 에이전트 추가 및 테스트</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">📈 관리 지표</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• 일일/월별 활성 사용자 수</li>
                        <li>• AI 에이전트별 사용률</li>
                        <li>• 매출 및 크레딧 소모량</li>
                        <li>• 고객 만족도 및 피드백</li>
                        <li>• 시스템 성능 지표</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 핵심 가치 제안 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">💎 핵심 가치 제안</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-blue-600 mb-3">사용자 관점</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>유연한 결제:</strong> 필요한 만큼만 크레딧 구매</li>
                      <li>• <strong>전문성:</strong> 업무별 특화된 AI 도구</li>
                      <li>• <strong>편의성:</strong> 통합된 플랫폼에서 원스톱 서비스</li>
                      <li>• <strong>투명성:</strong> 명확한 크레딧 소모량 표시</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600 mb-3">기업 관점</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• <strong>관리 효율성:</strong> 중앙화된 직원 AI 도구 관리</li>
                      <li>• <strong>비용 통제:</strong> 부서별 사용량 모니터링</li>
                      <li>• <strong>생산성 향상:</strong> 업무 자동화로 효율성 증대</li>
                      <li>• <strong>ROI 측정:</strong> 명확한 사용량 및 성과 분석</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">개발 요청서</h1>
                <p className="text-sm text-gray-500">AI 에이전트 허브 플랫폼 개발 가이드</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
      
      {/* 화면 정의 플로팅 버튼 */}
      {(() => {
        const screenDef = getScreenDefinition('/request');
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