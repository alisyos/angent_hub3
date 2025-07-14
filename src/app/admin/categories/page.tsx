'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminTable from '@/components/admin/AdminTable';
import AdminFilter, { FilterConfig } from '@/components/admin/AdminFilter';
import AdminPagination from '@/components/admin/AdminPagination';
import { useModal } from '@/contexts/ModalContext';
import { 
  Grid3X3, 
  Plus, 
  Edit2, 
  ArrowUp,
  ArrowDown,
  ToggleRight,
  Briefcase,
  Megaphone,
  PenTool,
  Eye,
  EyeOff,
  Home,
  Building,
  Users,
  MessageSquare,
  HelpCircle,
  Settings,
  Search,
  ShoppingCart,
  CreditCard,
  Heart,
  Star,
  Gift,
  Zap,
  Camera,
  Monitor,
  Smartphone,
  Headphones,
  Globe,
  Clock,
  Calendar,
  Target,
  TrendingUp,
  FileText,
  Layers,
  Database,
  Cloud,
  Shield,
  Lock,
  Key,
  Award,
  Trophy,
  Medal,
  Bookmark,
  Tag,
  Folder,
  Archive,
  Download,
  Upload,
  Share,
  LinkIcon,
  Copy,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Mail,
  Bell,
  Phone,
  MapPin,
  Navigation,
  Compass,
  Flag,
  Sun,
  Moon,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Wifi,
  Battery,
  Bluetooth,
  Printer,
  Gamepad2,
  Truck,
  Plane,
  Car,
  Bike,
  Coffee,
  Pizza,
  Utensils,
  Music,
  Image,
  Video,
  Mic,
  Youtube,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Paintbrush,
  Palette,
  Brush,
  Scissors,
  Ruler,
  Wrench,
  Hammer,
  Cog,
  Sliders
} from 'lucide-react';
import { Category } from '@/types/agent';
import { categories as initialCategories, aiAgents } from '@/data/agents';

// 아이콘 리스트 정의
const iconList = [
  { name: 'Grid3X3', icon: Grid3X3, label: '그리드' },
  { name: 'Briefcase', icon: Briefcase, label: '서류가방' },
  { name: 'Megaphone', icon: Megaphone, label: '확성기' },
  { name: 'PenTool', icon: PenTool, label: '펜 도구' },
  { name: 'Home', icon: Home, label: '홈' },
  { name: 'Building', icon: Building, label: '건물' },
  { name: 'Users', icon: Users, label: '사용자' },
  { name: 'MessageSquare', icon: MessageSquare, label: '메시지' },
  { name: 'HelpCircle', icon: HelpCircle, label: '도움말' },
  { name: 'Settings', icon: Settings, label: '설정' },
  { name: 'Search', icon: Search, label: '검색' },
  { name: 'ShoppingCart', icon: ShoppingCart, label: '장바구니' },
  { name: 'CreditCard', icon: CreditCard, label: '신용카드' },
  { name: 'Heart', icon: Heart, label: '하트' },
  { name: 'Star', icon: Star, label: '별' },
  { name: 'Gift', icon: Gift, label: '선물' },
  { name: 'Zap', icon: Zap, label: '번개' },
  { name: 'Camera', icon: Camera, label: '카메라' },
  { name: 'Monitor', icon: Monitor, label: '모니터' },
  { name: 'Smartphone', icon: Smartphone, label: '스마트폰' },
  { name: 'Headphones', icon: Headphones, label: '헤드폰' },
  { name: 'Globe', icon: Globe, label: '지구본' },
  { name: 'Clock', icon: Clock, label: '시계' },
  { name: 'Calendar', icon: Calendar, label: '달력' },
  { name: 'Target', icon: Target, label: '타겟' },
  { name: 'TrendingUp', icon: TrendingUp, label: '상승 그래프' },
  { name: 'FileText', icon: FileText, label: '파일' },
  { name: 'Layers', icon: Layers, label: '레이어' },
  { name: 'Database', icon: Database, label: '데이터베이스' },
  { name: 'Cloud', icon: Cloud, label: '클라우드' },
  { name: 'Shield', icon: Shield, label: '보안' },
  { name: 'Lock', icon: Lock, label: '잠금' },
  { name: 'Key', icon: Key, label: '열쇠' },
  { name: 'Award', icon: Award, label: '상' },
  { name: 'Trophy', icon: Trophy, label: '트로피' },
  { name: 'Medal', icon: Medal, label: '메달' },
  { name: 'Bookmark', icon: Bookmark, label: '북마크' },
  { name: 'Tag', icon: Tag, label: '태그' },
  { name: 'Folder', icon: Folder, label: '폴더' },
  { name: 'Archive', icon: Archive, label: '보관함' },
  { name: 'Download', icon: Download, label: '다운로드' },
  { name: 'Upload', icon: Upload, label: '업로드' },
  { name: 'Share', icon: Share, label: '공유' },
  { name: 'LinkIcon', icon: LinkIcon, label: '링크' },
  { name: 'Copy', icon: Copy, label: '복사' },
  { name: 'Trash2', icon: Trash2, label: '삭제' },
  { name: 'AlertCircle', icon: AlertCircle, label: '경고' },
  { name: 'CheckCircle', icon: CheckCircle, label: '확인' },
  { name: 'XCircle', icon: XCircle, label: '취소' },
  { name: 'Mail', icon: Mail, label: '메일' },
  { name: 'Bell', icon: Bell, label: '알림' },
  { name: 'Phone', icon: Phone, label: '전화' },
  { name: 'MapPin', icon: MapPin, label: '위치' },
  { name: 'Navigation', icon: Navigation, label: '내비게이션' },
  { name: 'Compass', icon: Compass, label: '나침반' },
  { name: 'Flag', icon: Flag, label: '깃발' },
  { name: 'Sun', icon: Sun, label: '태양' },
  { name: 'Moon', icon: Moon, label: '달' },
  { name: 'Play', icon: Play, label: '재생' },
  { name: 'Pause', icon: Pause, label: '일시정지' },
  { name: 'Volume2', icon: Volume2, label: '볼륨' },
  { name: 'VolumeX', icon: VolumeX, label: '음소거' },
  { name: 'Wifi', icon: Wifi, label: '와이파이' },
  { name: 'Battery', icon: Battery, label: '배터리' },
  { name: 'Bluetooth', icon: Bluetooth, label: '블루투스' },
  { name: 'Printer', icon: Printer, label: '프린터' },
  { name: 'Gamepad2', icon: Gamepad2, label: '게임패드' },
  { name: 'Truck', icon: Truck, label: '트럭' },
  { name: 'Plane', icon: Plane, label: '비행기' },
  { name: 'Car', icon: Car, label: '자동차' },
  { name: 'Bike', icon: Bike, label: '자전거' },
  { name: 'Coffee', icon: Coffee, label: '커피' },
  { name: 'Pizza', icon: Pizza, label: '피자' },
  { name: 'Utensils', icon: Utensils, label: '식기' },
  { name: 'Music', icon: Music, label: '음악' },
  { name: 'Image', icon: Image, label: '이미지' },
  { name: 'Video', icon: Video, label: '비디오' },
  { name: 'Mic', icon: Mic, label: '마이크' },
  { name: 'Youtube', icon: Youtube, label: '유튜브' },
  { name: 'Facebook', icon: Facebook, label: '페이스북' },
  { name: 'Twitter', icon: Twitter, label: '트위터' },
  { name: 'Instagram', icon: Instagram, label: '인스타그램' },
  { name: 'Linkedin', icon: Linkedin, label: '링크드인' },
  { name: 'Github', icon: Github, label: '깃허브' },
  { name: 'Paintbrush', icon: Paintbrush, label: '페인트브러시' },
  { name: 'Palette', icon: Palette, label: '팔레트' },
  { name: 'Brush', icon: Brush, label: '브러시' },
  { name: 'Scissors', icon: Scissors, label: '가위' },
  { name: 'Ruler', icon: Ruler, label: '자' },
  { name: 'Wrench', icon: Wrench, label: '렌치' },
  { name: 'Hammer', icon: Hammer, label: '망치' },
  { name: 'Cog', icon: Cog, label: '톱니바퀴' },
  { name: 'Sliders', icon: Sliders, label: '슬라이더' }
];

export default function CategoryManagement() {
  const { showModal } = useModal();
  const [categories, setCategories] = useState<Category[]>(
    [...initialCategories, {
      id: 'design-mockup',
      name: '디자인',
      description: '디자인 작업 및 창의적 작업 지원 AI',
      color: 'red',
      icon: 'Paintbrush',
      order: 4,
      isActive: false,
      agentCount: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }]
      .map(cat => ({ 
        ...cat, 
        agentCount: aiAgents.filter(agent => agent.category === cat.name).length 
      }))
      .sort((a, b) => a.order - b.order)
  );
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // 필터 설정 (색상 필터 제거)
  const filterConfigs: FilterConfig[] = [
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
  const getFilteredCategories = () => {
    let filtered = [...categories];

    // 검색 필터링
    if (searchValue) {
      filtered = filtered.filter(cat =>
        cat.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // 상태 필터링
    if (filterValues.isActive) {
      const isActive = filterValues.isActive === 'true';
      filtered = filtered.filter(cat => cat.isActive === isActive);
    }

    return filtered.sort((a, b) => a.order - b.order);
  };

  const filteredCategories = getFilteredCategories();

  // 페이지네이션
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // 아이콘 매핑
  const getIconComponent = (iconName: string) => {
    const iconItem = iconList.find(item => item.name === iconName);
    return iconItem ? iconItem.icon : Grid3X3;
  };

  // 순서 변경 핸들러
  const handleOrderChange = (cat: Category, direction: 'up' | 'down') => {
    const currentOrder = cat.order;
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    const targetCategory = categories.find(c => c.order === targetOrder);
    if (!targetCategory) return;

    setCategories(prev => prev.map(c => {
      if (c.id === cat.id) {
        return { ...c, order: targetOrder };
      }
      if (c.id === targetCategory.id) {
        return { ...c, order: currentOrder };
      }
      return c;
    }));

    showModal({
      title: '순서 변경 완료',
      message: `${cat.name} 카테고리의 순서가 변경되었습니다.`,
      type: 'success'
    });
  };

  // 상태 토글 핸들러
  const handleToggleStatus = (cat: Category) => {
    const newStatus = !cat.isActive;
    setCategories(prev => prev.map(c => 
      c.id === cat.id ? { ...c, isActive: newStatus, updatedAt: new Date().toISOString() } : c
    ));

    showModal({
      title: '상태 변경 완료',
      message: `${cat.name} 카테고리가 ${newStatus ? '활성' : '비활성'}으로 변경되었습니다.`,
      type: 'success'
    });
  };

  // 카테고리 추가
  const handleAddCategory = (categoryData: Partial<Category>) => {
    const newId = `category-${Date.now()}`;
    const maxOrder = Math.max(...categories.map(c => c.order), 0);
    const newCategory: Category = {
      id: newId,
      name: categoryData.name || '',
      description: categoryData.description || '',
      color: categoryData.color || 'blue',
      icon: categoryData.icon || 'Grid3X3',
      order: maxOrder + 1,
      isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
      agentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCategories(prev => [...prev, newCategory]);
    setShowAddModal(false);
    showModal({
      title: '카테고리 추가 완료',
      message: `${newCategory.name} 카테고리가 성공적으로 추가되었습니다.`,
      type: 'success'
    });
  };

  // 카테고리 수정
  const handleEditCategory = (categoryData: Partial<Category>) => {
    if (!selectedCategory) return;

    const updatedCategory: Category = {
      ...selectedCategory,
      ...categoryData,
      updatedAt: new Date().toISOString()
    };

    setCategories(prev => prev.map(cat => 
      cat.id === selectedCategory.id ? updatedCategory : cat
    ));
    setShowEditModal(false);
    setSelectedCategory(null);
    showModal({
      title: '카테고리 수정 완료',
      message: `${updatedCategory.name} 카테고리가 성공적으로 수정되었습니다.`,
      type: 'success'
    });
  };

  // 카테고리 삭제
  const handleDeleteCategory = (cat: Category) => {
    if (cat.agentCount && cat.agentCount > 0) {
      showModal({
        title: '삭제 불가',
        message: `이 카테고리에 ${cat.agentCount}개의 에이전트가 있습니다. 먼저 에이전트를 다른 카테고리로 이동시켜주세요.`,
        type: 'error'
      });
      return;
    }

    showModal({
      title: '카테고리 삭제',
      message: `${cat.name} 카테고리를 삭제하시겠습니까?\n이 작업은 취소할 수 없습니다.`,
      type: 'warning',
      onConfirm: () => {
        setCategories(prev => prev.filter(c => c.id !== cat.id));
        showModal({
          title: '삭제 완료',
          message: `${cat.name} 카테고리가 삭제되었습니다.`,
          type: 'success'
        });
      }
    });
  };

  // 테이블 컬럼 정의 (설명, 색상 컬럼 제거)
  const columns = [
    {
      key: 'name',
      label: '카테고리',
      sortable: true,
      render: (cat: Category) => {
        const IconComponent = getIconComponent(cat.icon);
        
        return (
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              cat.isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium text-gray-900 flex items-center space-x-2">
                <span>{cat.name}</span>
                {!cat.isActive && (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="text-sm text-gray-500">순서: {cat.order}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'agentCount',
      label: '에이전트 수',
      sortable: true,
      render: (cat: Category) => {
        const agentCount = Number(cat.agentCount) || 0;
        return (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">
              {agentCount}개
            </span>
            {agentCount > 0 && (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
        );
      }
    },
    {
      key: 'status',
      label: '상태',
      sortable: false,
      render: (cat: Category) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleToggleStatus(cat)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ToggleRight className={`w-5 h-5 ${cat.isActive ? 'text-green-500' : 'text-gray-400'}`} />
          </button>
          <span className={`text-xs px-2 py-1 rounded-full ${
            cat.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {cat.isActive ? '활성' : '비활성'}
          </span>
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
      onClick: (cat: Category) => {
        setSelectedCategory(cat);
        setShowEditModal(true);
      }
    },
    {
      label: '순서 올리기',
      icon: ArrowUp,
      color: 'gray' as const,
      onClick: (cat: Category) => {
        handleOrderChange(cat, 'up');
      },
      show: (cat: Category) => cat.order > 1
    },
    {
      label: '순서 내리기',
      icon: ArrowDown,
      color: 'gray' as const,
      onClick: (cat: Category) => {
        handleOrderChange(cat, 'down');
      },
      show: (cat: Category) => cat.order < categories.length
    }
  ];

  return (
    <AdminLayout
      title="카테고리 관리"
      description="AI 에이전트 카테고리를 관리하고 순서를 조정하세요"
      hideTimePeriod={true}
      actions={
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>카테고리 추가</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* 필터 */}
        <AdminFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="카테고리명으로 검색..."
          filters={filterConfigs}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
        />

        {/* 테이블 */}
        <AdminTable
          columns={columns}
          data={currentCategories}
          loading={false}
          emptyMessage="카테고리가 없습니다."
          onSort={() => {}}
          actions={actions}
        />

        {/* 페이지네이션 */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={filteredCategories.length}
        />
      </div>

      {/* 카테고리 추가 모달 */}
      <CategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCategory}
        title="카테고리 추가"
      />

      {/* 카테고리 수정 모달 */}
      <CategoryModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleEditCategory}
        title="카테고리 수정"
        initialData={selectedCategory}
        onDelete={handleDeleteCategory}
      />
    </AdminLayout>
  );
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Category>) => void;
  onDelete?: (cat: Category) => void;
  title: string;
  initialData?: Category | null;
}

function CategoryModal({ isOpen, onClose, onSubmit, onDelete, title, initialData }: CategoryModalProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    icon: 'Grid3X3',
    isActive: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        icon: 'Grid3X3',
        isActive: true
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleDelete = () => {
    if (initialData && onDelete) {
      onDelete(initialData);
    }
    onClose();
  };

  const handleInputChange = (field: keyof Category, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리명 *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              아이콘 *
            </label>
            <div className="space-y-2">
              {/* 현재 선택된 아이콘 미리보기 */}
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  {(() => {
                    const IconComponent = iconList.find(item => item.name === formData.icon)?.icon || Grid3X3;
                    return <IconComponent className="w-5 h-5 text-blue-600" />;
                  })()}
                </div>
                <span className="text-sm text-gray-700">
                  {iconList.find(item => item.name === formData.icon)?.label || '그리드'}
                </span>
              </div>
              
              {/* 아이콘 선택 그리드 */}
              <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3">
                {iconList.map((iconItem) => {
                  const IconComponent = iconItem.icon;
                  const isSelected = formData.icon === iconItem.name;
                  return (
                    <button
                      key={iconItem.name}
                      type="button"
                      onClick={() => handleInputChange('icon', iconItem.name)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors ${
                        isSelected ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-500' : 'text-gray-600'
                      }`}
                      title={iconItem.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive || false}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">활성 상태</span>
            </label>
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {initialData && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  삭제
                </button>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {initialData ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 