'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import ScreenDefinitionModal, { ScreenDefinition } from './ScreenDefinitionModal';

interface ScreenDefinitionButtonProps {
  pageTitle: string;
  definition: ScreenDefinition;
}

export default function ScreenDefinitionButton({ 
  pageTitle, 
  definition 
}: ScreenDefinitionButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40 group"
        title="화면 정의서 보기"
      >
        <FileText className="w-6 h-6" />
        
        {/* 툴팁 */}
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          화면 정의서
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </button>

      {/* 모달 */}
      <ScreenDefinitionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        definition={definition}
        pageTitle={pageTitle}
      />
    </>
  );
}