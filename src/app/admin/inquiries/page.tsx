'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminStats from '@/components/admin/AdminStats';
import AdminFilter from '@/components/admin/AdminFilter';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import AdminPagination from '@/components/admin/AdminPagination';
import { mockInquiries } from '@/data/admin';
import { InquiryAdmin, InquiryResponse } from '@/types/admin';
import { User } from 'lucide-react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Upload, 
  Settings, 
  Eye, 
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  X
} from 'lucide-react';

// 안전한 날짜 포맷팅 컴포넌트
function SafeDate({ date, format = 'date' }: { date: string | Date; format?: 'date' | 'datetime' }) {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    const dateObj = new Date(date);
    if (format === 'datetime') {
      setFormattedDate(dateObj.toLocaleString('ko-KR'));
    } else {
      setFormattedDate(dateObj.toLocaleDateString('ko-KR'));
    }
  }, [date, format]);

  return <span>{formattedDate}</span>;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<InquiryAdmin[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryAdmin | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({});
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState<'inquiries' | 'agent_requests'>('inquiries');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    inquiry: InquiryAdmin | null;
    type: 'delete';
  }>({
    isOpen: false,
    inquiry: null,
    type: 'delete'
  });

  // 클라이언트 사이드에서만 데이터 초기화
  useEffect(() => {
    setInquiries(mockInquiries);
  }, []);

  // 탭 정의
  const tabs = [
    { id: 'inquiries', name: '일반 문의', count: inquiries.filter(i => i.type !== 'agent_request' && i.status === 'pending').length },
    { id: 'agent_requests', name: '에이전트 추가신청', count: inquiries.filter(i => i.type === 'agent_request' && i.status === 'pending').length }
  ];

  // 탭별 필터 옵션 정의
  const getFilterOptions = () => {
    const commonStatusFilter = {
      key: 'status',
      label: '상태',
      type: 'select' as const,
      options: [
        { value: 'pending', label: '대기중' },
        { value: 'completed', label: '완료' }
      ]
    };

    if (activeTab === 'inquiries') {
      return [
        commonStatusFilter,
        {
          key: 'type',
          label: '문의 유형',
          type: 'select' as const,
          options: [
            { value: 'service', label: '서비스 관련' },
            { value: 'technical', label: '기술 지원' },
            { value: 'billing', label: '결제/크레딧' },
            { value: 'account', label: '계정 관리' },
            { value: 'other', label: '기타' }
          ]
        }
      ];
    } else if (activeTab === 'agent_requests') {
      return [
        commonStatusFilter,
        {
          key: 'developmentType',
          label: '개발 유형',
          type: 'select' as const,
          options: [
            { value: 'free', label: '무료' },
            { value: 'paid', label: '유료' }
          ]
        }
      ];
    }
    return [];
  };

  // 탭별 테이블 컬럼 정의
  const getColumns = () => {
    const commonInfoColumn = {
      key: 'info',
      label: activeTab === 'agent_requests' ? '에이전트 정보' : '문의 정보',
      render: (inquiry: InquiryAdmin) => (
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                inquiry.type === 'agent_request' 
                  ? 'bg-purple-100' 
                  : 'bg-blue-100'
              }`}>
                {inquiry.type === 'agent_request' ? (
                  <User className="w-5 h-5 text-purple-600" />
                ) : (
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {inquiry.type === 'agent_request' 
                    ? inquiry.agentRequestData?.agentName || '에이전트명 없음'
                    : inquiry.title || '제목 없음'}
                </p>
                {inquiry.attachments && inquiry.attachments.length > 0 && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <FileText className="w-3 h-3" />
                    <span>{inquiry.attachments.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    };

    const userColumn = {
      key: 'user',
      label: '신청자',
      render: (inquiry: InquiryAdmin) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{inquiry.user?.name || '사용자 정보 없음'}</p>
          <p className="text-sm text-gray-500">{inquiry.user?.email || '이메일 정보 없음'}</p>
        </div>
      )
    };

    if (activeTab === 'agent_requests') {
      return [
        commonInfoColumn,
        {
          key: 'category',
          label: '카테고리',
          render: (inquiry: InquiryAdmin) => (
            <div>
              <p className="text-sm text-gray-900">
                {inquiry.agentRequestData?.categoryId || '카테고리 없음'}
              </p>
            </div>
          )
        },
        {
          key: 'development',
          label: '개발 유형',
          render: (inquiry: InquiryAdmin) => (
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                inquiry.agentRequestData?.developmentType === 'free' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {inquiry.agentRequestData?.developmentType === 'free' ? '무료' : '유료'}
              </span>
              {inquiry.agentRequestData?.developmentType === 'paid' && inquiry.agentRequestData?.developmentCost && (
                <p className="text-xs text-gray-500 mt-1">{inquiry.agentRequestData.developmentCost}</p>
              )}
            </div>
          )
        },
        userColumn,
        {
          key: 'status',
          label: '상태',
          render: (inquiry: InquiryAdmin) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              inquiry.status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {inquiry.status === 'pending' ? '대기중' : '완료'}
            </span>
          )
        },
        {
          key: 'date',
          label: '신청일',
          render: (inquiry: InquiryAdmin) => (
            <div className="text-sm text-gray-900">
              <SafeDate date={inquiry.createdAt} />
            </div>
          )
        }
      ];
    } else {
      return [
        commonInfoColumn,
        {
          key: 'type',
          label: '유형',
          render: (inquiry: InquiryAdmin) => (
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                inquiry.type === 'service' ? 'bg-blue-100 text-blue-800' :
                inquiry.type === 'technical' ? 'bg-red-100 text-red-800' :
                inquiry.type === 'billing' ? 'bg-yellow-100 text-yellow-800' :
                inquiry.type === 'account' ? 'bg-green-100 text-green-800' :
                inquiry.type === 'agent_request' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {inquiry.type === 'service' ? '서비스' :
                 inquiry.type === 'technical' ? '기술' :
                 inquiry.type === 'billing' ? '결제' :
                 inquiry.type === 'account' ? '계정' :
                 inquiry.type === 'agent_request' ? '에이전트' :
                 '기타'}
              </span>
            </div>
          )
        },
        userColumn,
        {
          key: 'status',
          label: '상태',
          render: (inquiry: InquiryAdmin) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              inquiry.status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {inquiry.status === 'pending' ? '대기중' : '완료'}
            </span>
          )
        },
        {
          key: 'date',
          label: '등록일',
          render: (inquiry: InquiryAdmin) => (
            <div className="text-sm text-gray-900">
              <SafeDate date={inquiry.createdAt} />
            </div>
          )
        }
      ];
    }
  };

  // 탭별 데이터 필터링
  const getFilteredInquiries = () => {
    let filtered = inquiries;
    
    // 탭별 필터링
    if (activeTab === 'inquiries') {
      filtered = filtered.filter(inquiry => inquiry.type !== 'agent_request');
    } else if (activeTab === 'agent_requests') {
      filtered = filtered.filter(inquiry => inquiry.type === 'agent_request');
    }
    
    // 검색 필터링
    if (searchValue) {
      filtered = filtered.filter(inquiry => 
        (inquiry.title && inquiry.title.toLowerCase().includes(searchValue.toLowerCase())) ||
        (inquiry.user?.name && inquiry.user.name.toLowerCase().includes(searchValue.toLowerCase())) ||
        (inquiry.user?.email && inquiry.user.email.toLowerCase().includes(searchValue.toLowerCase())) ||
        (inquiry.agentRequestData?.agentName && 
         inquiry.agentRequestData.agentName.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }
    
    // 추가 필터링
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all') {
        if (key === 'developmentType') {
          filtered = filtered.filter(inquiry => 
            inquiry.agentRequestData?.developmentType === value
          );
        } else if (key === 'status') {
          filtered = filtered.filter(inquiry => inquiry.status === value);
        } else if (key === 'type') {
          filtered = filtered.filter(inquiry => inquiry.type === value);
        }
      }
    });
    
    return filtered;
  };

  // 탭별 통계 계산
  const getTabStats = () => {
    const filtered = getFilteredInquiries();
    return {
      pending: filtered.filter(i => i.status === 'pending').length,
      completed: filtered.filter(i => i.status === 'completed').length,
      total: filtered.length
    };
  };

  // 페이지네이션을 위한 현재 페이지 데이터
  const currentPageData = getFilteredInquiries().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(getFilteredInquiries().length / itemsPerPage);

  const handleDelete = (inquiry: InquiryAdmin) => {
    setInquiries(prev => prev.filter(i => i.id !== inquiry.id));
  };

  // 로딩 상태 표시
  if (inquiries.length === 0) {
    return (
      <AdminLayout
        title="문의 관리"
        description="사용자 문의사항 및 에이전트 추가신청을 관리합니다"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="문의 관리"
      description="사용자 문의사항 및 에이전트 추가신청을 관리합니다"
    >
      <div className="space-y-6">
        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  setCurrentPage(1);
                  setFilterValues({});
                }}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AdminStats
            title={'총 ' + (activeTab === 'agent_requests' ? '신청' : '문의')}
            value={getTabStats().total}
            icon={MessageSquare}
            color="blue"
          />
          <AdminStats
            title="대기중"
            value={getTabStats().pending}
            icon={Clock}
            color="yellow"
          />
          <AdminStats
            title="처리완료"
            value={getTabStats().completed}
            icon={CheckCircle}
            color="green"
          />
        </div>

        {/* 필터 및 검색 */}
        <AdminFilter
          searchValue={searchValue}
          onSearchChange={(search) => setSearchValue(search)}
          searchPlaceholder="문의 제목, 사용자명, 이메일로 검색..."
          filters={getFilterOptions()}
          filterValues={filterValues}
          onFilterChange={(key, value) => setFilterValues(prev => ({ ...prev, [key]: value }))}
        />

        {/* 테이블 */}
        <AdminTable
          data={currentPageData}
          columns={getColumns()}
          onRowClick={(inquiry) => {
            if (inquiry) {
              setSelectedInquiry(inquiry);
              setShowInquiryModal(true);
            }
          }}
          actions={[
            {
              label: '보기',
              onClick: (inquiry) => {
                if (inquiry) {
                  setSelectedInquiry(inquiry);
                  setShowInquiryModal(true);
                }
              },
              icon: Eye
            }
          ]}
        />

        {/* 페이지네이션 */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={getFilteredInquiries().length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          showItemsPerPage={true}
        />
      </div>

      {/* 문의 상세 모달 */}
      <AdminModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        title={selectedInquiry?.type === 'agent_request' ? '에이전트 추가신청 상세' : '문의 상세'}
        size="lg"
      >
        {selectedInquiry && <InquiryDetailModal inquiry={selectedInquiry} />}
      </AdminModal>
    </AdminLayout>
  );
}

// 문의 상세 정보 모달 컴포넌트
function InquiryDetailModal({ inquiry }: { inquiry: InquiryAdmin }) {
  const [currentStatus, setCurrentStatus] = useState<'pending' | 'completed'>(inquiry.status);
  const [processingComment, setProcessingComment] = useState('');

  const handleStatusUpdate = () => {
    // 상태 업데이트 로직 추가
    alert(`상태가 ${currentStatus === 'pending' ? '대기중' : '완료'}으로 변경되었습니다.`);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      service: '서비스 관련',
      technical: '기술 지원',
      billing: '결제/크레딧',
      account: '계정 관리',
      agent_request: '에이전트 추가신청',
      other: '기타'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: '대기중',
      completed: '완료'
    };
    return labels[status as keyof typeof labels] || status;
  };

  // 에이전트 추가신청인 경우 다른 레이아웃 사용
  if (inquiry.type === 'agent_request' && inquiry.agentRequestData) {
    return (
      <div className="space-y-6">
        {/* 에이전트 기본 정보 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">에이전트 기본 정보</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">에이전트명</label>
                <p className="mt-1 text-sm text-gray-900">{inquiry.agentRequestData.agentName || '정보 없음'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">카테고리</label>
                <p className="mt-1 text-sm text-gray-900">{inquiry.agentRequestData.categoryId || '정보 없음'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">에이전트 설명</label>
              <p className="text-sm text-gray-900 whitespace-pre-line">{inquiry.agentRequestData.agentDescription || '설명 없음'}</p>
            </div>
          </div>
        </div>

        {/* 개발 비용 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">개발 비용</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">개발 유형</label>
                <p className="mt-1 text-sm text-gray-900">
                  {inquiry.agentRequestData.developmentType === 'free' ? '무료' : '유료'}
                </p>
              </div>
              {inquiry.agentRequestData.developmentType === 'paid' && inquiry.agentRequestData.developmentCost && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">개발 비용</label>
                  <p className="mt-1 text-sm text-gray-900">{inquiry.agentRequestData.developmentCost}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 담당자 정보 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">담당자 정보</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">담당자명</label>
                <p className="mt-1 text-sm text-gray-900">{inquiry.agentRequestData.contactName || '정보 없음'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">담당자 이메일</label>
                <p className="mt-1 text-sm text-gray-900">{inquiry.agentRequestData.contactEmail || '정보 없음'}</p>
              </div>
              {inquiry.agentRequestData.contactPhone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">담당자 연락처</label>
                  <p className="mt-1 text-sm text-gray-900">{inquiry.agentRequestData.contactPhone}</p>
                </div>
              )}
              {inquiry.agentRequestData.department && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">부서</label>
                  <p className="mt-1 text-sm text-gray-900">{inquiry.agentRequestData.department}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 추가 정보 */}
        {inquiry.agentRequestData.additionalInfo && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">추가 정보</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-900 whitespace-pre-line">{inquiry.agentRequestData.additionalInfo}</p>
            </div>
          </div>
        )}

        {/* 답변 처리 결과 설정 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">답변 처리 결과</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">상태 변경</label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value as 'pending' | 'completed')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">대기중</option>
                <option value="completed">처리완료</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">처리 메모</label>
              <textarea
                value={processingComment}
                onChange={(e) => setProcessingComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="처리 관련 메모를 입력하세요..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>상태 업데이트</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 일반 문의인 경우 기존 레이아웃 사용
  return (
    <div className="space-y-6">
      {/* 문의자 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">문의자 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">이름</label>
            <p className="mt-1 text-sm text-gray-900">{inquiry.user?.name || '정보 없음'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">이메일</label>
            <p className="mt-1 text-sm text-gray-900">{inquiry.user?.email || '정보 없음'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">연락처</label>
            <p className="mt-1 text-sm text-gray-900">{inquiry.user?.phone || '정보 없음'}</p>
          </div>
        </div>
      </div>
          
      {/* 문의 내용 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">문의 내용</h3>
        
        {/* 문의 기본 정보 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">제목</label>
              <p className="mt-1 text-sm text-gray-900">{inquiry.title || '제목 없음'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">유형</label>
              <p className="mt-1 text-sm text-gray-900">{getTypeLabel(inquiry.type)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">상태</label>
              <p className="mt-1 text-sm text-gray-900">{getStatusLabel(inquiry.status)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">등록일</label>
              <p className="mt-1 text-sm text-gray-900">
                <SafeDate date={inquiry.createdAt} format="datetime" />
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">상세 내용</label>
            <p className="text-sm text-gray-900 whitespace-pre-line">{inquiry.content || '내용 없음'}</p>
          </div>
        </div>

        {/* 첨부파일 */}
        {inquiry.attachments && inquiry.attachments.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">첨부파일</h4>
            <div className="space-y-2">
              {inquiry.attachments.map((file, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1 ml-3">
                    <p className="text-sm font-medium text-gray-900">{file.originalName}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{(file.size / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      <span>{file.mimeType}</span>
                      <span>•</span>
                      <span>
                        <SafeDate date={file.uploadedAt} />
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => window.open(file.downloadUrl, '_blank')}
                    className="ml-3 px-3 py-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    다운로드
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 답변 처리 결과 설정 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">답변 처리 결과</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상태 변경</label>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value as 'pending' | 'completed')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">대기중</option>
              <option value="completed">처리완료</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">처리 메모</label>
            <textarea
              value={processingComment}
              onChange={(e) => setProcessingComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="처리 관련 메모를 입력하세요..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleStatusUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>상태 업데이트</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
