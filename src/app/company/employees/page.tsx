'use client';

import { useState, useMemo, useEffect } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { aiAgents } from '@/data/agents';
import { 
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
  Check,
  ChevronUp,
  ChevronDown,
  Filter
} from 'lucide-react';

export default function CompanyEmployees() {
  const [activeTab, setActiveTab] = useState('employees');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 필터 및 정렬 상태
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'department' | 'lastActive' | 'status' | 'joinDate'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // 편집 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  
  // 부서 관리 필터 및 정렬 상태
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('');
  const [agentSearchTerm, setAgentSearchTerm] = useState('');
  const [creditSortDirection, setCreditSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // 부서 설정 모달 상태
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [isNewDepartment, setIsNewDepartment] = useState(false);
  
  const itemsPerPage = 20;
  const departmentItemsPerPage = 10;

  // 직원 데이터 (실제로는 더 많은 데이터)
  const allEmployees = [
    { id: 1, name: '김철수', department: '개발팀', mostUsedAgent: '회의록 자동화 AI', lastActive: '2024-01-20', email: 'kim@company.com', status: 'active', joinDate: '2023-03-15', phone: '010-1234-5678' },
    { id: 2, name: '이영희', department: '마케팅팀', mostUsedAgent: 'SNS 이벤트 기획 AI', lastActive: '2024-01-20', email: 'lee@company.com', status: 'active', joinDate: '2023-05-22', phone: '010-2345-6789' },
    { id: 3, name: '박민수', department: '기획팀', mostUsedAgent: 'PPT 슬라이드 생성기', lastActive: '2024-01-19', email: 'park@company.com', status: 'active', joinDate: '2023-07-10', phone: '010-3456-7890' },
    { id: 4, name: '정수진', department: '디자인팀', mostUsedAgent: '카드뉴스 생성 AI', lastActive: '2024-01-19', email: 'jung@company.com', status: 'active', joinDate: '2023-09-05', phone: '010-4567-8901' },
    { id: 5, name: '최동현', department: '영업팀', mostUsedAgent: '이메일 자동 작성 AI', lastActive: '2024-01-18', email: 'choi@company.com', status: 'inactive', joinDate: '2023-11-12', phone: '010-5678-9012' },
    // 부서 미정인 직원들
    { id: 6, name: '강미정', department: '부서 미정', mostUsedAgent: '-', lastActive: '-', email: 'kang@company.com', status: 'inactive', joinDate: '2024-01-15', phone: '010-6789-0123' },
    { id: 7, name: '윤성호', department: '부서 미정', mostUsedAgent: '-', lastActive: '-', email: 'yoon@company.com', status: 'inactive', joinDate: '2024-01-18', phone: '010-7890-1234' },
    { id: 8, name: '조현우', department: '부서 미정', mostUsedAgent: '-', lastActive: '-', email: 'cho@company.com', status: 'inactive', joinDate: '2024-01-20', phone: '010-8901-2345' },
    // 더 많은 직원 데이터...
    ...Array.from({ length: 27 }, (_, i) => ({
      id: i + 9,
      name: `${['김', '이', '박', '정', '최', '신', '윤', '장', '임', '한'][i % 10]}직원${i + 9}`,
      department: i % 7 === 0 ? '부서 미정' : ['개발팀', '마케팅팀', '기획팀', '디자인팀', '영업팀'][i % 5],
      mostUsedAgent: i % 7 === 0 ? '-' : '회의록 자동화 AI',
      lastActive: i % 7 === 0 ? '-' : '2024-01-20',
      email: `employee${i + 9}@company.com`,
      status: i % 7 === 0 ? 'inactive' : (Math.random() > 0.2 ? 'active' : 'inactive'),
      joinDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`
    }))
  ];

  // 부서 데이터
  const allDepartments = [
    { id: 1, name: '개발팀', members: 12, headCount: 15, manager: '김개발', credits: 450 },
    { id: 2, name: '마케팅팀', members: 8, headCount: 10, manager: '이마케팅', credits: 380 },
    { id: 3, name: '기획팀', members: 6, headCount: 8, manager: '박기획', credits: 320 },
    { id: 4, name: '디자인팀', members: 5, headCount: 6, manager: '정디자인', credits: 290 },
    { id: 5, name: '영업팀', members: 9, headCount: 12, manager: '최영업', credits: 250 },
    // 더 많은 부서 데이터...
    ...Array.from({ length: 18 }, (_, i) => ({
      id: i + 6,
      name: `부서${i + 6}`,
      members: Math.floor(Math.random() * 15) + 3,
      headCount: Math.floor(Math.random() * 20) + 5,
      manager: `관리자${i + 6}`,
      credits: Math.floor(Math.random() * 400) + 100
    }))
  ];

  // AI 에이전트 데이터 (실제 데이터 사용)
  const allAgents = aiAgents.map(agent => ({
    id: agent.id,
    name: agent.name,
    category: agent.category,
    cost: agent.creditCost
  }));

  // 직원 목록 상태 관리
  const [employees, setEmployees] = useState(allEmployees);

  // 직원 관리 기능들
  const handleEditEmployee = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setEditingEmployee(employee);
      setIsEditModalOpen(true);
    }
  };

  const handleToggleEmployeeStatus = (employeeId: number) => {
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp.id === employeeId 
          ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
          : emp
      )
    );
  };

  // 정렬 기능
  const handleSort = (field: 'name' | 'department' | 'lastActive' | 'status' | 'joinDate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 필터링 및 정렬된 직원 목록
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      // 검색 필터
      const matchesSearch = employeeSearchTerm === '' || 
        employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(employeeSearchTerm.toLowerCase());
      
      // 부서 필터
      const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
      
      // 상태 필터
      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });

    // 정렬
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'department':
          aValue = a.department;
          bValue = b.department;
          break;
        case 'lastActive':
          aValue = a.lastActive;
          bValue = b.lastActive;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'joinDate':
          aValue = a.joinDate;
          bValue = b.joinDate;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortDirection === 'desc') {
        return bValue.localeCompare(aValue, 'ko');
      } else {
        return aValue.localeCompare(bValue, 'ko');
      }
    });

    return filtered;
  }, [employees, employeeSearchTerm, departmentFilter, statusFilter, sortField, sortDirection]);

  // 부서별 설정 상태 (권한 + 크레딧)
  const [departmentSettings, setDepartmentSettings] = useState<Record<string, { 
    type: 'full' | 'partial' | 'none'; 
    agents: string[]; 
    credits: number | 'unlimited';
  }>>({
    '개발팀': { type: 'partial', agents: ['회의록 자동화 AI', '이메일 작성 AI'], credits: 5000 },
    '마케팅팀': { type: 'partial', agents: ['SNS 이벤트 기획 AI', '리뷰 분석 AI', '키워드 분석 AI'], credits: 3000 },
    '기획팀': { type: 'full', agents: [], credits: 'unlimited' },
    '디자인팀': { type: 'partial', agents: ['AI 카드뉴스 생성기', 'AI 블로그 생성기'], credits: 2500 },
    '영업팀': { type: 'partial', agents: ['이메일 작성 AI', 'PPT 슬라이드 생성기'], credits: 4000 },
    '부서 미정': { type: 'none', agents: [], credits: 0 }
  });

  // 현재 페이지 데이터 계산
  const getCurrentPageData = (data: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems: number) => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  // 고유 부서 목록 추출
  const uniqueDepartments = [...new Set(allEmployees.map(emp => emp.department))];

  // 부서별 실제 인원수 계산
  const getDepartmentMemberCount = (deptName: string) => {
    return employees.filter(emp => emp.department === deptName).length;
  };

  // 필터링된 부서 목록 계산
  const getFilteredDepartments = () => {
    return Object.keys(departmentSettings)
      .filter(deptName => {
        const matchesDeptName = departmentSearchTerm === '' || 
          deptName.toLowerCase().includes(departmentSearchTerm.toLowerCase());
        
        const matchesAgent = agentSearchTerm === '' || 
          departmentSettings[deptName].agents.some(agent => 
            agent.toLowerCase().includes(agentSearchTerm.toLowerCase())
          ) || 
          (departmentSettings[deptName].type === 'full' && '전체'.includes(agentSearchTerm));
        
        return matchesDeptName && matchesAgent;
      })
      .sort((a, b) => {
        const aCredits = departmentSettings[a].credits;
        const bCredits = departmentSettings[b].credits;
        
        if (aCredits === 'unlimited' && bCredits === 'unlimited') return 0;
        if (aCredits === 'unlimited') return creditSortDirection === 'desc' ? -1 : 1;
        if (bCredits === 'unlimited') return creditSortDirection === 'desc' ? 1 : -1;
        
        return creditSortDirection === 'desc' ? 
          (bCredits as number) - (aCredits as number) : 
          (aCredits as number) - (bCredits as number);
      });
  };

  // 정렬 아이콘 컴포넌트
  const SortIcon = ({ field }: { field: 'name' | 'department' | 'lastActive' | 'status' | 'joinDate' }) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    }
    return sortDirection === 'desc' ? 
      <ChevronDown className="w-4 h-4 text-gray-600" /> : 
      <ChevronUp className="w-4 h-4 text-gray-600" />;
  };

  // 페이지네이션 컴포넌트
  const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, 5);
        } else if (currentPage >= totalPages - 2) {
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            pages.push(i);
          }
        }
      }
      
      return pages;
    };

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            이전
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            다음
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
              {' '}-{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, (activeTab === 'employees' ? filteredAndSortedEmployees.length : allDepartments.length))}</span>
              {' '}of{' '}
              <span className="font-medium">{activeTab === 'employees' ? filteredAndSortedEmployees.length : allDepartments.length}</span>
              {' '}results
            </p>
          </div>
          <div>
            <nav className="inline-flex -space-x-px rounded-md shadow-sm">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  // 직원 편집 모달
  const EmployeeEditModal = () => {
    const [formData, setFormData] = useState({
      name: editingEmployee?.name || '',
      phone: editingEmployee?.phone || '',
      password: '',
      department: editingEmployee?.department || '부서 미정'
    });

    const handleSave = () => {
      setEmployees(prev => 
        prev.map(emp => 
          emp.id === editingEmployee.id 
            ? { ...emp, ...formData }
            : emp
        )
      );
      setIsEditModalOpen(false);
      setEditingEmployee(null);
    };

    const handleDelete = () => {
      if (confirm('정말로 이 직원 계정을 삭제하시겠습니까?')) {
        setEmployees(prev => prev.filter(emp => emp.id !== editingEmployee.id));
        setIsEditModalOpen(false);
        setEditingEmployee(null);
      }
    };

    if (!editingEmployee) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              직원 정보 편집
            </h3>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* 이메일 (수정 불가) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 (수정 불가)
              </label>
              <input
                type="email"
                value={editingEmployee.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {((isNewDepartment && Object.keys(departmentSettings).includes(formData.name)) ||
                (!isNewDepartment && editingDepartment !== formData.name && Object.keys(departmentSettings).includes(formData.name))) && (
                <div className="text-xs text-red-600 mt-1">
                  이미 존재하는 부서명입니다.
                </div>
              )}
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 새 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새 비밀번호 (변경 시에만 입력)
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="새 비밀번호를 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 부서 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                부서
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="부서 미정">부서 미정</option>
                <option value="개발팀">개발팀</option>
                <option value="마케팅팀">마케팅팀</option>
                <option value="기획팀">기획팀</option>
                <option value="디자인팀">디자인팀</option>
                <option value="영업팀">영업팀</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              계정 삭제
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 부서 설정 모달
  const DepartmentSettingsModal = () => {
    const [formData, setFormData] = useState({
      name: isNewDepartment ? '' : editingDepartment || '',
      credits: isNewDepartment ? 1000 : (editingDepartment ? departmentSettings[editingDepartment]?.credits || 1000 : 1000),
      type: isNewDepartment ? 'partial' : (editingDepartment ? departmentSettings[editingDepartment]?.type || 'partial' : 'partial'),
      agents: isNewDepartment ? [] : (editingDepartment ? departmentSettings[editingDepartment]?.agents || [] : [])
    });

    // 에이전트 선택 모달에서 선택된 에이전트들을 formData에 반영
    useEffect(() => {
      if (!isAgentModalOpen && selectedAgents.length >= 0) {
        setFormData(prev => ({ ...prev, agents: selectedAgents }));
      }
    }, [isAgentModalOpen, selectedAgents]);

    const handleSave = () => {
      if (isNewDepartment) {
        setDepartmentSettings(prev => ({
          ...prev,
          [formData.name]: {
            type: formData.type as 'full' | 'partial' | 'none',
            agents: formData.agents,
            credits: formData.credits
          }
        }));
      } else if (editingDepartment) {
        // 부서명이 변경된 경우 기존 부서 삭제하고 새로운 부서로 추가
        if (editingDepartment !== formData.name) {
          const newSettings = { ...departmentSettings };
          delete newSettings[editingDepartment];
          newSettings[formData.name] = {
            type: formData.type as 'full' | 'partial' | 'none',
            agents: formData.agents,
            credits: formData.credits
          };
          setDepartmentSettings(newSettings);
          
          // 해당 부서의 직원들 부서명도 변경
          setEmployees(prevEmployees =>
            prevEmployees.map(emp =>
              emp.department === editingDepartment
                ? { ...emp, department: formData.name }
                : emp
            )
          );
        } else {
          setDepartmentSettings(prev => ({
            ...prev,
            [editingDepartment]: {
              type: formData.type as 'full' | 'partial' | 'none',
              agents: formData.agents,
              credits: formData.credits
            }
          }));
        }
      }
      setIsDepartmentModalOpen(false);
      setEditingDepartment(null);
    };

    const handleOpenAgentModal = () => {
      setSelectedAgents(formData.agents);
      setIsAgentModalOpen(true);
    };

    if (!isDepartmentModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {isNewDepartment ? '새 부서 추가' : '부서 설정'}
            </h3>
            <button
              onClick={() => setIsDepartmentModalOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
                         {/* 부서명 */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 부서명
               </label>
               <input
                 type="text"
                 value={formData.name}
                 onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               />
             </div>

                         {/* 할당 크레딧 */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 할당 크레딧
               </label>
               <div className="text-xs text-gray-500 mb-3">
                 매월 1일에 자동으로 리셋되는 월간 크레딧 한도입니다.
               </div>
               <div className="space-y-2">
                 <div className="flex items-center">
                   <input
                     type="radio"
                     id="limited"
                     checked={formData.credits !== 'unlimited'}
                     onChange={() => setFormData(prev => ({ ...prev, credits: 1000 }))}
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                   />
                   <label htmlFor="limited" className="ml-2 text-sm text-gray-700">제한</label>
                 </div>
                 {formData.credits !== 'unlimited' && (
                   <input
                     type="number"
                     value={formData.credits as number}
                     onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="월간 크레딧 한도"
                   />
                 )}
                 <div className="flex items-center">
                   <input
                     type="radio"
                     id="unlimited"
                     checked={formData.credits === 'unlimited'}
                     onChange={() => setFormData(prev => ({ ...prev, credits: 'unlimited' }))}
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                   />
                   <label htmlFor="unlimited" className="ml-2 text-sm text-gray-700">무제한</label>
                 </div>
               </div>
             </div>

            {/* AI 에이전트 사용 범위 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI 에이전트 사용 범위
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="full"
                    checked={formData.type === 'full'}
                    onChange={() => setFormData(prev => ({ ...prev, type: 'full', agents: [] }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="full" className="ml-2 text-sm text-gray-700">전체 사용</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="partial"
                    checked={formData.type === 'partial'}
                    onChange={() => setFormData(prev => ({ ...prev, type: 'partial' }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="partial" className="ml-2 text-sm text-gray-700">일부 사용</label>
                </div>
                {formData.type === 'partial' && (
                  <button
                    onClick={handleOpenAgentModal}
                    className="ml-6 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    에이전트 선택 ({formData.agents.length}개 선택됨)
                  </button>
                )}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="none"
                    checked={formData.type === 'none'}
                    onChange={() => setFormData(prev => ({ ...prev, type: 'none', agents: [] }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="none" className="ml-2 text-sm text-gray-700">사용 안함</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-6 space-x-3">
            <button
              onClick={() => setIsDepartmentModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={
                !formData.name.trim() || 
                (isNewDepartment && Object.keys(departmentSettings).includes(formData.name)) ||
                (!isNewDepartment && editingDepartment !== formData.name && Object.keys(departmentSettings).includes(formData.name))
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 에이전트 선택 모달 (부서 설정에서 사용)
  const AgentSelectionModal = () => {
    const filteredAgents = allAgents.filter(agent => 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAgentToggle = (agentName: string) => {
      setSelectedAgents(prev => 
        prev.includes(agentName) 
          ? prev.filter(name => name !== agentName)
          : [...prev, agentName]
      );
    };

    const handleSave = () => {
      // 부서 설정 모달의 formData 업데이트는 부모에서 처리
      setIsAgentModalOpen(false);
      setSearchTerm('');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              AI 에이전트 선택
            </h3>
            <button
              onClick={() => setIsAgentModalOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="에이전트 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-96 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAgents.map((agent) => (
                <div key={agent.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedAgents.includes(agent.name)}
                    onChange={() => handleAgentToggle(agent.name)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{agent.name}</div>
                    <div className="text-xs text-gray-500">{agent.category} • {agent.cost} 크레딧</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              선택된 에이전트: {selectedAgents.length}개
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsAgentModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <CompanyLayout 
      title="직원/부서 관리"
      description="회사 직원들의 정보와 권한을 관리하세요"
      hideTimePeriod={true}
    >
      <div className="space-y-6">
        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('employees');
                setCurrentPage(1);
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'employees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              직원 목록
            </button>
            <button
              onClick={() => {
                setActiveTab('departments');
                setCurrentPage(1);
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'departments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              부서 관리
            </button>
          </nav>
        </div>

        {/* 직원 목록 탭 */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">직원 목록</h2>
              </div>
              
              {/* 검색 및 필터 섹션 */}
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 검색 */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="직원 이름 또는 이메일 검색..."
                      value={employeeSearchTerm}
                      onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* 부서 필터 */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="all">전체 부서</option>
                      {uniqueDepartments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 상태 필터 */}
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">전체 상태</option>
                      <option value="active">활성</option>
                      <option value="inactive">비활성</option>
                    </select>
                  </div>
                </div>
              </div>
              
                              <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          onClick={() => handleSort('name')}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-1">
                            <span>직원</span>
                            <SortIcon field="name" />
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('department')}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-1">
                            <span>부서</span>
                            <SortIcon field="department" />
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('status')}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-1">
                            <span>상태</span>
                            <SortIcon field="status" />
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('lastActive')}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-1">
                            <span>최근 활동</span>
                            <SortIcon field="lastActive" />
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('joinDate')}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-1">
                            <span>가입일</span>
                            <SortIcon field="joinDate" />
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
                      </tr>
                    </thead>
                                      <tbody className="bg-white divide-y divide-gray-200">
                      {getCurrentPageData(filteredAndSortedEmployees, currentPage).map((employee) => (
                        <tr key={employee.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                <div className="text-sm text-gray-500">{employee.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{employee.department}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                              employee.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {employee.status === 'active' ? '활성' : '비활성'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{employee.lastActive}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{employee.joinDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleEditEmployee(employee.id)}
                              className="text-blue-600 hover:text-blue-900 mr-2"
                            >
                              편집
                            </button>
                            <button 
                              onClick={() => handleToggleEmployeeStatus(employee.id)}
                              className={`${
                                employee.status === 'active' 
                                  ? 'text-red-600 hover:text-red-900' 
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {employee.status === 'active' ? '비활성화' : '활성화'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
              </div>
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={getTotalPages(filteredAndSortedEmployees.length)}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* 부서 관리 탭 (통합) */}
        {activeTab === 'departments' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">부서 관리</h2>
              <button 
                onClick={() => {
                  setIsNewDepartment(true);
                  setEditingDepartment(null);
                  setIsDepartmentModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>새 부서 추가</span>
              </button>
            </div>
            
            {/* 검색 및 필터 섹션 */}
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 부서명 검색 */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="부서명 검색..."
                    value={departmentSearchTerm}
                    onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* 사용 에이전트 검색 */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="사용 에이전트 검색..."
                    value={agentSearchTerm}
                    onChange={(e) => setAgentSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* 크레딧 정렬 */}
                <div>
                  <button
                    onClick={() => setCreditSortDirection(creditSortDirection === 'asc' ? 'desc' : 'asc')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2"
                  >
                    <span>크레딧 순 정렬</span>
                    {creditSortDirection === 'desc' ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronUp className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            </div>
            
            {/* 부서 목록 */}
            <div className="space-y-4">
              {getFilteredDepartments()
                .slice((currentPage - 1) * departmentItemsPerPage, currentPage * departmentItemsPerPage)
                .map((deptName) => {
                  const dept = departmentSettings[deptName];
                  return (
                    <div key={deptName} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-medium text-gray-900">{deptName}</h4>
                        <button 
                          onClick={() => {
                            setIsNewDepartment(false);
                            setEditingDepartment(deptName);
                            setIsDepartmentModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-500">인원</div>
                          <div className="text-sm font-medium">{getDepartmentMemberCount(deptName)}명</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">할당 크레딧</div>
                          <div className="text-sm font-medium text-blue-600">
                            {dept.credits === 'unlimited' ? '무제한' : `${dept.credits.toLocaleString()}`}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">에이전트 사용범위</div>
                          <div className="text-sm font-medium">
                            {dept.type === 'full' ? '전체 사용 가능' : 
                             dept.type === 'partial' ? `${dept.agents.length}개 선택` : 
                             '사용 불가'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">상태</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            dept.type === 'full' ? 'bg-green-100 text-green-800' :
                            dept.type === 'partial' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {dept.type === 'full' ? '전체 허용' :
                             dept.type === 'partial' ? '일부 허용' :
                             '사용 금지'}
                          </span>
                        </div>
                      </div>
                      
                      {dept.type === 'partial' && dept.agents.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 mb-2">사용 가능한 에이전트</div>
                          <div className="flex flex-wrap gap-2">
                            {dept.agents.map((agentName) => (
                              <span key={agentName} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {agentName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
            
            {/* 부서 관리 페이지네이션 */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(getFilteredDepartments().length / departmentItemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
      
      {/* 직원 편집 모달 */}
      {isEditModalOpen && <EmployeeEditModal />}
      
      {/* 부서 설정 모달 */}
      {isDepartmentModalOpen && <DepartmentSettingsModal />}
      
      {/* 에이전트 선택 모달 */}
      {isAgentModalOpen && <AgentSelectionModal />}
    </CompanyLayout>
  );
} 