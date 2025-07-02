'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  MessageSquare, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Reply,
  Archive,
  Trash2
} from 'lucide-react';

export default function AdminInquiries() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const inquiries = [
    {
      id: 1,
      type: 'payment',
      title: '결제 승인이 되지 않습니다',
      content: '크레딧 구매 시 결제 승인이 계속 실패합니다. 카드는 정상이고...',
      user: '김철수',
      email: 'kimcs@example.com',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-20 14:30',
      updatedAt: '2024-01-20 14:30'
    },
    {
      id: 2,
      type: 'technical',
      title: 'AI 에이전트 실행 오류',
      content: '회의록 자동화 AI 실행 시 "서버 오류"가 발생합니다.',
      user: '이영희',
      email: 'leeyh@company.com',
      status: 'in_progress',
      priority: 'high',
      createdAt: '2024-01-20 12:15',
      updatedAt: '2024-01-20 15:20'
    },
    {
      id: 3,
      type: 'general',
      title: '회사 계정 전환 방법',
      content: '개인 계정을 회사 계정으로 전환하고 싶습니다.',
      user: '박민수',
      email: 'parkms@example.com',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-01-19 16:45',
      updatedAt: '2024-01-20 09:30'
    }
  ];

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus;
    const matchesType = filterType === 'all' || inquiry.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle },
      resolved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle }
    };

    const labels = {
      pending: '대기중',
      in_progress: '처리중',
      resolved: '해결완료'
    };

    const style = styles[status as keyof typeof styles];
    const IconComponent = style.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">문의 관리</h1>
          <p className="mt-2 text-sm text-gray-600">
            사용자 문의를 관리하고 응답하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 문의</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{inquiries.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">대기중</p>
                <p className="text-2xl font-bold text-yellow-600 mt-2">
                  {inquiries.filter(i => i.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">처리중</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {inquiries.filter(i => i.status === 'in_progress').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">해결완료</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {inquiries.filter(i => i.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="문의 제목, 내용, 사용자명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">모든 상태</option>
                <option value="pending">대기중</option>
                <option value="in_progress">처리중</option>
                <option value="resolved">해결완료</option>
              </select>
            </div>
            
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">모든 유형</option>
                <option value="payment">결제</option>
                <option value="technical">기술</option>
                <option value="general">일반</option>
                <option value="feature">기능</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              문의 목록 ({filteredInquiries.length}건)
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{inquiry.title}</h3>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {inquiry.content.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>{inquiry.user} ({inquiry.email})</span>
                      <span>작성: {inquiry.createdAt}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md">
                      <Reply className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md">
                      <Archive className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
