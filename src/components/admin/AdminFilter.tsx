import React from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange';
  options?: FilterOption[];
  placeholder?: string;
}

interface AdminFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  filterValues: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onReset?: () => void;
  showReset?: boolean;
  className?: string;
}

export default function AdminFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = '검색...',
  filters = [],
  filterValues,
  onFilterChange,
  onReset,
  showReset = true,
  className = ''
}: AdminFilterProps) {
  
  const hasActiveFilters = searchValue || Object.values(filterValues).some(value => 
    value && (Array.isArray(value) ? value.length > 0 : true)
  );

  const handleReset = () => {
    onSearchChange('');
    filters.forEach(filter => {
      onFilterChange(filter.key, filter.type === 'multiselect' ? [] : '');
    });
    onReset?.();
  };

  const renderFilter = (filter: FilterConfig) => {
    const value = filterValues[filter.key];

    switch (filter.type) {
      case 'select':
        return (
          <select
            key={filter.key}
            value={value || ''}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">{filter.placeholder || `모든 ${filter.label}`}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div key={filter.key} className="relative">
            <select
              multiple
              value={value || []}
              onChange={(e) => {
                const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                onFilterChange(filter.key, selectedValues);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              size={Math.min(filter.options?.length || 3, 4)}
            >
              {filter.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {value && Array.isArray(value) && value.length > 0 && (
              <div className="absolute top-1 right-1">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {value.length}
                </span>
              </div>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={filter.key} className="relative">
            <input
              type="date"
              value={value || ''}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        );

      case 'daterange':
        return (
          <div key={filter.key} className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                type="date"
                value={value?.start || ''}
                onChange={(e) => onFilterChange(filter.key, { ...value, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="시작일"
              />
              <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            <div className="relative">
              <input
                type="date"
                value={value?.end || ''}
                onChange={(e) => onFilterChange(filter.key, { ...value, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="종료일"
              />
              <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="grid grid-cols-1 gap-4">
        {/* Search Row */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {showReset && hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="text-sm">초기화</span>
            </button>
          )}
        </div>

        {/* Filters Row */}
        {filters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                {renderFilter(filter)}
              </div>
            ))}
          </div>
        )}
        
        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">활성 필터:</span>
            <div className="flex flex-wrap gap-2">
              {searchValue && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  검색: "{searchValue}"
                </span>
              )}
              {filters.map((filter) => {
                const value = filterValues[filter.key];
                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                
                if (Array.isArray(value)) {
                  return value.map((v) => {
                    const option = filter.options?.find(opt => opt.value === v);
                    return (
                      <span key={`${filter.key}-${v}`} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        {filter.label}: {option?.label || v}
                      </span>
                    );
                  });
                } else if (filter.type === 'daterange' && typeof value === 'object') {
                  const parts = [];
                  if (value.start) parts.push(`시작: ${value.start}`);
                  if (value.end) parts.push(`종료: ${value.end}`);
                  if (parts.length > 0) {
                    return (
                      <span key={filter.key} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        {filter.label}: {parts.join(', ')}
                      </span>
                    );
                  }
                } else {
                  const option = filter.options?.find(opt => opt.value === value);
                  return (
                    <span key={filter.key} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                      {filter.label}: {option?.label || value}
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 