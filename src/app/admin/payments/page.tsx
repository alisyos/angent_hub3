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
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterValues, setFilterValues] = useState<Record<string, string | string[]>>({});
  const [searchValue, setSearchValue] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    payment: PaymentAdmin | null;
    type: 'refund' | 'cancel';
  }>({
    isOpen: false,
    payment: null,
    type: 'refund'
  });

  // 필터 정의
  const filterOptions = [
    {
      key: 'status',
      label: '상태',
      type: 'select' as const,
      options: [
        { value: 'pending', label: '대기중' },
        { value: 'completed', label: '완료' },
        { value: 'failed', label: '실패' },
        { value: 'refunded', label: '환불' },
        { value: 'cancelled', label: '취소' }
      ]
    },
    {
      key: 'type',
      label: '결제 유형',
      type: 'select' as const,
      options: [
        { value: 'credit_purchase', label: '크레딧 구매' },
        { value: 'subscription', label: '구독' },
        { value: 'refund', label: '환불' }
      ]
    },
    {
      key: 'paymentMethod',
      label: '결제 수단',
      type: 'select' as const,
      options: [
        { value: 'card', label: '카드' },
        { value: 'bank', label: '계좌이체' },
        { value: 'kakaopay', label: '카카오페이' },
        { value: 'naverpay', label: '네이버페이' },
        { value: 'toss', label: '토스' }
      ]
    }
  ];

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'info',
      label: '결제 정보',
      render: (payment: PaymentAdmin) => (
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                payment?.status === 'completed' ? 'bg-green-100' :
                payment?.status === 'failed' ? 'bg-red-100' :
                payment?.status === 'refunded' ? 'bg-yellow-100' :
                'bg-gray-100'
              }`}>
                <CreditCard className={`w-5 h-5 ${
                  payment?.status === 'completed' ? 'text-green-600' :
                  payment?.status === 'failed' ? 'text-red-600' :
                  payment?.status === 'refunded' ? 'text-yellow-600' :
                  'text-gray-400'
                }`} />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {(payment?.amount ?? 0).toLocaleString()}원
              </p>
              <p className="text-sm text-gray-500">
                {payment?.type === 'credit_purchase' ? `${payment?.credits ?? 0} 크레딧` :
                 payment?.type === 'subscription' ? '구독' : '환불'}
              </p>
              <p className="text-xs text-gray-400">
                ID: {payment?.transactionId || '거래ID 없음'}
              </p>
            </div>
          </div>
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
              {payment?.user?.type === 'company' ? 
                <Building2 className="w-4 h-4 text-gray-500" /> :
                <User className="w-4 h-4 text-gray-500" />
              }
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{payment?.user?.name || '사용자 정보 없음'}</p>
            <p className="text-sm text-gray-500">{payment?.user?.email || '이메일 없음'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'method',
      label: '결제 수단',
      render: (payment: PaymentAdmin) => getPaymentMethodBadge(payment?.paymentMethod || 'card')
    },
    {
      key: 'status',
      label: '상태',
      render: (payment: PaymentAdmin) => getStatusBadge(payment?.status || 'pending')
    },
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
          {payment?.receiptUrl && (
            <button
              onClick={() => window.open(payment.receiptUrl!, '_blank')}
              className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
              title="영수증 다운로드"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          {payment?.status === 'completed' && (
            <button
              onClick={() => payment && handleRefundPayment(payment)}
              className="p-1 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded"
              title="환불 처리"
              disabled={!payment}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {payment?.status === 'pending' && (
            <button
              onClick={() => payment && handleCancelPayment(payment)}
              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
              title="결제 취소"
              disabled={!payment}
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
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
      card: '카드',
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
      pending: '대기중',
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

    // 검색어 필터링
    if (searchValue) {
      filtered = filtered.filter(payment =>
        (payment?.transactionId || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (payment?.user?.name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
        (payment?.user?.email || '').toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // 기타 필터링
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(payment => {
          const paymentValue = payment?.[key as keyof PaymentAdmin];
          return paymentValue === value;
        });
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

  const handleRefundPayment = (payment: PaymentAdmin) => {
    setSelectedPayment(payment);
    setRefundReason('');
    setShowRefundModal(true);
  };

  const handleCancelPayment = (payment: PaymentAdmin) => {
    setConfirmModal({
      isOpen: true,
      payment,
      type: 'cancel'
    });
  };

  const handleProcessRefund = () => {
    if (!selectedPayment || !refundReason.trim()) {
      alert('환불 사유를 입력해주세요.');
      return;
    }

    setPayments(prev => prev.map(payment =>
      payment.id === selectedPayment.id
        ? {
            ...payment,
            status: 'refunded' as const,
            refundedAt: new Date().toISOString(),
            refundReason: refundReason,
            refundedBy: '관리자'
          }
        : payment
    ));

    setShowRefundModal(false);
    alert('환불 처리가 완료되었습니다.');
  };

  const handleConfirmAction = () => {
    if (!confirmModal.payment) return;

    if (confirmModal.type === 'cancel') {
      setPayments(prev => prev.map(payment =>
        payment.id === confirmModal.payment!.id
          ? { ...payment, status: 'cancelled' as const }
          : payment
      ));
      alert('결제가 취소되었습니다.');
    }

    setConfirmModal({ isOpen: false, payment: null, type: 'refund' });
  };

  // 통계 계산
  const totalRevenue = payments
    .filter(p => p?.status === 'completed')
    .reduce((sum, p) => sum + (p?.amount ?? 0), 0);

  const monthlyRevenue = payments
    .filter(p => {
      if (!p?.createdAt || !p?.status) return false;
      const paymentDate = new Date(p.createdAt);
      const now = new Date();
      return p.status === 'completed' &&
             paymentDate.getMonth() === now.getMonth() &&
             paymentDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, p) => sum + (p?.amount ?? 0), 0);

  const refundAmount = payments
    .filter(p => p?.status === 'refunded')
    .reduce((sum, p) => sum + (p?.amount ?? 0), 0);

  const refundRate = totalRevenue > 0 ? (refundAmount / totalRevenue) * 100 : 0;

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

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AdminStats
            title="총 매출"
            value={`${(totalRevenue / 1000000).toFixed(1)}M원`}
            icon={DollarSign}
            color="green"
            change={{ value: 15, type: 'positive' }}
          />
          <AdminStats
            title="이번 달 매출"
            value={`${(monthlyRevenue / 1000).toFixed(0)}K원`}
            icon={TrendingUp}
            color="blue"
            change={{ value: 8, type: 'positive' }}
          />
          <AdminStats
            title="총 거래"
            value={payments.filter(p => p?.status === 'completed').length}
            icon={CreditCard}
            color="purple"
            change={{ value: 12, type: 'positive' }}
          />
          <AdminStats
            title="환불율"
            value={`${refundRate.toFixed(1)}%`}
            icon={RefreshCw}
            color="yellow"
            change={{ value: -2, type: 'negative' }}
          />
        </div>

        {/* 필터 */}
        <AdminFilter
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          searchPlaceholder="거래ID, 사용자명, 이메일로 검색..."
          filters={filterOptions}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
        />

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

        {/* 환불 처리 모달 */}
        <AdminModal
          isOpen={showRefundModal}
          onClose={() => setShowRefundModal(false)}
          title="환불 처리"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                환불 정보
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">거래ID:</span>
                    <span className="ml-2 font-medium">{selectedPayment?.transactionId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">결제 금액:</span>
                    <span className="ml-2 font-medium">{selectedPayment?.amount.toLocaleString()}원</span>
                  </div>
                  <div>
                    <span className="text-gray-500">사용자:</span>
                    <span className="ml-2 font-medium">{selectedPayment?.user.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">결제일:</span>
                    <span className="ml-2 font-medium">
                      {selectedPayment && new Date(selectedPayment.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                환불 사유 *
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="환불 사유를 입력하세요..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleProcessRefund}
                disabled={!refundReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                환불 처리
              </button>
            </div>
          </div>
        </AdminModal>

        {/* 확인 모달 */}
        <AdminModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, payment: null, type: 'refund' })}
          title="결제 취소"
          size="sm"
        >
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              이 결제를 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, payment: null, type: 'refund' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                결제 취소
              </button>
            </div>
          </div>
        </AdminModal>
    </AdminLayout>
  );
}

// 결제 상세 정보 모달 컴포넌트
function PaymentDetailModal({ payment }: { payment: PaymentAdmin }) {
  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">결제 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">거래 ID</label>
            <p className="mt-1 text-sm text-gray-900 font-mono">{payment.transactionId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">게이트웨이 ID</label>
            <p className="mt-1 text-sm text-gray-900 font-mono">{payment.gatewayTransactionId || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">결제 유형</label>
            <p className="mt-1 text-sm text-gray-900">
              {payment.type === 'credit_purchase' ? '크레딧 구매' :
               payment.type === 'subscription' ? '구독' : '환불'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">결제 상태</label>
            <p className="mt-1 text-sm text-gray-900">{payment.status}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">결제 금액</label>
            <p className="mt-1 text-sm text-gray-900 font-semibold">
              {payment.amount.toLocaleString()}원
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">크레딧</label>
            <p className="mt-1 text-sm text-gray-900">{payment.credits.toLocaleString()} 크레딧</p>
          </div>
        </div>
      </div>

      {/* 사용자 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">사용자 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">이름</label>
            <p className="mt-1 text-sm text-gray-900">{payment.user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">이메일</label>
            <p className="mt-1 text-sm text-gray-900">{payment.user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">계정 유형</label>
            <p className="mt-1 text-sm text-gray-900">
              {payment.user.type === 'individual' ? '개인' : payment.user.type === 'company' ? '회사' : '관리자'}
            </p>
          </div>
        </div>
      </div>

      {/* 결제 수단 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">결제 수단</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">결제 수단</label>
            <p className="mt-1 text-sm text-gray-900">{payment.paymentMethod}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">결제 게이트웨이</label>
            <p className="mt-1 text-sm text-gray-900">{payment.gateway}</p>
          </div>
        </div>
      </div>

      {/* 날짜 정보 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">날짜 정보</h3>
        <div className="grid grid-cols-2 gap-4">
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

      {/* 환불 정보 */}
      {payment.status === 'refunded' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">환불 정보</h3>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">환불 사유</label>
                <p className="mt-1 text-sm text-gray-900">{payment.refundReason}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">환불 처리자</label>
                <p className="mt-1 text-sm text-gray-900">{payment.refundedBy}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 영수증 */}
      {payment.receiptUrl && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">영수증</h3>
          <div className="text-center">
            <button
              onClick={() => window.open(payment.receiptUrl, '_blank')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Receipt className="w-4 h-4 mr-2" />
              영수증 다운로드
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 