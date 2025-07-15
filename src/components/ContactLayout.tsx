'use client';

import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactNavigation from '@/components/ContactNavigation';

interface ContactLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function ContactLayout({ 
  children, 
  title, 
  description, 
  actions
}: ContactLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* 좌측 문의 사이드바 */}
        <ContactNavigation />
        
        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1 p-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {description && (
                  <p className="mt-2 text-sm text-gray-600">{description}</p>
                )}
              </div>
              {actions && (
                <div className="flex items-center space-x-3">
                  {actions}
                </div>
              )}
            </div>
          </div>

          {/* 페이지 콘텐츠 */}
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
} 