// 회사 관리 페이지들에서 사용하는 공통 샘플 데이터

// 직원 인터페이스
export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'inactive';
  joinDate: string;
  phone: string;
  lastActive: string;
  mostUsedAgent: string;
  usageCount?: number;
  creditsUsed: number;
  topAgent?: string;
}

// 부서 인터페이스
export interface Department {
  id: number;
  name: string;
  allocatedCredits: number;
  status: '전체 허용' | '일부 허용' | '사용 금지';
  usageCount: number;
  creditsUsed: number;
  topAgent: string;
  members?: number;
  headCount?: number;
  manager?: string;
}

// 기본 직원 데이터 (총 12명)
export const employeeData: Employee[] = [
  { 
    id: 1, 
    name: '김철수', 
    email: 'kim@company.com', 
    department: '개발팀', 
    status: 'active', 
    joinDate: '2023-03-15', 
    phone: '010-1234-5678',
    lastActive: '2024-01-20',
    mostUsedAgent: '회의록 자동화 AI',
    usageCount: 45,
    creditsUsed: 450,
    topAgent: '회의록 자동화 AI'
  },
  { 
    id: 2, 
    name: '이영희', 
    email: 'lee@company.com', 
    department: '마케팅팀', 
    status: 'active', 
    joinDate: '2023-05-22', 
    phone: '010-2345-6789',
    lastActive: '2024-01-20',
    mostUsedAgent: 'SNS 이벤트 기획 AI',
    usageCount: 38,
    creditsUsed: 684,
    topAgent: 'SNS 이벤트 기획 AI'
  },
  { 
    id: 3, 
    name: '박민수', 
    email: 'park@company.com', 
    department: '기획팀', 
    status: 'active', 
    joinDate: '2023-07-10', 
    phone: '010-3456-7890',
    lastActive: '2024-01-19',
    mostUsedAgent: 'PPT 슬라이드 생성기',
    usageCount: 32,
    creditsUsed: 320,
    topAgent: 'PPT 슬라이드 생성기'
  },
  { 
    id: 4, 
    name: '정수진', 
    email: 'jung@company.com', 
    department: '디자인팀', 
    status: 'active', 
    joinDate: '2023-09-05', 
    phone: '010-4567-8901',
    lastActive: '2024-01-19',
    mostUsedAgent: '카드뉴스 생성 AI',
    usageCount: 29,
    creditsUsed: 580,
    topAgent: '카드뉴스 생성 AI'
  },
  { 
    id: 5, 
    name: '최동현', 
    email: 'choi@company.com', 
    department: '영업팀', 
    status: 'inactive', 
    joinDate: '2023-11-12', 
    phone: '010-5678-9012',
    lastActive: '2024-01-18',
    mostUsedAgent: '이메일 자동 작성 AI',
    usageCount: 25,
    creditsUsed: 200,
    topAgent: '이메일 자동 작성 AI'
  },
  { 
    id: 6, 
    name: '송미라', 
    email: 'song@company.com', 
    department: '개발팀', 
    status: 'active', 
    joinDate: '2023-04-18', 
    phone: '010-6789-0123',
    lastActive: '2024-01-20',
    mostUsedAgent: '회의록 자동화 AI',
    usageCount: 41,
    creditsUsed: 410,
    topAgent: '회의록 자동화 AI'
  },
  { 
    id: 7, 
    name: '한지수', 
    email: 'han@company.com', 
    department: '마케팅팀', 
    status: 'inactive', 
    joinDate: '2023-06-25', 
    phone: '010-7890-1234',
    lastActive: '2024-01-17',
    mostUsedAgent: '리뷰 분석 AI',
    usageCount: 18,
    creditsUsed: 324,
    topAgent: '리뷰 분석 AI'
  },
  { 
    id: 8, 
    name: '배준호', 
    email: 'bae@company.com', 
    department: '기획팀', 
    status: 'active', 
    joinDate: '2023-08-14', 
    phone: '010-8901-2345',
    lastActive: '2024-01-20',
    mostUsedAgent: 'PPT 슬라이드 생성기',
    usageCount: 33,
    creditsUsed: 825,
    topAgent: 'PPT 슬라이드 생성기'
  },
  { 
    id: 9, 
    name: '윤서연', 
    email: 'yoon@company.com', 
    department: '디자인팀', 
    status: 'active', 
    joinDate: '2023-10-03', 
    phone: '010-9012-3456',
    lastActive: '2024-01-19',
    mostUsedAgent: '카드뉴스 생성 AI',
    usageCount: 27,
    creditsUsed: 540,
    topAgent: '카드뉴스 생성 AI'
  },
  { 
    id: 10, 
    name: '장민혁', 
    email: 'jang@company.com', 
    department: '영업팀', 
    status: 'active', 
    joinDate: '2023-12-01', 
    phone: '010-0123-4567',
    lastActive: '2024-01-18',
    mostUsedAgent: '이메일 자동 작성 AI',
    usageCount: 31,
    creditsUsed: 248,
    topAgent: '이메일 자동 작성 AI'
  },
  { 
    id: 11, 
    name: '노현진', 
    email: 'no@company.com', 
    department: '개발팀', 
    status: 'active', 
    joinDate: '2023-02-28', 
    phone: '010-1357-2468',
    lastActive: '2024-01-20',
    mostUsedAgent: '회의록 자동화 AI',
    usageCount: 39,
    creditsUsed: 390,
    topAgent: '회의록 자동화 AI'
  },
  { 
    id: 12, 
    name: '임가영', 
    email: 'lim@company.com', 
    department: '마케팅팀', 
    status: 'active', 
    joinDate: '2023-01-15', 
    phone: '010-2468-1357',
    lastActive: '2024-01-19',
    mostUsedAgent: '키워드 분석 AI',
    usageCount: 35,
    creditsUsed: 630,
    topAgent: '키워드 분석 AI'
  }
];

// 확장된 직원 데이터 (직원 관리 페이지용 - 추가 직원들)
export const extendedEmployeeData: Employee[] = [
  ...employeeData,
  // 부서 미정인 직원들
  { 
    id: 13, 
    name: '강미정', 
    email: 'kang@company.com', 
    department: '부서 미정', 
    status: 'inactive', 
    joinDate: '2024-01-15', 
    phone: '010-6789-0123',
    lastActive: '-',
    mostUsedAgent: '-',
    usageCount: 0,
    creditsUsed: 0,
    topAgent: '-'
  },
  { 
    id: 14, 
    name: '윤성호', 
    email: 'yoon2@company.com', 
    department: '부서 미정', 
    status: 'inactive', 
    joinDate: '2024-01-18', 
    phone: '010-7890-1234',
    lastActive: '-',
    mostUsedAgent: '-',
    usageCount: 0,
    creditsUsed: 0,
    topAgent: '-'
  },
  { 
    id: 15, 
    name: '조현우', 
    email: 'cho@company.com', 
    department: '부서 미정', 
    status: 'inactive', 
    joinDate: '2024-01-20', 
    phone: '010-8901-2345',
    lastActive: '-',
    mostUsedAgent: '-',
    usageCount: 0,
    creditsUsed: 0,
    topAgent: '-'
  },
  // 추가 직원들 (랜덤 생성)
  ...Array.from({ length: 22 }, (_, i) => ({
    id: i + 16,
    name: `${['김', '이', '박', '정', '최', '신', '윤', '장', '임', '한'][i % 10]}직원${i + 16}`,
    email: `employee${i + 16}@company.com`,
    department: i % 7 === 0 ? '부서 미정' : ['개발팀', '마케팅팀', '기획팀', '디자인팀', '영업팀'][i % 5],
    status: (i % 7 === 0 ? 'inactive' : (Math.random() > 0.2 ? 'active' : 'inactive')) as 'active' | 'inactive',
    joinDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    lastActive: i % 7 === 0 ? '-' : '2024-01-20',
    mostUsedAgent: i % 7 === 0 ? '-' : '회의록 자동화 AI',
    usageCount: i % 7 === 0 ? 0 : Math.floor(Math.random() * 50) + 10,
    creditsUsed: i % 7 === 0 ? 0 : Math.floor(Math.random() * 500) + 100,
    topAgent: i % 7 === 0 ? '-' : '회의록 자동화 AI'
  }))
];

// 부서 데이터
export const departmentData: Department[] = [
  { 
    id: 1, 
    name: '개발팀', 
    allocatedCredits: 5000, 
    status: '전체 허용', 
    usageCount: 125, 
    creditsUsed: 1250, 
    topAgent: '회의록 자동화 AI',
    members: 3, // 김철수, 송미라, 노현진
    headCount: 15,
    manager: '김개발'
  },
  { 
    id: 2, 
    name: '마케팅팀', 
    allocatedCredits: 4000, 
    status: '전체 허용', 
    usageCount: 91, 
    creditsUsed: 1638, 
    topAgent: 'SNS 이벤트 기획 AI',
    members: 3, // 이영희, 한지수, 임가영
    headCount: 10,
    manager: '이마케팅'
  },
  { 
    id: 3, 
    name: '기획팀', 
    allocatedCredits: 3000, 
    status: '일부 허용', 
    usageCount: 65, 
    creditsUsed: 1145, 
    topAgent: 'PPT 슬라이드 생성기',
    members: 2, // 박민수, 배준호
    headCount: 8,
    manager: '박기획'
  },
  { 
    id: 4, 
    name: '디자인팀', 
    allocatedCredits: 3500, 
    status: '전체 허용', 
    usageCount: 56, 
    creditsUsed: 1120, 
    topAgent: '카드뉴스 생성 AI',
    members: 2, // 정수진, 윤서연
    headCount: 6,
    manager: '정디자인'
  },
  { 
    id: 5, 
    name: '영업팀', 
    allocatedCredits: 2500, 
    status: '전체 허용', 
    usageCount: 56, 
    creditsUsed: 448, 
    topAgent: '이메일 자동 작성 AI',
    members: 2, // 최동현, 장민혁
    headCount: 12,
    manager: '최영업'
  },
  { 
    id: 6, 
    name: '인사팀', 
    allocatedCredits: 2000, 
    status: '일부 허용', 
    usageCount: 23, 
    creditsUsed: 230, 
    topAgent: '회의록 자동화 AI',
    members: 0,
    headCount: 5,
    manager: '김인사'
  },
  { 
    id: 7, 
    name: '재무팀', 
    allocatedCredits: 1500, 
    status: '사용 금지', 
    usageCount: 18, 
    creditsUsed: 180, 
    topAgent: '이메일 자동 작성 AI',
    members: 0,
    headCount: 4,
    manager: '이재무'
  },
  { 
    id: 8, 
    name: '법무팀', 
    allocatedCredits: 1000, 
    status: '전체 허용', 
    usageCount: 12, 
    creditsUsed: 120, 
    topAgent: '회의록 자동화 AI',
    members: 0,
    headCount: 3,
    manager: '박법무'
  },
  { 
    id: 9, 
    name: '운영팀', 
    allocatedCredits: 2000, 
    status: '전체 허용', 
    usageCount: 34, 
    creditsUsed: 340, 
    topAgent: '이메일 자동 작성 AI',
    members: 0,
    headCount: 8,
    manager: '정운영'
  },
  { 
    id: 10, 
    name: '구매팀', 
    allocatedCredits: 1500, 
    status: '사용 금지', 
    usageCount: 25, 
    creditsUsed: 250, 
    topAgent: '회의록 자동화 AI',
    members: 0,
    headCount: 6,
    manager: '최구매'
  },
  { 
    id: 11, 
    name: '품질팀', 
    allocatedCredits: 1800, 
    status: '일부 허용', 
    usageCount: 28, 
    creditsUsed: 280, 
    topAgent: '이메일 자동 작성 AI',
    members: 0,
    headCount: 7,
    manager: '한품질'
  },
  { 
    id: 12, 
    name: '부서 미정', 
    allocatedCredits: 0, 
    status: '사용 금지', 
    usageCount: 0, 
    creditsUsed: 0, 
    topAgent: '-',
    members: 3, // 강미정, 윤성호, 조현우
    headCount: 0,
    manager: '-'
  }
];

// 에이전트 사용량 데이터
export const agentUsageData = [
  { id: 1, name: '회의록 자동화 AI', category: '일반사무', usageCount: 234, creditsUsed: 2340 },
  { id: 2, name: 'PPT 슬라이드 생성기', category: '일반사무', usageCount: 189, creditsUsed: 4725 },
  { id: 3, name: '이메일 자동 작성 AI', category: '일반사무', usageCount: 162, creditsUsed: 1296 },
  { id: 4, name: 'SNS 이벤트 기획 AI', category: '마케팅/광고', usageCount: 145, creditsUsed: 2610 },
  { id: 5, name: '카드뉴스 생성 AI', category: '콘텐츠 제작', usageCount: 124, creditsUsed: 2480 },
  { id: 6, name: '리뷰 분석 AI', category: '마케팅/광고', usageCount: 98, creditsUsed: 1470 },
  { id: 7, name: '키워드 분석 AI', category: '마케팅/광고', usageCount: 87, creditsUsed: 1044 },
  { id: 8, name: '광고 문구 분석 및 제안 AI', category: '마케팅/광고', usageCount: 76, creditsUsed: 1520 },
  { id: 9, name: '음성파일 기반 문서 자동화 AI', category: '일반사무', usageCount: 65, creditsUsed: 1950 },
  { id: 10, name: 'AI 블로그 생성기', category: '콘텐츠 제작', usageCount: 54, creditsUsed: 810 },
  { id: 11, name: '고객 지원 AI', category: '일반사무', usageCount: 43, creditsUsed: 430 },
  { id: 12, name: '데이터 분석 AI', category: '마케팅/광고', usageCount: 32, creditsUsed: 640 }
];

// 회사 통계 데이터
export const companyStats = {
  totalEmployees: 12,
  activeEmployees: 9,
  totalCreditsUsed: 5485,
  totalCreditsRemaining: 7515,
  mostUsedAgent: '회의록 자동화 AI',
  efficiency: 87.5,
  costSavings: 2400000,
  efficiencyIncrease: 24
}; 