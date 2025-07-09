'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Upload, 
  Settings, 
  User, 
  Building2, 
  Shield, 
  CreditCard,
  CheckCircle,
  Clock,
  Ban,
  Edit,
  Eye,
  Trash2,
  Plus,
  Save,
  X,
  Users,
  Calendar
} from 'lucide-react';
import AdminStats from '@/components/admin/AdminStats';
import AdminTable from '@/components/admin/AdminTable';
import AdminFilter, { FilterConfig } from '@/components/admin/AdminFilter';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminModal, { ConfirmModal } from '@/components/admin/AdminModal';
import { mockUsers, generateUserActivityLogs } from '@/data/admin';
import { AdminUser } from '@/types/admin';

export default function AdminUsers() {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'suspend' | 'activate' | 'delete' | null;
    user: AdminUser | null;
  }>({ isOpen: false, type: null, user: null });

  // 기간 선택 필터 상태
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
    period: 'all' // 'all', 'week', 'month', 'custom'
  });

  // 기간별 크레딧 사용량 계산 함수
  const calculatePeriodCredits = (user: AdminUser) => {
    if (!user.activityLogs) return 0;

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (dateFilter.period === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (dateFilter.period === 'month') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (dateFilter.period === 'custom') {
      if (dateFilter.startDate) startDate = new Date(dateFilter.startDate);
      if (dateFilter.endDate) endDate = new Date(dateFilter.endDate);
    }

    // 전체 기간인 경우 모든 크레딧 사용량 반환
    if (dateFilter.period === 'all') {
      return user.totalCreditsUsed;
    }

    // 기간 내 크레딧 사용량 계산
    let periodCredits = 0;
    user.activityLogs.forEach(log => {
      if (log.action === 'agent_use') {
        const logDate = new Date(log.timestamp);
        
        // 시작일 체크
        if (startDate && logDate < startDate) return;
        
        // 종료일 체크
        if (endDate && logDate > endDate) return;
        
        // 크레딧 사용량 추출 (예: "회의록 자동화 AI 사용 (10 크레딧)" -> 10)
        const creditMatch = log.details.match(/\((\d+)\s*크레딧\)/);
        if (creditMatch) {
          periodCredits += parseInt(creditMatch[1]);
        }
      }
    });

    return periodCredits;
  };

  // 필터 설정
  const filterConfigs: FilterConfig[] = [
    {
      key: 'type',
      label: '계정 유형',
      type: 'select',
      options: [
        { label: '일반사용자', value: 'general_user' },
        { label: '회사관리자', value: 'company_admin' },
        { label: '회사일반사용자', value: 'company_employee' },
        { label: '관리자', value: 'admin' }
      ]
    },
    {
      key: 'status',
      label: '상태',
      type: 'select',
      options: [
        { label: '활성', value: 'active' },
        { label: '비활성', value: 'inactive' },
        { label: '정지', value: 'suspended' }
      ]
    }
  ];

  // 데이터 필터링 - 기간 선택은 크레딧 계산용이므로 등록일 필터링 제거
  const getFilteredUsers = () => {
    let filtered = [...mockUsers];

    // 검색 필터링
    if (searchValue) {
      filtered = filtered.filter(user => {
        const matchesSearch = 
          user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          (user.companyInfo?.name && user.companyInfo.name.toLowerCase().includes(searchValue.toLowerCase()));
        return matchesSearch;
      });
    }

    // 타입 및 상태 필터링
    if (filterValues.type) {
      filtered = filtered.filter(user => user.type === filterValues.type);
    }
    if (filterValues.status) {
      filtered = filtered.filter(user => user.status === filterValues.status);
    }

    return filtered.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
  };

  const filteredUsers = getFilteredUsers();

  // 기간 필터 변경 핸들러
  const handleDateFilterChange = (field: string, value: string) => {
    setDateFilter(prev => ({ ...prev, [field]: value }));
  };

  // 페이지네이션
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // 통계 계산
  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === 'active').length,
    generalUsers: mockUsers.filter(u => u.type === 'general_user').length,
    companyAdmin: mockUsers.filter(u => u.type === 'company_admin').length,
    companyEmployee: mockUsers.filter(u => u.type === 'company_employee').length,
    suspended: mockUsers.filter(u => u.status === 'suspended').length
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'name',
      label: '사용자',
      render: (user: any) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-medium text-sm">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{user?.name || '이름 없음'}</div>
            <div className="text-sm text-gray-500">{user?.email || '이메일 없음'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: '유형',
      render: (user: any) => getUserTypeBadge(user?.type, user?.companyInfo?.name)
    },
    {
      key: 'status',
      label: '상태',
      render: (user: any) => getStatusBadge(user?.status)
    },
    {
      key: 'credits',
      label: '크레딧',
      render: (user: any) => (
        <div className="flex items-center">
          <CreditCard className="w-4 h-4 text-amber-500 mr-1" />
          <span className="font-medium">{user?.credits?.toLocaleString() || '0'}</span>
        </div>
      )
    },
    {
      key: 'periodCredits',
      label: '사용 크레딧',
      render: (user: any) => {
        const periodCredits = calculatePeriodCredits(user);
        return (
          <div className="flex items-center">
            <span className="font-medium text-purple-600">{periodCredits.toLocaleString()}</span>
            <span className="text-xs text-gray-500 ml-1">크레딧</span>
          </div>
        );
      }
    },
    {
      key: 'lastLoginAt',
      label: '최근 로그인',
      render: (user: any) => (
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('ko-KR') : '로그인 기록 없음'}
        </div>
      )
    }
  ];

  // 테이블 액션 정의
  const actions = [
    {
      label: '상세 보기',
      icon: Eye,
      onClick: (user: any) => {
        setSelectedUser({
          ...user,
          activityLogs: generateUserActivityLogs(user?.id || '', 20)
        });
        setIsUserModalOpen(true);
      },
      color: 'blue' as const
    },
    {
      label: '수정',
      icon: Edit,
      onClick: (user: any) => {
        console.log('Edit user:', user);
      },
      color: 'gray' as const
    },
    {
      label: '정지',
      icon: Ban,
      onClick: (user: any) => {
        setConfirmModal({
          isOpen: true,
          type: 'suspend',
          user
        });
      },
      color: 'yellow' as const,
      show: (user: any) => user?.status === 'active'
    },
    {
      label: '활성화',
      icon: CheckCircle,
      onClick: (user: any) => {
        setConfirmModal({
          isOpen: true,
          type: 'activate',
          user
        });
      },
      color: 'green' as const,
      show: (user: any) => user?.status !== 'active'
    }
  ];

  // Helper 함수들 - 회사명 포함
  const getUserTypeBadge = (type: string, companyName?: string) => {
    const configs = {
      general_user: { bg: 'bg-blue-100', text: 'text-blue-800', label: '일반사용자', icon: User },
      company_admin: { bg: 'bg-green-100', text: 'text-green-800', label: '회사관리자', icon: Building2 },
      company_employee: { bg: 'bg-purple-100', text: 'text-purple-800', label: '회사일반사용자', icon: Users },
      admin: { bg: 'bg-orange-100', text: 'text-orange-800', label: '관리자', icon: Shield }
    };
    
    const config = configs[type as keyof typeof configs];
    if (!config) return null;
    
    const Icon = config.icon;

    // 회사관리자나 회사일반사용자인 경우 회사명 포함
    const displayLabel = (type === 'company_admin' || type === 'company_employee') && companyName
      ? `${config.label} (${companyName})`
      : config.label;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {displayLabel}
      </span>
    );
  };

  // 상태 뱃지 함수
  const getStatusBadge = (status: string) => {
    const configs = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: '활성', icon: CheckCircle, description: '로그인 가능, 에이전트 사용 가능' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: '비활성', icon: Clock, description: '로그인 가능, 에이전트 사용 불가능' },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', label: '정지', icon: Ban, description: '로그인 불가능' }
    };
    
    const config = configs[status as keyof typeof configs];
    if (!config) return null;
    
    const Icon = config.icon;
    
    return (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        title={config.description}
      >
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleConfirmAction = () => {
    if (!confirmModal.user) return;
    
    // 실제 구현에서는 API 호출
    console.log(`${confirmModal.type} user:`, confirmModal.user);
    
    setConfirmModal({ isOpen: false, type: null, user: null });
  };

  const newUserButton = (
    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
      <Plus className="w-4 h-4" />
      <span>새 사용자 추가</span>
    </button>
  );

  // 기간별 표시 텍스트
  const getPeriodText = () => {
    switch (dateFilter.period) {
      case 'week': return '최근 1주일';
      case 'month': return '최근 1개월';
      case 'custom': return '선택 기간';
      default: return '전체 기간';
    }
  };

  return (
    <AdminLayout
      title="사용자 관리"
      description="플랫폼 사용자들을 관리하고 모니터링하세요"
      actions={newUserButton}
      hideTimePeriod={true}
    >
      {/* 기간 선택 섹션 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">기간 선택</h3>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">현재: {getPeriodText()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <select
              value={dateFilter.period}
              onChange={(e) => handleDateFilterChange('period', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">전체</option>
              <option value="week">최근 1주일</option>
              <option value="month">최근 1개월</option>
              <option value="custom">직접 선택</option>
            </select>
          </div>
          
          {dateFilter.period === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시작일</label>
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">종료일</label>
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 기간 선택은 리스트의 '사용 크레딧' 컬럼에 반영됩니다. 선택된 기간 내 크레딧 사용량을 확인할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <AdminStats
          title="전체 사용자"
          value={stats.total}
          icon={User}
          color="blue"
        />
        <AdminStats
          title="활성 사용자"
          value={stats.active}
          icon={CheckCircle}
          color="green"
          change={{ value: 12.5, type: 'positive', label: '전월대비' }}
        />
        <AdminStats
          title="회사 계정"
          value={stats.companyAdmin + stats.companyEmployee}
          icon={Building2}
          color="purple"
        />
        <AdminStats
          title="정지된 계정"
          value={stats.suspended}
          icon={Ban}
          color="red"
        />
      </div>

      {/* 필터 */}
      <AdminFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="이름, 이메일, 회사명으로 검색..."
        filters={filterConfigs}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        className="mb-6"
      />

      {/* 테이블 */}
      <AdminTable
        columns={columns}
        data={currentUsers}
        actions={actions}
        emptyMessage="사용자가 없습니다."
        className="mb-6"
      />

      {/* 페이지네이션 */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* 사용자 상세 모달 */}
      {selectedUser && (
        <AdminModal
          isOpen={isUserModalOpen}
          onClose={() => {
            setIsUserModalOpen(false);
            setSelectedUser(null);
          }}
          title={`${selectedUser.name} 상세 정보`}
          size="lg"
        >
          <UserDetailModal user={selectedUser} />
        </AdminModal>
      )}

      {/* 확인 모달 */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, user: null })}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.type === 'suspend' ? '사용자 정지' :
          confirmModal.type === 'activate' ? '사용자 활성화' :
          '사용자 삭제'
        }
        message={
          confirmModal.type === 'suspend' 
            ? `${confirmModal.user?.name}님의 계정을 정지하시겠습니까? 정지된 계정은 로그인할 수 없습니다.`
            : confirmModal.type === 'activate'
            ? `${confirmModal.user?.name}님의 계정을 활성화하시겠습니까?`
            : `${confirmModal.user?.name}님의 계정을 삭제하시겠습니까?`
        }
        type={confirmModal.type === 'suspend' ? 'warning' : confirmModal.type === 'activate' ? 'info' : 'error'}
      />
    </AdminLayout>
  );
}

// 사용자 상세 정보 모달 컴포넌트
function UserDetailModal({ user }: { user: AdminUser }) {
  const getUserTypeLabel = (type: string) => {
    const labels = {
      general_user: '일반사용자',
      company_admin: '회사관리자',
      company_employee: '회사일반사용자',
      admin: '관리자'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: '활성',
      inactive: '비활성',
      suspended: '정지'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">이름</label>
            <p className="mt-1 text-sm text-gray-900">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">이메일</label>
            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">계정 유형</label>
            <p className="mt-1 text-sm text-gray-900">{getUserTypeLabel(user.type)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">상태</label>
            <p className="mt-1 text-sm text-gray-900">{getStatusLabel(user.status)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">가입일</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(user.registeredAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">최근 로그인</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(user.lastLoginAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>
      </div>
      
      {/* 회사 정보 */}
      {user.companyInfo && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">회사 정보</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">회사명</label>
              <p className="mt-1 text-sm text-gray-900">{user.companyInfo.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">사업자번호</label>
              <p className="mt-1 text-sm text-gray-900">{user.companyInfo.businessNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">직원 수</label>
              <p className="mt-1 text-sm text-gray-900">{user.companyInfo.employeeCount}명</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">구독 플랜</label>
              <p className="mt-1 text-sm text-gray-900">{user.companyInfo.subscriptionPlan}</p>
            </div>
          </div>
        </div>
      )}

      {/* 크레딧 및 사용 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">크레딧 및 사용 정보</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">보유 크레딧</label>
            <p className="mt-1 text-lg font-semibold text-blue-600">{user.credits.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">총 사용 크레딧</label>
            <p className="mt-1 text-lg font-semibold text-purple-600">{user.totalCreditsUsed.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">총 사용액</label>
            <p className="mt-1 text-lg font-semibold text-green-600">{user.totalSpent.toLocaleString()}원</p>
          </div>
        </div>
      </div>

      {/* 활동 로그 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">최근 활동</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {user.activityLogs?.map((log) => (
            <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-gray-900">{log.details}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(log.timestamp).toLocaleString('ko-KR')} • {log.ipAddress}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 