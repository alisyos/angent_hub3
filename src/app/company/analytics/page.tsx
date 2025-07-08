'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CompanyLayout from '@/components/CompanyLayout';
import { 
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Users,
  Bot,
  Building,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon
} from 'lucide-react';
import { employeeData, departmentData, agentUsageData } from '@/data/company';

export default function CompanyAnalytics() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'employee' | 'team' | 'agent'>('employee');

  // URL 파라미터에서 탭 정보 읽기
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'employee' || tab === 'department' || tab === 'team') {
      setActiveTab(tab === 'department' ? 'team' : tab as 'employee' | 'team');
    } else if (tab === 'agent') {
      setActiveTab('agent');
    }
  }, [searchParams]);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'custom'>('7d');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 부서 목록
  const departments = ['개발팀', '마케팅팀', '기획팀', '디자인팀', '영업팀', '인사팀', '재무팀', '법무팀', '운영팀', '구매팀', '품질팀'];
  
  // 카테고리 목록
  const categories = ['일반사무', '마케팅/광고', '콘텐츠 제작'];

  // 데이터 필터링 및 정렬
  const getFilteredData = () => {
    let data: any[] = [];
    
    if (activeTab === 'employee') {
      data = employeeData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        const matchesDepartment = departmentFilter === 'all' || item.department === departmentFilter;
        return matchesSearch && matchesStatus && matchesDepartment;
      });
    } else if (activeTab === 'team') {
      data = departmentData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
      });
    } else if (activeTab === 'agent') {
      data = agentUsageData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
      });
    }

    // 정렬
    data.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return data;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };



  const handleDateRangeChange = (range: '7d' | '30d' | 'custom') => {
    setDateRange(range);
    if (range !== 'custom') {
      setShowDatePicker(false);
    } else {
      setShowDatePicker(true);
    }
  };

  const getDateRangeText = () => {
    if (dateRange === '7d') return '최근 7일';
    if (dateRange === '30d') return '최근 30일';
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      return `${customStartDate} ~ ${customEndDate}`;
    }
    return '직접 입력';
  };

  return (
    <CompanyLayout 
      title="분석 및 리포트"
      description="AI 에이전트 사용량과 성과를 분석하고 리포트를 확인해보세요"
      hideTimePeriod={true}
    >
      <div className="space-y-6">
        {/* 기간 선택 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">분석 기간</h3>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{getDateRangeText()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleDateRangeChange('7d')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dateRange === '7d' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              최근 7일
            </button>
            <button
              onClick={() => handleDateRangeChange('30d')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dateRange === '30d' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              최근 30일
            </button>
            <button
              onClick={() => handleDateRangeChange('custom')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                dateRange === 'custom' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              직접 입력
            </button>
          </div>
          
          {showDatePicker && (
            <div className="mt-4 flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('employee')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'employee'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>직원별 분석</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'team'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>부서별 분석</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('agent')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'agent'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <span>에이전트별 분석</span>
                </div>
              </button>
            </nav>
          </div>

          {/* 검색 및 필터 섹션 */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
              {/* 검색 */}
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={
                      activeTab === 'employee' ? '직원명 또는 이메일 검색' :
                      activeTab === 'team' ? '부서명 검색' :
                      '에이전트명 검색'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 필터 */}
              <div className="flex items-center space-x-2">
                {(activeTab === 'employee' || activeTab === 'team') && (
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">모든 상태</option>
                    {activeTab === 'team' ? (
                      <>
                        <option value="전체 허용">전체 허용</option>
                        <option value="일부 허용">일부 허용</option>
                        <option value="사용 금지">사용 금지</option>
                      </>
                    ) : (
                      <>
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                      </>
                    )}
                  </select>
                )}

                {activeTab === 'employee' && (
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">모든 부서</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                )}

                {activeTab === 'agent' && (
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">모든 카테고리</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}


              </div>
            </div>
          </div>

          {/* 데이터 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {activeTab === 'employee' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>이름</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('department')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>부서</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('status')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>상태</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('usageCount')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>사용 횟수</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('creditsUsed')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>사용 크레딧</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        최다 사용 에이전트
                      </th>
                    </>
                  )}
                  {activeTab === 'team' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>부서명</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('allocatedCredits')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>할당 크레딧</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('status')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>상태</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('usageCount')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>사용 횟수</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('creditsUsed')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>사용 크레딧</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        최다 사용 에이전트
                      </th>
                    </>
                  )}
                  {activeTab === 'agent' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>에이전트명</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('category')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>카테고리</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('usageCount')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>사용 횟수</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={() => handleSort('creditsUsed')}
                          className="flex items-center space-x-1 hover:text-gray-700"
                        >
                          <span>사용 크레딧</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {activeTab === 'employee' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {item.name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status === 'active' ? '활성' : '비활성'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.usageCount}회
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.creditsUsed.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.topAgent}
                        </td>
                      </>
                    )}
                    {activeTab === 'team' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Building className="w-5 h-5 text-purple-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.allocatedCredits.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === '전체 허용' 
                              ? 'bg-green-100 text-green-800' 
                              : item.status === '일부 허용'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.usageCount}회
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.creditsUsed.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.topAgent}
                        </td>
                      </>
                    )}
                    {activeTab === 'agent' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Bot className="w-5 h-5 text-green-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.category === '일반사무' ? 'bg-blue-100 text-blue-800' :
                            item.category === '마케팅/광고' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.usageCount}회
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.creditsUsed.toLocaleString()}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  전체 {filteredData.length}개 중 {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredData.length)}개 표시
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CompanyLayout>
  );
} 