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

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<InquiryAdmin[]>(mockInquiries);
  const [filteredInquiries, setFilteredInquiries] = useState<InquiryAdmin[]>(mockInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryAdmin | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({});
  const [searchValue, setSearchValue] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    inquiry: InquiryAdmin | null;
    type: 'delete';
  }>({
    isOpen: false,
    inquiry: null,
    type: 'delete'
  });

  // 필터 정의
  const filterOptions = [
    {
      key: 'status',
      label: '상태',
      type: 'select' as const,
      options: [
        { value: 'pending', label: '대기중' },
        { value: 'completed', label: '완료' }
      ]
    },
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
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {inquiry?.title || '제목 없음'}
                </p>
                {inquiry?.attachments && inquiry.attachments.length > 0 && (
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
            onClick={() => inquiry && handleDeleteInquiry(inquiry)}
            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
            title="삭제"
            disabled={!inquiry}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // 상태 배지
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle }
    };

    const labels = {
      pending: '대기중',
      completed: '완료'
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
      service: { bg: 'bg-green-100', text: 'text-green-800' },
      technical: { bg: 'bg-blue-100', text: 'text-blue-800' },
      billing: { bg: 'bg-purple-100', text: 'text-purple-800' },
      account: { bg: 'bg-orange-100', text: 'text-orange-800' },
      other: { bg: 'bg-gray-100', text: 'text-gray-800' }
    };

    const labels = {
      service: '서비스',
      technical: '기술',
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
  const handleFilterChange = (key: string, value: string | string[]) => {
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





  const handleDeleteInquiry = (inquiry: InquiryAdmin) => {
    setConfirmModal({
      isOpen: true,
      inquiry,
      type: 'delete'
    });
  };

  const handleConfirmAction = () => {
    if (!confirmModal.inquiry) return;

    if (confirmModal.type === 'delete') {
      setInquiries(prev => prev.filter(inquiry => inquiry.id !== confirmModal.inquiry!.id));
    }

    setConfirmModal({ isOpen: false, inquiry: null, type: 'delete' });
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AdminStats
            title="전체 문의"
            value={inquiries.length}
            icon={MessageSquare}
            color="blue"
          />
          <AdminStats
            title="대기중"
            value={inquiries.filter(i => i.status === 'pending').length}
            icon={Clock}
            color="yellow"
          />
          <AdminStats
            title="완료"
            value={inquiries.filter(i => i.status === 'completed').length}
            icon={CheckCircle}
            color="green"
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



        {/* 확인 모달 */}
        <AdminModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, inquiry: null, type: 'delete' })}
          title="문의 삭제"
          size="sm"
        >
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              이 문의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, inquiry: null, type: 'delete' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-red-600 hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
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

  return (
    <div className="space-y-6">
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
        
        {/* 문의 기본 정보 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">제목</label>
              <p className="mt-1 text-sm text-gray-900">{inquiry.title}</p>
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
                {new Date(inquiry.createdAt).toLocaleString('ko-KR')}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">상세 내용</label>
            <p className="text-sm text-gray-900 whitespace-pre-line">{inquiry.content}</p>
          </div>
        </div>

        {/* 첨부파일 */}
        {inquiry.attachments && inquiry.attachments.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">첨부파일</h4>
            <div className="space-y-2">
              {(inquiry.attachments || []).map((file, index) => (
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
                      <span>{new Date(file.uploadedAt).toLocaleDateString('ko-KR')}</span>
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
              <option value="completed">완료</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">처리 결과 코멘트</label>
            <textarea
              value={processingComment}
              onChange={(e) => setProcessingComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="처리 결과에 대한 코멘트를 입력하세요..."
            />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleStatusUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              상태 업데이트
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
