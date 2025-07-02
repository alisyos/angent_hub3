'use client';

import { AIAgent } from '@/types/agent';
import { Coins, Play } from 'lucide-react';

interface AgentCardProps {
  agent: AIAgent;
  onClick?: (agent: AIAgent) => void;
}

export default function AgentCard({ agent, onClick }: AgentCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case '일반사무':
        return 'bg-blue-100 text-blue-800';
      case '마케팅/광고':
        return 'bg-green-100 text-green-800';
      case '콘텐츠 제작':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-blue-300 card-hover">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{agent.icon}</div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {agent.name}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(agent.category)}`}>
                {agent.category}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-amber-600">
            <Coins className="w-4 h-4" />
            <span className="text-sm font-medium">{agent.creditCost}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 overflow-hidden">
          {agent.description}
        </p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {agent.hashtags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
            >
              #{tag}
            </span>
          ))}
          {agent.hashtags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500">
              +{agent.hashtags.length - 3}
            </span>
          )}
        </div>

        {/* Input/Output Info */}
        <div className="space-y-2 mb-4 text-xs text-gray-500">
          <div>
            <span className="font-medium">입력:</span> {agent.inputs.length}개 항목
          </div>
          <div>
            <span className="font-medium">출력:</span> {agent.outputs.length}개 결과물
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onClick?.(agent)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>에이전트 실행</span>
        </button>
      </div>

      {/* Status indicator */}
      {!agent.isActive && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            비활성화
          </span>
        </div>
      )}
    </div>
  );
} 