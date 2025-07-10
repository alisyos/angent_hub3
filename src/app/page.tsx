'use client';

import { useState, useMemo, useEffect } from 'react';
import { useModal } from '@/contexts/ModalContext';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
// import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AgentCard from '@/components/AgentCard';
import AdminPagination from '@/components/admin/AdminPagination';
import { aiAgents } from '@/data/agents';
import { AIAgent, AgentCategory } from '@/types/agent';
import { Search, Briefcase, Megaphone, PenTool, Grid3X3, ChevronLeft, ChevronRight, ChevronDown, ChevronRight as ChevronRightSmall } from 'lucide-react';

export default function Dashboard() {
  const { showModal } = useModal();
  // const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | 'agentList'>('agentList');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<AgentCategory | 'agentList'>>(new Set(['agentList']));
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Handle URL category parameter
  // useEffect(() => {
  //   const categoryParam = searchParams.get('category');
  //   if (categoryParam && ['일반사무', '마케팅/광고', '콘텐츠 제작'].includes(categoryParam)) {
  //     setSelectedCategory(categoryParam as AgentCategory);
  //     setExpandedCategories(prev => new Set([...prev, categoryParam as AgentCategory]));
  //   }
  // }, [searchParams]);

  // Filter agents based on category and search query
  const filteredAgents = useMemo(() => {
    let filtered = aiAgents.filter(agent => agent.isActive);

    // Category filter
    if (selectedCategory !== 'agentList') {
      filtered = filtered.filter(agent => agent.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query) ||
        agent.hashtags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAgents = filteredAgents.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<AgentCategory | 'agentList', number> = {
      'agentList': aiAgents.filter(agent => agent.isActive).length,
      '일반사무': 0,
      '마케팅/광고': 0,
      '콘텐츠 제작': 0,
    };

    aiAgents.filter(agent => agent.isActive).forEach(agent => {
      counts[agent.category]++;
    });

    return counts;
  }, []);

  const handleAgentClick = (agent: AIAgent) => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;
    
    // 로그인 상태 확인
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      showModal({
        title: '로그인 필요',
        message: 'AI 에이전트를 사용하려면 로그인이 필요합니다.',
        type: 'warning'
      });
      return;
    }

    try {
      const parsedUserInfo = JSON.parse(userInfo);
      if (!parsedUserInfo.isLoggedIn) {
        showModal({
          title: '로그인 필요',
          message: 'AI 에이전트를 사용하려면 로그인이 필요합니다.',
          type: 'warning'
        });
        return;
      }
    } catch {
      showModal({
        title: '로그인 필요',
        message: 'AI 에이전트를 사용하려면 로그인이 필요합니다.',
        type: 'warning'
      });
      return;
    }

    // 로그인된 상태라면 에이전트 페이지로 이동
    window.location.href = `/agent/${agent.id}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색 로직은 이미 searchQuery state로 처리됨
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Category icons and colors
  const categoryIcons = {
    agentList: Grid3X3,
    '일반사무': Briefcase,
    '마케팅/광고': Megaphone,
    '콘텐츠 제작': PenTool,
  };

  // const categoryColors = {
  //   agentList: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
  //   '일반사무': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  //   '마케팅/광고': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  //   '콘텐츠 제작': 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  // };

  // const selectedCategoryColors = {
  //   agentList: 'bg-gray-600 text-white border-gray-600',
  //   '일반사무': 'bg-blue-600 text-white border-blue-600',
  //   '마케팅/광고': 'bg-green-600 text-white border-green-600',
  //   '콘텐츠 제작': 'bg-purple-600 text-white border-purple-600',
  // };

  const categories: (AgentCategory | 'agentList')[] = ['agentList', '일반사무', '마케팅/광고', '콘텐츠 제작'];

  const getCategoryLabel = (category: AgentCategory | 'agentList') => {
    return category === 'agentList' ? 'Agent List' : category;
  };

  const toggleCategory = (category: AgentCategory | 'agentList') => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const getAgentsByCategory = (category: AgentCategory | 'agentList') => {
    if (category === 'agentList') {
      return aiAgents.filter(agent => agent.isActive);
    }
    return aiAgents.filter(agent => agent.isActive && agent.category === category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-sm border-r border-gray-200 min-h-screen transition-all duration-300 relative`}>
          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 z-10"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>

          <div className="p-6">
            {isSidebarOpen && (
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center justify-between">
                <span>Agent List</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                  {categoryCounts.agentList}개
                </span>
              </h2>
            )}
            
            <nav className="space-y-1">
              {categories.filter(category => category !== 'agentList').map((category) => {
                const Icon = categoryIcons[category];
                const isExpanded = expandedCategories.has(category);
                const agents = getAgentsByCategory(category);
                
                return (
                  <div key={category}>
                    {/* Category Header */}
                    <button
                      onClick={() => isSidebarOpen ? toggleCategory(category) : setSelectedCategory(category)}
                      className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 ${!isSidebarOpen ? 'justify-center' : ''}`}
                      title={!isSidebarOpen ? getCategoryLabel(category) : ''}
                    >
                      <Icon className={`w-4 h-4 ${isSidebarOpen ? 'mr-2' : ''} text-gray-600`} />
                      {isSidebarOpen && (
                        <>
                          <span className="font-medium flex-1 text-left text-gray-700">
                            {getCategoryLabel(category)}
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium mr-1">
                            {categoryCounts[category]}개
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronRightSmall className="w-4 h-4 text-gray-400" />
                          )}
                        </>
                      )}
                    </button>

                    {/* Agent List */}
                    {isSidebarOpen && isExpanded && (
                      <div className="ml-6 space-y-1 mt-1">
                        {agents.map((agent) => (
                          <button
                            key={agent.id}
                            onClick={() => handleAgentClick(agent)}
                            className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 transition-all duration-200 text-left"
                          >
                            <span className="text-sm mr-2">{agent.icon}</span>
                            <span className="text-sm text-gray-600 flex-1 truncate">
                              {agent.name}
                            </span>
                            <span className="text-xs text-amber-600 ml-1">
                              {agent.creditCost}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="gradient-bg rounded-2xl p-8 text-white mb-8">
              <h1 className="text-4xl font-bold mb-8">
                AI 에이전트와 함께 업무를 혁신하세요
              </h1>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="원하는 AI 에이전트를 검색해보세요..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 bg-white border-0 rounded-xl focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-gray-500 shadow-lg"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {(searchQuery || filteredAgents.length > 0) && (
            <div className="mb-6 flex items-center justify-between">
              <div>
                {searchQuery ? (
                  <p className="text-gray-600">
                    <span className="font-semibold">&quot;{searchQuery}&quot;</span> 검색 결과: {filteredAgents.length}개 에이전트
                  </p>
                ) : (
                  <p className="text-gray-600">
                    총 {filteredAgents.length}개의 에이전트
                  </p>
                )}
              </div>
              {filteredAgents.length > 0 && totalPages > 1 && (
                <div className="text-sm text-gray-500">
                  {startIndex + 1}-{Math.min(endIndex, filteredAgents.length)} / {filteredAgents.length}
                </div>
              )}
            </div>
          )}

          {/* Agents Grid */}
          {paginatedAgents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedAgents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onClick={handleAgentClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredAgents.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={(items) => {
                  setItemsPerPage(items);
                  setCurrentPage(1);
                }}
                className="mt-8"
              />
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {filteredAgents.length === 0 ? '검색 결과가 없습니다' : '에이전트가 없습니다'}
              </h3>
              <p className="text-gray-500">
                다른 키워드로 검색하거나 카테고리를 변경해보세요.
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 btn-primary"
                >
                  검색 초기화
                </button>
              )}
            </div>
          )}

        </main>
      </div>
      
      <Footer />
    </div>
  );
}
