'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminStats from '@/components/admin/AdminStats';
import AdminFilter from '@/components/admin/AdminFilter';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import AdminPagination from '@/components/admin/AdminPagination';
import { aiAgents } from '@/data/agents';
import { AgentAdmin } from '@/types/admin';
import { 
  Bot, 
  Settings, 
  Play, 
  Pause, 
  BarChart3, 
  Eye,
  Edit,
  AlertTriangle,
  Clock,
  Activity,
  Cpu,
  Zap,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Server,
  Shield,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  Save,
  RotateCcw
} from 'lucide-react';

// AgentAdmin 타입으로 변환하는 헬퍼 함수
const convertToAgentAdmin = (agent: any): AgentAdmin => ({
  ...agent,
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
    isEnabled: true,
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
  const [agentAdmins] = useState<AgentAdmin[]>(aiAgents.map(convertToAgentAdmin));
  const [filteredAgents, setFilteredAgents] = useState<AgentAdmin[]>(agentAdmins);
  const [selectedAgent, setSelectedAgent] = useState<AgentAdmin | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [searchValue, setSearchValue] = useState('');
  const [editingSettings, setEditingSettings] = useState<any>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    agent: AgentAdmin | null;
    type: 'toggle' | 'maintenance' | 'restart';
  }>({
    isOpen: false,
    agent: null,
    type: 'toggle'
  });

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
        { value: 'disabled', label: '비활성' },
        { value: 'maintenance', label: '점검중' }
      ]
    },
    {
      key: 'performance',
      label: '성능',
      type: 'select' as const,
      options: [
        { value: 'excellent', label: '우수 (95%+)' },
        { value: 'good', label: '양호 (90-95%)' },
        { value: 'fair', label: '보통 (85-90%)' },
        { value: 'poor', label: '미흡 (<85%)' }
      ]
    }
  ];

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'agent',
      label: '에이전트',
      render: (agent: AgentAdmin) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              agent?.settings?.isEnabled && !agent?.settings?.maintenanceMode
                ? 'bg-green-100'
                : agent?.settings?.maintenanceMode
                ? 'bg-yellow-100'
                : 'bg-red-100'
            }`}>
              <Bot className={`w-5 h-5 ${
                agent?.settings?.isEnabled && !agent?.settings?.maintenanceMode
                  ? 'text-green-600'
                  : agent?.settings?.maintenanceMode
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`} />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {agent?.name || '에이전트명 없음'}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {agent?.description && agent.description.length > 40 
                ? `${agent.description.substring(0, 40)}...` 
                : (agent?.description || '설명 없음')}
            </p>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-xs text-gray-400">
                {agent?.creditCost || 0} 크레딧
              </span>
              {getCategoryBadge(agent?.category || '일반사무')}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: '상태',
      render: (agent: AgentAdmin) => getStatusBadge(agent?.settings || { isEnabled: false, maintenanceMode: false })
    },
    {
      key: 'performance',
      label: '성능 지표',
      render: (agent: AgentAdmin) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">성공률</span>
            <span className={`text-xs font-medium ${
              (agent?.statistics?.successRate ?? 0) >= 95 ? 'text-green-600' :
              (agent?.statistics?.successRate ?? 0) >= 90 ? 'text-blue-600' :
              (agent?.statistics?.successRate ?? 0) >= 85 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {(agent?.statistics?.successRate ?? 0).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">평균 처리</span>
            <span className="text-xs text-gray-900">
              {(agent?.statistics?.averageProcessingTime ?? 0).toFixed(1)}초
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">사용자 평점</span>
            <span className="text-xs text-gray-900">
              {(agent?.statistics?.userRating ?? 0).toFixed(1)}★
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'usage',
      label: '사용량 & 수익',
      render: (agent: AgentAdmin) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">총 사용</span>
            <span className="text-xs font-medium text-gray-900">
              {(agent?.statistics?.totalUsage ?? 0).toLocaleString()}회
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">월 수익</span>
            <span className="text-xs font-medium text-green-600">
              {((agent?.statistics?.revenue ?? 0) / 1000).toFixed(0)}K원
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">오류</span>
            <span className={`text-xs font-medium ${
              (agent?.statistics?.errorCount ?? 0) > 20 ? 'text-red-600' :
              (agent?.statistics?.errorCount ?? 0) > 10 ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {agent?.statistics?.errorCount ?? 0}건
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'settings',
      label: '시스템 설정',
      render: (agent: AgentAdmin) => (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">동시 사용자</span>
            <span className="text-xs text-gray-900">
              {agent?.settings?.maxConcurrentUsers ?? 0}명
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">요청 한도</span>
            <span className="text-xs text-gray-900">
              {agent?.settings?.rateLimit ?? 0}/분
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">타임아웃</span>
            <span className="text-xs text-gray-900">
              {agent?.settings?.timeout ?? 0}초
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: '작업',
      render: (agent: AgentAdmin) => (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => agent && handleViewAgent(agent)}
            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
            title="성능 대시보드"
            disabled={!agent}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => agent && handleSettingsAgent(agent)}
            className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
            title="설정 관리"
            disabled={!agent}
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => agent && handleLogsAgent(agent)}
            className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded"
            title="로그 확인"
            disabled={!agent}
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => agent && handleToggleAgent(agent)}
            className={`p-1 rounded ${
              agent?.settings?.isEnabled
                ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                : 'text-green-600 hover:text-green-900 hover:bg-green-50'
            }`}
            title={agent?.settings?.isEnabled ? '비활성화' : '활성화'}
            disabled={!agent}
          >
            {agent?.settings?.isEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => agent && handleRestartAgent(agent)}
            className="p-1 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded"
            title="재시작"
            disabled={!agent}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // 카테고리 배지
  const getCategoryBadge = (category: string) => {
    const styles = {
      '일반사무': { bg: 'bg-blue-100', text: 'text-blue-800' },
      '마케팅/광고': { bg: 'bg-green-100', text: 'text-green-800' },
      '콘텐츠 제작': { bg: 'bg-purple-100', text: 'text-purple-800' }
    };

    const style = styles[category as keyof typeof styles] || styles['일반사무'];

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}>
        {category}
      </span>
    );
  };

  // 상태 배지
  const getStatusBadge = (settings: any) => {
    if (settings?.maintenanceMode) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          점검중
        </span>
      );
    } else if (settings?.isEnabled) {
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
          } else if (value === 'maintenance') {
            filtered = filtered.filter(agent => agent?.settings?.maintenanceMode);
          }
        } else if (key === 'performance') {
          if (value === 'excellent') {
            filtered = filtered.filter(agent => (agent?.statistics?.successRate ?? 0) >= 95);
          } else if (value === 'good') {
            filtered = filtered.filter(agent => (agent?.statistics?.successRate ?? 0) >= 90 && (agent?.statistics?.successRate ?? 0) < 95);
          } else if (value === 'fair') {
            filtered = filtered.filter(agent => (agent?.statistics?.successRate ?? 0) >= 85 && (agent?.statistics?.successRate ?? 0) < 90);
          } else if (value === 'poor') {
            filtered = filtered.filter(agent => (agent?.statistics?.successRate ?? 0) < 85);
          }
    } else {
          filtered = filtered.filter(agent => {
            const agentValue = agent?.[key as keyof AgentAdmin];
            return agentValue === value;
          });
        }
      }
    });

    setFilteredAgents(filtered);
    setCurrentPage(1);
  };

  // 이벤트 핸들러
  const handleFilterChange = (key: string, value: any) => {
    const newFilterValues = { ...filterValues, [key]: value };
    setFilterValues(newFilterValues);
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

  const handleSettingsAgent = (agent: AgentAdmin) => {
    setSelectedAgent(agent);
    setEditingSettings({ ...agent?.settings || {} });
    setShowSettingsModal(true);
  };

  const handleLogsAgent = (agent: AgentAdmin) => {
    setSelectedAgent(agent);
    setShowLogsModal(true);
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
  const activeAgents = agentAdmins.filter(a => a?.settings?.isEnabled && !a?.settings?.maintenanceMode).length;
  const totalUsage = agentAdmins.reduce((sum, a) => sum + (a?.statistics?.totalUsage ?? 0), 0);
  const totalRevenue = agentAdmins.reduce((sum, a) => sum + (a?.statistics?.revenue ?? 0), 0);

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AdminStats
            title="총 에이전트"
            value={totalAgents}
            icon={Bot}
            color="blue"
            change={{ value: 5, type: 'positive' }}
          />
          <AdminStats
            title="활성 에이전트"
            value={activeAgents}
            icon={Activity}
            color="green"
            change={{ value: 2, type: 'positive' }}
          />
          <AdminStats
            title="총 사용량"
            value={`${(totalUsage / 1000).toFixed(1)}K`}
            icon={Users}
            color="purple"
            change={{ value: 18, type: 'positive' }}
          />
          <AdminStats
            title="총 수익"
            value={`${(totalRevenue / 1000000).toFixed(1)}M원`}
            icon={DollarSign}
            color="yellow"
            change={{ value: 22, type: 'positive' }}
          />
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
  settings: any;
  onChange: (settings: any) => void;
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
  const [logFilter, setLogFilter] = useState('all');

  const filteredLogs = agent.logs.filter(log => {
    if (logFilter === 'all') return true;
    return log.status === logFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">실행 로그</h3>
        <select
          value={logFilter}
          onChange={(e) => setLogFilter(e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">전체</option>
          <option value="success">성공</option>
          <option value="error">오류</option>
          <option value="timeout">타임아웃</option>
        </select>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredLogs.map((log) => (
          <div key={log.id} className={`p-3 rounded-lg border ${
            log.status === 'success' ? 'bg-green-50 border-green-200' :
            log.status === 'error' ? 'bg-red-50 border-red-200' :
            'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {log.status === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : log.status === 'error' ? (
                  <XCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-600" />
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