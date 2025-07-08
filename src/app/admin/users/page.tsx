'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Users, 
  Eye, 
  Edit, 
  Ban, 
  CheckCircle,
  XCircle,
  Building2,
  User,
  Crown,
  CreditCard,
  Clock,
  Plus,
  UserCheck,
  UserX,
  UserMinus
} from 'lucide-react';
import AdminStats from '@/components/admin/AdminStats';
import AdminTable, { TableColumn, TableAction } from '@/components/admin/AdminTable';
import AdminFilter, { FilterConfig } from '@/components/admin/AdminFilter';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminModal, { ConfirmModal } from '@/components/admin/AdminModal';
import { mockUsers, generateUserActivityLogs } from '@/data/admin';
import { AdminUser } from '@/types/admin';

export default function AdminUsers() {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'suspend' | 'activate' | 'delete' | null;
    user: AdminUser | null;
  }>({ isOpen: false, type: null, user: null });

  // 필터 설정
  const filterConfigs: FilterConfig[] = [
    {
      key: 'type',
      label: '계정 유형',
      type: 'select',
      options: [
        { label: '개인', value: 'individual' },
        { label: '회사', value: 'company' },
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
    },
    {
      key: 'registeredDate',
      label: '가입일',
      type: 'daterange'
    }
  ];

  // 데이터 필터링
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = searchValue === '' || 
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      (user.companyInfo?.name && user.companyInfo.name.toLowerCase().includes(searchValue.toLowerCase()));
    
    const matchesType = !filterValues.type || user.type === filterValues.type;
    const matchesStatus = !filterValues.status || user.status === filterValues.status;
    
    let matchesDate = true;
    if (filterValues.registeredDate?.start || filterValues.registeredDate?.end) {
      const userDate = new Date(user.registeredAt);
      if (filterValues.registeredDate.start) {
        matchesDate = matchesDate && userDate >= new Date(filterValues.registeredDate.start);
      }
      if (filterValues.registeredDate.end) {
        matchesDate = matchesDate && userDate <= new Date(filterValues.registeredDate.end);
      }
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // 페이지네이션
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // 통계 계산
  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === 'active').length,
    company: mockUsers.filter(u => u.type === 'company').length,
    suspended: mockUsers.filter(u => u.status === 'suspended').length
  };

  // 테이블 컬럼 정의
  const columns: TableColumn<AdminUser>[] = [
    {
      key: 'name',
      label: '사용자',
      render: (_, user) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-medium text-sm">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: '유형',
      render: (_, user) => getUserTypeBadge(user.type)
    },
    {
      key: 'status',
      label: '상태',
      render: (_, user) => getStatusBadge(user.status)
    },
    {
      key: 'credits',
      label: '크레딧',
      render: (_, user) => (
        <div className="flex items-center">
          <CreditCard className="w-4 h-4 text-amber-500 mr-1" />
          <span className="font-medium">{user.credits.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'totalSpent',
      label: '총 사용액',
      render: (_, user) => `${(user.totalSpent / 1000).toFixed(0)}K원`
    },
    {
      key: 'lastLoginAt',
      label: '최근 로그인',
      render: (_, user) => (
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {new Date(user.lastLoginAt).toLocaleDateString('ko-KR')}
        </div>
      )
    }
  ];

  // 테이블 액션 정의
  const actions: TableAction<AdminUser>[] = [
    {
      label: '상세 보기',
      icon: Eye,
      onClick: (user) => {
        setSelectedUser({
          ...user,
          activityLogs: generateUserActivityLogs(user.id, 20)
        });
        setIsUserModalOpen(true);
      },
      color: 'blue'
    },
    {
      label: '수정',
      icon: Edit,
      onClick: (user) => {
        console.log('Edit user:', user);
      },
      color: 'gray'
    },
    {
      label: '정지',
      icon: Ban,
      onClick: (user) => {
        setConfirmModal({
          isOpen: true,
          type: 'suspend',
          user
        });
      },
      color: 'yellow',
      show: (user) => user.status === 'active'
    },
    {
      label: '활성화',
      icon: CheckCircle,
      onClick: (user) => {
        setConfirmModal({
          isOpen: true,
          type: 'activate',
          user
        });
      },
      color: 'green',
      show: (user) => user.status !== 'active'
    }
  ];

  // Helper 함수들
  const getUserTypeBadge = (type: string) => {
    const configs = {
      individual: { bg: 'bg-blue-100', text: 'text-blue-800', label: '개인', icon: User },
      company: { bg: 'bg-green-100', text: 'text-green-800', label: '회사', icon: Building2 },
      admin: { bg: 'bg-purple-100', text: 'text-purple-800', label: '관리자', icon: Crown }
    };
    
    const config = configs[type as keyof typeof configs];
    if (!config) return null;
    
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: '활성', icon: UserCheck },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: '비활성', icon: UserX },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', label: '정지', icon: UserMinus }
    };
    
    const config = configs[status as keyof typeof configs];
    if (!config) return null;
    
    const Icon = config.icon;
    
      return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
        </span>
      );
  };

  const handleFilterChange = (key: string, value: any) => {
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

  return (
    <AdminLayout
      title="사용자 관리"
      description="플랫폼 사용자들을 관리하고 모니터링하세요"
      actions={newUserButton}
      hideTimePeriod={true}
    >

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AdminStats
            title="전체 사용자"
            value={stats.total}
            icon={Users}
            color="blue"
          />
          <AdminStats
            title="활성 사용자"
            value={stats.active}
            icon={UserCheck}
            color="green"
            change={{ value: 12.5, type: 'positive', label: '전월대비' }}
          />
          <AdminStats
            title="회사 계정"
            value={stats.company}
            icon={Building2}
            color="purple"
          />
          <AdminStats
            title="정지된 계정"
            value={stats.suspended}
            icon={UserMinus}
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
              ? `${confirmModal.user?.name}님의 계정을 정지하시겠습니까?`
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
            <p className="mt-1 text-sm text-gray-900">
              {user.type === 'individual' ? '개인' : user.type === 'company' ? '회사' : '관리자'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">상태</label>
            <p className="mt-1 text-sm text-gray-900">
              {user.status === 'active' ? '활성' : user.status === 'inactive' ? '비활성' : '정지'}
            </p>
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

      {/* 사용 통계 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">사용 통계</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{user.credits.toLocaleString()}</div>
            <div className="text-sm text-blue-600">보유 크레딧</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{user.totalCreditsUsed.toLocaleString()}</div>
            <div className="text-sm text-green-600">사용한 크레딧</div>
            </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{(user.totalSpent / 1000).toFixed(0)}K원</div>
            <div className="text-sm text-purple-600">총 사용액</div>
          </div>
                          </div>
                        </div>

      {/* 최근 활동 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">최근 활동</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {user.activityLogs.slice(0, 10).map((log) => (
            <div key={log.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{log.details}</p>
                <p className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString('ko-KR')} · {log.ipAddress}
                </p>
                        </div>
                      </div>
          ))}
        </div>
      </div>
    </div>
  );
} 