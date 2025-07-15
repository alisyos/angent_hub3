'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { showAlert, showDeleteConfirm } from '@/utils/notifications';
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
  Calendar,
  Tag,
  Save,
  X,
  Check,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Edit2,
  Search,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<FAQAdmin[]>(mockFAQs);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQAdmin[]>(mockFAQs);
  const [selectedFaq, setSelectedFaq] = useState<FAQAdmin | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
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
    order: 1,
    tags: []
  });

  // 카테고리 목록 (실제 FAQ 페이지와 동기화)
  const categories = [
    { value: 'general', label: '일반' },
    { value: 'credits', label: '크레딧' },
    { value: 'agents', label: 'AI 에이전트' },
    { value: 'security', label: '보안' },
    { value: 'account', label: '계정' }
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
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs text-gray-400">
                  순서: {faq?.order || 0}
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
      key: 'createdAt',
      label: '날짜',
      render: (faq: FAQAdmin) => {
        // 수정일이 등록일과 다르면 수정일을 표시, 같으면 등록일을 표시
        const hasBeenUpdated = faq?.updatedAt && faq.updatedAt !== faq.createdAt;
        const displayDate = hasBeenUpdated ? faq.updatedAt : faq.createdAt;
        const dateLabel = hasBeenUpdated ? '수정' : '등록';
        
        return (
          <div>
            <p className="text-sm text-gray-900">
              {displayDate ? new Date(displayDate).toLocaleDateString('ko-KR') : '날짜 없음'}
            </p>
            <p className="text-xs text-gray-500">
              {dateLabel}일
            </p>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: '작업',
      render: (faq: FAQAdmin) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => faq && handleViewFaq(faq)}
            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
            title="상세 보기 및 편집"
            disabled={!faq}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => faq && handleOrderChange(faq, 'up')}
            className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded"
            title="순서 올리기"
            disabled={!faq}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => faq && handleOrderChange(faq, 'down')}
            className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded"
            title="순서 내리기"
            disabled={!faq}
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // 카테고리 배지
  const getCategoryBadge = (category: string) => {
    const styles = {
      general: { bg: 'bg-gray-100', text: 'text-gray-800' },
      credits: { bg: 'bg-green-100', text: 'text-green-800' },
      agents: { bg: 'bg-blue-100', text: 'text-blue-800' },
      security: { bg: 'bg-purple-100', text: 'text-purple-800' },
      account: { bg: 'bg-orange-100', text: 'text-orange-800' }
    };

    const labels = {
      general: '일반',
      credits: '크레딧',
      agents: 'AI 에이전트',
      security: '보안',
      account: '계정'
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
        } else {
          filtered = filtered.filter(faq => {
            const faqValue = faq?.[key as keyof FAQAdmin];
            return faqValue === value;
          });
        }
      }
    });

    // 우선순위순 정렬
    filtered.sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));

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
    setShowCreateModal(true);
  };

  const handleCreateFaq = () => {
    setEditingFaq({
      category: '',
      question: '',
      answer: '',
      isPublished: true,
      order: 1,
      tags: []
    });
    setShowCreateModal(true);
  };

  const handleOrderChange = (faq: FAQAdmin, direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? Math.max(1, faq.order - 1) : faq.order + 1;
    
    setFaqs(prev => prev.map(f =>
      f.id === faq.id ? { ...f, order: newOrder, updatedAt: new Date().toISOString() } : f
    ));
  };

  const handleTogglePublish = (faq: FAQAdmin) => {
    setFaqs(prev => prev.map(f =>
      f.id === faq.id
        ? { ...f, isPublished: !f.isPublished, updatedAt: new Date().toISOString() }
        : f
    ));
  };

  const handleDeleteFaq = (faq: FAQAdmin) => {
    showDeleteConfirm('FAQ를 삭제하시겠습니까?', () => {
      setFaqs(prev => prev.filter(f => f.id !== faq.id));
      showAlert('FAQ가 삭제되었습니다.', 'success');
    });
  };

  const handleSaveFaq = (updatedFaq?: FAQAdmin) => {
    if (updatedFaq) {
      // 기존 FAQ 업데이트
      setFaqs(prev => prev.map(f => 
        f.id === updatedFaq.id 
          ? { ...updatedFaq, updatedAt: new Date().toISOString() }
          : f
      ));
      setShowDetailModal(false);
      showAlert('FAQ가 수정되었습니다.', 'success');
    } else {
      // 새 FAQ 생성
      if (!editingFaq.category || !editingFaq.question || !editingFaq.answer) {
        showAlert('카테고리, 질문, 답변을 모두 입력해주세요.', 'warning');
        return;
      }

      const newFaq: FAQAdmin = {
        id: `faq_${Date.now()}`,
        category: editingFaq.category!,
        question: editingFaq.question!,
        answer: editingFaq.answer!,
        isPublished: editingFaq.isPublished!,
        order: editingFaq.order!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: '관리자',
        tags: editingFaq.tags || []
      };

      setFaqs(prev => [...prev, newFaq]);
      setShowCreateModal(false);
      setEditingFaq({
        category: '',
        question: '',
        answer: '',
        isPublished: true,
        order: 1,
        tags: []
      });
      showAlert('FAQ가 추가되었습니다.', 'success');
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AdminStats
            title="전체 FAQ"
            value={faqs.length}
            icon={HelpCircle}
            color="blue"
          />
          <AdminStats
            title="게시된 FAQ"
            value={faqs.filter(f => f.isPublished).length}
            icon={CheckCircle}
            color="green"
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
          {selectedFaq && (
            <FaqDetailModal
              faq={selectedFaq}
              onSave={handleSaveFaq}
              onDelete={handleDeleteFaq}
              onTogglePublish={handleTogglePublish}
              categories={categories}
            />
          )}
        </AdminModal>

        {/* FAQ 편집 모달 */}
        <AdminModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="FAQ 추가"
          size="lg"
        >
          <FaqEditModal
            faq={editingFaq}
            onChange={setEditingFaq}
            categories={categories}
            onSave={handleSaveFaq}
            onCancel={() => setShowCreateModal(false)}
            onTagAdd={handleTagAdd}
            onTagRemove={handleTagRemove}
          />
        </AdminModal>
    </AdminLayout>
  );
}

// FAQ 상세 정보 모달 컴포넌트
function FaqDetailModal({ faq, onSave, onDelete, onTogglePublish, categories }: { 
  faq: FAQAdmin; 
  onSave: (updatedFaq: FAQAdmin) => void;
  onDelete: (faq: FAQAdmin) => void;
  onTogglePublish: (faq: FAQAdmin) => void;
  categories: { value: string; label: string }[];
}) {
  const [editingFaq, setEditingFaq] = useState<FAQAdmin>(faq);
  const [newTag, setNewTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(editingFaq);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingFaq(faq);
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setEditingFaq(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setEditingFaq(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="space-y-6">
      {/* 상단 액션 버튼 */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? '편집 취소' : '편집하기'}
          </button>
          <button
            onClick={() => onTogglePublish(editingFaq)}
            className={`px-4 py-2 text-sm font-medium border rounded-md flex items-center ${
              editingFaq.isPublished
                ? 'text-yellow-700 bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                : 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
            }`}
          >
            {editingFaq.isPublished ? <X className="w-4 h-4 mr-2" /> : <Check className="w-4 h-4 mr-2" />}
            {editingFaq.isPublished ? '비공개로 변경' : '게시하기'}
          </button>
        </div>
        <button
          onClick={() => onDelete(editingFaq)}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 flex items-center"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          삭제
        </button>
      </div>

      {/* 기본 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">FAQ 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">카테고리</label>
            {isEditing ? (
              <select
                value={editingFaq.category}
                onChange={(e) => setEditingFaq(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            ) : (
              <p className="mt-1 text-sm text-gray-900">
                {categories.find(c => c.value === editingFaq.category)?.label || editingFaq.category}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">순서</label>
            {isEditing ? (
              <input
                type="number"
                min="1"
                value={editingFaq.order}
                onChange={(e) => setEditingFaq(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{editingFaq.order}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">상태</label>
            <p className="mt-1 text-sm text-gray-900">
              {editingFaq.isPublished ? '게시됨' : '비공개'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">등록일</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(editingFaq.createdAt).toLocaleString('ko-KR')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">수정일</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(editingFaq.updatedAt).toLocaleString('ko-KR')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">작성자</label>
            <p className="mt-1 text-sm text-gray-900">{editingFaq.createdBy}</p>
          </div>
        </div>
      </div>

      {/* 질문 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">질문</h3>
        {isEditing ? (
          <input
            type="text"
            value={editingFaq.question}
            onChange={(e) => setEditingFaq(prev => ({ ...prev, question: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="자주 묻는 질문을 입력하세요"
          />
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-900">{editingFaq.question}</p>
          </div>
        )}
      </div>

      {/* 답변 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">답변</h3>
        {isEditing ? (
          <textarea
            value={editingFaq.answer}
            onChange={(e) => setEditingFaq(prev => ({ ...prev, answer: e.target.value }))}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="답변을 입력하세요"
          />
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-900 whitespace-pre-line">{editingFaq.answer}</p>
          </div>
        )}
      </div>

      {/* 태그 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">태그</h3>
        {isEditing && (
          <div className="flex space-x-2 mb-3">
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
        )}
        {editingFaq.tags && editingFaq.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {editingFaq.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">태그가 없습니다</p>
        )}
      </div>

      {/* 편집 모드일 때 저장/취소 버튼 */}
      {isEditing && (
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            저장
          </button>
        </div>
      )}
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
            순서
          </label>
          <input
            type="number"
            min="1"
            value={faq.order || 1}
            onChange={(e) => onChange({ ...faq, order: parseInt(e.target.value) || 1 })}
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