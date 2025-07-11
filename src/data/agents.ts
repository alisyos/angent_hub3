import { AIAgent, CreditPackage } from '@/types/agent';

export const aiAgents: AIAgent[] = [
  {
    id: 'meeting-recorder',
    name: '회의록 자동화 AI',
    category: '일반사무',
    description: '회의 내용을 체계적인 회의록으로 자동 변환해드립니다.',
    inputs: [
      { name: '회의내용', type: 'text', required: true, placeholder: '회의 내용을 입력하거나 파일을 업로드하세요' },
      { name: '자료설명', type: 'text', required: false, placeholder: '추가 자료에 대한 설명' },
      { name: '회의록 양식', type: 'select', required: true, options: ['표준 양식', '간단 양식', '상세 양식'] }
    ],
    outputs: ['회의제목', '일시', '회의록'],
    creditCost: 10,
    icon: '📝',
    hashtags: ['회의록', '자동화', '문서작성', '업무효율'],
    isActive: true
  },
  {
    id: 'email-writer',
    name: '이메일 작성 AI',
    category: '일반사무',
    description: '목적에 맞는 전문적인 이메일을 자동으로 작성해드립니다.',
    inputs: [
      { name: '사용자 말투', type: 'select', required: true, options: ['정중한 말투', '친근한 말투', '비즈니스 말투'] },
      { name: '이메일 유형', type: 'select', required: true, options: ['업무 협조', '회의 요청', '보고서', '문의사항'] },
      { name: '이메일 목적/내용', type: 'text', required: true, placeholder: '이메일의 목적과 전달하고 싶은 내용을 입력하세요' }
    ],
    outputs: ['작성 이메일 본문'],
    creditCost: 8,
    icon: '📧',
    hashtags: ['이메일', '비즈니스', '소통', '자동작성'],
    isActive: true
  },
  {
    id: 'review-analyzer',
    name: '리뷰 분석 AI',
    category: '마케팅/광고',
    description: '고객 리뷰를 분석하여 인사이트와 개선방안을 제공합니다.',
    inputs: [
      { name: '리뷰자료', type: 'text', required: true, placeholder: '리뷰 데이터를 입력하거나 파일을 업로드하세요' },
      { name: '제품/서비스 군', type: 'text', required: true, placeholder: '예: 음식점, 화장품, 전자제품' },
      { name: '제품/서비스 이름', type: 'text', required: true, placeholder: '분석할 제품/서비스명' }
    ],
    outputs: ['리뷰분석 보고서', '긍부정 비율', '리뷰분석', '개선방안 및 인사이트'],
    creditCost: 15,
    icon: '📊',
    hashtags: ['리뷰분석', '고객만족', '데이터분석', '인사이트'],
    isActive: true
  },
  {
    id: 'keyword-analyzer',
    name: '키워드 분석 AI',
    category: '마케팅/광고',
    description: '키워드의 온라인 반응과 트렌드를 종합적으로 분석합니다.',
    inputs: [
      { name: '분석요청 키워드', type: 'text', required: true, placeholder: '분석하고 싶은 키워드를 입력하세요' }
    ],
    outputs: ['블로그 영역 분석', '카페영역 분석', '유튜브 분석', '뉴스영역 분석', '세부분석: 키워드빈도, 감정분석, 긍부정평가'],
    creditCost: 12,
    icon: '🔍',
    hashtags: ['키워드', 'SEO', '트렌드분석', '마케팅'],
    isActive: true
  },
  {
    id: 'card-news-generator',
    name: 'AI 카드뉴스 생성기',
    category: '콘텐츠 제작',
    description: '매력적인 카드뉴스를 자동으로 기획하고 생성합니다.',
    inputs: [
      { name: '카드뉴스 유형', type: 'select', required: true, options: ['정보전달형', '스토리형', '비교분석형', '팁/가이드형'] },
      { name: '내용', type: 'text', required: true, placeholder: '카드뉴스로 만들 내용을 입력하세요' },
      { name: '목적/타겟/문체/문장스타일', type: 'text', required: true, placeholder: '타겟 독자와 원하는 문체를 설명하세요' },
      { name: '카드 수', type: 'number', required: true, placeholder: '생성할 카드 수를 입력하세요 (5-15장 권장)' }
    ],
    outputs: ['카드뉴스 목차', '카드뉴스 제안 (주제, 본문, 이미지 프롬프트)', '카드뉴스 이미지'],
    creditCost: 20,
    icon: '🎨',
    hashtags: ['카드뉴스', '콘텐츠제작', '비주얼', 'SNS마케팅'],
    isActive: true
  },
  {
    id: 'sns-event-planner',
    name: 'SNS 이벤트 기획 AI',
    category: '마케팅/광고',
    description: 'SNS 이벤트를 전략적으로 기획하고 실행 계획을 수립합니다.',
    inputs: [
      { name: '카테고리/제품명/특징', type: 'text', required: true, placeholder: '이벤트 대상 제품/서비스의 카테고리, 이름, 특징을 입력하세요' },
      { name: '목표KPI/타겟/예산/기간', type: 'text', required: true, placeholder: '이벤트 목표, 타겟 고객, 예산, 진행 기간을 입력하세요' }
    ],
    outputs: ['이벤트 기획안', '실행 계획', '콘텐츠 전략', '목표&성과', '경품&예산'],
    creditCost: 18,
    icon: '🎉',
    hashtags: ['이벤트기획', 'SNS마케팅', '프로모션', '고객참여'],
    isActive: true
  },
  {
    id: 'blog-generator',
    name: 'AI 블로그 생성기',
    category: '콘텐츠 제작',
    description: '목적에 맞는 고품질 블로그 포스팅을 자동으로 작성합니다.',
    inputs: [
      { name: '유형/목적', type: 'select', required: true, options: ['정보 제공', '제품 리뷰', '노하우 공유', '브랜드 스토리'] },
      { name: '내용입력', type: 'text', required: true, placeholder: '블로그 주제와 포함하고 싶은 내용을 입력하세요' },
      { name: '페르소나/타겟/문체/문장스타일', type: 'text', required: true, placeholder: '타겟 독자와 원하는 글의 톤앤매너를 설명하세요' }
    ],
    outputs: ['블로그 포스팅 내용', '이미지 생성 프롬프트', '해시태그'],
    creditCost: 15,
    icon: '✍️',
    hashtags: ['블로그', '콘텐츠마케팅', 'SEO', '글쓰기'],
    isActive: true
  },
  {
    id: 'ppt-generator',
    name: 'AI PPT 슬라이드 생성기',
    category: '일반사무',
    description: '전문적인 프레젠테이션 슬라이드를 자동으로 구성합니다.',
    inputs: [
      { name: '내용입력', type: 'text', required: true, placeholder: '프레젠테이션 주제와 포함할 내용을 입력하세요' },
      { name: '목적/타겟/슬라이드수/문체', type: 'text', required: true, placeholder: '발표 목적, 청중, 슬라이드 수, 발표 스타일을 입력하세요' }
    ],
    outputs: ['슬라이드 내용', '시각적 제안', '발표 스크립트'],
    creditCost: 25,
    icon: '📈',
    hashtags: ['프레젠테이션', 'PPT', '발표자료', '비즈니스'],
    isActive: true
  },
  {
    id: 'ad-analyzer',
    name: '광고 문구 분석 및 제안 AI',
    category: '마케팅/광고',
    description: '광고 문구를 분석하고 효과적인 개선안을 제안합니다.',
    inputs: [
      { name: '검색키워드/자사명', type: 'text', required: true, placeholder: '검색할 키워드와 자사명을 입력하세요' },
      { name: '광고 데이터', type: 'text', required: true, placeholder: '분석할 광고 문구나 이미지 정보를 입력하세요' }
    ],
    outputs: ['자사광고 분석', '경쟁사 분석', '광고 소재 제안'],
    creditCost: 20,
    icon: '💡',
    hashtags: ['광고분석', '카피라이팅', '경쟁분석', '마케팅전략'],
    isActive: true
  },
  {
    id: 'voice-to-doc',
    name: '음성파일 기반 문서 자동화 AI',
    category: '일반사무',
    description: '음성 파일을 분석하여 다양한 형태의 문서로 변환합니다.',
    inputs: [
      { name: '음성파일', type: 'file', required: true, placeholder: '음성 파일을 업로드하세요 (mp3, wav, m4a)' },
      { name: '문서유형', type: 'select', required: true, options: ['회의록', '제안서', '업무보고서', '인터뷰 정리'] }
    ],
    outputs: ['생성문서 (회의록, 제안서, 업무보고서 등)'],
    creditCost: 30,
    icon: '🎙️',
    hashtags: ['음성인식', '문서자동화', 'STT', '회의록'],
    isActive: true
  }
];

export const creditPackages: CreditPackage[] = [
  {
    id: 'basic-100',
    name: '기본 패키지',
    credits: 100,
    price: 10000,
    bonus: 0,
    isActive: true,
    order: 1
  },
  {
    id: 'popular-300',
    name: '추천 패키지',
    credits: 300,
    price: 25000,
    bonus: 50,
    popular: true,
    isActive: true,
    order: 2
  },
  {
    id: 'premium-500',
    name: '프리미엄 패키지',
    credits: 500,
    price: 40000,
    bonus: 100,
    isActive: true,
    order: 3
  },
  {
    id: 'enterprise-1000',
    name: '엔터프라이즈 패키지',
    credits: 1000,
    price: 70000,
    bonus: 200,
    isActive: true,
    order: 4
  },
  {
    id: 'starter-50',
    name: '스타터 패키지',
    credits: 50,
    price: 5000,
    bonus: 0,
    isActive: false,
    order: 5
  },
  {
    id: 'mega-2000',
    name: '메가 패키지',
    credits: 2000,
    price: 120000,
    bonus: 500,
    isActive: false,
    order: 6
  },
  {
    id: 'trial-20',
    name: '체험 패키지',
    credits: 20,
    price: 2000,
    bonus: 5,
    isActive: false,
    order: 7
  }
]; 