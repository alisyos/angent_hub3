'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminStats from '@/components/admin/AdminStats';
import AdminFilter from '@/components/admin/AdminFilter';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import AdminPagination from '@/components/admin/AdminPagination';
import { mockFAQs } from '@/data/admin';
import { FAQAdmin } from '@/types/admin';
import { 
  HelpCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Users,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Tag,
  Save,
  X,
  Check
} from 'lucide-react';

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<FAQAdmin[]>(mockFAQs);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQAdmin[]>(mockFAQs);
  const [selectedFaq, setSelectedFaq] = useState<FAQAdmin | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({});
  const [searchValue, setSearchValue] = useState('');
  const [editingFaq, setEditingFaq] = useState<Partial<FAQAdmin>>({
    category: '',
    question: '',
    answer: '',
    isPublished: true,
    priority: 1,
    tags: []
  });
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    faq: FAQAdmin | null;
    type: 'delete' | 'publish' | 'unpublish';
  }>({
    isOpen: false,
    faq: null,
    type: 'delete'
  });

  // 카테고리 목록
  const categories = [
    { value: 'general', label: '일반' },
    { value: 'payment', label: '결제' },
    { value: 'technical', label: '기술' },
    { value: 'account', label: '계정' },
    { value: 'service', label: '서비스' }
  ];

  // 필터 정의
  const filterOptions = [
    {
      key: 'category',
      label: '카테고리',
      type: 'select' as const,
      options: categories
    },
    {
      key: 'isPublished',
      label: '상태',
      type: 'select' as const,
      options: [
        { value: 'true', label: '게시됨' },
        { value: 'false', label: '비공개' }
      ]
    },
    {
      key: 'priority',
      label: '우선순위',
      type: 'select' as const,
      options: [
        { value: '1', label: '1순위' },
        { value: '2', label: '2순위' },
        { value: '3', label: '3순위' },
        { value: '4', label: '4순위' },
        { value: '5', label: '5순위' }
      ]
    }
  ];

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'question',
      label: 'FAQ 정보',
      render: (faq: FAQAdmin) => (
        <div className="min-w-0 flex-1">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              faq?.isPublished ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <HelpCircle className={`w-5 h-5 ${
                faq?.isPublished ? 'text-green-600' : 'text-gray-400'
              }`} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {faq?.question || '질문 없음'}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {faq?.answer && faq.answer.length > 80 
                  ? `${faq.answer.substring(0, 80)}...` 
                  : (faq?.answer || '답변 없음')}
              </p>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs text-gray-400">
                  우선순위: {faq?.priority || 0}
                </span>
                {(faq.tags || []).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: '카테고리',
      render: (faq: FAQAdmin) => getCategoryBadge(faq?.category || 'general')
    },
    {
      key: 'status',
      label: '상태',
      render: (faq: FAQAdmin) => getStatusBadge(faq?.isPublished ?? false)
    },
    {
      key: 'stats',
      label: '통계',
      render: (faq: FAQAdmin) => (
        <div className="text-sm">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{faq?.viewCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600">{faq?.helpful || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown className="w-4 h-4 text-red-500" />
              <span className="text-red-600">{faq?.notHelpful || 0}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: '등록일',
      render: (faq: FAQAdmin) => (
        <div>
          <p className="text-sm text-gray-900">
            {faq?.createdAt ? new Date(faq.createdAt).toLocaleDateString('ko-KR') : '날짜 없음'}
          </p>
          <p className="text-xs text-gray-500">
            {faq?.createdBy || '작성자 없음'}
          </p>
        </div>
      )
    },
    {
      key: 'actions',
      label: '작업',
      render: (faq: FAQAdmin) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => faq && handleViewFaq(faq)}
            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
            title="상세 보기"
            disabled={!faq}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => faq && handleEditFaq(faq)}
            className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
            title="수정"
            disabled={!faq}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => faq && handlePriorityChange(faq, 'up')}
            className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded"
            title="우선순위 올리기"
            disabled={!faq}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => faq && handlePriorityChange(faq, 'down')}
            className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded"
            title="우선순위 내리기"
            disabled={!faq}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => faq && handleTogglePublish(faq)}
            className={`p-1 hover:bg-opacity-50 rounded ${
              faq?.isPublished
                ? 'text-yellow-600 hover:bg-yellow-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={faq?.isPublished ? '비공개' : '게시'}
            disabled={!faq}
          >
            {faq?.isPublished ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          </button>
          <button
            onClick={() => faq && handleDeleteFaq(faq)}
            className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
            title="삭제"
            disabled={!faq}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // 카테고리 배지
  const getCategoryBadge = (category: string) => {
    const styles = {
      general: { bg: 'bg-gray-100', text: 'text-gray-800' },
      payment: { bg: 'bg-green-100', text: 'text-green-800' },
      technical: { bg: 'bg-blue-100', text: 'text-blue-800' },
      account: { bg: 'bg-purple-100', text: 'text-purple-800' },
      service: { bg: 'bg-orange-100', text: 'text-orange-800' }
    };

    const labels = {
      general: '일반',
      payment: '결제',
      technical: '기술',
      account: '계정',
      service: '서비스'
    };

    const style = styles[category as keyof typeof styles] || styles.general;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {labels[category as keyof typeof labels] || category}
      </span>
    );
  };

  // 상태 배지
  const getStatusBadge = (isPublished: boolean) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isPublished
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {isPublished ? '게시됨' : '비공개'}
      </span>
    );
  };

  // 필터링 로직
  const applyFilters = () => {
    let filtered = [...faqs];

    // 검색어 필터링
    if (searchValue) {
      filtered = filtered.filter(faq =>
        (faq?.question || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (faq?.answer || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (faq?.tags || []).some(tag => tag.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }

    // 기타 필터링
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== 'all') {
        if (key === 'isPublished') {
          filtered = filtered.filter(faq => (faq?.isPublished ?? false) === (value === 'true'));
        } else if (key === 'priority') {
          filtered = filtered.filter(faq => (faq?.priority ?? 0) === parseInt(value));
        } else {
          filtered = filtered.filter(faq => {
            const faqValue = faq?.[key as keyof FAQAdmin];
            return faqValue === value;
          });
        }
      }
    });

    // 우선순위순 정렬
    filtered.sort((a, b) => (a?.priority ?? 0) - (b?.priority ?? 0));

    setFilteredFaqs(filtered);
    setCurrentPage(1);
  };

  // 이벤트 핸들러
  const handleFilterChange = (key: string, value: string | string[]) => {
    const newFilterValues = { ...filterValues, [key]: value };
    setFilterValues(newFilterValues);
    applyFilters();
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    applyFilters();
  };

  const handleViewFaq = (faq: FAQAdmin) => {
    setSelectedFaq(faq);
    setShowDetailModal(true);
  };

  const handleEditFaq = (faq: FAQAdmin) => {
    setEditingFaq({
      ...faq,
      tags: [...faq.tags]
    });
    setShowEditModal(true);
  };

  const handleCreateFaq = () => {
    setEditingFaq({
      category: '',
      question: '',
      answer: '',
      isPublished: true,
      priority: 1,
      tags: []
    });
    setShowCreateModal(true);
  };

  const handlePriorityChange = (faq: FAQAdmin, direction: 'up' | 'down') => {
    const newPriority = direction === 'up' ? Math.max(1, faq.priority - 1) : faq.priority + 1;
    
    setFaqs(prev => prev.map(f =>
      f.id === faq.id ? { ...f, priority: newPriority, updatedAt: new Date().toISOString() } : f
    ));
  };

  const handleTogglePublish = (faq: FAQAdmin) => {
    setConfirmModal({
      isOpen: true,
      faq,
      type: faq.isPublished ? 'unpublish' : 'publish'
    });
  };

  const handleDeleteFaq = (faq: FAQAdmin) => {
    setConfirmModal({
      isOpen: true,
      faq,
      type: 'delete'
    });
  };

  const handleSaveFaq = () => {
    if (!editingFaq.question || !editingFaq.answer || !editingFaq.category) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (showCreateModal) {
      // 새 FAQ 생성
      const newFaq: FAQAdmin = {
        id: Date.now().toString(),
        category: editingFaq.category!,
        question: editingFaq.question!,
        answer: editingFaq.answer!,
        isPublished: editingFaq.isPublished!,
        priority: editingFaq.priority!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 0,
        helpful: 0,
        notHelpful: 0,
        createdBy: '관리자',
        tags: editingFaq.tags || []
      };

      setFaqs(prev => [...prev, newFaq]);
      setShowCreateModal(false);
    } else {
      // 기존 FAQ 수정
      setFaqs(prev => prev.map(faq =>
        faq.id === editingFaq.id
          ? {
              ...faq,
              ...editingFaq,
              updatedAt: new Date().toISOString(),
              updatedBy: '관리자'
            }
          : faq
      ));
      setShowEditModal(false);
    }

    alert(showCreateModal ? 'FAQ가 생성되었습니다.' : 'FAQ가 수정되었습니다.');
  };

  const handleConfirmAction = () => {
    if (!confirmModal.faq) return;

    if (confirmModal.type === 'delete') {
      setFaqs(prev => prev.filter(faq => faq.id !== confirmModal.faq!.id));
      alert('FAQ가 삭제되었습니다.');
    } else if (confirmModal.type === 'publish') {
      setFaqs(prev => prev.map(faq =>
        faq.id === confirmModal.faq!.id
          ? { ...faq, isPublished: true, updatedAt: new Date().toISOString() }
          : faq
      ));
      alert('FAQ가 게시되었습니다.');
    } else if (confirmModal.type === 'unpublish') {
      setFaqs(prev => prev.map(faq =>
        faq.id === confirmModal.faq!.id
          ? { ...faq, isPublished: false, updatedAt: new Date().toISOString() }
          : faq
      ));
      alert('FAQ가 비공개되었습니다.');
    }

    setConfirmModal({ isOpen: false, faq: null, type: 'delete' });
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !editingFaq.tags?.includes(tag.trim())) {
      setEditingFaq(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag.trim()]
      }));
    }
  };

  const handleTagRemove = (index: number) => {
    setEditingFaq(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }));
  };

  // 페이지네이션
  const totalItems = filteredFaqs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFaqs = filteredFaqs.slice(startIndex, endIndex);

  const addFaqButton = (
    <button
      onClick={handleCreateFaq}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Plus className="w-4 h-4 mr-2" />
      FAQ 추가
    </button>
  );

  return (
    <AdminLayout
      title="FAQ 관리"
      description="자주 묻는 질문을 관리하고 우선순위를 설정하세요"
      actions={addFaqButton}
      hideTimePeriod={true}
    >

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AdminStats
            title="전체 FAQ"
            value={faqs.length}
            icon={HelpCircle}
            color="blue"
            change={{ value: 8, type: 'positive' }}
          />
          <AdminStats
            title="게시된 FAQ"
            value={faqs.filter(f => f.isPublished).length}
            icon={Check}
            color="green"
            change={{ value: 12, type: 'positive' }}
          />
          <AdminStats
            title="총 조회수"
            value={faqs.reduce((sum, f) => sum + f.viewCount, 0)}
            icon={Eye}
            color="purple"
            change={{ value: 25, type: 'positive' }}
          />
          <AdminStats
            title="평균 만족도"
            value={`${Math.round(
              (faqs.reduce((sum, f) => sum + f.helpful, 0) / 
               Math.max(faqs.reduce((sum, f) => sum + f.helpful + f.notHelpful, 0), 1)) * 100
            )}%`}
            icon={ThumbsUp}
            color="yellow"
            change={{ value: 5, type: 'positive' }}
          />
        </div>

        {/* 필터 */}
        <AdminFilter
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder="FAQ 질문, 답변, 태그로 검색..."
          filters={filterOptions}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
        />

        {/* FAQ 테이블 */}
        <AdminTable
          columns={columns}
          data={paginatedFaqs}
          emptyMessage="FAQ가 없습니다"
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

        {/* FAQ 상세 모달 */}
        <AdminModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="FAQ 상세 정보"
          size="lg"
        >
          {selectedFaq && <FaqDetailModal faq={selectedFaq} />}
        </AdminModal>

        {/* FAQ 편집 모달 */}
        <AdminModal
          isOpen={showEditModal || showCreateModal}
          onClose={() => {
            setShowEditModal(false);
            setShowCreateModal(false);
          }}
          title={showCreateModal ? 'FAQ 추가' : 'FAQ 수정'}
          size="lg"
        >
          <FaqEditModal
            faq={editingFaq}
            onChange={setEditingFaq}
            categories={categories}
            onSave={handleSaveFaq}
            onCancel={() => {
              setShowEditModal(false);
              setShowCreateModal(false);
            }}
            onTagAdd={handleTagAdd}
            onTagRemove={handleTagRemove}
          />
        </AdminModal>

        {/* 확인 모달 */}
        <AdminModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, faq: null, type: 'delete' })}
          title={
            confirmModal.type === 'delete' ? 'FAQ 삭제' :
            confirmModal.type === 'publish' ? 'FAQ 게시' : 'FAQ 비공개'
          }
          size="sm"
        >
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {confirmModal.type === 'delete' && '이 FAQ를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'}
              {confirmModal.type === 'publish' && 'FAQ를 게시하시겠습니까?'}
              {confirmModal.type === 'unpublish' && 'FAQ를 비공개로 설정하시겠습니까?'}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, faq: null, type: 'delete' })}
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
                {confirmModal.type === 'delete' ? '삭제' : '확인'}
              </button>
            </div>
          </div>
        </AdminModal>
    </AdminLayout>
  );
}

// FAQ 상세 정보 모달 컴포넌트
function FaqDetailModal({ faq }: { faq: FAQAdmin }) {
  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">FAQ 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">카테고리</label>
            <p className="mt-1 text-sm text-gray-900">{faq.category}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">우선순위</label>
            <p className="mt-1 text-sm text-gray-900">{faq.priority}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">상태</label>
            <p className="mt-1 text-sm text-gray-900">
              {faq.isPublished ? '게시됨' : '비공개'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">조회수</label>
            <p className="mt-1 text-sm text-gray-900">{faq.viewCount.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">등록일</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(faq.createdAt).toLocaleString('ko-KR')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">수정일</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(faq.updatedAt).toLocaleString('ko-KR')}
            </p>
          </div>
        </div>
      </div>

      {/* 질문과 답변 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">질문</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-900">{faq.question}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">답변</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-900 whitespace-pre-line">{faq.answer}</p>
        </div>
      </div>

      {/* 태그 */}
      {faq.tags.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">태그</h3>
          <div className="flex flex-wrap gap-2">
            {faq.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 통계 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">피드백 통계</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{faq.viewCount}</div>
            <div className="text-sm text-blue-600">조회수</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{faq.helpful}</div>
            <div className="text-sm text-green-600">도움됨</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{faq.notHelpful}</div>
            <div className="text-sm text-red-600">도움안됨</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// FAQ 편집 모달 컴포넌트
function FaqEditModal({ 
  faq, 
  onChange, 
  categories, 
  onSave, 
  onCancel,
  onTagAdd,
  onTagRemove 
}: {
  faq: Partial<FAQAdmin>;
  onChange: (faq: Partial<FAQAdmin>) => void;
  categories: { value: string; label: string }[];
  onSave: () => void;
  onCancel: () => void;
  onTagAdd: (tag: string) => void;
  onTagRemove: (index: number) => void;
}) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      onTagAdd(newTag);
      setNewTag('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리 *
          </label>
          <select
            value={faq.category || ''}
            onChange={(e) => onChange({ ...faq, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            우선순위
          </label>
          <input
            type="number"
            min="1"
            value={faq.priority || 1}
            onChange={(e) => onChange({ ...faq, priority: parseInt(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          질문 *
        </label>
        <input
          type="text"
          value={faq.question || ''}
          onChange={(e) => onChange({ ...faq, question: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="자주 묻는 질문을 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          답변 *
        </label>
        <textarea
          value={faq.answer || ''}
          onChange={(e) => onChange({ ...faq, answer: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="답변을 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          태그
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="태그 입력 후 엔터"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            추가
          </button>
        </div>
        {faq.tags && faq.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {faq.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onTagRemove(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublished"
          checked={faq.isPublished || false}
          onChange={(e) => onChange({ ...faq, isPublished: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
          즉시 게시
        </label>
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