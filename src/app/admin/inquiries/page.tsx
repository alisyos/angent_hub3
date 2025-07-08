'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminStats from '@/components/admin/AdminStats';
import AdminFilter from '@/components/admin/AdminFilter';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import AdminPagination from '@/components/admin/AdminPagination';
import { mockInquiries } from '@/data/admin';
import { InquiryAdmin, InquiryResponse } from '@/types/admin';
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Pause,
  Eye,
  MessageCircle,
  User,
  Calendar,
  Tag,
  Send,
  Edit,
  Archive,
  AlertTriangle,
  X
} from 'lucide-react';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<InquiryAdmin[]>(mockInquiries);
  const [filteredInquiries, setFilteredInquiries] = useState<InquiryAdmin[]>(mockInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryAdmin | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [responseText, setResponseText] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [searchValue, setSearchValue] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    inquiry: InquiryAdmin | null;
    type: 'status' | 'delete';
    newStatus?: 'pending' | 'in_progress' | 'resolved' | 'closed';
  }>({
    isOpen: false,
    inquiry: null,
    type: 'status'
  });

  // 필터 정의
  const filterOptions = [
    {
      key: 'status',
      label: '상태',
      type: 'select' as const,
      options: [
        { value: 'pending', label: '대기중' },
        { value: 'in_progress', label: '처리중' },
        { value: 'resolved', label: '완료' },
        { value: 'closed', label: '종료' }
      ]
    },
    {
      key: 'type',
      label: '문의 유형',
      type: 'select' as const,
      options: [
        { value: 'technical', label: '기술 문의' },
        { value: 'service', label: '서비스 문의' },
        { value: 'billing', label: '결제 문의' },
        { value: 'account', label: '계정 문의' },
        { value: 'other', label: '기타' }
      ]
    },
    {
      key: 'priority',
      label: '우선순위',
      type: 'select' as const,
      options: [
        { value: 'low', label: '낮음' },
        { value: 'medium', label: '보통' },
        { value: 'high', label: '높음' },
        { value: 'urgent', label: '긴급' }
      ]
    }
  ];

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'info',
      label: '문의 정보',
      render: (inquiry: InquiryAdmin) => (
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {inquiry?.title || '제목 없음'}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {inquiry?.content && inquiry.content.length > 60 
                  ? `${inquiry.content.substring(0, 60)}...` 
                  : (inquiry?.content || '내용 없음')}
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'user',
      label: '문의자',
      render: (inquiry: InquiryAdmin) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{inquiry?.user?.name || '사용자 정보 없음'}</p>
          <p className="text-sm text-gray-500">{inquiry?.user?.email || '이메일 없음'}</p>
        </div>
      )
    },
    {
      key: 'type',
      label: '유형',
      render: (inquiry: InquiryAdmin) => getTypeBadge(inquiry?.type || 'other')
    },
    {
      key: 'priority',
      label: '우선순위',
      render: (inquiry: InquiryAdmin) => getPriorityBadge(inquiry?.priority || 'medium')
    },
    {
      key: 'status',
      label: '상태',
      render: (inquiry: InquiryAdmin) => getStatusBadge(inquiry?.status || 'pending')
    },
    {
      key: 'createdAt',
      label: '등록일',
      render: (inquiry: InquiryAdmin) => (
        <div>
          <p className="text-sm text-gray-900">
            {inquiry?.createdAt ? new Date(inquiry.createdAt).toLocaleDateString('ko-KR') : '날짜 없음'}
          </p>
          <p className="text-xs text-gray-500">
            {inquiry?.createdAt ? new Date(inquiry.createdAt).toLocaleTimeString('ko-KR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : '시간 없음'}
          </p>
        </div>
      )
    },
    {
      key: 'actions',
      label: '작업',
      render: (inquiry: InquiryAdmin) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => inquiry && handleViewInquiry(inquiry)}
            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
            title="상세 보기"
            disabled={!inquiry}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => inquiry && handleReplyInquiry(inquiry)}
            className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
            title="답변 작성"
            disabled={!inquiry}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => inquiry && handleStatusChange(inquiry, 'resolved')}
            className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded"
            title="완료 처리"
            disabled={!inquiry}
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => inquiry && handleDeleteInquiry(inquiry)}
            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
            title="삭제"
            disabled={!inquiry}
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // 상태 배지
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle },
      resolved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      closed: { bg: 'bg-gray-100', text: 'text-gray-800', icon: X }
    };

    const labels = {
      pending: '대기중',
      in_progress: '처리중',
      resolved: '완료',
      closed: '종료'
    };

    const style = styles[status as keyof typeof styles];
    const IconComponent = style.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  // 유형 배지
  const getTypeBadge = (type: string) => {
    const styles = {
      technical: { bg: 'bg-blue-100', text: 'text-blue-800' },
      service: { bg: 'bg-green-100', text: 'text-green-800' },
      billing: { bg: 'bg-purple-100', text: 'text-purple-800' },
      account: { bg: 'bg-orange-100', text: 'text-orange-800' },
      other: { bg: 'bg-gray-100', text: 'text-gray-800' }
    };

    const labels = {
      technical: '기술',
      service: '서비스',
      billing: '결제',
      account: '계정',
      other: '기타'
    };

    const style = styles[type as keyof typeof styles];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {labels[type as keyof typeof labels]}
      </span>
    );
  };

  // 우선순위 배지
  const getPriorityBadge = (priority: string) => {
    const styles = {
      low: { bg: 'bg-gray-100', text: 'text-gray-800' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      high: { bg: 'bg-orange-100', text: 'text-orange-800' },
      urgent: { bg: 'bg-red-100', text: 'text-red-800' }
    };

    const labels = {
      low: '낮음',
      medium: '보통',
      high: '높음',
      urgent: '긴급'
    };

    const style = styles[priority as keyof typeof styles];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    );
  };

  // 필터링 로직
  const applyFilters = () => {
    let filtered = [...inquiries];

    // 검색어 필터링
    if (searchValue) {
      filtered = filtered.filter(inquiry =>
        (inquiry?.title || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (inquiry?.content || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (inquiry?.user?.name || '').toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // 기타 필터링
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(inquiry => {
          const inquiryValue = inquiry[key as keyof InquiryAdmin];
          return inquiryValue === value;
        });
      }
    });

    setFilteredInquiries(filtered);
    setCurrentPage(1);
  };

  // 이벤트 핸들러
  const handleFilterChange = (key: string, value: any) => {
    const newFilterValues = { ...filterValues, [key]: value };
    setFilterValues(newFilterValues);
    
    // 즉시 필터 적용
    let filtered = [...inquiries];

    // 검색어 필터링
    if (searchValue) {
      filtered = filtered.filter(inquiry =>
        (inquiry?.title || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (inquiry?.content || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (inquiry?.user?.name || '').toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // 기타 필터링
    Object.entries(newFilterValues).forEach(([filterKey, filterValue]) => {
      if (filterValue && filterValue !== 'all') {
        filtered = filtered.filter(inquiry => {
          const inquiryValue = inquiry[filterKey as keyof InquiryAdmin];
          return inquiryValue === filterValue;
        });
      }
    });

    setFilteredInquiries(filtered);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    applyFilters();
  };

  const handleViewInquiry = (inquiry: InquiryAdmin) => {
    setSelectedInquiry(inquiry);
    setShowInquiryModal(true);
  };

  const handleReplyInquiry = (inquiry: InquiryAdmin) => {
    setSelectedInquiry(inquiry);
    setResponseText('');
    setShowResponseModal(true);
  };

  const handleStatusChange = (inquiry: InquiryAdmin, newStatus: 'pending' | 'in_progress' | 'resolved' | 'closed') => {
    setConfirmModal({
      isOpen: true,
      inquiry,
      type: 'status',
      newStatus
    });
  };

  const handleDeleteInquiry = (inquiry: InquiryAdmin) => {
    setConfirmModal({
      isOpen: true,
      inquiry,
      type: 'delete'
    });
  };

  const handleConfirmAction = () => {
    if (!confirmModal.inquiry) return;

    if (confirmModal.type === 'status' && confirmModal.newStatus) {
      setInquiries(prev => prev.map(inquiry =>
        inquiry.id === confirmModal.inquiry!.id
          ? { ...inquiry, status: confirmModal.newStatus!, updatedAt: new Date().toISOString() }
          : inquiry
      ));
    } else if (confirmModal.type === 'delete') {
      setInquiries(prev => prev.filter(inquiry => inquiry.id !== confirmModal.inquiry!.id));
    }

    setConfirmModal({ isOpen: false, inquiry: null, type: 'status' });
  };

  const handleSendResponse = () => {
    if (!selectedInquiry || !responseText.trim()) return;

    const newResponse: InquiryResponse = {
      id: Date.now().toString(),
      inquiryId: selectedInquiry.id,
      content: responseText,
      attachments: [],
      author: {
        id: 'admin1',
        name: '관리자',
        role: 'admin'
      },
      isInternal: false,
      createdAt: new Date().toISOString()
    };

    setInquiries(prev => prev.map(inquiry =>
      inquiry.id === selectedInquiry.id
        ? {
            ...inquiry,
            responses: [...inquiry.responses, newResponse],
            status: 'in_progress' as const,
            updatedAt: new Date().toISOString()
          }
        : inquiry
    ));

    setResponseText('');
    setShowResponseModal(false);
    alert('답변이 전송되었습니다.');
  };

  // 페이지네이션
  const totalItems = filteredInquiries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInquiries = filteredInquiries.slice(startIndex, endIndex);

  return (
    <AdminLayout
      title="문의 관리"
      description="사용자 문의를 관리하고 응답하세요"
      hideTimePeriod={true}
    >

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AdminStats
            title="전체 문의"
            value={inquiries.length}
            icon={MessageSquare}
            color="blue"
            change={{ value: 12, type: 'positive' }}
          />
          <AdminStats
            title="대기중"
            value={inquiries.filter(i => i.status === 'pending').length}
            icon={Clock}
            color="yellow"
            change={{ value: -5, type: 'negative' }}
          />
          <AdminStats
            title="처리중"
            value={inquiries.filter(i => i.status === 'in_progress').length}
            icon={AlertCircle}
            color="blue"
            change={{ value: 8, type: 'positive' }}
          />
          <AdminStats
            title="완료"
            value={inquiries.filter(i => i.status === 'resolved').length}
            icon={CheckCircle}
            color="green"
            change={{ value: 15, type: 'positive' }}
          />
        </div>

        {/* 필터 */}
        <AdminFilter
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder="문의 제목, 내용, 사용자명으로 검색..."
          filters={filterOptions}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
        />

        {/* 문의 테이블 */}
        <AdminTable
          columns={columns}
          data={paginatedInquiries}
          emptyMessage="문의가 없습니다"
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

        {/* 문의 상세 모달 */}
        <AdminModal
          isOpen={showInquiryModal}
          onClose={() => setShowInquiryModal(false)}
          title="문의 상세 정보"
          size="lg"
        >
          {selectedInquiry && <InquiryDetailModal inquiry={selectedInquiry} />}
        </AdminModal>

        {/* 답변 작성 모달 */}
        <AdminModal
          isOpen={showResponseModal}
          onClose={() => setShowResponseModal(false)}
          title="답변 작성"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedInquiry?.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {selectedInquiry?.content}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                답변 내용
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="답변을 입력하세요..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSendResponse}
                disabled={!responseText.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                답변 전송
              </button>
            </div>
          </div>
        </AdminModal>

        {/* 확인 모달 */}
        <AdminModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, inquiry: null, type: 'status' })}
          title={confirmModal.type === 'delete' ? '문의 삭제' : '상태 변경'}
          size="sm"
        >
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {confirmModal.type === 'delete'
                ? '이 문의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
                : `문의 상태를 변경하시겠습니까?`
              }
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, inquiry: null, type: 'status' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md ${
                  confirmModal.type === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {confirmModal.type === 'delete' ? '삭제' : '변경'}
              </button>
            </div>
          </div>
        </AdminModal>
    </AdminLayout>
  );
}

// 문의 상세 정보 모달 컴포넌트
function InquiryDetailModal({ inquiry }: { inquiry: InquiryAdmin }) {
  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">문의 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">제목</label>
            <p className="mt-1 text-sm text-gray-900">{inquiry.title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">유형</label>
            <p className="mt-1 text-sm text-gray-900">{inquiry.type}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">우선순위</label>
            <p className="mt-1 text-sm text-gray-900">{inquiry.priority}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">상태</label>
            <p className="mt-1 text-sm text-gray-900">{inquiry.status}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">등록일</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(inquiry.createdAt).toLocaleString('ko-KR')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">최종 수정일</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(inquiry.updatedAt).toLocaleString('ko-KR')}
            </p>
          </div>
        </div>
      </div>

      {/* 문의자 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">문의자 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">이름</label>
            <p className="mt-1 text-sm text-gray-900">{inquiry.user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">이메일</label>
            <p className="mt-1 text-sm text-gray-900">{inquiry.user.email}</p>
          </div>
        </div>
      </div>

      {/* 문의 내용 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">문의 내용</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-900 whitespace-pre-line">{inquiry.content}</p>
        </div>
      </div>

      {/* 첨부파일 */}
      {inquiry.attachments && inquiry.attachments.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">첨부파일</h3>
          <div className="space-y-2">
            {(inquiry.attachments || []).map((file, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{file.originalName}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  다운로드
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 답변 이력 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">답변 이력</h3>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {(inquiry.responses || []).length > 0 ? (
            (inquiry.responses || []).map((response) => (
              <div key={response.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {response.author.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(response.createdAt).toLocaleString('ko-KR')}
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {response.content}
                </p>
                {(response.attachments || []).length > 0 && (
                  <div className="mt-2 space-y-1">
                    {(response.attachments || []).map((file, index) => (
                      <div key={index} className="text-xs text-blue-600">
                        📎 {file.originalName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              아직 답변이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
