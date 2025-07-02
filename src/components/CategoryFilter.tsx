'use client';

import { AgentCategory } from '@/types/agent';
import { Briefcase, Megaphone, PenTool, Grid3X3 } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: AgentCategory | 'all';
  onCategoryChange: (category: AgentCategory | 'all') => void;
  categoryCounts: Record<AgentCategory | 'all', number>;
}

const categoryIcons = {
  all: Grid3X3,
  '일반사무': Briefcase,
  '마케팅/광고': Megaphone,
  '콘텐츠 제작': PenTool,
};

const categoryColors = {
  all: 'bg-gray-100 text-gray-800 border-gray-200',
  '일반사무': 'bg-blue-100 text-blue-800 border-blue-200',
  '마케팅/광고': 'bg-green-100 text-green-800 border-green-200',
  '콘텐츠 제작': 'bg-purple-100 text-purple-800 border-purple-200',
};

const selectedCategoryColors = {
  all: 'bg-gray-600 text-white border-gray-600',
  '일반사무': 'bg-blue-600 text-white border-blue-600',
  '마케팅/광고': 'bg-green-600 text-white border-green-600',
  '콘텐츠 제작': 'bg-purple-600 text-white border-purple-600',
};

export default function CategoryFilter({ 
  selectedCategory, 
  onCategoryChange, 
  categoryCounts 
}: CategoryFilterProps) {
  const categories: (AgentCategory | 'all')[] = ['all', '일반사무', '마케팅/광고', '콘텐츠 제작'];

  const getCategoryLabel = (category: AgentCategory | 'all') => {
    return category === 'all' ? '전체' : category;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">카테고리</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const isSelected = selectedCategory === category;
          const colorClass = isSelected 
            ? selectedCategoryColors[category]
            : categoryColors[category];
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${colorClass}`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <span className="font-medium text-sm mb-1">
                {getCategoryLabel(category)}
              </span>
              <span className="text-xs opacity-75">
                {categoryCounts[category]}개
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
} 