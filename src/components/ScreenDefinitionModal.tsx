'use client';

import React, { useState } from 'react';
import { 
  X, 
  Info, 
  Layout, 
  FileText, 
  List, 
  Settings, 
  Navigation, 
  MessageSquare, 
  Shield, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface ScreenDefinition {
  // 1. 기본 정보
  basic: {
    classification: string;
    purpose: string;
    mainFeatures: string[];
    userTypes: string[];
  };
  
  // 2. 화면 구성
  layout: {
    structure: string;
    uiElements: string[];
  };
  
  // 3. 입력항목 정의
  inputFields?: {
    fieldName: string;
    dataType: string;
    inputType: string;
    required: boolean;
    lengthLimit?: string;
    defaultValue?: string;
    placeholder?: string;
  }[];
  
  // 4. 출력항목 정의
  outputFields?: {
    displayField: string;
    displayFormat: string;
    linkSettings?: string;
  }[];
  
  // 5. 기능정의
  functions: {
    buttons: {
      name: string;
      position: string;
      function: string;
      event: string;
    }[];
  };
  
  // 6. 화면이동
  navigation: {
    entryPath: string[];
    targetScreens: string[];
    popupScreens?: string[];
    backAction: string;
  };
  
  // 7. 메시지
  messages: {
    confirmMessages: string[];
    errorMessages: string[];
    warningMessages: string[];
    exceptions: string[];
  };
  
  // 8. 권한 및 보안
  security: {
    accessPermissions: string[];
    functionPermissions: string[];
  };
  
  // 9. 기타
  etc: {
    notes: string[];
    references: string[];
    changeHistory: string[];
  };
}

interface ScreenDefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  definition: ScreenDefinition;
  pageTitle: string;
}

export default function ScreenDefinitionModal({ 
  isOpen, 
  onClose, 
  definition, 
  pageTitle 
}: ScreenDefinitionModalProps) {
  const [activeSection, setActiveSection] = useState<number>(0);

  if (!isOpen) return null;

  const sections = [
    {
      id: 0,
      title: '기본 정보',
      icon: Info,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">화면 분류</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{definition.basic.classification}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">화면 목적</h4>
            <p className="text-sm text-gray-600">{definition.basic.purpose}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">주요 기능</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {definition.basic.mainFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">사용자 유형</h4>
            <div className="flex flex-wrap gap-2">
              {definition.basic.userTypes.map((userType, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {userType}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: '화면 구성',
      icon: Layout,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">레이아웃 구조</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{definition.layout.structure}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">UI 요소</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {definition.layout.uiElements.map((element, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  {element}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: '입력항목',
      icon: FileText,
      content: (
        <div className="space-y-4">
          {definition.inputFields && definition.inputFields.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-medium text-gray-800">필드명</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-800">타입</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-800">형태</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-800">필수</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-800">제한</th>
                  </tr>
                </thead>
                <tbody>
                  {definition.inputFields.map((field, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 px-2 font-medium">{field.fieldName}</td>
                      <td className="py-2 px-2 text-gray-600">{field.dataType}</td>
                      <td className="py-2 px-2 text-gray-600">{field.inputType}</td>
                      <td className="py-2 px-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          field.required 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {field.required ? '필수' : '선택'}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-gray-600">{field.lengthLimit || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded">
              입력 필드가 없습니다.
            </p>
          )}
        </div>
      )
    },
    {
      id: 3,
      title: '출력항목',
      icon: List,
      content: (
        <div className="space-y-4">
          {definition.outputFields && definition.outputFields.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-medium text-gray-800">표시 필드</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-800">표시 형식</th>
                    <th className="text-left py-2 px-2 font-medium text-gray-800">링크 설정</th>
                  </tr>
                </thead>
                <tbody>
                  {definition.outputFields.map((field, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 px-2 font-medium">{field.displayField}</td>
                      <td className="py-2 px-2 text-gray-600">{field.displayFormat}</td>
                      <td className="py-2 px-2 text-gray-600">{field.linkSettings || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded">
              출력 필드가 없습니다.
            </p>
          )}
        </div>
      )
    },
    {
      id: 4,
      title: '기능정의',
      icon: Settings,
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 font-medium text-gray-800">버튼명</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-800">위치</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-800">기능</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-800">이벤트</th>
                </tr>
              </thead>
              <tbody>
                {definition.functions.buttons.map((button, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-2 font-medium">{button.name}</td>
                    <td className="py-2 px-2 text-gray-600">{button.position}</td>
                    <td className="py-2 px-2 text-gray-600">{button.function}</td>
                    <td className="py-2 px-2 text-gray-600">{button.event}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: '화면이동',
      icon: Navigation,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">진입 경로</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {definition.navigation.entryPath.map((path, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  {path}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">이동 화면</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {definition.navigation.targetScreens.map((screen, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  {screen}
                </li>
              ))}
            </ul>
          </div>
          {definition.navigation.popupScreens && definition.navigation.popupScreens.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-800 mb-2">팝업 화면</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {definition.navigation.popupScreens.map((popup, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    {popup}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h4 className="font-medium text-gray-800 mb-2">뒤로가기</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{definition.navigation.backAction}</p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: '메시지',
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-green-600 mb-2">확인 메시지</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {definition.messages.confirmMessages.map((message, index) => (
                <li key={index} className="bg-green-50 p-2 rounded">
                  {message}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-600 mb-2">오류 메시지</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {definition.messages.errorMessages.map((message, index) => (
                <li key={index} className="bg-red-50 p-2 rounded">
                  {message}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-yellow-600 mb-2">경고 메시지</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {definition.messages.warningMessages.map((message, index) => (
                <li key={index} className="bg-yellow-50 p-2 rounded">
                  {message}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-orange-600 mb-2">예외 상황</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {definition.messages.exceptions.map((exception, index) => (
                <li key={index} className="bg-orange-50 p-2 rounded">
                  {exception}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: '권한 및 보안',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">접근 권한</h4>
            <div className="flex flex-wrap gap-2">
              {definition.security.accessPermissions.map((permission, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">기능 권한</h4>
            <div className="flex flex-wrap gap-2">
              {definition.security.functionPermissions.map((permission, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: '기타',
      icon: AlertCircle,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">주의사항</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {definition.etc.notes.map((note, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">참고사항</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {definition.etc.references.map((reference, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                  {reference}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">변경이력</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {definition.etc.changeHistory.map((change, index) => (
                <li key={index} className="bg-gray-50 p-2 rounded text-xs">
                  {change}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">화면 정의서</h2>
            <p className="text-sm text-gray-600 mt-1">{pageTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 사이드바 */}
          <div className="w-64 border-r border-gray-200 bg-gray-50">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-3">섹션</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 콘텐츠 */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                {React.createElement(sections[activeSection].icon, {
                  className: "w-5 h-5 text-blue-600"
                })}
                <h3 className="text-lg font-semibold text-gray-900">
                  {sections[activeSection].title}
                </h3>
              </div>
              
              {sections[activeSection].content}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertCircle className="w-4 h-4" />
            <span>이 문서는 개발 참고용입니다.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <button
              onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
              disabled={activeSection === sections.length - 1}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}