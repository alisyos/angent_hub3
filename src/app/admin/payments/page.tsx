'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AdminStats from '@/components/admin/AdminStats';
import AdminFilter from '@/components/admin/AdminFilter';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import AdminPagination from '@/components/admin/AdminPagination';
import { mockPayments } from '@/data/admin';
import { PaymentAdmin } from '@/types/admin';
import { 
  CreditCard,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Eye,
  Download,
  Ban,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Building2,
  Receipt
} from 'lucide-react';

export default function AdminPayments() {
  const [payments, setPayments] = useState<PaymentAdmin[]>(mockPayments);
  const [filteredPayments, setFilteredPayments] = useState<PaymentAdmin[]>(mockPayments);
  const [selectedPayment, setSelectedPayment] = useState<PaymentAdmin | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    status: '',
    taxInvoiceStatus: '',
    refundCredits: 0,
    additionalCredits: 0
  });
  const [addFormData, setAddFormData] = useState({
    userId: '',
    userName: '',
    userEmail: '',
    userType: 'general_user',
    companyName: '',
    productName: '기본 패키지',
    amount: 10000,
    credits: 100,
    paymentMethod: 'card',
    taxInvoiceStatus: 'not_applicable'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({
    dateRange: '7days'
  });
  const [searchValue, setSearchValue] = useState('');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });


  // 필터 정의
  const filterOptions = [
    {
      key: 'productName',
      label: '결제정보(상품명)',
      type: 'select' as const,
      options: [
        { value: '기본 패키지', label: '기본 패키지' },
        { value: '인기 패키지', label: '인기 패키지' },
        { value: '프리미엄 패키지', label: '프리미엄 패키지' },
        { value: '엔터프라이즈 패키지', label: '엔터프라이즈 패키지' }
      ]
    },
    {
      key: 'paymentMethod',
      label: '결제 수단',
      type: 'select' as const,
      options: [
        { value: 'card', label: '신용카드' },
        { value: 'bank', label: '계좌이체' },
        { value: 'kakaopay', label: '카카오페이' },
        { value: 'naverpay', label: '네이버페이' }
      ]
    },
    {
      key: 'status',
      label: '상태',
      type: 'select' as const,
      options: [
        { value: 'pending', label: '보류' },
        { value: 'completed', label: '완료' },
        { value: 'refunded', label: '환불' }
      ]
    },
    {
      key: 'dateRange',
      label: '기간 선택',
      type: 'select' as const,
      options: [
        { value: 'all', label: '전체' },
        { value: '7days', label: '최근 7일' },
        { value: '30days', label: '최근 30일' },
        { value: 'custom', label: '직접선택' }
      ]
    }
  ];

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'createdAt',
      label: '결제일',
      render: (payment: PaymentAdmin) => (
        <div>
          <p className="text-sm text-gray-900">
            {payment?.createdAt ? new Date(payment.createdAt).toLocaleDateString('ko-KR') : '날짜 없음'}
          </p>
          <p className="text-xs text-gray-500">
            {payment?.createdAt ? new Date(payment.createdAt).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit'
            }) : '시간 없음'}
          </p>
        </div>
      )
    },
    {
      key: 'user',
      label: '사용자',
      render: (payment: PaymentAdmin) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              {(payment?.user?.type === 'company_admin' || payment?.user?.type === 'company_employee') ? 
                <Building2 className="w-4 h-4 text-gray-500" /> :
                <User className="w-4 h-4 text-gray-500" />
              }
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{payment?.user?.name || '사용자 정보 없음'}</p>
            <p className="text-sm text-gray-500">{payment?.user?.email || '이메일 없음'}</p>
            <p className="text-xs text-gray-400">
              {payment?.user?.type === 'general_user' ? '일반사용자' : 
               payment?.user?.type === 'company_admin' ? '회사관리자' : 
               payment?.user?.type === 'company_employee' ? '회사일반사용자' : '관리자'}
              {payment?.user?.companyName && ` (${payment.user.companyName})`}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'productInfo',
      label: '결제정보',
      render: (payment: PaymentAdmin) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{payment?.productName || '상품명 없음'}</p>
          <p className="text-sm text-gray-500">{payment?.credits ?? 0} 크레딧</p>
          <p className="text-sm font-semibold text-gray-900">{(payment?.amount ?? 0).toLocaleString()}원</p>
        </div>
      )
    },
    {
      key: 'method',
      label: '결제수단',
      render: (payment: PaymentAdmin) => getPaymentMethodBadge(payment?.paymentMethod || 'card')
    },
    {
      key: 'status',
      label: '상태',
      render: (payment: PaymentAdmin) => getStatusBadge(payment?.status || 'pending')
    },
    {
      key: 'taxInvoice',
      label: '세금계산서',
      render: (payment: PaymentAdmin) => {
        if (payment?.user?.type !== 'company_admin') {
          return <span className="text-xs text-gray-400">해당없음</span>;
        }
        
        const getTaxInvoiceBadge = (status?: string) => {
          const styles = {
            not_applicable: { bg: 'bg-gray-100', text: 'text-gray-600' },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
            issued: { bg: 'bg-green-100', text: 'text-green-700' }
          };
          
          const labels = {
            not_applicable: '발행안함',
            pending: '발행 전',
            issued: '발행완료'
          };
          
          const style = styles[status as keyof typeof styles] || styles.not_applicable;
          const label = labels[status as keyof typeof labels] || '발행안함';
          
          return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
              {label}
            </span>
          );
        };
        
        return (
          <div className="flex items-center space-x-2">
            {getTaxInvoiceBadge(payment?.taxInvoiceStatus)}
            {payment?.taxInvoiceStatus === 'pending' && (
              <button
                onClick={() => payment && handleUpdateTaxInvoice(payment)}
                className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
                title="발행 완료로 변경"
              >
                <CheckCircle className="w-3 h-3" />
              </button>
            )}
        </div>
        );
      }
    },
    {
      key: 'actions',
      label: '작업',
      render: (payment: PaymentAdmin) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => payment && handleViewPayment(payment)}
            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
            title="상세 보기"
            disabled={!payment}
          >
            <Eye className="w-4 h-4" />
          </button>
            <button
            onClick={() => payment && handleEditPayment(payment)}
            className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded"
            title="수정"
              disabled={!payment}
            >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            </button>
        </div>
      )
    }
  ];

  // 결제 수단 배지
  const getPaymentMethodBadge = (method: string) => {
    const styles = {
      card: { bg: 'bg-blue-100', text: 'text-blue-800' },
      bank: { bg: 'bg-green-100', text: 'text-green-800' },
      kakaopay: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      naverpay: { bg: 'bg-green-100', text: 'text-green-800' },
      toss: { bg: 'bg-blue-100', text: 'text-blue-800' }
    };

    const labels = {
      card: '신용카드',
      bank: '계좌이체',
      kakaopay: '카카오페이',
      naverpay: '네이버페이',
      toss: '토스'
    };

    const style = styles[method as keyof typeof styles] || styles.card;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {labels[method as keyof typeof labels] || method}
      </span>
    );
  };

  // 상태 배지
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertTriangle },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      failed: { bg: 'bg-red-100', text: 'text-red-800', icon: Ban },
      refunded: { bg: 'bg-orange-100', text: 'text-orange-800', icon: RefreshCw },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Ban }
    };

    const labels = {
      pending: '보류',
      completed: '완료',
      failed: '실패',
      refunded: '환불',
      cancelled: '취소'
    };

    const style = styles[status as keyof typeof styles] || styles.pending;
    const IconComponent = style.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  // 필터링 로직
  const applyFilters = () => {
    let filtered = [...payments];

    // 검색어 필터링 (사용자명, 이메일, 회사명)
    if (searchValue && searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase().trim();
      filtered = filtered.filter(payment =>
        (payment?.user?.name || '').toLowerCase().includes(searchTerm) ||
        (payment?.user?.email || '').toLowerCase().includes(searchTerm) ||
        (payment?.user?.companyName || '').toLowerCase().includes(searchTerm)
      );
    }

    // 기타 필터링
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== 'all') {
        if (key === 'dateRange') {
          // 기간 선택 필터링 (기준일: 2025년 7월 10일)
          const now = new Date('2025-07-10T23:59:59Z');
          let startDate: Date;
          
          switch (value) {
            case '7days':
              startDate = new Date('2025-07-04T00:00:00Z');
              break;
            case '30days':
              startDate = new Date('2025-06-11T00:00:00Z');
              break;
            case 'custom':
              if (customDateRange.startDate && customDateRange.endDate) {
                const customStart = new Date(customDateRange.startDate + 'T00:00:00Z');
                const customEnd = new Date(customDateRange.endDate + 'T23:59:59Z');
                filtered = filtered.filter(payment => {
                  if (!payment?.createdAt) return false;
                  const paymentDate = new Date(payment.createdAt);
                  return paymentDate >= customStart && paymentDate <= customEnd;
                });
              }
              return;
            default:
              return;
          }
          
          filtered = filtered.filter(payment => {
            if (!payment?.createdAt) return false;
            const paymentDate = new Date(payment.createdAt);
            return paymentDate >= startDate && paymentDate <= now;
          });
        } else if (key === 'userType') {
          filtered = filtered.filter(payment => {
            return payment?.user?.type === value;
          });
        } else {
        filtered = filtered.filter(payment => {
          const paymentValue = payment?.[key as keyof PaymentAdmin];
          return paymentValue === value;
        });
        }
      }
    });

    // 최신 순으로 정렬
    filtered.sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    setFilteredPayments(filtered);
    setCurrentPage(1);
  };

  // 이벤트 핸들러
  const handleFilterChange = (key: string, value: string | string[]) => {
    const newFilterValues = { ...filterValues, [key]: value };
    setFilterValues(newFilterValues);
    // 커스텀 날짜 범위가 아닌 경우 초기화
    if (key === 'dateRange' && value !== 'custom') {
      setCustomDateRange({ startDate: '', endDate: '' });
    }
    applyFilters();
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    applyFilters();
  };

  const handleViewPayment = (payment: PaymentAdmin) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const handleEditPayment = (payment: PaymentAdmin) => {
    setSelectedPayment(payment);
    setEditFormData({
      status: payment.status,
      taxInvoiceStatus: payment.taxInvoiceStatus || 'not_applicable',
      refundCredits: payment.credits,
      additionalCredits: payment.credits
    });
    setShowEditModal(true);
  };

  const handleUpdateTaxInvoice = (payment: PaymentAdmin) => {
    // 세금계산서 상태를 '발행완료'로 업데이트
    const updatedPayment = { ...payment, taxInvoiceStatus: 'issued' as const };
    const updatedPayments = payments.map(p => 
      p.id === payment.id ? updatedPayment : p
    );
    setPayments(updatedPayments);
    
    // 필터된 결제 목록도 업데이트
    const updatedFilteredPayments = filteredPayments.map(p => 
      p.id === payment.id ? updatedPayment : p
    );
    setFilteredPayments(updatedFilteredPayments);
    
    // 성공 메시지 (실제로는 API 호출 후 성공 응답을 받아야 함)
    alert('세금계산서가 발행완료로 변경되었습니다.');
  };

    const handleSaveEdit = () => {
    if (!selectedPayment) return;

    const originalStatus = selectedPayment.status;
    const newStatus = editFormData.status;

    // 상태 변경 검증
    if (originalStatus === 'completed' && newStatus === 'pending') {
      alert('완료 상태에서 보류로 변경할 수 없습니다.');
      return;
    }

    if (originalStatus === 'pending' && newStatus === 'refunded') {
      alert('보류 상태에서 환불로 변경할 수 없습니다.');
      return;
    }

    if (originalStatus === 'refunded' && newStatus === 'pending') {
      alert('환불 상태에서 보류로 변경할 수 없습니다.');
      return;
    }

    // 업데이트할 데이터 준비
    let updatedPayment = {
      ...selectedPayment,
      status: newStatus as PaymentAdmin['status'],
      taxInvoiceStatus: editFormData.taxInvoiceStatus as PaymentAdmin['taxInvoiceStatus']
    };

    // 보류에서 완료로 변경 시 크레딧 충전
    if (originalStatus === 'pending' && newStatus === 'completed') {
      alert(`${selectedPayment.user.name} 계정에 ${selectedPayment.credits} 크레딧이 충전됩니다.`);
    }

    // 완료에서 환불로 변경 시 환불 크레딧 처리
    if (originalStatus === 'completed' && newStatus === 'refunded') {
      updatedPayment = {
        ...updatedPayment,
        credits: -editFormData.refundCredits,
        refundedAt: new Date().toISOString(),
        refundedBy: '관리자'
      };
      alert(`${editFormData.refundCredits} 크레딧이 환불 처리됩니다.`);
    }

    // 환불에서 완료로 변경 시 추가 크레딧 처리
    if (originalStatus === 'refunded' && newStatus === 'completed') {
      updatedPayment = {
        ...updatedPayment,
        credits: editFormData.additionalCredits,
        refundedAt: undefined,
        refundedBy: undefined
      };
      alert(`${editFormData.additionalCredits} 크레딧이 추가 충전됩니다.`);
    }

    // 결제 목록 업데이트
    const updatedPayments = payments.map(p => 
      p.id === selectedPayment.id ? updatedPayment : p
    );
    setPayments(updatedPayments);
    
    // 필터된 결제 목록도 업데이트
    const updatedFilteredPayments = filteredPayments.map(p => 
      p.id === selectedPayment.id ? updatedPayment : p
    );
    setFilteredPayments(updatedFilteredPayments);

    setShowEditModal(false);
    alert('결제 정보가 수정되었습니다.');
  };

  const handleAddPayment = () => {
    // 폼 검증
    if (!addFormData.userName.trim() || !addFormData.userEmail.trim()) {
      alert('사용자명과 이메일을 입력해주세요.');
      return;
    }

    if (addFormData.userType === 'company_admin' && !addFormData.companyName.trim()) {
      alert('회사관리자인 경우 회사명을 입력해주세요.');
      return;
    }

    // 새로운 결제 ID 생성
    const newPaymentId = `pay${String(payments.length + 1).padStart(3, '0')}`;
    
    // 새로운 결제 데이터 생성
    const newPayment: PaymentAdmin = {
      id: newPaymentId,
      user: {
        id: addFormData.userId || newPaymentId,
        name: addFormData.userName,
        email: addFormData.userEmail,
        type: addFormData.userType as 'general_user' | 'company_admin',
        ...(addFormData.userType === 'company_admin' && { companyName: addFormData.companyName })
      },
      type: 'credit_purchase',
      productName: addFormData.productName,
      amount: addFormData.amount,
      credits: addFormData.credits,
      status: 'completed',
      paymentMethod: addFormData.paymentMethod as PaymentAdmin['paymentMethod'],
      taxInvoiceStatus: addFormData.taxInvoiceStatus as PaymentAdmin['taxInvoiceStatus'],
      transactionId: `TXN-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${newPaymentId}`,
      receiptUrl: `/receipts/${newPaymentId}.pdf`,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      gateway: 'KCP',
      gatewayTransactionId: `KCP-${Date.now()}`
    };

    // 결제 목록에 추가
    const updatedPayments = [newPayment, ...payments];
    setPayments(updatedPayments);

    // 폼 초기화
    setAddFormData({
      userId: '',
      userName: '',
      userEmail: '',
      userType: 'general_user',
      companyName: '',
      productName: '기본 패키지',
      amount: 10000,
      credits: 100,
      paymentMethod: 'card',
      taxInvoiceStatus: 'not_applicable'
    });

    setShowAddModal(false);
    alert(`${addFormData.userName}님의 결제 내역이 추가되었습니다.`);
  };





  // 통계 계산 (필터링된 데이터 기반)
  const completedPayments = filteredPayments.filter(p => p?.status === 'completed');
  const refundedPayments = filteredPayments.filter(p => p?.status === 'refunded');
  
  // 매출 관련 통계
  const totalRevenue = completedPayments.reduce((sum, p) => sum + (p?.amount ?? 0), 0);
  const generalUserRevenue = completedPayments
    .filter(p => p?.user?.type === 'general_user')
    .reduce((sum, p) => sum + (p?.amount ?? 0), 0);
  const companyUserRevenue = completedPayments
    .filter(p => ['company_admin', 'company_employee'].includes(p?.user?.type || ''))
    .reduce((sum, p) => sum + (p?.amount ?? 0), 0);

  // 거래 관련 통계
  const totalTransactions = filteredPayments.length;
  const generalUserTransactions = filteredPayments
    .filter(p => p?.user?.type === 'general_user').length;
  const companyUserTransactions = filteredPayments
    .filter(p => ['company_admin', 'company_employee'].includes(p?.user?.type || '')).length;

  // 환불 관련 통계
  const refundAmount = refundedPayments.reduce((sum, p) => sum + Math.abs(p?.amount ?? 0), 0);
  const refundCount = refundedPayments.length;

  // 페이지네이션
  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  return (
    <AdminLayout
      title="결제 관리"
      description="결제 내역을 조회하고 환불을 관리하세요"
      hideTimePeriod={true}
    >

        {/* 검색 설정 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">검색 설정</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              결제 추가
            </button>
          </div>
          
          {/* 1행: 기간 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">기간 선택</label>
            <div className="flex flex-wrap gap-3">
              <select
                value={filterValues.dateRange || '7days'}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7days">최근 7일</option>
                <option value="30days">최근 30일</option>
                <option value="custom">직접선택</option>
              </select>
              
              {/* 직접선택 시 날짜 입력 필드 */}
              {filterValues.dateRange === 'custom' && (
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={customDateRange.startDate}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">~</span>
                  <input
                    type="date"
                    value={customDateRange.endDate}
                    onChange={(e) => {
                      setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }));
                      // 날짜가 설정되면 자동으로 필터 적용
                      setTimeout(() => {
                        if (customDateRange.startDate && e.target.value) {
                          setCurrentPage(1);
                        }
                      }, 100);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
        </div>

          {/* 2행: 사용자 유형, 결제정보, 결제수단, 상태 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">사용자 유형</label>
              <select
                value={filterValues.userType || 'all'}
                onChange={(e) => handleFilterChange('userType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">전체</option>
                <option value="general_user">일반사용자</option>
                <option value="company_admin">회사관리자</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">결제정보</label>
              <select
                value={filterValues.productName || 'all'}
                onChange={(e) => handleFilterChange('productName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">전체</option>
                <option value="기본 패키지">기본 패키지</option>
                <option value="인기 패키지">인기 패키지</option>
                <option value="프리미엄 패키지">프리미엄 패키지</option>
                <option value="엔터프라이즈 패키지">엔터프라이즈 패키지</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">결제수단</label>
              <select
                value={filterValues.paymentMethod || 'all'}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">전체</option>
                <option value="card">신용카드</option>
                <option value="bank">계좌이체</option>
                <option value="kakaopay">카카오페이</option>
                <option value="naverpay">네이버페이</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
              <select
                value={filterValues.status || 'all'}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">전체</option>
                <option value="pending">보류</option>
                <option value="completed">완료</option>
                <option value="refunded">환불</option>
              </select>
            </div>
          </div>

          {/* 3행: 검색 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="사용자명, 이메일, 회사명으로 검색..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 요약 박스 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 매출 박스 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-700">매출</h3>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">총 매출</span>
                <span className="text-lg font-bold text-blue-900">
                  {totalRevenue.toLocaleString()} 원
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">일반사용자 매출</span>
                <span className="text-md font-semibold text-blue-700">
                  {generalUserRevenue.toLocaleString()} 원
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">회사사용자 매출</span>
                <span className="text-md font-semibold text-blue-700">
                  {companyUserRevenue.toLocaleString()} 원
                </span>
              </div>
            </div>
          </div>
          
          {/* 거래 박스 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-700">거래</h3>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">총 거래</span>
                <span className="text-lg font-bold text-green-900">
                  {totalTransactions} 건
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">일반사용자 거래</span>
                <span className="text-md font-semibold text-green-700">
                  {generalUserTransactions} 건
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">회사사용자 거래</span>
                <span className="text-md font-semibold text-green-700">
                  {companyUserTransactions} 건
                </span>
              </div>
            </div>
          </div>
          
          {/* 환불 박스 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-700">환불</h3>
              <RefreshCw className="w-8 h-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">환불금액</span>
                <span className="text-lg font-bold text-red-900">
                  {refundAmount.toLocaleString()} 원
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">환불건수</span>
                <span className="text-md font-semibold text-red-700">
                  {refundCount} 건
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 테이블 */}
        <AdminTable
          columns={columns}
          data={paginatedPayments}
          emptyMessage="결제 내역이 없습니다"
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

        {/* 결제 상세 모달 */}
        <AdminModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="결제 상세 정보"
          size="lg"
        >
          {selectedPayment && <PaymentDetailModal payment={selectedPayment} />}
        </AdminModal>

        {/* 결제 추가 모달 */}
        <AdminModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="결제 추가"
          size="lg"
        >
          <div className="space-y-6">
            {/* 사용자 정보 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">사용자 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">사용자명 *</label>
                  <input
                    type="text"
                    value={addFormData.userName}
                    onChange={(e) => setAddFormData({ ...addFormData, userName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="사용자명을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">이메일 *</label>
                  <input
                    type="email"
                    value={addFormData.userEmail}
                    onChange={(e) => setAddFormData({ ...addFormData, userEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">사용자 유형</label>
                  <select
                    value={addFormData.userType}
                    onChange={(e) => setAddFormData({ ...addFormData, userType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general_user">일반사용자</option>
                    <option value="company_admin">회사관리자</option>
                  </select>
                </div>
                {addFormData.userType === 'company_admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">회사명 *</label>
                    <input
                      type="text"
                      value={addFormData.companyName}
                      onChange={(e) => setAddFormData({ ...addFormData, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="회사명을 입력하세요"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 결제 정보 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">결제 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">패키지</label>
                  <select
                    value={addFormData.productName}
                    onChange={(e) => {
                      const productName = e.target.value;
                      let amount = 10000;
                      let credits = 100;
                      
                      switch (productName) {
                        case '기본 패키지':
                          amount = 10000;
                          credits = 100;
                          break;
                        case '인기 패키지':
                          amount = 25000;
                          credits = 300;
                          break;
                        case '프리미엄 패키지':
                          amount = 40000;
                          credits = 500;
                          break;
                        case '엔터프라이즈 패키지':
                          amount = 70000;
                          credits = 1000;
                          break;
                      }
                      
                      setAddFormData({ 
                        ...addFormData, 
                        productName,
                        amount,
                        credits
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="기본 패키지">기본 패키지</option>
                    <option value="인기 패키지">인기 패키지</option>
                    <option value="프리미엄 패키지">프리미엄 패키지</option>
                    <option value="엔터프라이즈 패키지">엔터프라이즈 패키지</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">결제수단</label>
                  <select
                    value={addFormData.paymentMethod}
                    onChange={(e) => setAddFormData({ ...addFormData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="card">신용카드</option>
                    <option value="bank">계좌이체</option>
                    <option value="kakaopay">카카오페이</option>
                    <option value="naverpay">네이버페이</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">금액</label>
                  <input
                    type="number"
                    value={addFormData.amount}
                    onChange={(e) => setAddFormData({ ...addFormData, amount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">크레딧</label>
                  <input
                    type="number"
                    value={addFormData.credits}
                    onChange={(e) => setAddFormData({ ...addFormData, credits: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* 세금계산서 설정 (회사관리자인 경우) */}
            {addFormData.userType === 'company_admin' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">세금계산서 설정</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">세금계산서 상태</label>
                  <select
                    value={addFormData.taxInvoiceStatus}
                    onChange={(e) => setAddFormData({ ...addFormData, taxInvoiceStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="not_applicable">발행안함</option>
                    <option value="pending">발행 전</option>
                    <option value="issued">발행완료</option>
                  </select>
                </div>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                취소
              </button>
              <button
                onClick={handleAddPayment}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                추가
              </button>
            </div>
          </div>
        </AdminModal>

        {/* 수정 모달 */}
        <AdminModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="결제 정보 수정"
          size="lg"
        >
          {selectedPayment && (
            <div className="space-y-6">
              {/* 결제 정보 */}
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">결제 정보</h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">패키지명</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">{selectedPayment.productName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">크레딧</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.credits.toLocaleString()} 크레딧</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">금액</label>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">
                      {selectedPayment.amount.toLocaleString()}원
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">결제수단</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedPayment.paymentMethod === 'card' ? '신용카드' :
                       selectedPayment.paymentMethod === 'bank' ? '계좌이체' :
                       selectedPayment.paymentMethod === 'kakaopay' ? '카카오페이' :
                       selectedPayment.paymentMethod === 'naverpay' ? '네이버페이' : selectedPayment.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              {/* 상태 수정 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">상태 수정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">결제 상태</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">보류</option>
                      <option value="completed">완료</option>
                      <option value="refunded">환불</option>
                    </select>
            </div>
            
                  {/* 완료에서 환불로 변경 시 환불 크레딧 입력 */}
                  {selectedPayment.status === 'completed' && editFormData.status === 'refunded' && (
            <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">환불 크레딧</label>
                      <input
                        type="number"
                        value={editFormData.refundCredits}
                        onChange={(e) => setEditFormData({ ...editFormData, refundCredits: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max={selectedPayment.credits}
              />
            </div>
                  )}

                  {/* 환불에서 완료로 변경 시 추가 크레딧 입력 */}
                  {selectedPayment.status === 'refunded' && editFormData.status === 'completed' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">추가할 크레딧</label>
                      <input
                        type="number"
                        value={editFormData.additionalCredits}
                        onChange={(e) => setEditFormData({ ...editFormData, additionalCredits: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
            </div>
                  )}
          </div>
              </div>

              {/* 세금계산서 상태 수정 (회사관리자인 경우) */}
              {selectedPayment.user.type === 'company_admin' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">세금계산서 상태 수정</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">세금계산서 상태</label>
                    <select
                      value={editFormData.taxInvoiceStatus}
                      onChange={(e) => setEditFormData({ ...editFormData, taxInvoiceStatus: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="not_applicable">발행안함</option>
                      <option value="pending">발행 전</option>
                      <option value="issued">발행완료</option>
                    </select>
            </div>
                </div>
              )}

              {/* 저장 버튼 */}
            <div className="flex justify-end space-x-3">
              <button
                  onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                  저장
              </button>
            </div>
          </div>
          )}
        </AdminModal>
    </AdminLayout>
  );
}

// 결제 상세 정보 모달 컴포넌트
function PaymentDetailModal({ payment }: { payment: PaymentAdmin }) {
  return (
    <div className="space-y-6">
      {/* 결제 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">결제 정보</h3>
        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">패키지명</label>
            <p className="mt-1 text-sm text-gray-900 font-semibold">{payment.productName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">크레딧</label>
            <p className="mt-1 text-sm text-gray-900">{payment.credits.toLocaleString()} 크레딧</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">금액</label>
            <p className="mt-1 text-sm text-gray-900 font-semibold">
              {payment.amount.toLocaleString()}원
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">결제수단</label>
            <p className="mt-1 text-sm text-gray-900">
              {payment.paymentMethod === 'card' ? '신용카드' :
               payment.paymentMethod === 'bank' ? '계좌이체' :
               payment.paymentMethod === 'kakaopay' ? '카카오페이' :
               payment.paymentMethod === 'naverpay' ? '네이버페이' : payment.paymentMethod}
            </p>
          </div>
        </div>
      </div>

      {/* 사용자 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">사용자 정보</h3>
        <div className="bg-blue-50 rounded-lg p-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">이름</label>
            <p className="mt-1 text-sm text-gray-900">{payment.user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">ID(이메일)</label>
            <p className="mt-1 text-sm text-gray-900">{payment.user.email}</p>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-500">계정유형</label>
            <p className="mt-1 text-sm text-gray-900">
              {payment.user.type === 'general_user' ? '일반사용자' : 
               payment.user.type === 'company_admin' ? '회사관리자' : 
               payment.user.type === 'company_employee' ? '회사일반사용자' : '관리자'}
            </p>
          </div>
        </div>
      </div>

      {/* 회사 정보 (회사관리자일 경우) */}
      {payment.user.type === 'company_admin' && payment.user.companyName && (
      <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">회사 정보</h3>
          <div className="bg-green-50 rounded-lg p-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">회사명</label>
              <p className="mt-1 text-sm text-gray-900">{payment.user.companyName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">사업자등록번호</label>
              <p className="mt-1 text-sm text-gray-900">123-45-67890</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">대표자명</label>
              <p className="mt-1 text-sm text-gray-900">김대표</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">주소</label>
              <p className="mt-1 text-sm text-gray-900">서울특별시 강남구 테헤란로 123</p>
            </div>
          </div>
        </div>
      )}

      {/* 세금계산서 정보 */}
      {payment.user.type === 'company_admin' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">세금계산서</h3>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">발행여부</label>
                <p className="mt-1 text-sm text-gray-900">
                  {payment.taxInvoiceStatus === 'pending' ? '발행 전' :
                   payment.taxInvoiceStatus === 'issued' ? '발행완료' : '발행안함'}
                </p>
              </div>
            </div>
            
            {payment.taxInvoiceStatus !== 'not_applicable' && (
              <>
                <h4 className="text-sm font-medium text-gray-700 mb-2">수신처 정보</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
                    <label className="block text-sm font-medium text-gray-500">담당자명</label>
                    <p className="mt-1 text-sm text-gray-900">김담당</p>
          </div>
          <div>
                    <label className="block text-sm font-medium text-gray-500">담당자 전화번호</label>
                    <p className="mt-1 text-sm text-gray-900">02-1234-5678</p>
          </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-500">담당자 이메일</label>
                    <p className="mt-1 text-sm text-gray-900">contact@company.com</p>
        </div>
      </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 날짜 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">날짜 정보</h3>
        <div className="bg-yellow-50 rounded-lg p-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">결제 요청일</label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(payment.createdAt).toLocaleString('ko-KR')}
            </p>
          </div>
          {payment.completedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-500">결제 완료일</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(payment.completedAt).toLocaleString('ko-KR')}
              </p>
            </div>
          )}
          {payment.refundedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-500">환불 처리일</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(payment.refundedAt).toLocaleString('ko-KR')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 영수증 */}
      {payment.receiptUrl && (
          <div className="text-center">
            <button
              onClick={() => window.open(payment.receiptUrl, '_blank')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Receipt className="w-4 h-4 mr-2" />
              영수증 다운로드
            </button>
        </div>
      )}
    </div>
  );
} 