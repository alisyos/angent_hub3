'use client';

import { useState } from 'react';
import CompanyLayout from '@/components/CompanyLayout';
import { 
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Users,
  DollarSign,
  Target,
  RefreshCw
} from 'lucide-react';

export default function CompanyAnalytics() {
  const [selectedReport, setSelectedReport] = useState('comprehensive');
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [showCustomReport, setShowCustomReport] = useState(false);

  const analyticsData = {
    totalUsage: { value: 8940, change: 12.5, trend: 'up' },
    totalCost: { value: 1250000, change: -5.2, trend: 'down' },
    activeUsers: { value: 142, change: 8.3, trend: 'up' },
    avgEfficiency: { value: 87.5, change: 3.1, trend: 'up' },
    topAgents: [
      { name: '회의록 자동화 AI', usage: 2340, cost: 234000, efficiency: 92 },
      { name: 'PPT 슬라이드 생성기', usage: 1890, cost: 472500, efficiency: 89 },
      { name: '이메일 자동 작성 AI', usage: 1620, cost: 129600, efficiency: 94 },
      { name: 'SNS 이벤트 기획 AI', usage: 1450, cost: 261000, efficiency: 86 },
      { name: '카드뉴스 생성 AI', usage: 1240, cost: 248000, efficiency: 90 }
    ],
    departmentAnalysis: [
      { name: '개발팀', usage: 2450, cost: 367500, efficiency: 92, roi: 850 },
      { name: '마케팅팀', usage: 2180, cost: 435000, efficiency: 89, roi: 720 },
      { name: '기획팀', usage: 1920, cost: 288000, efficiency: 87, roi: 680 },
      { name: '디자인팀', usage: 1590, cost: 318000, efficiency: 90, roi: 650 },
      { name: '영업팀', usage: 1400, cost: 210000, efficiency: 85, roi: 580 }
    ],
    roiAnalysis: {
      totalInvestment: 1250000,
      totalReturn: 3750000,
      roi: 200,
      paybackPeriod: 3.2,
      productivity: 45.8,
      timeSaved: 2840
    }
  };

  const predefinedReports = [
    { id: 'comprehensive', name: '종합 분석 리포트', description: '전체 사용량과 성과 분석' },
    { id: 'department', name: '부서별 분석', description: '부서별 사용량과 효율성 분석' },
    { id: 'agent-performance', name: 'AI 에이전트 성과', description: '에이전트별 사용량과 효율성' },
    { id: 'roi-analysis', name: 'ROI 분석', description: '투자 대비 수익률 분석' },
    { id: 'cost-analysis', name: '비용 분석', description: '크레딧 사용량과 비용 분석' },
    { id: 'user-behavior', name: '사용자 행동 분석', description: '직원들의 사용 패턴 분석' }
  ];

  const generateReport = () => {
    // 리포트 생성 로직
    console.log('Generating report:', selectedReport);
  };

  const downloadReport = () => {
    // 리포트 다운로드 로직
    console.log('Downloading report');
  };

  return (
    <CompanyLayout 
      title="분석 및 리포트"
      description="AI 에이전트 사용량과 성과를 분석하고 리포트를 생성하세요"
      actions={
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowCustomReport(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>커스텀 리포트</span>
          </button>
          <button 
            onClick={downloadReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>리포트 다운로드</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 핵심 지표 대시보드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 사용량</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalUsage.value.toLocaleString()}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {analyticsData.totalUsage.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm ${analyticsData.totalUsage.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.totalUsage.change > 0 ? '+' : ''}{analyticsData.totalUsage.change}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 비용</p>
                <p className="text-2xl font-bold text-gray-900">₩{analyticsData.totalCost.value.toLocaleString()}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {analyticsData.totalCost.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  )}
                  <span className={`text-sm ${analyticsData.totalCost.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                    {analyticsData.totalCost.change > 0 ? '+' : ''}{analyticsData.totalCost.change}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">활성 사용자</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.activeUsers.value}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {analyticsData.activeUsers.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm ${analyticsData.activeUsers.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.activeUsers.change > 0 ? '+' : ''}{analyticsData.activeUsers.change}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">평균 효율성</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.avgEfficiency.value}%</p>
                <div className="flex items-center space-x-1 mt-1">
                  {analyticsData.avgEfficiency.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm ${analyticsData.avgEfficiency.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.avgEfficiency.change > 0 ? '+' : ''}{analyticsData.avgEfficiency.change}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ROI 분석 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">ROI 분석</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-blue-900">총 투자액</h4>
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">₩{analyticsData.roiAnalysis.totalInvestment.toLocaleString()}</p>
              <p className="text-sm text-blue-700 mt-2">AI 에이전트 사용 비용</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-green-900">총 수익</h4>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">₩{analyticsData.roiAnalysis.totalReturn.toLocaleString()}</p>
              <p className="text-sm text-green-700 mt-2">생산성 향상으로 인한 수익</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-purple-900">ROI</h4>
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900">{analyticsData.roiAnalysis.roi}%</p>
              <p className="text-sm text-purple-700 mt-2">투자 대비 수익률</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{analyticsData.roiAnalysis.paybackPeriod}개월</div>
              <div className="text-sm text-gray-600">투자 회수 기간</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{analyticsData.roiAnalysis.productivity}%</div>
              <div className="text-sm text-gray-600">생산성 향상</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{analyticsData.roiAnalysis.timeSaved}시간</div>
              <div className="text-sm text-gray-600">절약된 시간</div>
            </div>
          </div>
        </div>

        {/* 상위 AI 에이전트 성과 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">상위 AI 에이전트 성과</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">에이전트</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용량</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">비용</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">효율성</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">트렌드</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.topAgents.map((agent, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agent.usage.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₩{agent.cost.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">{agent.efficiency}%</div>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${agent.efficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 부서별 분석 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">부서별 분석</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyticsData.departmentAnalysis.map((dept, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">{dept.name}</h4>
                  <span className="text-xs text-gray-500">효율성: {dept.efficiency}%</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">사용량</span>
                    <span className="font-medium">{dept.usage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">비용</span>
                    <span className="font-medium">₩{dept.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ROI</span>
                    <span className="font-medium text-green-600">{dept.roi}%</span>
                  </div>
                </div>
                
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${dept.efficiency}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 사전 정의된 리포트 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">사전 정의된 리포트</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predefinedReports.map((report) => (
              <div 
                key={report.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedReport === report.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name="report"
                    checked={selectedReport === report.id}
                    onChange={() => setSelectedReport(report.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <h4 className="text-sm font-medium text-gray-900">{report.name}</h4>
                </div>
                <p className="text-xs text-gray-600 ml-6">{report.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">보고서 기간</label>
                <select 
                  value={reportPeriod}
                  onChange={(e) => setReportPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="weekly">주간</option>
                  <option value="monthly">월간</option>
                  <option value="quarterly">분기</option>
                  <option value="yearly">연간</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={generateReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>리포트 생성</span>
              </button>
              <button
                onClick={downloadReport}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>다운로드</span>
              </button>
            </div>
          </div>
        </div>

        {/* 커스텀 리포트 생성 */}
        {showCustomReport && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">커스텀 리포트 생성</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">리포트 이름</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="커스텀 리포트 이름"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">날짜 범위</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">~</span>
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">포함할 데이터</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    '사용량 통계',
                    '비용 분석',
                    '부서별 성과',
                    '에이전트별 성과',
                    'ROI 분석',
                    '사용자 행동',
                    '트렌드 분석',
                    '예측 분석'
                  ].map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={item}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={item} className="text-sm text-gray-700">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCustomReport(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    // 커스텀 리포트 생성 로직
                    setShowCustomReport(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  리포트 생성
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CompanyLayout>
  );
} 