'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  HelpCircle,
  MessageCircle,
  CreditCard,
  Bot,
  Shield,
  Settings
} from 'lucide-react';

export default function FAQ() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = [
    { id: 'all', name: '전체', icon: HelpCircle },
    { id: 'general', name: '일반', icon: MessageCircle },
    { id: 'credits', name: '크레딧', icon: CreditCard },
    { id: 'agents', name: 'AI 에이전트', icon: Bot },
    { id: 'security', name: '보안', icon: Shield },
    { id: 'account', name: '계정', icon: Settings }
  ];

  const faqData = [
    {
      id: 'general-1',
      category: 'general',
      question: 'AI 에이전트 허브란 무엇인가요?',
      answer: 'AI 에이전트 허브는 다양한 업무를 자동화할 수 있는 AI 에이전트들을 한 곳에서 이용할 수 있는 플랫폼입니다. 회의록 작성, 이메일 생성, PPT 제작 등 10가지의 다양한 AI 에이전트를 제공합니다.'
    },
    {
      id: 'general-2',
      category: 'general',
      question: '무료로 사용할 수 있나요?',
      answer: '회원가입 시 500 크레딧을 무료로 제공하며, 모든 AI 에이전트를 체험해보실 수 있습니다. 추가 사용을 원하시면 크레딧 패키지를 구매하실 수 있습니다.'
    },
    {
      id: 'credits-1',
      category: 'credits',
      question: '크레딧은 어떻게 사용되나요?',
      answer: '각 AI 에이전트마다 사용되는 크레딧이 다릅니다. 예를 들어, 회의록 자동화 AI는 50크레딧, PPT 슬라이드 생성기는 80크레딧을 사용합니다. 사용 전에 필요한 크레딧을 확인할 수 있습니다.'
    },
    {
      id: 'credits-2',
      category: 'credits',
      question: '크레딧은 언제까지 사용할 수 있나요?',
      answer: '구매한 크레딧은 구매일로부터 1년간 사용하실 수 있습니다. 만료 전에 이메일로 안내해드리며, 미사용 크레딧은 자동으로 연장됩니다.'
    },
    {
      id: 'agents-1',
      category: 'agents',
      question: '어떤 AI 에이전트들이 있나요?',
      answer: '총 10개의 AI 에이전트를 제공합니다: 회의록 자동화, 이메일 자동 작성, 리뷰 분석, 키워드 분석, 카드뉴스 생성, SNS 이벤트 기획, AI 블로그 생성, PPT 슬라이드 생성, 광고 성과 분석, 음성 문서화 AI입니다.'
    },
    {
      id: 'agents-2',
      category: 'agents',
      question: 'AI 에이전트의 정확도는 어떻게 되나요?',
      answer: '저희 AI 에이전트들은 최신 언어모델을 기반으로 개발되어 평균 90% 이상의 정확도를 보장합니다. 지속적인 학습을 통해 성능을 개선하고 있습니다.'
    },
    {
      id: 'security-1',
      category: 'security',
      question: '데이터 보안은 어떻게 관리되나요?',
      answer: '모든 데이터는 SSL 암호화를 통해 전송되며, AWS의 보안 서버에 저장됩니다. 개인정보는 암호화되어 관리되며, 업무 데이터는 처리 완료 후 즉시 삭제됩니다.'
    },
    {
      id: 'account-1',
      category: 'account',
      question: '개인 계정과 회사 계정의 차이는 무엇인가요?',
      answer: '개인 계정은 개인 사용자를 위한 계정이며, 회사 계정은 팀 관리 기능, 사용량 분석, 대량 크레딧 구매 할인 등의 추가 기능을 제공합니다.'
    },
    {
      id: 'general-3',
      category: 'general',
      question: '회원가입은 어떻게 하나요?',
      answer: '이메일 주소와 비밀번호만으로 간단하게 회원가입이 가능합니다. 소셜 계정(구글, 네이버, 카카오)으로도 가입하실 수 있습니다.'
    },
    {
      id: 'general-4',
      category: 'general',
      question: '모바일에서도 사용할 수 있나요?',
      answer: '네, 반응형 웹 디자인으로 제작되어 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 환경으로 이용하실 수 있습니다.'
    },
    {
      id: 'credits-3',
      category: 'credits',
      question: '크레딧 환불이 가능한가요?',
      answer: '미사용 크레딧의 경우 구매일로부터 7일 이내에 환불 요청이 가능합니다. 단, 부분 사용한 크레딧은 사용량을 제외한 나머지 금액만 환불됩니다.'
    },
    {
      id: 'credits-4',
      category: 'credits',
      question: '크레딧 결제 방법은 무엇이 있나요?',
      answer: '신용카드, 계좌이체, 카카오페이, 네이버페이 등 다양한 결제 수단을 지원합니다. 회사 계정의 경우 세금계산서 발행도 가능합니다.'
    },
    {
      id: 'credits-5',
      category: 'credits',
      question: '대량 구매 할인이 있나요?',
      answer: '10,000 크레딧 이상 구매 시 할인 혜택을 제공합니다. 자세한 할인율은 고객센터로 문의해주세요.'
    },
    {
      id: 'agents-3',
      category: 'agents',
      question: 'AI 에이전트 사용 방법이 어렵나요?',
      answer: '직관적인 UI로 설계되어 누구나 쉽게 사용할 수 있습니다. 각 에이전트마다 상세한 가이드와 예시를 제공하고 있습니다.'
    },
    {
      id: 'agents-4',
      category: 'agents',
      question: '여러 언어를 지원하나요?',
      answer: '현재 한국어와 영어를 지원하며, 향후 중국어, 일본어 등 다국어 서비스를 확대할 예정입니다.'
    },
    {
      id: 'agents-5',
      category: 'agents',
      question: '맞춤형 AI 에이전트 개발이 가능한가요?',
      answer: '기업 고객의 경우 특정 업무에 특화된 맞춤형 AI 에이전트 개발 서비스를 제공합니다. 별도 상담을 통해 견적을 안내해드립니다.'
    },
    {
      id: 'security-2',
      category: 'security',
      question: '개인정보는 어떻게 보호되나요?',
      answer: '개인정보보호법에 따라 엄격하게 관리되며, 제3자에게 제공되지 않습니다. 모든 직원은 보안서약서를 작성하고 정기적인 보안교육을 받습니다.'
    },
    {
      id: 'security-3',
      category: 'security',
      question: '업무 데이터가 AI 학습에 사용되나요?',
      answer: '고객의 업무 데이터는 AI 학습에 절대 사용되지 않습니다. 모든 데이터는 처리 완료 후 즉시 삭제되며, 이는 서비스 약관에 명시되어 있습니다.'
    },
    {
      id: 'account-2',
      category: 'account',
      question: '비밀번호를 잊어버렸어요',
      answer: '로그인 페이지에서 "비밀번호 찾기"를 클릭하시면 등록된 이메일로 재설정 링크를 보내드립니다.'
    },
    {
      id: 'account-3',
      category: 'account',
      question: '계정을 삭제하고 싶어요',
      answer: '계정 설정에서 "계정 삭제" 메뉴를 통해 삭제하실 수 있습니다. 삭제 시 모든 데이터가 영구적으로 삭제되니 신중히 결정해주세요.'
    },
    {
      id: 'general-5',
      category: 'general',
      question: '서비스 이용 시간에 제한이 있나요?',
      answer: '24시간 연중무휴로 서비스를 이용하실 수 있습니다. 단, 정기 점검이 있을 경우 사전에 공지해드립니다.'
    },
    {
      id: 'general-6',
      category: 'general',
      question: '동시에 여러 AI 에이전트를 사용할 수 있나요?',
      answer: '네, 동시에 여러 AI 에이전트를 사용하실 수 있습니다. 각각 독립적으로 작업이 처리되어 효율적으로 업무를 진행할 수 있습니다.'
    },
    {
      id: 'credits-6',
      category: 'credits',
      question: '크레딧 사용 내역을 확인할 수 있나요?',
      answer: '프로필 페이지의 "크레딧 내역" 탭에서 자세한 사용 내역을 확인하실 수 있습니다. 날짜별, 에이전트별로 필터링도 가능합니다.'
    },
    {
      id: 'agents-6',
      category: 'agents',
      question: '작업 결과물을 저장할 수 있나요?',
      answer: '모든 AI 에이전트의 결과물은 다운로드 또는 복사하여 저장하실 수 있습니다. 다양한 파일 형식(PDF, DOCX, PPTX 등)을 지원합니다.'
    },
    {
      id: 'security-4',
      category: 'security',
      question: '해킹이나 보안 사고가 발생하면 어떻게 하나요?',
      answer: '보안 사고 발생 시 즉시 관련 기관에 신고하고 고객에게 투명하게 공지합니다. 24시간 보안 모니터링 시스템을 운영하고 있습니다.'
    },
    {
      id: 'account-4',
      category: 'account',
      question: '이메일 주소를 변경할 수 있나요?',
      answer: '보안상의 이유로 이메일 주소 변경은 고객센터를 통해서만 가능합니다. 본인 확인 절차를 거친 후 변경해드립니다.'
    }
  ];

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 페이징 처리
  const totalPages = Math.ceil(filteredFAQ.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFAQ = filteredFAQ.slice(startIndex, endIndex);

  // 필터나 검색어 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedItems([]); // 페이지 변경 시 확장된 항목 초기화
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">자주 묻는 질문</h1>
          <p className="text-lg text-gray-600">
            AI 에이전트 허브에 대해 궁금한 것들을 빠르게 찾아보세요
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="질문을 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {/* 페이지 정보 표시 */}
          {filteredFAQ.length > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>총 {filteredFAQ.length}개의 질문</span>
              {totalPages > 1 && (
                <span>
                  {startIndex + 1}-{Math.min(endIndex, filteredFAQ.length)} / {filteredFAQ.length}
                </span>
              )}
            </div>
          )}

          {paginatedFAQ.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 키워드로 검색해보시거나 카테고리를 변경해보세요.</p>
            </div>
          ) : (
            paginatedFAQ.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 pr-4">
                      {item.question}
                    </h3>
                    {expandedItems.includes(item.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                </button>
                
                {expandedItems.includes(item.id) && (
                  <div className="px-6 pb-4">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        {filteredFAQ.length > 0 && totalPages > 1 && (
          <div className="mt-8">
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                이전
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="text-center mt-4 text-sm text-gray-500">
              페이지 {currentPage} / {totalPages}
            </div>
          </div>
        )}

        <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">더 궁금한 것이 있으신가요?</h3>
          <p className="text-gray-600 mb-6">
            원하는 답변을 찾지 못하셨다면 언제든지 문의해주세요. 빠르게 도움을 드리겠습니다.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => router.push('/contact')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              문의하기
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
