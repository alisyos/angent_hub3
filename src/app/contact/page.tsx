'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, FileText, Zap, CreditCard, User } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    email: '',
    title: '',
    content: '',
    priority: 'normal',
    emailNotification: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
      setFormData({
        type: '',
        name: '',
        email: '',
        title: '',
        content: '',
        priority: 'normal',
        emailNotification: true
      });
    }, 1000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const inquiryTypes = [
    { id: 'service', name: '서비스 관련', icon: Zap },
    { id: 'technical', name: '기술 지원', icon: FileText },
    { id: 'billing', name: '결제/크레딧', icon: CreditCard },
    { id: 'account', name: '계정 관리', icon: User },
    { id: 'other', name: '기타', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            문의하기
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            궁금한 점이나 문제가 있으시면 언제든지 문의해 주세요. 
            전문 상담원이 빠르게 답변 드리겠습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">문의 양식</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    문의 유형 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {inquiryTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <label
                          key={type.id}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.type === type.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={type.id}
                            checked={formData.type === type.id}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            className="sr-only"
                            required
                          />
                          <Icon className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">{type.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="이름을 입력하세요"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="답변을 받을 이메일 주소"
                      required
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="문의 제목을 입력하세요"
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    상세 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    placeholder="문의 내용을 상세히 입력해 주세요"
                    required
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    긴급도
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="normal">일반</option>
                    <option value="important">중요</option>
                    <option value="urgent">긴급</option>
                  </select>
                </div>

                {/* Email Notification */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotification"
                    checked={formData.emailNotification}
                    onChange={(e) => handleInputChange('emailNotification', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotification" className="ml-2 block text-sm text-gray-700">
                    이메일로 답변 알림 받기
                  </label>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>문의 접수 중...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>문의 보내기</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">연락처 정보</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">이메일</p>
                    <p className="text-sm text-gray-600">support@aigenthub.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">전화번호</p>
                    <p className="text-sm text-gray-600">02-1234-5678</p>
                    <p className="text-xs text-gray-500">평일 09:00 - 18:00</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">주소</p>
                    <p className="text-sm text-gray-600">
                      서울특별시 강남구<br />
                      테헤란로 123, 456호
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">응답 시간</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>일반 문의:</span>
                  <span className="font-medium">24시간 이내</span>
                </div>
                <div className="flex justify-between">
                  <span>기술 지원:</span>
                  <span className="font-medium">12시간 이내</span>
                </div>
                <div className="flex justify-between">
                  <span>긴급 문의:</span>
                  <span className="font-medium">2시간 이내</span>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">자주 묻는 질문</h3>
              <p className="text-sm text-gray-600 mb-4">
                자주 묻는 질문을 먼저 확인해 보세요. 
                빠른 답변을 찾을 수 있습니다.
              </p>
              <button className="w-full btn-secondary">
                FAQ 보기
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 