# AI 에이전트 허브 플랫폼 (angent_hub3) - 개발 가이드

## 프로젝트 개요

이 프로젝트는 다양한 업무 지원 AI 에이전트를 통합한 플랫폼입니다. 사용자는 크레딧을 충전하여 AI 에이전트를 활용할 수 있으며, 관리자와 회사는 플랫폼을 효율적으로 관리할 수 있습니다.

## 기술 스택

- **Frontend**: Next.js 15.3.4 (App Router), React 19.0.0, TypeScript 5
- **Styling**: Tailwind CSS 3.4.0
- **Forms**: React Hook Form 7.59.0 + Zod 3.25.67
- **Charts**: Recharts 3.0.2
- **Icons**: Lucide React 0.525.0
- **Utilities**: clsx, date-fns
- **Development**: Turbopack (빠른 번들링)

## 개발 환경 설정

### 전제 조건
- Node.js 18.17 이상
- npm 또는 yarn

### 설치 및 실행
```bash
npm install
npm run dev  # Turbopack 사용
```

### 빌드 및 배포
```bash
npm run build
npm start
```

### 코드 품질 관리
```bash
npm run lint
```

## 프로젝트 구조

```
src/
├── app/                          # Next.js App Router 페이지
│   ├── page.tsx                 # 메인 에이전트 대시보드
│   ├── login/page.tsx           # 로그인
│   ├── register/page.tsx        # 회원가입
│   ├── profile/page.tsx         # 사용자 프로필
│   ├── credits/page.tsx         # 크레딧 충전
│   ├── faq/page.tsx            # FAQ
│   ├── agent/[id]/page.tsx     # AI 에이전트 실행
│   ├── contact/                # 고객 지원
│   │   ├── inquiry/page.tsx    # 일반 문의
│   │   └── agent-request/page.tsx # 에이전트 추가 신청
│   ├── admin/                  # 관리자 시스템
│   │   ├── page.tsx           # 대시보드
│   │   ├── users/page.tsx     # 사용자 관리
│   │   ├── payments/page.tsx  # 결제 관리
│   │   ├── agents/page.tsx    # AI 에이전트 관리
│   │   ├── categories/page.tsx # 카테고리 관리
│   │   ├── credit-packages/page.tsx # 크레딧 패키지 관리
│   │   ├── faq/page.tsx       # FAQ 관리
│   │   └── inquiries/page.tsx # 문의 관리
│   └── company/               # 회사 관리 시스템
│       ├── page.tsx          # 회사 대시보드
│       ├── employees/page.tsx # 직원 관리
│       ├── analytics/page.tsx # 분석 및 리포트
│       ├── credits/page.tsx   # 회사 크레딧 관리
│       └── settings/page.tsx  # 회사 설정
├── components/                # 재사용 가능한 컴포넌트
│   ├── Header.tsx            # 헤더 및 네비게이션
│   ├── Footer.tsx            # 푸터
│   ├── AgentCard.tsx         # AI 에이전트 카드
│   ├── FavoritesSection.tsx  # 즐겨찾기 사이드바
│   ├── CategoryFilter.tsx    # 카테고리 필터
│   ├── AdminLayout.tsx       # 관리자 레이아웃
│   ├── CompanyLayout.tsx     # 회사 관리 레이아웃
│   ├── ContactLayout.tsx     # 고객 지원 레이아웃
│   ├── Modal.tsx             # 범용 모달
│   ├── ConfirmModal.tsx      # 확인 모달
│   └── admin/                # 관리자 전용 컴포넌트
├── contexts/                 # React Context
│   └── ModalContext.tsx      # 모달 상태 관리
├── data/                     # Mock 데이터
│   ├── agents.ts            # AI 에이전트 데이터
│   ├── admin.ts             # 관리자 시스템 데이터
│   └── company.ts           # 회사 관리 데이터
├── hooks/                    # 커스텀 Hook
│   └── useFavorites.ts      # 즐겨찾기 관리
├── types/                    # TypeScript 타입 정의
│   ├── agent.ts             # AI 에이전트 타입
│   ├── admin.ts             # 관리자 시스템 타입
│   ├── company.ts           # 회사 관리 타입
│   └── favorites.ts         # 즐겨찾기 타입
└── utils/                    # 유틸리티 함수
    ├── auth.ts              # 인증 유틸리티
    └── notifications.ts     # 알림 유틸리티
```

## 주요 기능

### 1. AI 에이전트 시스템 (10개 - 현재 7개 활성화)

**일반사무 (4개 중 3개 활성화)**
- 회의록 자동화 AI (10 크레딧) ✅
- 이메일 작성 AI (8 크레딧) ✅
- 음성파일 기반 문서 자동화 AI (30 크레딧) ✅
- AI PPT 슬라이드 생성기 (25 크레딧) 🚧

**마케팅/광고 (4개 중 3개 활성화)**
- 리뷰 분석 AI (15 크레딧) ✅
- 키워드 분석 AI (12 크레딧) ✅
- 광고 문구 분석 및 제안 AI (20 크레딧) ✅
- SNS 이벤트 기획 AI (18 크레딧) 🚧

**콘텐츠 제작 (2개 중 1개 활성화)**
- AI 카드뉴스 생성기 (20 크레딧) ✅
- AI 블로그 생성기 (15 크레딧) 🚧

### 2. 사용자 시스템

**계정 유형**
- `general_user`: 일반 사용자
- `company_admin`: 회사 관리자
- `company_employee`: 회사 일반 사용자
- `admin`: 플랫폼 관리자

### 3. 크레딧 시스템

**크레딧 패키지 (7개)**
- 스타터: 50 크레딧 (5,000원)
- 기본: 100 크레딧 (10,000원)
- 추천: 300+50 보너스 크레딧 (25,000원) ⭐
- 프리미엄: 500+100 보너스 크레딧 (40,000원)
- 엔터프라이즈: 1000+200 보너스 크레딧 (70,000원)
- 메가: 2000+500 보너스 크레딧 (120,000원)
- 체험: 20+5 보너스 크레딧 (2,000원)

## 테스트 계정

```typescript
// 로그인 시 사용 가능한 테스트 계정
admin@test.com / admin123        // 플랫폼 관리자
company@test.com / company123    // 회사 관리자
employee@test.com / employee123  // 회사 일반 사용자
user@test.com / user123         // 일반 사용자
```

## 개발 가이드

### 새로운 AI 에이전트 추가

1. `src/data/agents.ts`에 에이전트 정의 추가
2. 입력 필드와 출력 형태 정의
3. 크레딧 비용 설정
4. `isActive: true`로 활성화

### 새로운 페이지 추가

1. `src/app/` 하위에 폴더 및 `page.tsx` 생성
2. 적절한 레이아웃 컴포넌트 사용
3. 타입 정의가 필요한 경우 `src/types/`에 추가

### 스타일링 가이드

**색상 시스템**
- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Info: Purple (#8B5CF6)

**카테고리 색상**
- 일반사무: Blue
- 마케팅/광고: Green
- 콘텐츠 제작: Purple

**커스텀 CSS 클래스**
- `.gradient-bg`: 브랜드 그라디언트 배경
- `.card-hover`: 카드 호버 효과
- `.btn-primary`, `.btn-secondary`: 버튼 스타일

### 상태 관리

**React Context 사용**
- `ModalContext`: 모달 상태 관리
- `localStorage`: 즐겨찾기, 인증 상태

**커스텀 Hook**
- `useFavorites`: 즐겨찾기 관리 (폴더 시스템 포함)

## 현재 구현 상태

### ✅ 완료된 기능
- 모든 UI/UX 구현
- Mock 인증 시스템
- AI 에이전트 시스템 (7개 활성화)
- 검색 및 필터링
- 크레딧 시스템 UI
- 관리자 시스템
- 회사 관리 시스템
- 즐겨찾기 시스템
- 반응형 디자인

### 🚧 개발 중
- SNS 이벤트 기획 AI
- AI 블로그 생성기
- AI PPT 슬라이드 생성기

### 📋 계획 중
- 실제 AI 모델 연동
- 데이터베이스 연동
- 실제 결제 시스템
- 실시간 알림
- 소셜 로그인

## 디버깅 및 문제 해결

### 일반적인 문제

1. **페이지가 로드되지 않는 경우**
   - `npm run dev` 재시작
   - 브라우저 캐시 클리어

2. **타입 에러가 발생하는 경우**
   - `src/types/` 폴더의 타입 정의 확인
   - TypeScript 버전 호환성 확인

3. **스타일이 적용되지 않는 경우**
   - Tailwind CSS 클래스명 확인
   - `globals.css`의 커스텀 스타일 확인

### 개발 도구

- **ESLint**: 코드 품질 관리
- **TypeScript**: 타입 안전성
- **Turbopack**: 빠른 개발 서버

## 배포

**권장 플랫폼**: Vercel

```bash
npm run build
# Vercel CLI를 사용하거나 GitHub 연동으로 자동 배포
```

## 라이선스

MIT License