import { User, PaymentAdmin, FAQAdmin, InquiryAdmin, AgentAdmin, UserActivityLog } from '@/types/admin';

// === 사용자 관리 Mock 데이터 ===
export const mockUsers: User[] = [
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
    status: 'pending',
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
    status: 'completed',
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
  },
  {
    id: '4',
    type: 'service',
    title: 'AI 에이전트 사용법 문의',
    content: 'PPT 슬라이드 생성기 사용 방법을 알고 싶습니다. 어떤 형식으로 입력해야 하나요?',
    attachments: [
      {
        id: 'att1',
        filename: 'sample-presentation.pptx',
        originalName: 'sample-presentation.pptx',
        size: 1024000,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        uploadedAt: '2024-01-19T10:00:00Z',
        downloadUrl: '/attachments/att1'
      }
    ],
    user: {
      id: '6',
      name: '김영수',
      email: 'kim.ys@example.com',
      type: 'individual'
    },
    status: 'pending',
    assignedTo: undefined,
    responses: [],
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
    tags: ['사용법', 'PPT'],
    category: 'service',
    isInternal: false
  },
  {
    id: '5',
    type: 'technical',
    title: '파일 업로드 오류 발생',
    content: '음성파일 기반 문서 자동화 AI에서 파일 업로드 시 "파일 형식 오류"가 발생합니다. 지원되는 파일 형식을 확인해 주세요.',
    attachments: [
      {
        id: 'att2',
        filename: 'error-screenshot.png',
        originalName: '오류 스크린샷.png',
        size: 256000,
        mimeType: 'image/png',
        uploadedAt: '2024-01-19T14:30:00Z',
        downloadUrl: '/attachments/att2'
      },
      {
        id: 'att3',
        filename: 'audio-file.mp3',
        originalName: '회의 녹음.mp3',
        size: 8192000,
        mimeType: 'audio/mpeg',
        uploadedAt: '2024-01-19T14:32:00Z',
        downloadUrl: '/attachments/att3'
      }
    ],
    user: {
      id: '7',
      name: '박지현',
      email: 'park.jh@company.com',
      type: 'company'
    },
    status: 'pending',
    assignedTo: 'admin-001',
    responses: [
      {
        id: 'resp3',
        inquiryId: '5',
        content: '제공해주신 파일을 확인했습니다. 현재 MP3 파일 형식은 지원하지만, 파일 크기 제한이 있습니다. 5MB 이하로 압축해서 다시 시도해 주세요.',
        attachments: [],
        author: {
          id: 'admin-001',
          name: '기술지원팀',
          role: 'admin'
        },
        isInternal: false,
        createdAt: '2024-01-19T16:00:00Z'
      }
    ],
    createdAt: '2024-01-19T14:30:00Z',
    updatedAt: '2024-01-19T16:00:00Z',
    tags: ['파일업로드', '기술오류'],
    category: 'technical',
    isInternal: false
  },
  {
    id: '6',
    type: 'billing',
    title: '환불 요청 - 미사용 크레딧',
    content: '실수로 1000 크레딧을 구매했는데 사용하지 않았습니다. 환불 가능한가요?',
    attachments: [
      {
        id: 'att4',
        filename: 'receipt.pdf',
        originalName: '결제영수증.pdf',
        size: 128000,
        mimeType: 'application/pdf',
        uploadedAt: '2024-01-18T20:00:00Z',
        downloadUrl: '/attachments/att4'
      }
    ],
    user: {
      id: '8',
      name: '이수민',
      email: 'lee.sm@gmail.com',
      type: 'individual'
    },
    status: 'completed',
    assignedTo: 'admin-002',
    responses: [
      {
        id: 'resp4',
        inquiryId: '6',
        content: '환불 요청이 승인되었습니다. 영업일 기준 3-5일 내로 환불 처리됩니다.',
        attachments: [],
        author: {
          id: 'admin-002',
          name: '결제지원팀',
          role: 'admin'
        },
        isInternal: false,
        createdAt: '2024-01-19T09:00:00Z'
      }
    ],
    createdAt: '2024-01-18T20:00:00Z',
    updatedAt: '2024-01-19T09:00:00Z',
    resolvedAt: '2024-01-19T09:00:00Z',
    tags: ['환불', '크레딧'],
    category: 'billing',
    isInternal: false
  },
  {
    id: '7',
    type: 'account',
    title: '비밀번호 변경 요청',
    content: '계정 보안을 위해 비밀번호를 변경하려고 하는데 이메일 인증이 오지 않습니다.',
    attachments: [],
    user: {
      id: '9',
      name: '정민호',
      email: 'jung.mh@startup.co.kr',
      type: 'company'
    },
    status: 'pending',
    assignedTo: undefined,
    responses: [],
    createdAt: '2024-01-19T16:20:00Z',
    updatedAt: '2024-01-19T16:20:00Z',
    tags: ['비밀번호', '이메일인증'],
    category: 'account',
    isInternal: false
  },
  {
    id: '8',
    type: 'technical',
    title: '리뷰 분석 AI 결과 오류',
    content: '리뷰 분석 AI 사용 시 결과가 이상하게 나옵니다. 입력한 리뷰와 전혀 다른 분석 결과가 나와서 문의드립니다.',
    attachments: [
      {
        id: 'att5',
        filename: 'review-data.xlsx',
        originalName: '리뷰 데이터.xlsx',
        size: 512000,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        uploadedAt: '2024-01-19T11:45:00Z',
        downloadUrl: '/attachments/att5'
      },
      {
        id: 'att6',
        filename: 'analysis-result.pdf',
        originalName: '분석 결과.pdf',
        size: 300000,
        mimeType: 'application/pdf',
        uploadedAt: '2024-01-19T11:47:00Z',
        downloadUrl: '/attachments/att6'
      }
    ],
    user: {
      id: '10',
      name: '한상우',
      email: 'han.sw@marketing.com',
      type: 'company'
    },
    status: 'pending',
    assignedTo: 'admin-003',
    responses: [
      {
        id: 'resp5',
        inquiryId: '8',
        content: '제공해주신 데이터를 확인 중입니다. 분석 결과 이상에 대해 내부 검토 진행 중이며, 24시간 내로 답변드리겠습니다.',
        attachments: [],
        author: {
          id: 'admin-003',
          name: 'AI 전문팀',
          role: 'admin'
        },
        isInternal: false,
        createdAt: '2024-01-19T12:30:00Z'
      }
    ],
    createdAt: '2024-01-19T11:45:00Z',
    updatedAt: '2024-01-19T12:30:00Z',
    tags: ['리뷰분석', 'AI오류'],
    category: 'technical',
    isInternal: false
  },
  {
    id: '9',
    type: 'service',
    title: '신규 AI 에이전트 기능 제안',
    content: '번역 AI 에이전트 추가를 제안드립니다. 많은 사용자들이 필요로 할 것 같습니다.',
    attachments: [
      {
        id: 'att7',
        filename: 'proposal.docx',
        originalName: '기능 제안서.docx',
        size: 450000,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploadedAt: '2024-01-19T08:15:00Z',
        downloadUrl: '/attachments/att7'
      }
    ],
    user: {
      id: '11',
      name: '윤지영',
      email: 'yoon.jy@translation.co.kr',
      type: 'company'
    },
    status: 'pending',
    assignedTo: undefined,
    responses: [],
    createdAt: '2024-01-19T08:15:00Z',
    updatedAt: '2024-01-19T08:15:00Z',
    tags: ['기능제안', '번역AI'],
    category: 'service',
    isInternal: false
  },
  {
    id: '10',
    type: 'billing',
    title: '법인카드 결제 불가 문제',
    content: '법인카드로 크레딧 결제 시 승인 거부가 계속 됩니다. 개인카드로는 결제가 됩니다.',
    attachments: [
      {
        id: 'att8',
        filename: 'card-info.jpg',
        originalName: '법인카드 정보.jpg',
        size: 180000,
        mimeType: 'image/jpeg',
        uploadedAt: '2024-01-18T15:30:00Z',
        downloadUrl: '/attachments/att8'
      }
    ],
    user: {
      id: '12',
      name: '서동희',
      email: 'seo.dh@enterprise.com',
      type: 'company'
    },
    status: 'completed',
    assignedTo: 'admin-002',
    responses: [
      {
        id: 'resp6',
        inquiryId: '10',
        content: '법인카드의 경우 결제 한도 및 온라인 결제 설정을 확인해 주세요. 필요시 카드사에 문의하여 온라인 결제 승인 설정을 변경해 주시기 바랍니다.',
        attachments: [],
        author: {
          id: 'admin-002',
          name: '결제지원팀',
          role: 'admin'
        },
        isInternal: false,
        createdAt: '2024-01-18T16:45:00Z'
      }
    ],
    createdAt: '2024-01-18T15:30:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    resolvedAt: '2024-01-18T16:45:00Z',
    tags: ['법인카드', '결제승인'],
    category: 'billing',
    isInternal: false
  },
  {
    id: '11',
    type: 'other',
    title: '회사 소개 및 파트너십 문의',
    content: '저희 회사와 파트너십을 체결하고 싶어서 문의드립니다. 담당자와 연결해 주실 수 있나요?',
    attachments: [
      {
        id: 'att9',
        filename: 'company-profile.pdf',
        originalName: '회사 소개서.pdf',
        size: 2048000,
        mimeType: 'application/pdf',
        uploadedAt: '2024-01-19T13:00:00Z',
        downloadUrl: '/attachments/att9'
      },
      {
        id: 'att10',
        filename: 'partnership-proposal.pptx',
        originalName: '파트너십 제안서.pptx',
        size: 1536000,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        uploadedAt: '2024-01-19T13:02:00Z',
        downloadUrl: '/attachments/att10'
      }
    ],
    user: {
      id: '13',
      name: '김대표',
      email: 'ceo@partner.co.kr',
      type: 'company'
    },
    status: 'pending',
    assignedTo: undefined,
    responses: [],
    createdAt: '2024-01-19T13:00:00Z',
    updatedAt: '2024-01-19T13:00:00Z',
    tags: ['파트너십', '비즈니스'],
    category: 'other',
    isInternal: false
  },
  {
    id: '12',
    type: 'technical',
    title: '모바일 앱 출시 예정일 문의',
    content: '모바일 앱은 언제 출시될 예정인가요? 모바일에서 사용하기 불편합니다.',
    attachments: [],
    user: {
      id: '14',
      name: '조현아',
      email: 'cho.ha@mobile.com',
      type: 'individual'
    },
    status: 'pending',
    assignedTo: undefined,
    responses: [],
    createdAt: '2024-01-19T17:30:00Z',
    updatedAt: '2024-01-19T17:30:00Z',
    tags: ['모바일앱', '출시일정'],
    category: 'service',
    isInternal: false
  },
  {
    id: '13',
    type: 'service',
    title: '대량 처리 방법 문의',
    content: '한번에 100개 이상의 파일을 처리할 수 있는 방법이 있나요? 배치 처리 기능이 필요합니다.',
    attachments: [
      {
        id: 'att11',
        filename: 'file-list.txt',
        originalName: '처리할 파일 목록.txt',
        size: 15000,
        mimeType: 'text/plain',
        uploadedAt: '2024-01-19T09:45:00Z',
        downloadUrl: '/attachments/att11'
      }
    ],
    user: {
      id: '15',
      name: '오성진',
      email: 'oh.sj@batch.com',
      type: 'company'
    },
    status: 'pending',
    assignedTo: 'admin-001',
    responses: [
      {
        id: 'resp7',
        inquiryId: '13',
        content: '현재 배치 처리 기능은 엔터프라이즈 플랜에서 제공됩니다. 상세한 내용은 영업팀에서 연락드리겠습니다.',
        attachments: [],
        author: {
          id: 'admin-001',
          name: '기술지원팀',
          role: 'admin'
        },
        isInternal: false,
        createdAt: '2024-01-19T10:30:00Z'
      }
    ],
    createdAt: '2024-01-19T09:45:00Z',
    updatedAt: '2024-01-19T10:30:00Z',
    tags: ['배치처리', '엔터프라이즈'],
    category: 'service',
    isInternal: false
  },
  {
    id: '14',
    type: 'account',
    title: '계정 삭제 요청',
    content: '서비스를 더 이상 사용하지 않아서 계정을 삭제하고 싶습니다. 개인정보도 모두 삭제해 주세요.',
    attachments: [],
    user: {
      id: '16',
      name: '임채원',
      email: 'lim.cw@delete.com',
      type: 'individual'
    },
    status: 'pending',
    assignedTo: undefined,
    responses: [],
    createdAt: '2024-01-19T18:00:00Z',
    updatedAt: '2024-01-19T18:00:00Z',
    tags: ['계정삭제', '개인정보'],
    category: 'account',
    isInternal: false
  },
  {
    id: '15',
    type: 'billing',
    title: '정기 결제 설정 문의',
    content: '매월 자동으로 크레딧을 충전하는 정기 결제 설정이 가능한가요?',
    attachments: [
      {
        id: 'att12',
        filename: 'subscription-plan.pdf',
        originalName: '구독 플랜 비교표.pdf',
        size: 750000,
        mimeType: 'application/pdf',
        uploadedAt: '2024-01-19T12:15:00Z',
        downloadUrl: '/attachments/att12'
      }
    ],
    user: {
      id: '17',
      name: '신우철',
      email: 'shin.wc@subscription.com',
      type: 'company'
    },
    status: 'completed',
    assignedTo: 'admin-002',
    responses: [
      {
        id: 'resp8',
        inquiryId: '15',
        content: '정기 결제 기능은 현재 개발 중이며, 다음 달 출시 예정입니다. 출시 시 이메일로 안내해 드리겠습니다.',
        attachments: [],
        author: {
          id: 'admin-002',
          name: '결제지원팀',
          role: 'admin'
        },
        isInternal: false,
        createdAt: '2024-01-19T14:00:00Z'
      }
    ],
    createdAt: '2024-01-19T12:15:00Z',
    updatedAt: '2024-01-19T14:00:00Z',
    resolvedAt: '2024-01-19T14:00:00Z',
    tags: ['정기결제', '구독'],
    category: 'billing',
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
  // 일반 카테고리 (6개)
  {
    id: 'general-1',
    category: 'general',
    question: 'AI 에이전트 허브란 무엇인가요?',
    answer: 'AI 에이전트 허브는 다양한 업무를 자동화할 수 있는 AI 에이전트들을 한 곳에서 이용할 수 있는 플랫폼입니다. 회의록 작성, 이메일 생성, PPT 제작 등 10가지의 다양한 AI 에이전트를 제공합니다.',
    isPublished: true,
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: 'admin@agenthub.com',
    updatedBy: 'admin@agenthub.com',
    tags: ['기본', '소개', '플랫폼']
  },
  {
    id: 'general-2',
    category: 'general',
    question: '무료로 사용할 수 있나요?',
    answer: '회원가입 시 500 크레딧을 무료로 제공하며, 모든 AI 에이전트를 체험해보실 수 있습니다. 추가 사용을 원하시면 크레딧 패키지를 구매하실 수 있습니다.',
    isPublished: true,
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    createdBy: 'manager@agenthub.com',
    tags: ['무료', '체험', '크레딧']
  },
  {
    id: 'general-3',
    category: 'general',
    question: '회원가입은 어떻게 하나요?',
    answer: '이메일 주소와 비밀번호만으로 간단하게 회원가입이 가능합니다. 소셜 계정(구글, 네이버, 카카오)으로도 가입하실 수 있습니다.',
    isPublished: true,
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    createdBy: 'admin@agenthub.com',
    tags: ['회원가입', '소셜로그인', '계정']
  },
  {
    id: 'general-4',
    category: 'general',
    question: '모바일에서도 사용할 수 있나요?',
    answer: '네, 반응형 웹 디자인으로 제작되어 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 환경으로 이용하실 수 있습니다.',
    isPublished: true,
    order: 4,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T16:30:00Z',
    createdBy: 'manager@agenthub.com',
    tags: ['모바일', '반응형', '접근성']
  },
  {
    id: 'general-5',
    category: 'general',
    question: '서비스 이용 시간에 제한이 있나요?',
    answer: '24시간 연중무휴로 서비스를 이용하실 수 있습니다. 단, 정기 점검이 있을 경우 사전에 공지해드립니다.',
    isPublished: true,
    order: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T11:20:00Z',
    createdBy: 'admin@agenthub.com',
    tags: ['24시간', '서비스시간', '점검']
  },
  {
    id: 'general-6',
    category: 'general',
    question: '동시에 여러 AI 에이전트를 사용할 수 있나요?',
    answer: '네, 동시에 여러 AI 에이전트를 사용하실 수 있습니다. 각각 독립적으로 작업이 처리되어 효율적으로 업무를 진행할 수 있습니다.',
    isPublished: false,
    order: 6,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-07T14:45:00Z',
    createdBy: 'manager@agenthub.com',
    tags: ['동시사용', '멀티태스킹', '효율성']
  },
  
  // 크레딧 카테고리 (6개)
  {
    id: 'credits-1',
    category: 'credits',
    question: '크레딧은 어떻게 사용되나요?',
    answer: '각 AI 에이전트마다 사용되는 크레딧이 다릅니다. 예를 들어, 회의록 자동화 AI는 50크레딧, PPT 슬라이드 생성기는 80크레딧을 사용합니다. 사용 전에 필요한 크레딧을 확인할 수 있습니다.',
    isPublished: true,
    order: 7,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    createdBy: 'manager@agenthub.com',
    tags: ['크레딧', '사용법', '요금']
  },
  {
    id: 'credits-2',
    category: 'credits',
    question: '크레딧은 언제까지 사용할 수 있나요?',
    answer: '구매한 크레딧은 구매일로부터 1년간 사용하실 수 있습니다. 만료 전에 이메일로 안내해드리며, 미사용 크레딧은 자동으로 연장됩니다.',
    isPublished: true,
    order: 8,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-11T10:15:00Z',
    createdBy: 'admin@agenthub.com',
    tags: ['유효기간', '만료', '연장']
  },
  {
    id: 'credits-3',
    category: 'credits',
    question: '크레딧 환불이 가능한가요?',
    answer: '미사용 크레딧의 경우 구매일로부터 7일 이내에 환불 요청이 가능합니다. 단, 부분 사용한 크레딧은 사용량을 제외한 나머지 금액만 환불됩니다.',
    isPublished: true,
    order: 9,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-13T15:30:00Z',
    createdBy: 'support@agenthub.com',
    tags: ['환불', '정책', '미사용']
  },
  {
    id: 'credits-4',
    category: 'credits',
    question: '크레딧 결제 방법은 무엇이 있나요?',
    answer: '신용카드, 계좌이체, 카카오페이, 네이버페이 등 다양한 결제 수단을 지원합니다. 회사 계정의 경우 세금계산서 발행도 가능합니다.',
    isPublished: true,
    order: 10,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-09T12:40:00Z',
    createdBy: 'admin@agenthub.com',
    tags: ['결제', '결제수단', '세금계산서']
  },
  {
    id: 'credits-5',
    category: 'credits',
    question: '대량 구매 할인이 있나요?',
    answer: '10,000 크레딧 이상 구매 시 할인 혜택을 제공합니다. 자세한 할인율은 고객센터로 문의해주세요.',
    isPublished: false,
    order: 11,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T16:20:00Z',
    createdBy: 'manager@agenthub.com',
    tags: ['할인', '대량구매', '혜택']
  },
  {
    id: 'credits-6',
    category: 'credits',
    question: '크레딧 사용 내역을 확인할 수 있나요?',
    answer: '프로필 페이지의 "크레딧 내역" 탭에서 자세한 사용 내역을 확인하실 수 있습니다. 날짜별, 에이전트별로 필터링도 가능합니다.',
    isPublished: true,
    order: 12,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-16T13:50:00Z',
    createdBy: 'admin@agenthub.com',
    tags: ['사용내역', '확인', '필터링']
  },
  
  // AI 에이전트 카테고리 (6개)
  {
    id: 'agents-1',
    category: 'agents',
    question: '어떤 AI 에이전트들이 있나요?',
    answer: '총 10개의 AI 에이전트를 제공합니다: 회의록 자동화, 이메일 자동 작성, 리뷰 분석, 키워드 분석, 카드뉴스 생성, SNS 이벤트 기획, AI 블로그 생성, PPT 슬라이드 생성, 광고 성과 분석, 음성 문서화 AI입니다.',
    isPublished: true,
    order: 13,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
    createdBy: 'admin@agenthub.com',
    tags: ['AI', '에이전트', '목록', '기능']
  },
  {
    id: 'agents-2',
    category: 'agents',
    question: 'AI 에이전트의 정확도는 어떻게 되나요?',
    answer: '저희 AI 에이전트들은 최신 언어모델을 기반으로 개발되어 평균 90% 이상의 정확도를 보장합니다. 지속적인 학습을 통해 성능을 개선하고 있습니다.',
    isPublished: false,
    order: 14,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-17T11:25:00Z',
    createdBy: 'tech@agenthub.com',
    tags: ['정확도', '성능', '품질']
  },
  {
    id: 'agents-3',
    category: 'agents',
    question: 'AI 에이전트 사용 방법이 어렵나요?',
    answer: '직관적인 UI로 설계되어 누구나 쉽게 사용할 수 있습니다. 각 에이전트마다 상세한 가이드와 예시를 제공하고 있습니다.',
    isPublished: false,
    order: 15,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T14:10:00Z',
    createdBy: 'admin@agenthub.com',
    tags: ['사용법', '가이드', '쉬움']
  },
  {
    id: 'agents-4',
    category: 'agents',
    question: '여러 언어를 지원하나요?',
    answer: '현재 한국어와 영어를 지원하며, 향후 중국어, 일본어 등 다국어 서비스를 확대할 예정입니다.',
    isPublished: false,
    order: 16,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-12T16:35:00Z',
    createdBy: 'dev@agenthub.com',
    tags: ['다국어', '언어지원', '확장']
  },
  {
    id: 'agents-5',
    category: 'agents',
    question: '맞춤형 AI 에이전트 개발이 가능한가요?',
    answer: '기업 고객의 경우 특정 업무에 특화된 맞춤형 AI 에이전트 개발 서비스를 제공합니다. 별도 상담을 통해 견적을 안내해드립니다.',
    isPublished: true,
    order: 17,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-19T10:50:00Z',
    createdBy: 'admin@agenthub.com',
    tags: ['맞춤형', '개발', '기업']
  },
  {
    id: 'agents-6',
    category: 'agents',
    question: '작업 결과물을 저장할 수 있나요?',
    answer: '모든 AI 에이전트의 결과물은 다운로드 또는 복사하여 저장하실 수 있습니다. 다양한 파일 형식(PDF, DOCX, PPTX 등)을 지원합니다.',
    isPublished: true,
    order: 18,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T13:15:00Z',
    createdBy: 'manager@agenthub.com',
    tags: ['저장', '다운로드', '파일형식']
  },
  
  // 보안 카테고리 (4개)
  {
    id: 'security-1',
    category: 'security',
    question: '데이터 보안은 어떻게 관리되나요?',
    answer: '모든 데이터는 SSL 암호화를 통해 전송되며, AWS의 보안 서버에 저장됩니다. 개인정보는 암호화되어 관리되며, 업무 데이터는 처리 완료 후 즉시 삭제됩니다.',
    isPublished: true,
    order: 19,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-12T16:30:00Z',
    createdBy: 'security@agenthub.com',
    tags: ['보안', '데이터', 'SSL', '암호화']
  },
  {
    id: 'security-2',
    category: 'security',
    question: '개인정보는 어떻게 보호되나요?',
    answer: '개인정보보호법에 따라 엄격하게 관리되며, 제3자에게 제공되지 않습니다. 모든 직원은 보안서약서를 작성하고 정기적인 보안교육을 받습니다.',
    isPublished: true,
    order: 20,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T12:20:00Z',
    createdBy: 'privacy@agenthub.com',
    tags: ['개인정보', '보호', '법규준수']
  },
  {
    id: 'security-3',
    category: 'security',
    question: '업무 데이터가 AI 학습에 사용되나요?',
    answer: '고객의 업무 데이터는 AI 학습에 절대 사용되지 않습니다. 모든 데이터는 처리 완료 후 즉시 삭제되며, 이는 서비스 약관에 명시되어 있습니다.',
    isPublished: false,
    order: 21,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-16T15:40:00Z',
    createdBy: 'admin@agenthub.com',
    tags: ['데이터보호', 'AI학습', '약관']
  },
  {
    id: 'security-4',
    category: 'security',
    question: '해킹이나 보안 사고가 발생하면 어떻게 하나요?',
    answer: '보안 사고 발생 시 즉시 관련 기관에 신고하고 고객에게 투명하게 공지합니다. 24시간 보안 모니터링 시스템을 운영하고 있습니다.',
    isPublished: true,
    order: 22,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-18T17:25:00Z',
    createdBy: 'security@agenthub.com',
    tags: ['보안사고', '대응', '모니터링']
  },
  
  // 계정 카테고리 (4개)
  {
    id: 'account-1',
    category: 'account',
    question: '개인 계정과 회사 계정의 차이는 무엇인가요?',
    answer: '개인 계정은 개인 사용자를 위한 계정이며, 회사 계정은 팀 관리 기능, 사용량 분석, 대량 크레딧 구매 할인 등의 추가 기능을 제공합니다.',
    isPublished: true,
    order: 23,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T11:45:00Z',
    createdBy: 'support@agenthub.com',
    tags: ['계정', '차이점', '기업']
  },
  {
    id: 'account-2',
    category: 'account',
    question: '비밀번호를 잊어버렸어요',
    answer: '로그인 페이지에서 "비밀번호 찾기"를 클릭하시면 등록된 이메일로 재설정 링크를 보내드립니다.',
    isPublished: true,
    order: 24,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-11T09:30:00Z',
    createdBy: 'admin@agenthub.com',
    tags: ['비밀번호', '찾기', '재설정']
  },
  {
    id: 'account-3',
    category: 'account',
    question: '계정을 삭제하고 싶어요',
    answer: '계정 설정에서 "계정 삭제" 메뉴를 통해 삭제하실 수 있습니다. 삭제 시 모든 데이터가 영구적으로 삭제되니 신중히 결정해주세요.',
    isPublished: true,
    order: 25,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-13T14:15:00Z',
    createdBy: 'support@agenthub.com',
    tags: ['계정삭제', '데이터삭제', '주의']
  },
  {
    id: 'account-4',
    category: 'account',
    question: '이메일 주소를 변경할 수 있나요?',
    answer: '보안상의 이유로 이메일 주소 변경은 고객센터를 통해서만 가능합니다. 본인 확인 절차를 거친 후 변경해드립니다.',
    isPublished: false,
    order: 26,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T16:50:00Z',
    createdBy: 'admin@agenthub.com',
    tags: ['이메일변경', '고객센터', '보안']
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