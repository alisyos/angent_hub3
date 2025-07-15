import React, { useState, useEffect } from 'react';
import { Star, ChevronDown, ChevronRight, Plus, Edit2, Trash2, MoreVertical, Heart, Bookmark } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import FolderModal from './FolderModal';
import ConfirmModal from './ConfirmModal';
import { FavoriteFolder } from '@/types/favorites';
import { AIAgent } from '@/types/agent';
import { aiAgents } from '@/data/agents';

interface FavoritesSectionProps {
  isSidebarOpen: boolean;
  onAgentClick: (agent: AIAgent) => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  expandedCategories: Set<string>;
  onToggleExpand: (category: string) => void;
}

export default function FavoritesSection({
  isSidebarOpen,
  onAgentClick,
  selectedCategory,
  onCategorySelect,
  expandedCategories,
  onToggleExpand
}: FavoritesSectionProps) {
  const {
    favorites,
    loading,
    loggedIn,
    createFolder,
    updateFolder,
    deleteFolder,
    getAgentsInFolder,
    addAgentToFolder,
    removeAgentFromFolder,
    isAgentFavorite
  } = useFavorites();

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FavoriteFolder | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<FavoriteFolder | null>(null);

  // Get agent data by ID
  const getAgentById = (agentId: string): AIAgent | undefined => {
    return aiAgents.find(agent => agent.id === agentId);
  };

  // Handle folder creation
  const handleCreateFolder = (name: string, color: string, icon: string) => {
    createFolder(name, undefined, color, icon);
    setShowFolderModal(false);
  };

  // Handle folder editing
  const handleEditFolder = (name: string, color: string, icon: string) => {
    if (editingFolder) {
      updateFolder(editingFolder.id, { name, color, icon });
      setEditingFolder(null);
      setShowFolderModal(false);
    }
  };

  // Handle folder deletion
  const handleDeleteFolder = () => {
    if (editingFolder) {
      deleteFolder(editingFolder.id);
      setEditingFolder(null);
      setShowFolderModal(false);
    }
  };

  // Handle direct folder deletion from dropdown
  const handleDirectDeleteFolder = () => {
    if (folderToDelete) {
      deleteFolder(folderToDelete.id);
      setFolderToDelete(null);
      setShowConfirmDelete(false);
      setDropdownOpen(null);
    }
  };

  // Open create folder modal
  const openCreateModal = () => {
    setEditingFolder(null);
    setModalMode('create');
    setShowFolderModal(true);
  };

  // Open edit folder modal
  const openEditModal = (folder: FavoriteFolder) => {
    setEditingFolder(folder);
    setModalMode('edit');
    setShowFolderModal(true);
    setDropdownOpen(null);
  };

  // Open delete confirmation modal
  const openDeleteModal = (folder: FavoriteFolder) => {
    setFolderToDelete(folder);
    setShowConfirmDelete(true);
    setDropdownOpen(null);
  };

  // Handle folder dropdown toggle
  const toggleDropdown = (folderId: string) => {
    setDropdownOpen(dropdownOpen === folderId ? null : folderId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the dropdown
      const target = event.target as HTMLElement;
      if (dropdownOpen && !target.closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  // Don't render if loading or not logged in
  if (loading || !loggedIn) {
    return null;
  }

  return (
    <>
      {/* Favorites Section */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          {isSidebarOpen && (
            <h3 className="text-sm font-medium text-gray-900 flex items-center">
              <Heart className="w-4 h-4 mr-2 text-red-500" />
              즐겨찾기
            </h3>
          )}
          <button
            onClick={openCreateModal}
            className={`p-1 rounded-md hover:bg-gray-100 transition-colors ${
              isSidebarOpen ? '' : 'mx-auto'
            }`}
            title="새 폴더 만들기"
          >
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Favorites Folders */}
        <div className="space-y-1">
          {favorites.folders.map((folder) => {
            const agentIds = getAgentsInFolder(folder.id);
            const agents = agentIds.map(getAgentById).filter(Boolean) as AIAgent[];
            const isExpanded = expandedCategories.has(`favorites-${folder.id}`);
            const isSelected = selectedCategory === `favorites-${folder.id}`;

            return (
              <div key={folder.id}>
                {/* Folder Header */}
                <div className="flex items-center relative">
                  <button
                    onClick={() => {
                      if (isSidebarOpen) {
                        onToggleExpand(`favorites-${folder.id}`);
                        // 토글 방식: 이미 선택된 폴더를 다시 클릭하면 전체로 돌아감
                        if (selectedCategory === `favorites-${folder.id}`) {
                          onCategorySelect('agentList');
                        } else {
                          onCategorySelect(`favorites-${folder.id}`);
                        }
                      } else {
                        if (selectedCategory === `favorites-${folder.id}`) {
                          onCategorySelect('agentList');
                        } else {
                          onCategorySelect(`favorites-${folder.id}`);
                        }
                      }
                    }}
                    className={`flex-1 flex items-center p-2 rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'hover:bg-gray-100'
                    } ${!isSidebarOpen ? 'justify-center' : ''}`}
                    title={!isSidebarOpen ? folder.name : ''}
                  >
                    <div 
                      className={`text-lg ${isSidebarOpen ? 'mr-2' : ''} w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium`}
                      style={{ backgroundColor: folder.color }}
                    >
                      {folder.icon}
                    </div>
                    {isSidebarOpen && (
                      <>
                        <span className="font-medium flex-1 text-left text-sm truncate">
                          {folder.name}
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium mr-1">
                          {agents.length}개
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </>
                    )}
                  </button>

                  {/* Folder Actions */}
                  {isSidebarOpen && (
                    <div className="relative dropdown-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(folder.id);
                        }}
                        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>

                      {/* Dropdown Menu */}
                      {dropdownOpen === folder.id && (
                        <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[120px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(folder);
                            }}
                            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            수정
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal(folder);
                            }}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Folder Agents */}
                {isSidebarOpen && isExpanded && (
                  <div className="ml-6 space-y-1 mt-1">
                    {agents.length > 0 ? (
                      agents.map((agent) => (
                        <button
                          key={agent.id}
                          onClick={() => onAgentClick(agent)}
                          className="w-full flex items-center p-2 rounded-md hover:bg-blue-50 transition-all duration-200 text-left"
                        >
                          <span className="text-sm mr-2">{agent.icon}</span>
                          <span className="text-sm text-gray-600 flex-1 truncate">
                            {agent.name}
                          </span>
                          <span className="text-xs text-amber-600 ml-1">
                            {agent.creditCost}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="text-xs text-gray-500 py-2 px-2">
                        에이전트가 없습니다
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {favorites.folders.length === 0 && isSidebarOpen && (
            <div className="text-center py-4">
              <Bookmark className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500 mb-2">
                아직 즐겨찾기 폴더가 없습니다
              </p>
              <button
                onClick={openCreateModal}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                첫 번째 폴더 만들기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Folder Modal */}
      <FolderModal
        isOpen={showFolderModal}
        onClose={() => {
          setShowFolderModal(false);
          setEditingFolder(null);
        }}
        onSave={modalMode === 'create' ? handleCreateFolder : handleEditFolder}
        onDelete={modalMode === 'edit' ? handleDeleteFolder : undefined}
        initialData={editingFolder || undefined}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => {
          setShowConfirmDelete(false);
          setFolderToDelete(null);
        }}
        onConfirm={handleDirectDeleteFolder}
        title="폴더 삭제"
        message={`정말로 "${folderToDelete?.name}" 폴더를 삭제하시겠습니까? 폴더 내의 모든 즐겨찾기가 삭제됩니다.`}
        confirmText="삭제"
        cancelText="취소"
        type="danger"
      />
    </>
  );
} 