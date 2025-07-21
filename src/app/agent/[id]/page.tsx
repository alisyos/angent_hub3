'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/contexts/ModalContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoritesSection from '@/components/FavoritesSection';
import { useFavorites } from '@/hooks/useFavorites';
import { aiAgents } from '@/data/agents';
import ScreenDefinitionButton from '@/components/ScreenDefinitionButton';
import { getScreenDefinition } from '@/data/screenDefinitions';
import { AIAgent, AgentInput, AgentCategory } from '@/types/agent';
import { ArrowLeft, Play, Coins, Upload, Download, Copy, Briefcase, Megaphone, PenTool, Grid3X3, ChevronLeft, ChevronRight, ChevronDown, ChevronRight as ChevronRightSmall } from 'lucide-react';

export default function AgentExecution() {
  const params = useParams();
  const router = useRouter();
  const { showModal } = useModal();
  const { loggedIn } = useFavorites();
  const [agent, setAgent] = useState<AIAgent | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AgentCategory | 'agentList' | string>('agentList');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<AgentCategory | 'agentList' | string>>(new Set(['agentList']));

  useEffect(() => {
    const agentId = params.id as string;
    const foundAgent = aiAgents.find(a => a.id === agentId);
    
    if (foundAgent) {
      setAgent(foundAgent);
      // Expand the current agent's category
      setExpandedCategories(prev => new Set([...prev, foundAgent.category]));
      // Initialize form data
      const initialData: Record<string, string | File> = {};
      foundAgent.inputs.forEach(input => {
        initialData[input.name] = '';
      });
      setFormData(initialData);
    }
  }, [params.id]);

  const handleInputChange = (inputName: string, value: string | File | undefined) => {
    setFormData(prev => ({
      ...prev,
      [inputName]: value
    }));
  };

  // Category logic
  const categoryCounts = {
    'agentList': aiAgents.filter(agent => agent.isActive).length,
    '일반사무': aiAgents.filter(agent => agent.isActive && agent.category === '일반사무').length,
    '마케팅/광고': aiAgents.filter(agent => agent.isActive && agent.category === '마케팅/광고').length,
    '콘텐츠 제작': aiAgents.filter(agent => agent.isActive && agent.category === '콘텐츠 제작').length,
  };

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

  const handleAgentNavigation = (targetAgent: AIAgent) => {
    router.push(`/agent/${targetAgent.id}`);
  };

  const handleAgentClick = (targetAgent: AIAgent) => {
    router.push(`/agent/${targetAgent.id}`);
  };

  const handleExecute = async () => {
    if (!agent) return;
    
    // Validate required inputs
    const missingInputs = agent.inputs
      .filter(input => input.required && !formData[input.name])
      .map(input => input.name);
    
    if (missingInputs.length > 0) {
      showModal({
        title: '입력 필요',
        message: `다음 필수 항목을 입력해주세요: ${missingInputs.join(', ')}`,
        type: 'warning'
      });
      return;
    }

    setIsExecuting(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const sampleResult = `
🎯 ${agent.name} 실행 결과

📝 입력 정보:
${Object.entries(formData)
  .filter(([, value]) => value)
  .map(([key, value]) => `• ${key}: ${value}`)
  .join('\n')}

✨ 생성된 결과:
${agent.outputs.map(output => `📄 ${output}`).join('\n')}

이것은 데모 결과입니다. 실제 AI 모델 연동 시 실제 결과가 표시됩니다.

---
💡 생성된 결과물을 다운로드하거나 복사하여 사용하실 수 있습니다.
      `;
      
      setResult(sampleResult);
      setIsExecuting(false);
    }, 3000);
  };

  const renderInput = (input: AgentInput) => {
    switch (input.type) {
      case 'select':
        return (
          <select
            value={formData[input.name] || ''}
            onChange={(e) => handleInputChange(input.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={input.required}
          >
            <option value="">선택하세요</option>
            {input.options?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-sm text-gray-600 mb-2">
              파일을 여기에 드래그하거나 클릭하여 업로드
            </div>
            <input
              type="file"
              onChange={(e) => handleInputChange(input.name, e.target.files?.[0])}
              className="hidden"
              id={`file-${input.name}`}
              required={input.required}
            />
            <label
              htmlFor={`file-${input.name}`}
              className="btn-secondary cursor-pointer"
            >
              파일 선택
            </label>
          </div>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={formData[input.name] || ''}
            onChange={(e) => handleInputChange(input.name, e.target.value)}
            placeholder={input.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={input.required}
          />
        );
      
      default: // text
        return (
          <textarea
            value={formData[input.name] || ''}
            onChange={(e) => handleInputChange(input.name, e.target.value)}
            placeholder={input.placeholder}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            required={input.required}
          />
        );
    }
  };

  if (!agent) {
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
                        onClick={() => {
                          if (isSidebarOpen) {
                            toggleCategory(category);
                            // 토글 방식: 이미 선택된 카테고리를 다시 클릭하면 전체로 돌아감
                            if (selectedCategory === category) {
                              setSelectedCategory('agentList');
                            } else {
                              setSelectedCategory(category);
                            }
                          } else {
                            if (selectedCategory === category) {
                              setSelectedCategory('agentList');
                            } else {
                              setSelectedCategory(category);
                            }
                          }
                        }}
                        className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 ${!isSidebarOpen ? 'justify-center' : ''} ${
                          selectedCategory === category ? 'bg-blue-50 text-blue-700' : ''
                        }`}
                        title={!isSidebarOpen ? getCategoryLabel(category) : ''}
                      >
                        {!isSidebarOpen ? (
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            selectedCategory === category ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                        ) : (
                          <Icon className={`w-4 h-4 mr-2 ${selectedCategory === category ? 'text-blue-600' : 'text-gray-600'}`} />
                        )}
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
                          {agents.map((agentItem) => (
                            <button
                              key={agentItem.id}
                              onClick={() => handleAgentNavigation(agentItem)}
                              className={`w-full flex items-center p-2 rounded-md hover:bg-blue-50 transition-all duration-200 text-left`}
                            >
                              <span className="text-sm mr-2">{agentItem.icon}</span>
                              <span className="text-sm text-gray-600 flex-1 truncate">
                                {agentItem.name}
                              </span>
                              <span className="text-xs text-amber-600 ml-1">
                                {agentItem.creditCost}
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
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                에이전트를 찾을 수 없습니다
              </h1>
              <button
                onClick={() => router.push('/')}
                className="btn-primary"
              >
                대시보드로 돌아가기
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                      onClick={() => {
                        if (isSidebarOpen) {
                          toggleCategory(category);
                          // 토글 방식: 이미 선택된 카테고리를 다시 클릭하면 전체로 돌아감
                          if (selectedCategory === category) {
                            setSelectedCategory('agentList');
                          } else {
                            setSelectedCategory(category);
                          }
                        } else {
                          if (selectedCategory === category) {
                            setSelectedCategory('agentList');
                          } else {
                            setSelectedCategory(category);
                          }
                        }
                      }}
                      className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 ${!isSidebarOpen ? 'justify-center' : ''} ${
                        selectedCategory === category ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                      title={!isSidebarOpen ? getCategoryLabel(category) : ''}
                    >
                      {!isSidebarOpen ? (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          selectedCategory === category ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      ) : (
                        <Icon className={`w-4 h-4 mr-2 ${selectedCategory === category ? 'text-blue-600' : 'text-gray-600'}`} />
                      )}
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
                        {agents.map((agentItem) => {
                          const isCurrentAgent = agent && agent.id === agentItem.id;
                          return (
                            <button
                              key={agentItem.id}
                              onClick={() => handleAgentNavigation(agentItem)}
                              className={`w-full flex items-center p-2 rounded-md transition-all duration-200 text-left ${
                                isCurrentAgent 
                                  ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                                  : 'hover:bg-blue-50'
                              }`}
                            >
                              <span className="text-sm mr-2">{agentItem.icon}</span>
                              <span className={`text-sm flex-1 truncate ${
                                isCurrentAgent ? 'font-medium' : 'text-gray-600'
                              }`}>
                                {agentItem.name}
                              </span>
                              <span className="text-xs text-amber-600 ml-1">
                                {agentItem.creditCost}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Favorites Section */}
            <FavoritesSection
              isSidebarOpen={isSidebarOpen}
              onAgentClick={handleAgentClick}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              expandedCategories={expandedCategories}
              onToggleExpand={(category: string) => {
                setExpandedCategories(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(category)) {
                    newSet.delete(category);
                  } else {
                    newSet.add(category);
                  }
                  return newSet;
                });
              }}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-none">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>대시보드로 돌아가기</span>
          </button>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl">{agent.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {agent.name}
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                {agent.description}
              </p>
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-600">
                  {agent.creditCost} 크레딧 필요
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">입력 정보</h2>
            
            <div className="space-y-6">
              {agent.inputs.map((input, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {input.name}
                    {input.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderInput(input)}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={handleExecute}
                disabled={isExecuting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {isExecuting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>AI가 작업 중입니다...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>에이전트 실행 ({agent.creditCost} 크레딧)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">실행 결과</h2>
            
            {result ? (
              <div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {result}
                  </pre>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>복사</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      const blob = new Blob([result], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${agent.name}_결과.txt`;
                      a.click();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>다운로드</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">⚡</div>
                <p>에이전트를 실행하면 결과가 여기에 표시됩니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* Expected Outputs */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">예상 출력 결과</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agent.outputs.map((output, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-900">{output}</span>
              </div>
            ))}
          </div>
        </div>
        </main>
      </div>
      
      <Footer />
      
      {/* 화면 정의 플로팅 버튼 */}
      {(() => {
        const screenDef = getScreenDefinition('/agent/[id]');
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