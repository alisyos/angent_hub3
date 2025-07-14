'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminStats from '@/components/admin/AdminStats';
import AdminFilter from '@/components/admin/AdminFilter';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import AdminPagination from '@/components/admin/AdminPagination';
import { aiAgents } from '@/data/agents';
import { AIAgent } from '@/types/agent';
import { AgentAdmin, AgentSettings } from '@/types/admin';
import { 
  Bot, 
  Settings, 
  Play, 
  Pause, 
  BarChart3, 
  AlertTriangle,
  Clock,
  Activity,
  Users,
  DollarSign,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  Save,
  Edit,
  ArrowUp,
  ArrowDown,
  Monitor,
  ArrowUpDown
} from 'lucide-react';

// 아이콘 목록 (20~30개)
const availableIcons = [
  '📝', '📧', '📊', '🔍', '🎨', '🎉', '✍️', '📈', '💡', '🎙️',
  '📋', '💼', '📱', '🖥️', '⚡', '🚀', '🎯', '📌', '🔧', '⚙️',
  '📦', '🎭', '🎪', '🎨', '🎬', '📷', '🎵', '🎼', '🎸', '🎮'
];

// AgentAdmin 타입으로 변환하는 헬퍼 함수
const convertToAgentAdmin = (agent: AIAgent, index: number): AgentAdmin => ({
  ...agent,
  order: index + 1,
  statistics: {
    totalUsage: Math.floor(Math.random() * 2000) + 500,
    successRate: Math.random() * 20 + 80, // 80-100%
    averageProcessingTime: Math.random() * 5 + 1, // 1-6초
    revenue: Math.floor(Math.random() * 200000) + 50000,
    userRating: Math.random() * 1 + 4, // 4-5점
    monthlyUsage: Array.from({ length: 12 }, () => Math.floor(Math.random() * 200) + 50),
    errorCount: Math.floor(Math.random() * 50)
  },
  settings: {
    isEnabled: agent.isActive,
    maxConcurrentUsers: Math.floor(Math.random() * 50) + 10,
    maintenanceMode: false,
    apiKeys: ['key_' + Math.random().toString(36).substr(2, 9)],
    rateLimit: Math.floor(Math.random() * 100) + 50,
    timeout: Math.floor(Math.random() * 30) + 30
  },
  logs: Array.from({ length: 20 }, (_, i) => ({
    id: `log_${i}`,
    agentId: agent.id,
    userId: `user_${Math.floor(Math.random() * 100)}`,
    status: Math.random() > 0.1 ? 'success' : Math.random() > 0.5 ? 'error' : 'timeout',
    processingTime: Math.random() * 10 + 1,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    errorMessage: Math.random() > 0.8 ? 'API rate limit exceeded' : undefined,
    inputSize: Math.floor(Math.random() * 10000) + 1000,
    outputSize: Math.floor(Math.random() * 50000) + 5000
  }))
});

export default function AdminAgents() {
  const [agentAdmins, setAgentAdmins] = useState<AgentAdmin[]>(
    aiAgents.map(convertToAgentAdmin).sort((a, b) => (a.order || 0) - (b.order || 0))
  );
  const [filteredAgents, setFilteredAgents] = useState<AgentAdmin[]>(agentAdmins);
  const [selectedAgent, setSelectedAgent] = useState<AgentAdmin | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({
    period: '7days'
  });
  const [searchValue, setSearchValue] = useState('');
  const [editingSettings, setEditingSettings] = useState<AgentSettings>({
    isEnabled: false,
    maxConcurrentUsers: 0,
    maintenanceMode: false,
    apiKeys: [],
    rateLimit: 0,
    timeout: 0
  });
  
  const [editingAgent, setEditingAgent] = useState<Partial<AgentAdmin>>({});
  
  // 정렬 상태
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({
    key: 'order',
    direction: 'asc'
  });
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    agent: AgentAdmin | null;
    type: 'toggle' | 'maintenance' | 'restart';
  }>({
    isOpen: false,
    agent: null,
    type: 'toggle'
  });

  // 기간 선택 필터 상태
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    period: '7days' // 'all', '7days', '30days', 'custom'
  });

  // 커스텀 이벤트 리스너 등록
  useEffect(() => {
    const handleDateFilterChange = (event: any) => {
      const { field, value } = event.detail;
      setDateFilter(prev => ({
        ...prev,
        [field]: value
      }));
    };

    document.addEventListener('dateFilterChange', handleDateFilterChange);
    return () => {
      document.removeEventListener('dateFilterChange', handleDateFilterChange);
    };
  }, []);

  // agentAdmins가 변경될 때 필터링 재적용
  useEffect(() => {
    applyFilters();
  }, [agentAdmins, searchValue, filterValues, sortConfig]);

  // 기간별 사용량 계산 함수
  const calculatePeriodUsage = (agent: AgentAdmin) => {
    if (!agent.logs) return { usage: 0, credits: 0, success: 0, error: 0 };

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (dateFilter.period === '7days') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (dateFilter.period === '30days') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    } else if (dateFilter.period === 'custom') {
      if (dateFilter.startDate) startDate = new Date(dateFilter.startDate);
      if (dateFilter.endDate) endDate = new Date(dateFilter.endDate);
    }

    // 전체 기간이 아닌 경우에만 날짜 필터링

    // 기간 내 사용량 계산
    let usage = 0;
    let success = 0;
    let error = 0;

    agent.logs.forEach(log => {
      const logDate = new Date(log.timestamp);
      
      // 시작일 체크
      if (startDate && logDate < startDate) return;
      
      // 종료일 체크
      if (endDate && logDate > endDate) return;
      
      usage++;
      if (log.status === 'success') success++;
      if (log.status === 'error' || log.status === 'timeout') error++; // 타임아웃을 오류로 포함
    });

    return {
      usage,
      credits: success * agent.creditCost, // 성공건에 대해서만 크레딧 계산
      success,
      error
    };
  };

  // 필터 정의
  const filterOptions = [
    {
      key: 'category',
      label: '카테고리',
      type: 'select' as const,
      options: [
        { value: '일반사무', label: '일반사무' },
        { value: '마케팅/광고', label: '마케팅/광고' },
        { value: '콘텐츠 제작', label: '콘텐츠 제작' }
      ]
    },
    {
      key: 'status',
      label: '상태',
      type: 'select' as const,
      options: [
        { value: 'enabled', label: '활성' },
        { value: 'disabled', label: '비활성' }
      ]
    },
    {
      key: 'period',
      label: '기간 선택',
      type: 'select' as const,
      options: [
        { value: '7days', label: '최근 7일' },
        { value: '30days', label: '최근 30일' },
        { value: 'custom', label: '직접 선택' }
      ]
    }
  ];

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'agent',
      label: '에이전트',
      sortable: true,
      render: (agent: AgentAdmin) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              agent?.settings?.isEnabled
                ? 'bg-green-100'
                : 'bg-red-100'
            }`}>
              {agent?.customImage ? (
                <img
                  src={agent.customImage}
                  alt={agent.name}
                  className="w-8 h-8 rounded object-cover"
                />
              ) : (
                <span className="text-xl">
                  {agent?.icon || '📝'}
                </span>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {agent?.name || '에이전트명 없음'}
            </p>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-xs text-gray-400">
                {agent?.creditCost || 0} 크레딧
              </span>
              {getCategoryBadge(agent?.category || '일반사무')}
            </div>
            {/* 해시태그 */}
            {agent?.hashtags && agent.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {agent.hashtags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
                {agent.hashtags.length > 3 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                    +{agent.hashtags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: '상태',
      sortable: true,
      render: (agent: AgentAdmin) => getStatusBadge(agent?.settings || { isEnabled: false, maintenanceMode: false })
    },
    {
      key: 'order',
      label: '노출 순서',
      sortable: true,
      render: (agent: AgentAdmin) => (
        <div className="text-center">
          <span className="text-sm font-medium text-gray-900">
            {agent?.order || 0}
          </span>
        </div>
      )
    },
    {
      key: 'performance',
      label: '성능 지표',
      sortable: true,
      render: (agent: AgentAdmin) => {
        const periodData = calculatePeriodUsage(agent);
        const totalExecutions = periodData.success + periodData.error;
        const successRate = totalExecutions > 0 ? (periodData.success / totalExecutions) * 100 : 0;
        
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">성공</span>
              <span className="text-xs font-medium text-green-600">
                {periodData.success.toLocaleString()}건
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">오류</span>
              <span className="text-xs font-medium text-red-600">
                {periodData.error.toLocaleString()}건
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">성공률</span>
              <span className={`text-xs font-medium ${
                successRate >= 95 ? 'text-green-600' :
                successRate >= 90 ? 'text-blue-600' :
                successRate >= 85 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {successRate.toFixed(1)}%
              </span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'usage',
      label: '사용량',
      sortable: true,
      render: (agent: AgentAdmin) => {
        const periodData = calculatePeriodUsage(agent);
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">사용</span>
              <span className="text-xs font-medium text-gray-900">
                {periodData.usage.toLocaleString()}회
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">크레딧</span>
              <span className="text-xs font-medium text-blue-600">
                {periodData.credits.toLocaleString()}
              </span>
            </div>
          </div>
        );
      }
    },

    {
      key: 'actions',
      label: '작업',
      render: (agent: AgentAdmin) => (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => agent && handleEditAgent(agent)}
            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
            title="수정"
            disabled={!agent}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => agent && handleManageAgent(agent)}
            className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
            title="관리"
            disabled={!agent}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => agent && handleLogsAgent(agent)}
            className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded"
            title="로그"
            disabled={!agent}
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => agent && handleMoveUp(agent)}
            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
            title="순서올리기"
            disabled={!agent}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => agent && handleMoveDown(agent)}
            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
            title="순서내리기"
            disabled={!agent}
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // 카테고리 배지
  const getCategoryBadge = (category: string) => {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
        {category}
      </span>
    );
  };

  // 상태 배지
  const getStatusBadge = (settings: AgentSettings) => {
    if (settings?.isEnabled) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          활성
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          비활성
        </span>
      );
    }
  };

  // 필터링 로직
  const applyFilters = () => {
    let filtered = [...agentAdmins];

    // 검색어 필터링
    if (searchValue) {
      filtered = filtered.filter(agent =>
        (agent?.name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (agent?.description || '').toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // 기타 필터링
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== 'all') {
        if (key === 'status') {
          if (value === 'enabled') {
            filtered = filtered.filter(agent => agent?.settings?.isEnabled && !agent?.settings?.maintenanceMode);
          } else if (value === 'disabled') {
            filtered = filtered.filter(agent => !agent?.settings?.isEnabled);
          }

        } else if (key !== 'period') {
          filtered = filtered.filter(agent => {
            const agentValue = agent?.[key as keyof AgentAdmin];
            return agentValue === value;
          });
        }
      }
    });

    // 정렬 적용
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'agent':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          // 활성(1), 비활성(0)으로 정렬
          aValue = a?.settings?.isEnabled ? 1 : 0;
          bValue = b?.settings?.isEnabled ? 1 : 0;
          break;
        case 'order':
          aValue = a.order || 0;
          bValue = b.order || 0;
          break;
        case 'usage':
          const aPeriodData = calculatePeriodUsage(a);
          const bPeriodData = calculatePeriodUsage(b);
          aValue = aPeriodData.usage;
          bValue = bPeriodData.usage;
          break;
        case 'performance':
          const aPerformanceData = calculatePeriodUsage(a);
          const bPerformanceData = calculatePeriodUsage(b);
          const aTotalExecutions = aPerformanceData.success + aPerformanceData.error;
          const bTotalExecutions = bPerformanceData.success + bPerformanceData.error;
          const aSuccessRate = aTotalExecutions > 0 ? (aPerformanceData.success / aTotalExecutions) * 100 : 0;
          const bSuccessRate = bTotalExecutions > 0 ? (bPerformanceData.success / bTotalExecutions) * 100 : 0;
          aValue = aSuccessRate;
          bValue = bSuccessRate;
          break;
        default:
          // 기본 정렬: 순서
          aValue = a.order || 0;
          bValue = b.order || 0;
          break;
      }

      if (sortConfig.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredAgents(filtered);
    setCurrentPage(1);
  };

  // 정렬 핸들러
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 이벤트 핸들러
  const handleFilterChange = (key: string, value: string | string[]) => {
    const newFilterValues = { ...filterValues, [key]: value };
    setFilterValues(newFilterValues);
    
    // 기간 선택 시 dateFilter 업데이트
    if (key === 'period') {
      setDateFilter(prev => ({
        ...prev,
        period: value as string
      }));
    }
    
    applyFilters();
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    applyFilters();
  };

  const handleViewAgent = (agent: AgentAdmin) => {
    setSelectedAgent(agent);
    setShowDetailModal(true);
  };

  const handleEditAgent = (agent: AgentAdmin) => {
    setSelectedAgent(agent);
    setEditingAgent({
      name: agent.name,
      description: agent.description,
      category: agent.category,
      creditCost: agent.creditCost,
      icon: agent.icon,
      hashtags: [...(agent.hashtags || [])],
      customImage: agent.customImage,
      settings: { ...agent.settings }
    });
    setShowEditModal(true);
  };

  const handleManageAgent = (agent: AgentAdmin) => {
    setSelectedAgent(agent);
    setShowManageModal(true);
  };

  const handleSettingsAgent = (agent: AgentAdmin) => {
    setSelectedAgent(agent);
    setEditingSettings({ ...agent?.settings || {} });
    setShowSettingsModal(true);
  };

  const handleLogsAgent = (agent: AgentAdmin) => {
    setSelectedAgent(agent);
    setShowLogsModal(true);
  };

  const handleMoveUp = (agent: AgentAdmin) => {
    const currentOrder = agent.order || 0;
    const targetOrder = currentOrder - 1;
    
    if (targetOrder < 1) return; // 첫 번째 항목이면 이동 불가
    
    const targetAgent = agentAdmins.find(a => a.order === targetOrder);
    if (!targetAgent) return;

    setAgentAdmins(prev => prev.map(a => {
      if (a.id === agent.id) {
        return { ...a, order: targetOrder };
      }
      if (a.id === targetAgent.id) {
        return { ...a, order: currentOrder };
      }
      return a;
    }));

    alert(`${agent.name}의 순서가 올라갔습니다.`);
  };

  const handleMoveDown = (agent: AgentAdmin) => {
    const currentOrder = agent.order || 0;
    const targetOrder = currentOrder + 1;
    
    const maxOrder = Math.max(...agentAdmins.map(a => a.order || 0));
    if (targetOrder > maxOrder) return; // 마지막 항목이면 이동 불가
    
    const targetAgent = agentAdmins.find(a => a.order === targetOrder);
    if (!targetAgent) return;

    setAgentAdmins(prev => prev.map(a => {
      if (a.id === agent.id) {
        return { ...a, order: targetOrder };
      }
      if (a.id === targetAgent.id) {
        return { ...a, order: currentOrder };
      }
      return a;
    }));

    alert(`${agent.name}의 순서가 내려갔습니다.`);
  };

  const handleToggleAgent = (agent: AgentAdmin) => {
    setConfirmModal({
      isOpen: true,
      agent,
      type: 'toggle'
    });
  };

  const handleRestartAgent = (agent: AgentAdmin) => {
    setConfirmModal({
      isOpen: true,
      agent,
      type: 'restart'
    });
  };

  const handleSaveSettings = () => {
    if (!selectedAgent) return;

    // 설정 저장 로직 (실제로는 API 호출)
    console.log('Settings saved:', editingSettings);
    setShowSettingsModal(false);
    alert('설정이 저장되었습니다.');
  };

  const handleConfirmAction = () => {
    if (!confirmModal.agent) return;

    const action = confirmModal.type;
    console.log(`${action} action for agent:`, confirmModal.agent.id);

    if (action === 'toggle') {
      alert(`에이전트가 ${confirmModal.agent?.settings?.isEnabled ? '비활성화' : '활성화'}되었습니다.`);
    } else if (action === 'restart') {
      alert('에이전트가 재시작되었습니다.');
    }

    setConfirmModal({ isOpen: false, agent: null, type: 'toggle' });
  };

  // 통계 계산
  const totalAgents = agentAdmins.length;
  const activeAgents = agentAdmins.filter(a => a?.settings?.isEnabled).length;
  const inactiveAgents = agentAdmins.filter(a => !a?.settings?.isEnabled).length;
  
  // 기간별 총 사용량 계산
  const totalPeriodUsage = agentAdmins.reduce((sum, agent) => {
    const periodData = calculatePeriodUsage(agent);
    return {
      usage: sum.usage + periodData.usage,
      credits: sum.credits + periodData.credits,
      success: sum.success + periodData.success,
      error: sum.error + periodData.error
    };
  }, { usage: 0, credits: 0, success: 0, error: 0 });
  
  const totalSuccessRate = totalPeriodUsage.usage > 0 
    ? (totalPeriodUsage.success / totalPeriodUsage.usage) * 100 
    : 0;

  // 페이지네이션
  const totalItems = filteredAgents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAgents = filteredAgents.slice(startIndex, endIndex);

  return (
    <AdminLayout
      title="AI 에이전트 관리"
      description="AI 에이전트들의 성능을 모니터링하고 설정을 관리하세요"
      hideTimePeriod={true}
    >

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 에이전트 박스 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">에이전트</h3>
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">총 에이전트</span>
                <span className="text-lg font-bold text-gray-900">{totalAgents}개</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">활성</span>
                <span className="text-lg font-bold text-green-600">{activeAgents}개</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">비활성</span>
                <span className="text-lg font-bold text-red-600">{inactiveAgents}개</span>
              </div>
            </div>
          </div>

          {/* 총 사용량 박스 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">총 사용량</h3>
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">사용</span>
                <span className="text-lg font-bold text-gray-900">{totalPeriodUsage.usage.toLocaleString()}회</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">크레딧</span>
                <span className="text-lg font-bold text-blue-600">{totalPeriodUsage.credits.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 성능지표 박스 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">성능지표</h3>
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">성공</span>
                <span className="text-lg font-bold text-green-600">{totalPeriodUsage.success.toLocaleString()}건</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">오류</span>
                <span className="text-lg font-bold text-red-600">{totalPeriodUsage.error.toLocaleString()}건</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">성공률</span>
                <span className="text-lg font-bold text-purple-600">{totalSuccessRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 */}
        <AdminFilter
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder="에이전트명, 설명으로 검색..."
          filters={filterOptions}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
        />

        {/* 에이전트 테이블 */}
        <AdminTable
          columns={columns}
          data={paginatedAgents}
          emptyMessage="에이전트가 없습니다"
          sortBy={sortConfig.key}
          sortOrder={sortConfig.direction}
          onSort={handleSort}
        />

        {/* 페이지네이션 */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(items) => {
            setItemsPerPage(items);
            setCurrentPage(1);
          }}
        />

        {/* 성능 대시보드 모달 */}
        <AdminModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="에이전트 성능 대시보드"
          size="xl"
        >
          {selectedAgent && <AgentDashboardModal agent={selectedAgent} />}
        </AdminModal>

        {/* 설정 관리 모달 */}
        <AdminModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          title="에이전트 설정 관리"
          size="lg"
        >
          {selectedAgent && (
            <AgentSettingsModal
              agent={selectedAgent}
              settings={editingSettings}
              onChange={setEditingSettings}
              onSave={handleSaveSettings}
              onCancel={() => setShowSettingsModal(false)}
            />
          )}
        </AdminModal>

        {/* 로그 확인 모달 */}
        <AdminModal
          isOpen={showLogsModal}
          onClose={() => setShowLogsModal(false)}
          title="에이전트 로그"
          size="xl"
        >
          {selectedAgent && <AgentLogsModal agent={selectedAgent} />}
        </AdminModal>

        {/* 에이전트 수정 모달 */}
        <AdminModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="에이전트 수정"
          size="md"
        >
          {selectedAgent && (
            <AgentEditModal
              agent={selectedAgent}
              editingAgent={editingAgent}
              onChange={setEditingAgent}
              onSave={() => {
                console.log('Agent updated:', editingAgent);
                setShowEditModal(false);
                alert('에이전트가 수정되었습니다.');
              }}
              onCancel={() => setShowEditModal(false)}
            />
          )}
        </AdminModal>

        {/* 에이전트 관리 모달 */}
        <AdminModal
          isOpen={showManageModal}
          onClose={() => setShowManageModal(false)}
          title="에이전트 관리"
          size="lg"
        >
          {selectedAgent && (
            <AgentManageModal
              agent={selectedAgent}
              onClose={() => setShowManageModal(false)}
            />
          )}
        </AdminModal>

        {/* 확인 모달 */}
        <AdminModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, agent: null, type: 'toggle' })}
          title={
            confirmModal.type === 'toggle'
              ? (confirmModal.agent?.settings.isEnabled ? '에이전트 비활성화' : '에이전트 활성화')
              : '에이전트 재시작'
          }
          size="sm"
        >
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {confirmModal.type === 'toggle'
                ? `${confirmModal.agent?.name} 에이전트를 ${confirmModal.agent?.settings.isEnabled ? '비활성화' : '활성화'}하시겠습니까?`
                : `${confirmModal.agent?.name} 에이전트를 재시작하시겠습니까?`
              }
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, agent: null, type: 'toggle' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md ${
                  confirmModal.type === 'restart' || !confirmModal.agent?.settings.isEnabled
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {confirmModal.type === 'toggle'
                  ? (confirmModal.agent?.settings.isEnabled ? '비활성화' : '활성화')
                  : '재시작'
                }
            </button>
          </div>
        </div>
        </AdminModal>
    </AdminLayout>
  );
}

// 에이전트 대시보드 모달 컴포넌트
function AgentDashboardModal({ agent }: { agent: AgentAdmin }) {
  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
              <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">에이전트 정보</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{agent.statistics.totalUsage.toLocaleString()}</div>
            <div className="text-sm text-blue-600">총 사용량</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{agent.statistics.successRate.toFixed(1)}%</div>
            <div className="text-sm text-green-600">성공률</div>
              </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{(agent.statistics.revenue / 1000).toFixed(0)}K원</div>
            <div className="text-sm text-purple-600">월 수익</div>
              </div>
            </div>
          </div>
          
      {/* 성능 지표 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">성능 지표</h3>
        <div className="grid grid-cols-2 gap-6">
              <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">처리 시간</h4>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-900">평균 {agent.statistics.averageProcessingTime.toFixed(1)}초</span>
            </div>
          </div>
              <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">사용자 평점</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-900">{agent.statistics.userRating.toFixed(1)} / 5.0</span>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < Math.floor(agent.statistics.userRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
              <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">오류 발생</h4>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-900">{agent.statistics.errorCount}건</span>
              </div>
              </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">동시 사용자</h4>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-900">최대 {agent.settings.maxConcurrentUsers}명</span>
            </div>
          </div>
        </div>
          </div>
          
      {/* 월별 사용량 차트 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">월별 사용량 추이</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-around p-4">
          {agent.statistics.monthlyUsage.map((usage, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-6 bg-blue-500 rounded-t"
                style={{ height: `${(usage / Math.max(...agent.statistics.monthlyUsage)) * 200}px` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">{index + 1}월</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 에이전트 설정 모달 컴포넌트
function AgentSettingsModal({ 
  agent, 
  settings, 
  onChange, 
  onSave, 
  onCancel 
}: {
  agent: AgentAdmin;
  settings: AgentSettings;
  onChange: (settings: AgentSettings) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
                  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.isEnabled || false}
              onChange={(e) => onChange({ ...settings, isEnabled: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">에이전트 활성화</span>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.maintenanceMode || false}
              onChange={(e) => onChange({ ...settings, maintenanceMode: e.target.checked })}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">점검 모드</span>
          </label>
                            </div>
                          </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            최대 동시 사용자
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={settings.maxConcurrentUsers || 10}
            onChange={(e) => onChange({ ...settings, maxConcurrentUsers: parseInt(e.target.value) || 10 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            요청 한도 (분당)
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={settings.rateLimit || 60}
            onChange={(e) => onChange({ ...settings, rateLimit: parseInt(e.target.value) || 60 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
                          </div>
                        </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          타임아웃 (초)
        </label>
        <input
          type="number"
          min="10"
          max="300"
          value={settings.timeout || 60}
          onChange={(e) => onChange({ ...settings, timeout: parseInt(e.target.value) || 60 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
                        </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          API 키
        </label>
        <div className="space-y-2">
          {settings.apiKeys?.map((key: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={key}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
              <button
                onClick={() => {
                  const newKeys = [...settings.apiKeys];
                  newKeys[index] = 'key_' + Math.random().toString(36).substr(2, 9);
                  onChange({ ...settings, apiKeys: newKeys });
                }}
                className="px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
              >
                재생성
                          </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          취소
                          </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          저장
                          </button>
                        </div>
    </div>
  );
}

// 에이전트 로그 모달 컴포넌트
function AgentLogsModal({ agent }: { agent: AgentAdmin }) {
  // 사용하지 않는 agent 변수 참조 추가
  console.log('Agent logs for:', agent.name);
  const [logFilter, setLogFilter] = useState('all');

  // 기간별 데이터 계산
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    period: '7days'
  });

  const calculatePeriodData = () => {
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (dateFilter.period === '7days') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (dateFilter.period === '30days') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    } else if (dateFilter.period === 'custom') {
      if (dateFilter.startDate) startDate = new Date(dateFilter.startDate);
      if (dateFilter.endDate) endDate = new Date(dateFilter.endDate);
    }

    let periodLogs = [...agent.logs];
    
    // 기간 필터링 적용
    periodLogs = agent.logs.filter(log => {
      const logDate = new Date(log.timestamp);
      if (startDate && logDate < startDate) return false;
      if (endDate && logDate > endDate) return false;
      return true;
    });

    const success = periodLogs.filter(log => log.status === 'success').length;
    const error = periodLogs.filter(log => log.status === 'error' || log.status === 'timeout').length;
    const total = periodLogs.length;
    const successRate = total > 0 ? (success / total) * 100 : 0;

    return {
      usage: total,
      credits: success * agent.creditCost, // 성공건에 대해서만 크레딧 계산
      success,
      error,
      successRate,
      logs: periodLogs
    };
  };

  const periodData = calculatePeriodData();

  const filteredLogs = periodData.logs.filter(log => {
    if (logFilter === 'all') return true;
    if (logFilter === 'error') {
      return log.status === 'error' || log.status === 'timeout';
    }
    return log.status === logFilter;
  });

  return (
    <div className="space-y-6">
      {/* 기간 선택 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">에이전트 로그</h3>
        <div className="flex items-center space-x-4">
          <select
            value={dateFilter.period}
            onChange={(e) => setDateFilter(prev => ({ ...prev, period: e.target.value }))}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">최근 7일</option>
            <option value="30days">최근 30일</option>
            <option value="custom">직접 선택</option>
          </select>
          {dateFilter.period === 'custom' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md"
              />
              <span className="text-sm text-gray-500">~</span>
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{periodData.usage.toLocaleString()}</div>
          <div className="text-sm text-blue-600">사용</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{periodData.credits.toLocaleString()}</div>
          <div className="text-sm text-green-600">크레딧</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{periodData.success.toLocaleString()}</div>
          <div className="text-sm text-green-600">성공</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{periodData.error.toLocaleString()}</div>
          <div className="text-sm text-red-600">오류</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{periodData.successRate.toFixed(1)}%</div>
          <div className="text-sm text-purple-600">성공률</div>
        </div>
      </div>

      {/* 로그 필터 */}
      <div className="flex items-center justify-between">
        <h4 className="text-md font-medium text-gray-900">실행 로그</h4>
        <select
          value={logFilter}
          onChange={(e) => setLogFilter(e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">전체</option>
          <option value="success">성공</option>
          <option value="error">오류</option>
        </select>
      </div>

      {/* 로그 목록 */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredLogs.map((log) => (
          <div key={log.id} className={`p-3 rounded-lg border ${
            log.status === 'success' ? 'bg-green-50 border-green-200' :
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {log.status === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm font-medium text-gray-900">
                  User: {log.userId}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleString('ko-KR')}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>처리 시간: {log.processingTime.toFixed(2)}초</div>
              <div>입력 크기: {(log.inputSize / 1024).toFixed(1)}KB</div>
              <div>출력 크기: {(log.outputSize / 1024).toFixed(1)}KB</div>
              {log.errorMessage && (
                <div className="text-red-600 font-medium">오류: {log.errorMessage}</div>
              )}
            </div>
          </div>
        ))}
        </div>
    </div>
  );
}

// 에이전트 수정 모달 컴포넌트
function AgentEditModal({
  agent,
  editingAgent,
  onChange,
  onSave,
  onCancel
}: {
  agent: AgentAdmin;
  editingAgent: Partial<AgentAdmin>;
  onChange: (agent: Partial<AgentAdmin>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            에이전트명
          </label>
          <input
            type="text"
            value={editingAgent.name || ''}
            onChange={(e) => onChange({ ...editingAgent, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="에이전트명을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            설명
          </label>
          <textarea
            value={editingAgent.description || ''}
            onChange={(e) => onChange({ ...editingAgent, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="에이전트 설명을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            아이콘
          </label>
          
          {/* 아이콘 선택 방식 */}
          <div className="mb-3">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="iconType"
                  value="emoji"
                  checked={!editingAgent.customImage}
                  onChange={() => onChange({ ...editingAgent, customImage: undefined })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">이모지 아이콘</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="iconType"
                  value="image"
                  checked={!!editingAgent.customImage}
                  onChange={() => onChange({ ...editingAgent, icon: '', customImage: '' })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">커스텀 이미지</span>
              </label>
            </div>
          </div>

          {/* 이모지 아이콘 선택 */}
          {!editingAgent.customImage && (
            <div>
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">아이콘을 선택하세요:</p>
                <div className="grid grid-cols-10 gap-2 p-3 border border-gray-300 rounded-md max-h-32 overflow-y-auto">
                  {availableIcons.map((icon, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => onChange({ ...editingAgent, icon })}
                      className={`w-8 h-8 flex items-center justify-center rounded border-2 hover:border-blue-500 transition-colors ${
                        editingAgent.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <span className="text-lg">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">또는 직접 입력:</p>
                <input
                  type="text"
                  value={editingAgent.icon || ''}
                  onChange={(e) => onChange({ ...editingAgent, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이모지 아이콘을 입력하세요 (예: 📝)"
                />
              </div>
            </div>
          )}

          {/* 커스텀 이미지 업로드 */}
          {editingAgent.customImage !== undefined && (
            <div>
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        onChange({ ...editingAgent, customImage: event.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">JPG, PNG 파일을 업로드하세요 (권장 크기: 64x64px)</p>
              </div>
              
              {/* 이미지 미리보기 */}
              {editingAgent.customImage && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">미리보기:</p>
                  <div className="w-16 h-16 border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={editingAgent.customImage}
                      alt="미리보기"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 현재 선택된 아이콘 미리보기 */}
          {editingAgent.icon && !editingAgent.customImage && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">현재 선택: <span className="text-2xl ml-2">{editingAgent.icon}</span></p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            해시태그
          </label>
          <input
            type="text"
            value={editingAgent.hashtags?.join(', ') || ''}
            onChange={(e) => onChange({ 
              ...editingAgent, 
              hashtags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="해시태그를 쉼표로 구분하여 입력하세요 (예: 회의록, 자동화, 문서작성)"
          />
          <p className="text-xs text-gray-500 mt-1">쉼표(,)로 구분하여 여러 해시태그를 입력할 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              value={editingAgent.category || '일반사무'}
              onChange={(e) => onChange({ ...editingAgent, category: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="일반사무">일반사무</option>
              <option value="마케팅/광고">마케팅/광고</option>
              <option value="콘텐츠 제작">콘텐츠 제작</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              크레딧
            </label>
            <input
              type="number"
              min="1"
              value={editingAgent.creditCost || 0}
              onChange={(e) => onChange({ ...editingAgent, creditCost: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="크레딧을 입력하세요"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={editingAgent.settings?.isEnabled || false}
              onChange={(e) => onChange({ 
                ...editingAgent, 
                settings: { 
                  ...editingAgent.settings, 
                  isEnabled: e.target.checked,
                  maxConcurrentUsers: editingAgent.settings?.maxConcurrentUsers || 10,
                  maintenanceMode: editingAgent.settings?.maintenanceMode || false,
                  apiKeys: editingAgent.settings?.apiKeys || [],
                  rateLimit: editingAgent.settings?.rateLimit || 60,
                  timeout: editingAgent.settings?.timeout || 60
                } 
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">활성화</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          취소
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          저장
        </button>
      </div>
    </div>
  );
}

// 에이전트 관리 모달 컴포넌트
function AgentManageModal({
  agent,
  onClose
}: {
  agent: AgentAdmin;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState('model');

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('model')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'model'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            API 모델
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'prompt'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            시스템 프롬프트
          </button>
          <button
            onClick={() => setActiveTab('apikey')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'apikey'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            API 키
          </button>
        </nav>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="min-h-[400px]">
        {activeTab === 'model' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">API 모델 설정</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  현재 모델
                </label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-900">GPT-4</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  모델 변경
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>GPT-4</option>
                  <option>GPT-3.5-turbo</option>
                  <option>Claude-3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.7"
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-1">창의성 수준: 0.7</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prompt' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">시스템 프롬프트</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 프롬프트
              </label>
              <textarea
                rows={12}
                defaultValue="당신은 전문적인 AI 어시스턴트입니다. 사용자의 요청을 정확하고 유용하게 처리해주세요."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                프롬프트 저장
              </button>
            </div>
          </div>
        )}

        {activeTab === 'apikey' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">API 키 관리</h3>
            <div className="space-y-3">
              {agent.settings.apiKeys.map((key, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">API 키 {index + 1}</div>
                    <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                      {key.replace(/./g, '●')}
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                    재생성
                  </button>
                </div>
              ))}
              <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100">
                + 새 API 키 추가
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          닫기
        </button>
      </div>
    </div>
  );
} 