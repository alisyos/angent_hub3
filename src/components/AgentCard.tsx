'use client';

import { useState, useEffect } from 'react';
import { AIAgent } from '@/types/agent';
import { Coins, Play, Heart, Plus, Check } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface AgentCardProps {
  agent: AIAgent;
  onClick?: (agent: AIAgent) => void;
}

export default function AgentCard({ agent, onClick }: AgentCardProps) {
  const {
    favorites,
    loggedIn,
    isAgentFavorite,
    getFoldersContainingAgent,
    addAgentToFolder,
    removeAgentFromFolder
  } = useFavorites();

  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Update favorite status when data changes
  useEffect(() => {
    if (loggedIn) {
      setIsFavorite(isAgentFavorite(agent.id));
    } else {
      setIsFavorite(false);
    }
  }, [agent.id, isAgentFavorite, loggedIn]);

  // Get the primary folder color for the heart
  const getPrimaryFolderColor = () => {
    if (!loggedIn) return '#EF4444'; // Default red color
    
    const containingFolders = getFoldersContainingAgent(agent.id);
    if (containingFolders.length > 0) {
      return containingFolders[0].color; // Use the first folder's color
    }
    return '#EF4444'; // Default red color
  };

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

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!loggedIn) return;
    setShowFolderDropdown(!showFolderDropdown);
  };

  const handleFolderSelect = (folderId: string) => {
    if (!loggedIn) return;
    
    const containingFolders = getFoldersContainingAgent(agent.id);
    const isInFolder = containingFolders.some(folder => folder.id === folderId);
    
    if (isInFolder) {
      removeAgentFromFolder(agent.id, folderId);
    } else {
      addAgentToFolder(agent.id, folderId);
    }
    
    setShowFolderDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFolderDropdown) {
        setShowFolderDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showFolderDropdown]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-blue-300 card-hover relative h-full">
      <div className="p-6 h-full flex flex-col">
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
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-amber-600">
              <Coins className="w-4 h-4" />
              <span className="text-sm font-medium">{agent.creditCost}</span>
            </div>
            
            {/* Favorite Button - Only show if logged in */}
            {loggedIn && (
              <div className="relative">
                <button
                  onClick={handleFavoriteClick}
                  className={`p-1.5 rounded-full transition-colors ${
                    isFavorite 
                      ? 'hover:bg-red-50' 
                      : 'hover:bg-red-50'
                  }`}
                  title="즐겨찾기"
                  style={{
                    color: isFavorite ? getPrimaryFolderColor() : '#9CA3AF'
                  }}
                >
                  <Heart 
                    className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}
                  />
                </button>

                {/* Folder Dropdown */}
                {showFolderDropdown && (
                  <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[200px] max-h-64 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs text-gray-500 mb-2 px-2">폴더에 추가</div>
                      
                      {favorites.folders.length > 0 ? (
                        favorites.folders.map((folder) => {
                          const containingFolders = getFoldersContainingAgent(agent.id);
                          const isInFolder = containingFolders.some(f => f.id === folder.id);
                          
                          return (
                            <button
                              key={folder.id}
                              onClick={() => handleFolderSelect(folder.id)}
                              className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                            >
                              <div 
                                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs mr-2"
                                style={{ backgroundColor: folder.color }}
                              >
                                {folder.icon}
                              </div>
                              <span className="flex-1 text-left truncate">{folder.name}</span>
                              {isInFolder && (
                                <Check className="w-4 h-4 text-green-500 ml-2" />
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                          폴더가 없습니다
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 overflow-hidden">
          {agent.description}
        </p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1 mb-4 flex-grow">
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

        {/* Action Button */}
        <button
          onClick={() => onClick?.(agent)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 mt-auto"
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