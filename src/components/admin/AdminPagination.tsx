import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  showInfo?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export default function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [10, 25, 50, 100],
  showInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  className = ''
}: AdminPaginationProps) {
  
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // 모든 페이지를 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 주변의 페이지들을 표시
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, currentPage + halfVisible);
      
      // 시작 또는 끝 부분을 조정
      if (endPage - startPage + 1 < maxVisiblePages) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        } else {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
      }
      
      // 첫 페이지와 ... 추가
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      // 중간 페이지들 추가
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // ... 와 마지막 페이지 추가
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
      // 현재 페이지가 새로운 페이지 수를 초과하지 않도록 조정
      const newTotalPages = Math.ceil(totalItems / newItemsPerPage);
      if (currentPage > newTotalPages) {
        onPageChange(Math.max(1, newTotalPages));
      }
    }
  };

  if (totalPages <= 1 && !showInfo && !showItemsPerPage) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 ${className}`}>
      {/* 정보 표시 */}
      {showInfo && (
        <div className="text-sm text-gray-700">
          <span className="font-medium">{startItem}-{endItem}</span>
          <span className="mx-1">of</span>
          <span className="font-medium">{totalItems.toLocaleString()}</span>
          <span className="ml-1">항목</span>
        </div>
      )}

      {/* 페이지네이션 컨트롤 */}
      <div className="flex items-center space-x-2">
        {/* 첫 페이지 버튼 */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="첫 페이지"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="이전 페이지"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* 페이지 번호들 */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="다음 페이지"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* 마지막 페이지 버튼 */}
        {showFirstLast && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="마지막 페이지"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 페이지당 항목 수 선택 */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
            페이지당:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

// 간단한 페이지네이션 컴포넌트 (정보만 표시)
interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}: SimplePaginationProps) {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <span className="px-4 py-2 text-sm text-gray-700">
        {currentPage} / {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
} 