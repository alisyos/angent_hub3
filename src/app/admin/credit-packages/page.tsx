'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminTable from '@/components/admin/AdminTable';
import AdminFilter, { FilterConfig } from '@/components/admin/AdminFilter';
import AdminPagination from '@/components/admin/AdminPagination';
import { useModal } from '@/contexts/ModalContext';
import { 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  Star,
  Crown,
  ArrowUp,
  ArrowDown,
  ToggleRight
} from 'lucide-react';
import { CreditPackage } from '@/types/agent';
import { creditPackages as initialPackages } from '@/data/agents';

export default function CreditPackageManagement() {
  const { showModal } = useModal();
  const [packages, setPackages] = useState<CreditPackage[]>(
    initialPackages.sort((a, b) => (a.order || 0) - (b.order || 0))
  );
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);

  // 필터 설정
  const filterConfigs: FilterConfig[] = [
    {
      key: 'popular',
      label: '패키지 유형',
      type: 'select',
      options: [
        { label: '추천 패키지', value: 'true' },
        { label: '일반 패키지', value: 'false' }
      ]
    },
    {
      key: 'isActive',
      label: '상태',
      type: 'select',
      options: [
        { label: '활성', value: 'true' },
        { label: '비활성', value: 'false' }
      ]
    }
  ];

  // 데이터 필터링
  const getFilteredPackages = () => {
    let filtered = [...packages];

    // 검색 필터링
    if (searchValue) {
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        pkg.credits.toString().includes(searchValue) ||
        pkg.price.toString().includes(searchValue)
      );
    }

    // 패키지 유형 필터링
    if (filterValues.popular) {
      const isPopular = filterValues.popular === 'true';
      filtered = filtered.filter(pkg => pkg.popular === isPopular);
    }

    // 상태 필터링
    if (filterValues.isActive) {
      const isActive = filterValues.isActive === 'true';
      filtered = filtered.filter(pkg => pkg.isActive === isActive);
    }

    return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const filteredPackages = getFilteredPackages();

  // 페이지네이션
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPackages = filteredPackages.slice(startIndex, startIndex + itemsPerPage);

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // 순서 변경 핸들러
  const handleOrderChange = (pkg: CreditPackage, direction: 'up' | 'down') => {
    const currentOrder = pkg.order || 0;
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    const targetPackage = packages.find(p => p.order === targetOrder);
    if (!targetPackage) return;

    setPackages(prev => prev.map(p => {
      if (p.id === pkg.id) {
        return { ...p, order: targetOrder };
      }
      if (p.id === targetPackage.id) {
        return { ...p, order: currentOrder };
      }
      return p;
    }));

    showModal({
      title: '순서 변경 완료',
      message: `${pkg.name} 패키지의 순서가 변경되었습니다.`,
      type: 'success'
    });
  };

  // 상태 토글 핸들러
  const handleToggleStatus = (pkg: CreditPackage) => {
    const newStatus = !pkg.isActive;
    setPackages(prev => prev.map(p => 
      p.id === pkg.id ? { ...p, isActive: newStatus } : p
    ));

    showModal({
      title: '상태 변경 완료',
      message: `${pkg.name} 패키지가 ${newStatus ? '활성' : '비활성'}으로 변경되었습니다.`,
      type: 'success'
    });
  };

  // 패키지 추가
  const handleAddPackage = (packageData: Partial<CreditPackage>) => {
    const newId = `package-${Date.now()}`;
    const maxOrder = Math.max(...packages.map(p => p.order || 0), 0);
    const newPackage: CreditPackage = {
      id: newId,
      name: packageData.name || '',
      credits: packageData.credits || 0,
      price: packageData.price || 0,
      bonus: packageData.bonus || 0,
      popular: packageData.popular || false,
      isActive: packageData.isActive !== undefined ? packageData.isActive : true,
      order: maxOrder + 1
    };

    setPackages(prev => [...prev, newPackage]);
    setShowAddModal(false);
    showModal({
      title: '패키지 추가 완료',
      message: `${newPackage.name} 패키지가 성공적으로 추가되었습니다.`,
      type: 'success'
    });
  };

  // 패키지 수정
  const handleEditPackage = (packageData: Partial<CreditPackage>) => {
    if (!selectedPackage) return;

    const updatedPackage: CreditPackage = {
      ...selectedPackage,
      ...packageData
    };

    setPackages(prev => prev.map(pkg => 
      pkg.id === selectedPackage.id ? updatedPackage : pkg
    ));
    setShowEditModal(false);
    setSelectedPackage(null);
    showModal({
      title: '패키지 수정 완료',
      message: `${updatedPackage.name} 패키지가 성공적으로 수정되었습니다.`,
      type: 'success'
    });
  };

  // 패키지 삭제
  const handleDeletePackage = (pkg: CreditPackage) => {
    showModal({
      title: '패키지 삭제',
      message: `${pkg.name} 패키지를 삭제하시겠습니까?\n이 작업은 취소할 수 없습니다.`,
      type: 'warning',
      onConfirm: () => {
        setPackages(prev => prev.filter(p => p.id !== pkg.id));
        showModal({
          title: '삭제 완료',
          message: `${pkg.name} 패키지가 삭제되었습니다.`,
          type: 'success'
        });
      }
    });
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'name',
      label: '패키지명',
      sortable: true,
      render: (pkg: CreditPackage) => (
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            pkg.isActive ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Package className={`w-5 h-5 ${
              pkg.isActive ? 'text-blue-600' : 'text-gray-400'
            }`} />
          </div>
          <div>
            <div className="font-medium text-gray-900 flex items-center space-x-2">
              <span>{pkg.name}</span>
              {pkg.popular && (
                <Crown className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <div className="text-sm text-gray-500">순서: {pkg.order}</div>
          </div>
        </div>
      )
    },
    {
      key: 'credits',
      label: '크레딧',
      sortable: true,
      render: (pkg: CreditPackage) => (
        <div>
          <div className="font-medium text-gray-900">{pkg.credits.toLocaleString()} 크레딧</div>
          {pkg.bonus && pkg.bonus > 0 && (
            <div className="text-sm text-green-600">+{pkg.bonus.toLocaleString()} 보너스</div>
          )}
        </div>
      )
    },
    {
      key: 'price',
      label: '금액',
      sortable: true,
      render: (pkg: CreditPackage) => (
        <div className="font-medium text-gray-900">
          {pkg.price.toLocaleString()}원
        </div>
      )
    },
    {
      key: 'pricePerCredit',
      label: '크레딧당 가격',
      sortable: false,
      render: (pkg: CreditPackage) => (
        <div className="text-sm text-gray-600">
          {(pkg.price / (pkg.credits + (pkg.bonus || 0))).toFixed(1)}원
        </div>
      )
    },
    {
      key: 'status',
      label: '상태',
      sortable: false,
      render: (pkg: CreditPackage) => (
        <div className="flex flex-col space-y-1">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-fit ${
            pkg.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {pkg.isActive ? '활성' : '비활성'}
          </span>
          {pkg.popular && (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 w-fit">
              추천
            </span>
          )}
        </div>
      )
    }
  ];

  // 테이블 액션 정의
  const actions = [
    {
      label: '수정',
      icon: Edit2,
      color: 'blue' as const,
      onClick: (pkg: CreditPackage) => {
        setSelectedPackage(pkg);
        setShowEditModal(true);
      }
    },
    {
      label: '순서 올리기',
      icon: ArrowUp,
      color: 'gray' as const,
      onClick: (pkg: CreditPackage) => {
        handleOrderChange(pkg, 'up');
      },
      show: (pkg: CreditPackage) => (pkg.order || 0) > 1
    },
    {
      label: '순서 내리기',
      icon: ArrowDown,
      color: 'gray' as const,
      onClick: (pkg: CreditPackage) => {
        handleOrderChange(pkg, 'down');
      },
      show: (pkg: CreditPackage) => (pkg.order || 0) < packages.length
    }
  ];

  return (
    <AdminLayout
      title="크레딧 패키지 관리"
      description="크레딧 패키지를 등록, 수정, 삭제할 수 있습니다"
      hideTimePeriod={true}
      actions={
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>새 패키지 추가</span>
        </button>
      }
    >
      {/* 헤더 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">총 패키지</p>
              <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ToggleRight className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">활성 패키지</p>
              <p className="text-2xl font-bold text-gray-900">
                {packages.filter(p => p.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">평균 크레딧당 가격</p>
              <p className="text-2xl font-bold text-gray-900">
                {packages.length > 0 
                  ? (packages.reduce((sum, pkg) => sum + (pkg.price / (pkg.credits + (pkg.bonus || 0))), 0) / packages.length).toFixed(1)
                  : '0'
                }원
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 */}
      <AdminFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="패키지명, 크레딧 수, 금액으로 검색..."
        filters={filterConfigs}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
      />

      {/* 패키지 테이블 */}
      <AdminTable
        data={currentPackages}
        columns={columns}
        actions={actions}
        emptyMessage="등록된 크레딧 패키지가 없습니다."
      />

      {/* 페이지네이션 */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredPackages.length}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* 패키지 추가 모달 */}
      <PackageModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddPackage}
        title="새 패키지 추가"
      />

      {/* 패키지 수정 모달 */}
      <PackageModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditPackage}
        onDelete={handleDeletePackage}
        title="패키지 수정"
        initialData={selectedPackage}
      />
    </AdminLayout>
  );
}

// 패키지 추가/수정 모달 컴포넌트
interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<CreditPackage>) => void;
  onDelete?: (pkg: CreditPackage) => void;
  title: string;
  initialData?: CreditPackage | null;
}

function PackageModal({ isOpen, onClose, onSubmit, onDelete, title, initialData }: PackageModalProps) {
  const [formData, setFormData] = useState<Partial<CreditPackage>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ isActive: true });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.name || !formData.credits || !formData.price) {
      alert('필수 필드를 모두 입력해주세요.');
      return;
    }

    onSubmit(formData);
    setFormData({ isActive: true });
  };

  const handleDelete = () => {
    if (initialData && onDelete) {
      if (confirm(`${initialData.name} 패키지를 삭제하시겠습니까?\n이 작업은 취소할 수 없습니다.`)) {
        onDelete(initialData);
        onClose();
      }
    }
  };

  const handleInputChange = (field: keyof CreditPackage, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              패키지명 *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예: 기본 패키지"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                크레딧 수 *
              </label>
              <input
                type="number"
                value={formData.credits || ''}
                onChange={(e) => handleInputChange('credits', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                금액 (원) *
              </label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10000"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              보너스 크레딧
            </label>
            <input
              type="number"
              value={formData.bonus || ''}
              onChange={(e) => handleInputChange('bonus', parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="popular"
                checked={formData.popular || false}
                onChange={(e) => handleInputChange('popular', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="popular" className="text-sm font-medium text-gray-700">
                추천 패키지로 표시
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive !== false}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                활성 상태로 설정
              </label>
            </div>
          </div>

          {/* 미리보기 */}
          {formData.credits && formData.price && (
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">미리보기</h4>
              <div className="text-sm text-gray-600">
                <p>크레딧당 가격: {(formData.price / (formData.credits + (formData.bonus || 0))).toFixed(1)}원</p>
                <p>총 크레딧: {(formData.credits + (formData.bonus || 0)).toLocaleString()} 크레딧</p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-gray-200">
            {/* 삭제 버튼 (수정 모달에서만 표시) */}
            {initialData && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                삭제
              </button>
            )}
            <div className={`flex space-x-3 ${!initialData || !onDelete ? 'ml-auto' : ''}`}>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {title === '새 패키지 추가' ? '추가' : '수정'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 