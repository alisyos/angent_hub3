'use client';

import { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';
import ContactLayout from '@/components/ContactLayout';
import { Bot, Send, FileText, Paperclip, X, Info, CheckCircle } from 'lucide-react';

export default function AgentRequest() {
  const { showModal } = useModal();
  const [formData, setFormData] = useState({
    agentName: '',
    agentDescription: '',
    category: '',
    developmentType: 'free',
    developmentCost: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    department: '',
    additionalInfo: ''
  });
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      showModal({
        title: '신청 완료',
        message: '에이전트 추가 신청이 성공적으로 접수되었습니다. 검토 후 연락드리겠습니다.',
        type: 'success'
      });
      setFormData({
        agentName: '',
        agentDescription: '',
        category: '',
        developmentType: 'free',
        developmentCost: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        department: '',
        additionalInfo: ''
      });
      setAttachedFiles([]);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => {
        // 파일 크기 제한 (20MB - 에이전트 관련 자료는 더 큰 파일 허용)
        const maxSize = 20 * 1024 * 1024;
        if (file.size > maxSize) {
          showModal({
            title: '파일 크기 초과',
            message: `파일 크기가 너무 큽니다. (최대 20MB)\n파일명: ${file.name}`,
            type: 'error'
          });
          return false;
        }
        return true;
      });

      setAttachedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleFileRemove = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const categories = [
    { id: 'office', name: '일반사무' },
    { id: 'marketing', name: '마케팅/광고' },
    { id: 'content', name: '콘텐츠 제작' },
    { id: 'analysis', name: '데이터 분석' },
    { id: 'customer', name: '고객 서비스' },
    { id: 'hr', name: '인사 관리' },
    { id: 'finance', name: '재무/회계' },
    { id: 'other', name: '기타' }
  ];



  return (
    <ContactLayout title="에이전트 추가신청" description="새로운 AI 에이전트 개발을 요청하세요.">
      <div className="max-w-4xl mx-auto">
      {/* 안내 메시지 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">에이전트 추가 신청 안내</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>• 새로운 AI 에이전트 개발 및 추가를 요청하실 수 있습니다.</p>
              <p>• 신청 검토 후 개발 가능성과 비용을 안내드립니다.</p>
              <p>• 검토 기간은 영업일 기준 3-5일 소요됩니다.</p>
              <p>• 상세한 요구사항을 작성해 주시면 더 정확한 검토가 가능합니다.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 신청 폼 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 에이전트 기본 정보 */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">에이전트 기본 정보</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="agentName" className="block text-sm font-medium text-gray-700 mb-2">
                      에이전트 이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="agentName"
                      value={formData.agentName}
                      onChange={(e) => handleInputChange('agentName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="예: 계약서 검토 AI"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="agentDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      에이전트 설명 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="agentDescription"
                      value={formData.agentDescription}
                      onChange={(e) => handleInputChange('agentDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      placeholder="에이전트의 주요 기능과 목적을 설명해 주세요"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      카테고리 <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">카테고리를 선택하세요</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 개발 비용 */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">개발 비용</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      개발 유형 <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.developmentType === 'free'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="developmentType"
                          value="free"
                          checked={formData.developmentType === 'free'}
                          onChange={(e) => handleInputChange('developmentType', e.target.value)}
                          className="sr-only"
                          required
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                            {formData.developmentType === 'free' && (
                              <div className="w-2 h-2 rounded-full bg-current"></div>
                            )}
                          </div>
                          <div>
                            <span className="font-medium">무료</span>
                            <p className="text-xs text-gray-500">기본 에이전트 개발</p>
                          </div>
                        </div>
                      </label>

                      <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.developmentType === 'paid'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="developmentType"
                          value="paid"
                          checked={formData.developmentType === 'paid'}
                          onChange={(e) => handleInputChange('developmentType', e.target.value)}
                          className="sr-only"
                          required
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                            {formData.developmentType === 'paid' && (
                              <div className="w-2 h-2 rounded-full bg-current"></div>
                            )}
                          </div>
                          <div>
                            <span className="font-medium">유료</span>
                            <p className="text-xs text-gray-500">고급 기능 포함</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {formData.developmentType === 'paid' && (
                    <div>
                      <label htmlFor="developmentCost" className="block text-sm font-medium text-gray-700 mb-2">
                        예상 개발 비용 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="developmentCost"
                        value={formData.developmentCost}
                        onChange={(e) => handleInputChange('developmentCost', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="예: 500만원"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 담당자 정보 */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">담당자 정보</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                      담당자 이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="이름을 입력하세요"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                      부서
                    </label>
                    <input
                      type="text"
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="부서명을 입력하세요"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="이메일을 입력하세요"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                      연락처
                    </label>
                    <input
                      type="tel"
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="연락처를 입력하세요"
                    />
                  </div>
                </div>
              </div>

              {/* 추가 정보 */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">추가 정보</h3>
                
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                    추가 설명
                  </label>
                  <textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    placeholder="추가로 전달하고 싶은 내용이 있으시면 작성해 주세요"
                  />
                </div>
              </div>

              {/* 파일 첨부 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  참고 자료 첨부 (선택)
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Paperclip className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">클릭하여 파일 첨부</span> 또는 드래그 앤 드롭
                        </p>
                        <p className="text-xs text-gray-500">
                          최대 20MB (이미지, 문서, 압축파일 등)
                        </p>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.zip,.rar,.xlsx,.pptx"
                      />
                    </label>
                  </div>

                  {/* 첨부된 파일 목록 */}
                  {attachedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">첨부된 파일:</h4>
                      {attachedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{file.name}</span>
                            <span className="text-xs text-gray-400">({formatFileSize(file.size)})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFileRemove(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>신청 중...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>신청 접수</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 신청 프로세스 안내 */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">신청 프로세스</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">신청 접수</p>
                  <p className="text-xs text-gray-500">신청서 제출 및 접수 확인</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-yellow-600">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">검토 및 분석</p>
                  <p className="text-xs text-gray-500">기술적 검토 및 비용 산정</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-green-600">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">결과 안내</p>
                  <p className="text-xs text-gray-500">검토 결과 및 개발 계획 안내</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">주의사항</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>• 신청이 승인되어도 개발이 보장되지 않습니다</p>
              <p>• 개발 비용은 별도 협의됩니다</p>
              <p>• 기술적 제약으로 구현이 불가능할 수 있습니다</p>
              <p>• 개발 일정은 복잡도에 따라 달라집니다</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </ContactLayout>
  );
} 