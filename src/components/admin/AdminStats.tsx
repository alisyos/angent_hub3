import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface AdminStatsProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    type: 'positive' | 'negative';
    label?: string;
  };
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray';
  loading?: boolean;
  onClick?: () => void;
}

const colorClasses = {
  blue: {
    background: 'bg-blue-100',
    icon: 'text-blue-600',
    change: 'text-blue-600'
  },
  green: {
    background: 'bg-green-100',
    icon: 'text-green-600',
    change: 'text-green-600'
  },
  purple: {
    background: 'bg-purple-100',
    icon: 'text-purple-600',
    change: 'text-purple-600'
  },
  yellow: {
    background: 'bg-yellow-100',
    icon: 'text-yellow-600',
    change: 'text-yellow-600'
  },
  red: {
    background: 'bg-red-100',
    icon: 'text-red-600',
    change: 'text-red-600'
  },
  gray: {
    background: 'bg-gray-100',
    icon: 'text-gray-600',
    change: 'text-gray-600'
  }
};

export default function AdminStats({
  title,
  value,
  icon: Icon,
  change,
  color = 'blue',
  loading = false,
  onClick
}: AdminStatsProps) {
  const colors = colorClasses[color];
  
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-gray-300' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
              {change && <div className="h-4 bg-gray-200 rounded w-16"></div>}
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatValue(value)}
              </p>
              {change && (
                <div className={`flex items-center text-sm ${
                  change.type === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {change.type === 'positive' ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span className="font-medium">
                    {change.type === 'positive' ? '+' : ''}{change.value}%
                  </span>
                  {change.label && (
                    <span className="ml-1 text-gray-500">{change.label}</span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <div className={`w-12 h-12 ${colors.background} rounded-lg flex items-center justify-center ml-4`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
} 