import React from 'react';
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';

interface Column<T = unknown> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface TableAction<T> {
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick: (row: T, index: number) => void;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  show?: (row: T) => boolean;
}

interface AdminTableProps<T = unknown> {
  columns: Column<T>[];
  data: T[];
  actions?: TableAction<T>[];
  loading?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T) => void;
  selectedRows?: string[];
  onRowSelect?: (item: T) => void;
  onSelectAll?: () => void;
  rowClassName?: (item: T) => string;
}

const actionColors = {
  blue: 'text-blue-600 hover:text-blue-900 hover:bg-blue-50',
  green: 'text-green-600 hover:text-green-900 hover:bg-green-50',
  yellow: 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50',
  red: 'text-red-600 hover:text-red-900 hover:bg-red-50',
  gray: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
};

export default function AdminTable<T>({
  columns,
  data,
  actions,
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  emptyMessage = '데이터가 없습니다.',
  className = '',
  onRowClick,
  selectedRows,
  onRowSelect,
  onSelectAll,
  rowClassName
}: AdminTableProps<T>) {
  
  const getValue = (row: T, key: string): any => {
    if (typeof key === 'string' && key.includes('.')) {
      return key.split('.').reduce((obj: any, k) => obj?.[k], row);
    }
    return row[key as keyof T];
  };

  const handleSort = (column: Column<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    
    if (sortBy === column.key) {
      return sortOrder === 'asc' ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      );
    }
    
    return <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-50" />;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="animate-pulse">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex space-x-4">
                  {columns.map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded flex-1"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 group' : ''
                  } ${column.className || ''}`}
                  style={{ width: column.sortable ? 'auto' : column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (actions ? 1 : 0)} 
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <MoreHorizontal className="w-12 h-12 text-gray-300 mb-4" />
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item: T, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 transition-colors ${rowClassName ? rowClassName(item) : ''}`}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        column.className || 'text-gray-900'
                      }`}
                    >
                      {column.render 
                        ? column.render(item)
                        : getValue(item, column.key)
                      }
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        {actions
                          .filter(action => !action.show || action.show(item))
                          .map((action, actionIndex) => {
                            const Icon = action.icon;
                            return (
                              <button
                                key={actionIndex}
                                onClick={() => action.onClick(item, index)}
                                className={`p-2 rounded-lg transition-colors ${
                                  actionColors[action.color || 'gray']
                                }`}
                                title={action.label}
                              >
                                {Icon ? (
                                  <Icon className="w-4 h-4" />
                                ) : (
                                  <span className="text-xs font-medium">
                                    {action.label}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 