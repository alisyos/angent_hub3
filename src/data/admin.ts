import { 
  AdminUser, 
  InquiryAdmin, 
  PaymentAdmin, 
  FAQAdmin, 
  UserActivityLog,
  CompanyDetails 
} from '@/types/admin';

// === 사용자 관리 Mock 데이터 ===
export const mockUsers: AdminUser[] = [
  {
    id: '1',
    email: 'kim.cs@example.com',
    name: '김철수',
    type: 'individual',
    credits: 1250,
    profileImage: '',
    status: 'active',
    registeredAt: '2024-01-15T09:00:00Z',
    lastLoginAt: '2024-01-20T14:30:00Z',
    totalCreditsUsed: 2750,
    totalSpent: 275000,
    activityLogs: [
      {
        id: 'log1',
        userId: '1',
        action: 'login',
        details: '로그인',
        timestamp: '2024-01-20T14:30:00Z',
        ipAddress: '192.168.1.100'
      },
      {
        id: 'log2',
        userId: '1',
        action: 'agent_use',
        details: '회의록 자동화 AI 사용 (50 크레딧)',
        timestamp: '2024-01-20T15:00:00Z',
        ipAddress: '192.168.1.100'
      }
    ]
  },
  {
    id: '2',
    email: 'lee.yh@techstartup.com',
    name: '이영희',
    type: 'company',
    credits: 5000,
    profileImage: '',
    status: 'active',
    registeredAt: '2024-01-10T10:00:00Z',
    lastLoginAt: '2024-01-19T16:45:00Z',
    totalCreditsUsed: 8500,
    totalSpent: 850000,
    companyInfo: {
      name: '테크스타트업',
      businessNumber: '123-45-67890',
      address: '서울시 강남구 테헤란로 123',
      phone: '02-1234-5678',
      employeeCount: 15,
      subscriptionPlan: 'Enterprise',
      totalEmployees: []
    },
    activityLogs: []
  },
  {
    id: '3',
    email: 'park.ms@admin.com',
    name: '박민수',
    type: 'admin',
    credits: 0,
    profileImage: '',
    status: 'active',
    registeredAt: '2023-12-01T09:00:00Z',
    lastLoginAt: '2024-01-20T09:15:00Z',
    totalCreditsUsed: 0,
    totalSpent: 0,
    activityLogs: []
  },
  {
    id: '4',
    email: 'jung.sj@marketing.co.kr',
    name: '정수진',
    type: 'company',
    credits: 200,
    profileImage: '',
    status: 'inactive',
    registeredAt: '2024-01-08T11:30:00Z',
    lastLoginAt: '2024-01-12T13:20:00Z',
    totalCreditsUsed: 1800,
    totalSpent: 180000,
    companyInfo: {
      name: '디지털마케팅',
      businessNumber: '987-65-43210',
      address: '서울시 서초구 서초대로 456',
      phone: '02-9876-5432',
      employeeCount: 8,
      subscriptionPlan: 'Professional',
      totalEmployees: []
    },
    activityLogs: []
  },
  {
    id: '5',
    email: 'choi.dh@freelancer.com',
    name: '최동현',
    type: 'individual',
    credits: 750,
    profileImage: '',
    status: 'suspended',
    registeredAt: '2024-01-05T14:20:00Z',
    lastLoginAt: '2024-01-18T10:30:00Z',
    totalCreditsUsed: 1250,
    totalSpent: 125000,
    activityLogs: []
  }
];

// === 문의 관리 Mock 데이터 ===
export const mockInquiries: InquiryAdmin[] = [
  {
    id: '1',
    type: 'billing',
    title: '크레딧 결제 승인이 되지 않습니다',
    content: '1000 크레딧 구매 시 결제 승인이 계속 실패합니다. 카드는 정상이고 다른 사이트에서는 결제가 잘 됩니다.',
    attachments: [],
    user: {
      id: '1',
      name: '김철수',
      email: 'kim.cs@example.com',
      type: 'individual'
    },
    status: 'pending',
    priority: 'high',
    assignedTo: undefined,
    responses: [],
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    tags: ['결제', '크레딧'],
    category: 'payment',
    isInternal: false
  },
  {
    id: '2',
    type: 'technical',
    title: 'AI 에이전트 실행 시 서버 오류 발생',
    content: '회의록 자동화 AI 실행 시 "서버 내부 오류"가 발생하면서 크레딧만 차감되고 결과를 받을 수 없습니다.',
    attachments: [],
    user: {
      id: '2',
      name: '이영희',
      email: 'lee.yh@techstartup.com',
      type: 'company'
    },
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'admin-001',
    responses: [
      {
        id: 'resp1',
        inquiryId: '2',
        content: '해당 이슈를 확인 중입니다. 잠시만 기다려 주세요.',
        attachments: [],
        author: {
          id: 'admin-001',
          name: '관리자',
          role: 'admin'
        },
        isInternal: false,
        createdAt: '2024-01-20T15:20:00Z'
      }
    ],
    createdAt: '2024-01-20T12:15:00Z',
    updatedAt: '2024-01-20T15:20:00Z',
    tags: ['기술지원', 'AI'],
    category: 'technical',
    isInternal: false
  },
  {
    id: '3',
    type: 'account',
    title: '개인 계정을 회사 계정으로 전환 요청',
    content: '개인으로 가입했는데 회사 계정으로 전환하고 싶습니다. 어떻게 해야 하나요?',
    attachments: [],
    user: {
      id: '5',
      name: '최동현',
      email: 'choi.dh@freelancer.com',
      type: 'individual'
    },
    status: 'resolved',
    priority: 'medium',
    assignedTo: 'admin-002',
    responses: [
      {
        id: 'resp2',
        inquiryId: '3',
        content: '계정 전환 절차를 안내해드렸습니다. 추가 문의사항이 있으시면 언제든 연락 주세요.',
        attachments: [],
        author: {
          id: 'admin-002',
          name: '고객지원팀',
          role: 'admin'
        },
        isInternal: false,
        createdAt: '2024-01-19T11:30:00Z'
      }
    ],
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-19T11:30:00Z',
    resolvedAt: '2024-01-19T11:30:00Z',
    tags: ['계정', '전환'],
    category: 'account',
    isInternal: false
  }
];

// === 결제 관리 Mock 데이터 ===
export const mockPayments: PaymentAdmin[] = [
  {
    id: 'pay001',
    user: {
      id: '1',
      name: '김철수',
      email: 'kim.cs@example.com',
      type: 'individual'
    },
    type: 'credit_purchase',
    amount: 100000,
    credits: 1000,
    status: 'completed',
    paymentMethod: 'card',
    transactionId: 'TXN-20240120-001',
    receiptUrl: '/receipts/TXN-20240120-001.pdf',
    createdAt: '2024-01-20T10:30:00Z',
    completedAt: '2024-01-20T10:31:00Z',
    gateway: 'KCP',
    gatewayTransactionId: 'KCP-20240120-12345'
  },
  {
    id: 'pay002',
    user: {
      id: '2',
      name: '이영희',
      email: 'lee.yh@techstartup.com',
      type: 'company'
    },
    type: 'credit_purchase',
    amount: 500000,
    credits: 5000,
    status: 'completed',
    paymentMethod: 'bank',
    transactionId: 'TXN-20240119-002',
    receiptUrl: '/receipts/TXN-20240119-002.pdf',
    createdAt: '2024-01-19T14:20:00Z',
    completedAt: '2024-01-19T14:25:00Z',
    gateway: 'Inicis',
    gatewayTransactionId: 'INI-20240119-67890'
  },
  {
    id: 'pay003',
    user: {
      id: '4',
      name: '정수진',
      email: 'jung.sj@marketing.co.kr',
      type: 'company'
    },
    type: 'refund',
    amount: -50000,
    credits: -500,
    status: 'refunded',
    paymentMethod: 'card',
    transactionId: 'TXN-20240118-003',
    receiptUrl: '/receipts/TXN-20240118-003.pdf',
    createdAt: '2024-01-18T09:15:00Z',
    refundedAt: '2024-01-18T16:20:00Z',
    refundReason: '서비스 불만족으로 인한 환불',
    refundedBy: 'admin-001',
    gateway: 'KCP'
  }
];

// === FAQ 관리 Mock 데이터 ===
export const mockFAQs: FAQAdmin[] = [
  {
    id: 'faq001',
    category: 'general',
    question: 'AI 에이전트 허브란 무엇인가요?',
    answer: 'AI 에이전트 허브는 다양한 업무를 자동화할 수 있는 AI 에이전트들을 한 곳에서 이용할 수 있는 플랫폼입니다.',
    isPublished: true,
    priority: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    viewCount: 1245,
    helpful: 89,
    notHelpful: 12,
    createdBy: 'admin-001',
    updatedBy: 'admin-001',
    tags: ['기본', '소개']
  },
  {
    id: 'faq002',
    category: 'credits',
    question: '크레딧은 어떻게 사용되나요?',
    answer: '각 AI 에이전트마다 사용되는 크레딧이 다릅니다. 사용 전에 필요한 크레딧을 확인할 수 있습니다.',
    isPublished: true,
    priority: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    viewCount: 987,
    helpful: 76,
    notHelpful: 8,
    createdBy: 'admin-002',
    tags: ['크레딧', '사용법']
  },
  {
    id: 'faq003',
    category: 'agents',
    question: '어떤 AI 에이전트들이 있나요?',
    answer: '총 10개의 AI 에이전트를 제공합니다: 회의록 자동화, 이메일 자동 작성, 리뷰 분석 등이 있습니다.',
    isPublished: false,
    priority: 3,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
    viewCount: 654,
    helpful: 45,
    notHelpful: 5,
    createdBy: 'admin-001',
    updatedBy: 'admin-003',
    tags: ['AI', '에이전트', '목록']
  }
];

// === 활동 로그 생성 함수 ===
export const generateUserActivityLogs = (userId: string, count: number = 10): UserActivityLog[] => {
  const actions: UserActivityLog['action'][] = ['login', 'logout', 'agent_use', 'credit_purchase', 'profile_update'];
  const logs: UserActivityLog[] = [];
  
  for (let i = 0; i < count; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    logs.push({
      id: `log-${userId}-${i}`,
      userId,
      action,
      details: getActionDetails(action),
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`
    });
  }
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const getActionDetails = (action: UserActivityLog['action']): string => {
  switch (action) {
    case 'login':
      return '로그인';
    case 'logout':
      return '로그아웃';
    case 'agent_use':
      const agents = ['회의록 자동화 AI', '이메일 작성 AI', 'PPT 생성기', '리뷰 분석 AI'];
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const credits = [10, 15, 25, 30][Math.floor(Math.random() * 4)];
      return `${agent} 사용 (${credits} 크레딧)`;
    case 'credit_purchase':
      const amounts = [100, 300, 500, 1000];
      const amount = amounts[Math.floor(Math.random() * amounts.length)];
      return `${amount} 크레딧 구매`;
    case 'profile_update':
      return '프로필 정보 수정';
    default:
      return '알 수 없는 활동';
  }
};

// === 통계 데이터 ===
export const mockAdminStats = {
  users: {
    total: 2847,
    active: 1923,
    new: 156,
    growth: 12.5
  },
  agents: {
    total: 10,
    active: 10,
    totalUsage: 47582,
    revenue: 8950000
  },
  inquiries: {
    total: 179,
    pending: 23,
    resolved: 156,
    averageResponseTime: 4.2
  },
  payments: {
    totalRevenue: 8950000,
    monthlyRevenue: 2340000,
    totalTransactions: 1245,
    refundRate: 2.1
  }
}; 