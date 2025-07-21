import { ScreenDefinition } from '@/components/ScreenDefinitionModal';

// 화면 정의 데이터
export const screenDefinitions: Record<string, ScreenDefinition> = {
  // 메인 대시보드
  'main-dashboard': {
    basic: {
      classification: '메인 > 대시보드',
      purpose: 'AI 에이전트를 탐색하고 선택하여 사용할 수 있는 메인 화면',
      mainFeatures: [
        'AI 에이전트 목록 조회',
        '카테고리별 필터링',
        '실시간 검색',
        '즐겨찾기 관리',
        '페이지네이션'
      ],
      userTypes: ['일반 사용자', '회사 직원', '회사 관리자', '플랫폼 관리자']
    },
    layout: {
      structure: 'Header + Sidebar + Main Grid Layout + Footer',
      uiElements: [
        '헤더 (로고, 네비게이션, 사용자 정보)',
        '사이드바 (카테고리 필터, 즐겨찾기)',
        '검색바',
        'AI 에이전트 카드 그리드 (3열)',
        '페이지네이션',
        '푸터'
      ]
    },
    inputFields: [
      {
        fieldName: '검색어',
        dataType: 'string',
        inputType: 'text',
        required: false,
        lengthLimit: '100자',
        placeholder: 'AI 에이전트 검색...'
      }
    ],
    outputFields: [
      {
        displayField: '에이전트 카드',
        displayFormat: '그리드 형태 (3열)',
        linkSettings: '에이전트 상세 페이지로 이동'
      },
      {
        displayField: '크레딧 잔액',
        displayFormat: '숫자 + 단위',
        linkSettings: '크레딧 충전 페이지로 이동'
      }
    ],
    functions: {
      buttons: [
        {
          name: '검색',
          position: '상단 검색바',
          function: '에이전트 실시간 필터링',
          event: 'onChange'
        },
        {
          name: '카테고리 필터',
          position: '좌측 사이드바',
          function: '카테고리별 에이전트 필터링',
          event: 'onClick'
        },
        {
          name: '즐겨찾기 추가/제거',
          position: '에이전트 카드',
          function: '즐겨찾기 목록 관리',
          event: 'onClick'
        },
        {
          name: '에이전트 선택',
          position: '에이전트 카드',
          function: '에이전트 상세 페이지 이동',
          event: 'onClick'
        }
      ]
    },
    navigation: {
      entryPath: ['로그인 완료 후 자동 이동', '헤더 로고 클릭'],
      targetScreens: [
        'AI 에이전트 실행 페이지 (/agent/[id])',
        '크레딧 충전 페이지 (/credits)',
        '프로필 페이지 (/profile)',
        '관리자 시스템 (/admin/*)',
        '회사 관리 시스템 (/company/*)'
      ],
      popupScreens: ['폴더 생성 모달', '즐겨찾기 관리 모달'],
      backAction: '이전 페이지가 없으므로 현재 페이지 유지'
    },
    messages: {
      confirmMessages: [
        '즐겨찾기에 추가되었습니다.',
        '즐겨찾기에서 제거되었습니다.',
        '폴더가 생성되었습니다.'
      ],
      errorMessages: [
        '에이전트를 불러올 수 없습니다.',
        '네트워크 연결을 확인해주세요.',
        '즐겨찾기 저장에 실패했습니다.'
      ],
      warningMessages: [
        '크레딧이 부족합니다.',
        '로그인이 필요합니다.'
      ],
      exceptions: [
        '서버 오류 발생 시 에러 페이지 표시',
        '권한 없음 시 로그인 페이지로 리다이렉트'
      ]
    },
    security: {
      accessPermissions: ['로그인 사용자'],
      functionPermissions: ['에이전트 사용', '즐겨찾기 관리']
    },
    etc: {
      notes: [
        '모바일 환경에서는 2열 그리드로 변경',
        '사이드바는 모바일에서 토글 형태로 표시',
        '무한 스크롤 대신 페이지네이션 사용'
      ],
      references: [
        'AI 에이전트 데이터: /src/data/agents.ts',
        '즐겨찾기 Hook: /src/hooks/useFavorites.ts'
      ],
      changeHistory: [
        '2024-01-01: 초기 화면 설계',
        '2024-01-15: 즐겨찾기 시스템 추가',
        '2024-01-20: 검색 기능 개선'
      ]
    }
  },

  // 로그인 페이지
  'login': {
    basic: {
      classification: '인증 > 로그인',
      purpose: '사용자 인증을 통한 플랫폼 접근',
      mainFeatures: [
        '이메일/비밀번호 로그인',
        '로그인 상태 유지',
        '회원가입 링크',
        '테스트 계정 제공'
      ],
      userTypes: ['미인증 사용자']
    },
    layout: {
      structure: 'Center Layout with Login Form',
      uiElements: [
        '로고',
        '로그인 폼',
        '로그인 버튼',
        '회원가입 링크',
        '테스트 계정 정보'
      ]
    },
    inputFields: [
      {
        fieldName: '이메일',
        dataType: 'string',
        inputType: 'email',
        required: true,
        lengthLimit: '255자',
        placeholder: 'example@email.com'
      },
      {
        fieldName: '비밀번호',
        dataType: 'string',
        inputType: 'password',
        required: true,
        lengthLimit: '100자',
        placeholder: '비밀번호를 입력하세요'
      },
      {
        fieldName: '로그인 상태 유지',
        dataType: 'boolean',
        inputType: 'checkbox',
        required: false,
        defaultValue: 'false'
      }
    ],
    functions: {
      buttons: [
        {
          name: '로그인',
          position: '폼 하단',
          function: '사용자 인증 및 토큰 발급',
          event: 'onSubmit'
        },
        {
          name: '회원가입',
          position: '폼 하단 링크',
          function: '회원가입 페이지로 이동',
          event: 'onClick'
        }
      ]
    },
    navigation: {
      entryPath: ['URL 직접 접근', '비로그인 상태에서 자동 리다이렉트'],
      targetScreens: [
        '메인 대시보드 (로그인 성공 시)',
        '회원가입 페이지 (/register)'
      ],
      backAction: '이전 페이지 또는 메인 페이지로 이동'
    },
    messages: {
      confirmMessages: ['로그인에 성공했습니다.'],
      errorMessages: [
        '이메일 또는 비밀번호가 올바르지 않습니다.',
        '이메일을 입력해주세요.',
        '비밀번호를 입력해주세요.'
      ],
      warningMessages: [],
      exceptions: ['서버 연결 실패 시 재시도 안내']
    },
    security: {
      accessPermissions: ['모든 사용자'],
      functionPermissions: ['로그인 시도']
    },
    etc: {
      notes: [
        '테스트 계정 정보는 개발 환경에서만 표시',
        'Mock 인증 시스템 사용 중'
      ],
      references: ['인증 유틸: /src/utils/auth.ts'],
      changeHistory: [
        '2024-01-01: 초기 로그인 화면 생성',
        '2024-01-10: 테스트 계정 정보 추가'
      ]
    }
  },

  // AI 에이전트 실행 페이지
  'agent-execution': {
    basic: {
      classification: '에이전트 > 실행',
      purpose: '선택한 AI 에이전트를 실행하고 결과를 확인',
      mainFeatures: [
        '동적 입력 폼 생성',
        'AI 에이전트 실행',
        '결과 표시 및 다운로드',
        '크레딧 차감',
        '사용 내역 저장'
      ],
      userTypes: ['일반 사용자', '회사 직원', '회사 관리자', '플랫폼 관리자']
    },
    layout: {
      structure: 'Header + Agent Info + Input Form + Result Section + Sidebar',
      uiElements: [
        '에이전트 정보 (이름, 설명, 크레딧 비용)',
        '동적 입력 폼',
        '실행 버튼',
        '결과 표시 영역',
        '즐겨찾기 사이드바'
      ]
    },
    inputFields: [
      {
        fieldName: '동적 입력 필드',
        dataType: 'various',
        inputType: 'text/file/select/number',
        required: true,
        lengthLimit: '에이전트별 상이',
        placeholder: '에이전트별 동적 생성'
      }
    ],
    outputFields: [
      {
        displayField: 'AI 처리 결과',
        displayFormat: 'JSON/텍스트/파일',
        linkSettings: '다운로드 링크 제공'
      },
      {
        displayField: '사용된 크레딧',
        displayFormat: '숫자',
        linkSettings: '크레딧 충전 페이지로 이동'
      }
    ],
    functions: {
      buttons: [
        {
          name: '실행',
          position: '입력 폼 하단',
          function: 'AI 에이전트 실행',
          event: 'onSubmit'
        },
        {
          name: '결과 복사',
          position: '결과 영역',
          function: '결과를 클립보드에 복사',
          event: 'onClick'
        },
        {
          name: '결과 다운로드',
          position: '결과 영역',
          function: '결과를 파일로 다운로드',
          event: 'onClick'
        },
        {
          name: '뒤로가기',
          position: '상단',
          function: '메인 대시보드로 이동',
          event: 'onClick'
        }
      ]
    },
    navigation: {
      entryPath: ['메인 대시보드에서 에이전트 카드 클릭'],
      targetScreens: [
        '메인 대시보드 (뒤로가기)',
        '크레딧 충전 페이지 (크레딧 부족 시)'
      ],
      backAction: '메인 대시보드로 이동'
    },
    messages: {
      confirmMessages: [
        'AI 에이전트가 실행되었습니다.',
        '결과가 클립보드에 복사되었습니다.',
        '파일이 다운로드되었습니다.'
      ],
      errorMessages: [
        '크레딧이 부족합니다.',
        '입력값을 확인해주세요.',
        'AI 서비스 오류가 발생했습니다.',
        '파일 업로드에 실패했습니다.'
      ],
      warningMessages: [
        '이 작업은 {n} 크레딧을 소모합니다.',
        '처리 시간이 오래 걸릴 수 있습니다.'
      ],
      exceptions: [
        'AI API 타임아웃 시 재시도 안내',
        '크레딧 부족 시 충전 페이지 리다이렉트'
      ]
    },
    security: {
      accessPermissions: ['로그인 사용자'],
      functionPermissions: ['AI 에이전트 실행', '파일 업로드', '결과 다운로드']
    },
    etc: {
      notes: [
        '파일 업로드는 10MB 제한',
        '결과는 24시간 후 자동 삭제',
        '크레딧 차감은 실행 완료 시점'
      ],
      references: [
        'AI 에이전트 데이터: /src/data/agents.ts',
        'Mock 결과 생성 로직 포함'
      ],
      changeHistory: [
        '2024-01-01: 기본 실행 화면 생성',
        '2024-01-12: 파일 업로드 기능 추가',
        '2024-01-18: 결과 다운로드 기능 추가'
      ]
    }
  },

  // 개발요청 페이지 추가
  'development-request': {
    basic: {
      classification: '관리 > 개발요청',
      purpose: '개발자가 프로젝트를 이해할 수 있도록 상세 개발 가이드 제공',
      mainFeatures: [
        'PRD 문서 제공',
        '전체 사이트맵',
        '접근 권한 정의',
        '시스템 플로우 다이어그램',
        '네비게이션 구조',
        '사용자 시나리오'
      ],
      userTypes: ['개발자', '프로젝트 관리자', '플랫폼 관리자']
    },
    layout: {
      structure: 'Header + Tab Navigation + Content Area',
      uiElements: [
        '헤더 (제목, 설명)',
        '탭 네비게이션 (6개 탭)',
        '콘텐츠 영역',
        '섹션별 카드 레이아웃'
      ]
    },
    functions: {
      buttons: [
        {
          name: '탭 버튼',
          position: '상단 네비게이션',
          function: '섹션별 콘텐츠 전환',
          event: 'onClick'
        }
      ]
    },
    navigation: {
      entryPath: ['URL 직접 접근 (/request)'],
      targetScreens: ['없음 (정적 문서 페이지)'],
      backAction: '브라우저 뒤로가기'
    },
    messages: {
      confirmMessages: [],
      errorMessages: ['페이지 로딩 실패'],
      warningMessages: [],
      exceptions: ['네트워크 오류 시 재로딩 안내']
    },
    security: {
      accessPermissions: ['개발자', '관리자'],
      functionPermissions: ['문서 열람']
    },
    etc: {
      notes: [
        '개발 참고용 문서',
        '실제 개발 시 업데이트 필요'
      ],
      references: [
        'README.md',
        'CLAUDE.md',
        '각종 데이터 파일들'
      ],
      changeHistory: [
        '2024-01-01: 개발요청 페이지 생성',
        '2024-01-22: 시스템 플로우 탭 추가'
      ]
    }
  },

  // 회원가입 페이지
  'register': {
    basic: {
      classification: '인증 > 회원가입',
      purpose: '신규 사용자 계정 생성',
      mainFeatures: [
        '개인/회사 계정 선택',
        '이메일 중복 확인',
        '비밀번호 강도 검증',
        '회사 정보 입력 (회사 계정 시)'
      ],
      userTypes: ['미인증 사용자']
    },
    layout: {
      structure: 'Center Layout with Registration Form',
      uiElements: [
        '로고',
        '계정 유형 선택',
        '회원가입 폼',
        '회원가입 버튼',
        '로그인 링크'
      ]
    },
    inputFields: [
      {
        fieldName: '계정 유형',
        dataType: 'string',
        inputType: 'radio',
        required: true,
        defaultValue: 'general_user'
      },
      {
        fieldName: '이메일',
        dataType: 'string',
        inputType: 'email',
        required: true,
        lengthLimit: '255자',
        placeholder: 'example@email.com'
      },
      {
        fieldName: '비밀번호',
        dataType: 'string',
        inputType: 'password',
        required: true,
        lengthLimit: '8-100자',
        placeholder: '8자 이상 입력하세요'
      },
      {
        fieldName: '이름',
        dataType: 'string',
        inputType: 'text',
        required: true,
        lengthLimit: '50자',
        placeholder: '이름을 입력하세요'
      }
    ],
    functions: {
      buttons: [
        {
          name: '회원가입',
          position: '폼 하단',
          function: '계정 생성 및 로그인 처리',
          event: 'onSubmit'
        },
        {
          name: '로그인',
          position: '폼 하단 링크',
          function: '로그인 페이지로 이동',
          event: 'onClick'
        }
      ]
    },
    navigation: {
      entryPath: ['로그인 페이지에서 회원가입 링크 클릭'],
      targetScreens: [
        '메인 대시보드 (회원가입 성공 시)',
        '로그인 페이지 (/login)'
      ],
      backAction: '로그인 페이지로 이동'
    },
    messages: {
      confirmMessages: ['회원가입이 완료되었습니다.'],
      errorMessages: [
        '이미 등록된 이메일입니다.',
        '비밀번호는 8자 이상이어야 합니다.',
        '필수 항목을 입력해주세요.'
      ],
      warningMessages: [],
      exceptions: ['서버 연결 실패 시 재시도 안내']
    },
    security: {
      accessPermissions: ['모든 사용자'],
      functionPermissions: ['계정 생성']
    },
    etc: {
      notes: [
        '이메일 중복 체크는 실시간으로 처리',
        '비밀번호 강도는 클라이언트에서 검증'
      ],
      references: ['인증 유틸: /src/utils/auth.ts'],
      changeHistory: [
        '2024-01-01: 초기 회원가입 화면 생성',
        '2024-01-05: 회사 계정 유형 추가'
      ]
    }
  },

  // 크레딧 충전 페이지
  'credits': {
    basic: {
      classification: '결제 > 크레딧 충전',
      purpose: '크레딧 패키지 구매 및 충전',
      mainFeatures: [
        '크레딧 패키지 선택',
        '결제 수단 선택',
        '보너스 크레딧 계산',
        '결제 처리'
      ],
      userTypes: ['일반 사용자', '회사 관리자', '플랫폼 관리자']
    },
    layout: {
      structure: 'Header + Package Grid + Payment Form + Footer',
      uiElements: [
        '현재 크레딧 잔액',
        '크레딧 패키지 카드 그리드',
        '결제 수단 선택',
        '결제 버튼'
      ]
    },
    inputFields: [
      {
        fieldName: '크레딧 패키지',
        dataType: 'string',
        inputType: 'radio',
        required: true
      },
      {
        fieldName: '결제 수단',
        dataType: 'string',
        inputType: 'radio',
        required: true
      }
    ],
    outputFields: [
      {
        displayField: '현재 크레딧',
        displayFormat: '숫자 + 단위',
        linkSettings: '없음'
      },
      {
        displayField: '총 결제 금액',
        displayFormat: '통화 형식',
        linkSettings: '없음'
      }
    ],
    functions: {
      buttons: [
        {
          name: '패키지 선택',
          position: '패키지 카드',
          function: '선택된 패키지 정보 업데이트',
          event: 'onClick'
        },
        {
          name: '결제하기',
          position: '결제 폼 하단',
          function: '결제 처리 및 크레딧 충전',
          event: 'onSubmit'
        }
      ]
    },
    navigation: {
      entryPath: ['헤더 크레딧 클릭', '크레딧 부족 시 자동 리다이렉트'],
      targetScreens: ['결제 완료 후 메인 대시보드로 이동'],
      backAction: '메인 대시보드로 이동'
    },
    messages: {
      confirmMessages: [
        '결제가 완료되었습니다.',
        '크레딧이 충전되었습니다.'
      ],
      errorMessages: [
        '결제에 실패했습니다.',
        '결제 수단을 선택해주세요.',
        '패키지를 선택해주세요.'
      ],
      warningMessages: ['회사 직원은 크레딧을 직접 충전할 수 없습니다.'],
      exceptions: ['결제 API 오류 시 고객센터 안내']
    },
    security: {
      accessPermissions: ['일반 사용자', '회사 관리자', '플랫폼 관리자'],
      functionPermissions: ['크레딧 구매']
    },
    etc: {
      notes: [
        '회사 직원은 접근 불가',
        'Mock 결제 시스템 사용 중'
      ],
      references: ['크레딧 패키지 데이터: /src/data/agents.ts'],
      changeHistory: [
        '2024-01-01: 크레딧 충전 화면 생성',
        '2024-01-08: 보너스 크레딧 시스템 추가'
      ]
    }
  },

  // 프로필 페이지
  'profile': {
    basic: {
      classification: '사용자 > 프로필 관리',
      purpose: '사용자 정보 관리 및 사용 내역 조회',
      mainFeatures: [
        '개인 정보 수정',
        '프로필 이미지 업로드',
        '사용 내역 조회',
        '크레딧 충전 내역'
      ],
      userTypes: ['일반 사용자', '회사 직원', '회사 관리자', '플랫폼 관리자']
    },
    layout: {
      structure: 'Header + Profile Section + Usage History + Footer',
      uiElements: [
        '프로필 이미지',
        '사용자 정보 폼',
        '사용 내역 테이블',
        '크레딧 내역 차트'
      ]
    },
    inputFields: [
      {
        fieldName: '이름',
        dataType: 'string',
        inputType: 'text',
        required: true,
        lengthLimit: '50자'
      },
      {
        fieldName: '프로필 이미지',
        dataType: 'file',
        inputType: 'file',
        required: false,
        lengthLimit: '5MB'
      }
    ],
    functions: {
      buttons: [
        {
          name: '정보 수정',
          position: '프로필 섹션',
          function: '사용자 정보 업데이트',
          event: 'onSubmit'
        },
        {
          name: '이미지 업로드',
          position: '프로필 이미지',
          function: '프로필 이미지 변경',
          event: 'onChange'
        }
      ]
    },
    navigation: {
      entryPath: ['헤더 사용자 메뉴에서 프로필 클릭'],
      targetScreens: ['크레딧 충전 페이지'],
      backAction: '메인 대시보드로 이동'
    },
    messages: {
      confirmMessages: [
        '프로필이 업데이트되었습니다.',
        '이미지가 업로드되었습니다.'
      ],
      errorMessages: [
        '이미지 업로드에 실패했습니다.',
        '파일 크기가 너무 큽니다.',
        '지원하지 않는 파일 형식입니다.'
      ],
      warningMessages: [],
      exceptions: ['서버 오류 시 재시도 안내']
    },
    security: {
      accessPermissions: ['로그인 사용자'],
      functionPermissions: ['프로필 수정', '사용 내역 조회']
    },
    etc: {
      notes: [
        '이미지는 JPG, PNG만 지원',
        '사용 내역은 최근 3개월만 표시'
      ],
      references: ['사용자 데이터: localStorage 기반'],
      changeHistory: [
        '2024-01-01: 프로필 페이지 생성',
        '2024-01-12: 사용 내역 차트 추가'
      ]
    }
  },

  // FAQ 페이지
  'faq': {
    basic: {
      classification: '고객지원 > FAQ',
      purpose: '자주 묻는 질문 및 답변 제공',
      mainFeatures: [
        '카테고리별 FAQ 조회',
        '검색 기능',
        '답변 펼치기/접기',
        '도움이 되었는지 평가'
      ],
      userTypes: ['모든 사용자']
    },
    layout: {
      structure: 'Header + Search + Category Tabs + FAQ List + Footer',
      uiElements: [
        '검색바',
        '카테고리 탭',
        'FAQ 아코디언 리스트',
        '평가 버튼'
      ]
    },
    inputFields: [
      {
        fieldName: '검색어',
        dataType: 'string',
        inputType: 'text',
        required: false,
        placeholder: 'FAQ 검색...'
      }
    ],
    functions: {
      buttons: [
        {
          name: '검색',
          position: '검색바',
          function: 'FAQ 검색 및 필터링',
          event: 'onChange'
        },
        {
          name: '카테고리 탭',
          position: '상단',
          function: '카테고리별 FAQ 필터링',
          event: 'onClick'
        },
        {
          name: 'FAQ 펼치기',
          position: 'FAQ 항목',
          function: '답변 표시/숨김',
          event: 'onClick'
        }
      ]
    },
    navigation: {
      entryPath: ['푸터 링크', '고객지원 메뉴'],
      targetScreens: ['문의하기 페이지'],
      backAction: '이전 페이지로 이동'
    },
    messages: {
      confirmMessages: ['평가해주셔서 감사합니다.'],
      errorMessages: ['검색 결과를 불러올 수 없습니다.'],
      warningMessages: [],
      exceptions: ['데이터 로딩 실패 시 재로딩']
    },
    security: {
      accessPermissions: ['모든 사용자'],
      functionPermissions: ['FAQ 조회', 'FAQ 검색']
    },
    etc: {
      notes: [
        '검색은 제목과 내용 모두 대상',
        '카테고리는 관리자가 설정 가능'
      ],
      references: ['FAQ 데이터: Mock 데이터'],
      changeHistory: [
        '2024-01-01: FAQ 페이지 생성',
        '2024-01-15: 검색 기능 추가'
      ]
    }
  }
};

// 페이지 경로와 화면 정의 매핑
export const getScreenDefinition = (pathname: string): { title: string; definition: ScreenDefinition } | null => {
  // 경로에 따른 매핑
  const pathMappings: Record<string, { title: string; key: string }> = {
    '/': { title: '메인 대시보드', key: 'main-dashboard' },
    '/login': { title: '로그인', key: 'login' },
    '/register': { title: '회원가입', key: 'register' },
    '/agent/[id]': { title: 'AI 에이전트 실행', key: 'agent-execution' },
    '/request': { title: '개발요청서', key: 'development-request' },
    '/credits': { title: '크레딧 충전', key: 'credits' },
    '/profile': { title: '프로필', key: 'profile' },
    '/faq': { title: 'FAQ', key: 'faq' },
    '/contact': { title: '고객지원', key: 'faq' }, // FAQ와 유사
    '/contact/inquiry': { title: '일반 문의', key: 'faq' },
    '/contact/agent-request': { title: '에이전트 추가 신청', key: 'faq' },
    // 관리자 페이지들
    '/admin': { title: '관리자 대시보드', key: 'main-dashboard' },
    '/admin/users': { title: '사용자 관리', key: 'main-dashboard' },
    '/admin/payments': { title: '결제 관리', key: 'main-dashboard' },
    '/admin/agents': { title: 'AI 에이전트 관리', key: 'main-dashboard' },
    '/admin/categories': { title: '카테고리 관리', key: 'main-dashboard' },
    '/admin/credit-packages': { title: '크레딧 패키지 관리', key: 'main-dashboard' },
    '/admin/faq': { title: 'FAQ 관리', key: 'main-dashboard' },
    '/admin/inquiries': { title: '문의 관리', key: 'main-dashboard' },
    // 회사 관리 페이지들
    '/company': { title: '회사 대시보드', key: 'main-dashboard' },
    '/company/employees': { title: '직원 관리', key: 'main-dashboard' },
    '/company/analytics': { title: '분석 및 리포트', key: 'main-dashboard' },
    '/company/credits': { title: '회사 크레딧 관리', key: 'main-dashboard' },
    '/company/settings': { title: '회사 설정', key: 'main-dashboard' }
  };

  // 동적 라우트 처리
  let matchedPath = pathname;
  if (pathname.startsWith('/agent/')) {
    matchedPath = '/agent/[id]';
  }

  const mapping = pathMappings[matchedPath];
  if (mapping && screenDefinitions[mapping.key]) {
    return {
      title: mapping.title,
      definition: screenDefinitions[mapping.key]
    };
  }

  return null;
};