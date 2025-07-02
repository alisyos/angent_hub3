'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  HelpCircle,
  MessageCircle,
  CreditCard,
  Bot,
  Shield,
  Settings
} from 'lucide-react';

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
    }
  ];

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
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
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 키워드로 검색해보시거나 카테고리를 변경해보세요.</p>
            </div>
          ) : (
            filteredFAQ.map((item) => (
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

        <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">더 궁금한 것이 있으신가요?</h3>
          <p className="text-gray-600 mb-6">
            원하는 답변을 찾지 못하셨다면 언제든지 문의해주세요. 빠르게 도움을 드리겠습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              문의하기
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white font-medium">
              이메일 보내기
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
