import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Edit2, Trash2, Save, Plus } from 'lucide-react';
import { FavoriteFolder, DEFAULT_FOLDER_COLORS, DEFAULT_FOLDER_ICONS } from '@/types/favorites';
import ConfirmModal from './ConfirmModal';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string, icon: string) => void;
  onDelete?: () => void;
  initialData?: FavoriteFolder;
  mode: 'create' | 'edit';
}

export default function FolderModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  initialData,
  mode
}: FolderModalProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_FOLDER_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_FOLDER_ICONS[0]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSelectedColor(initialData.color);
      setSelectedIcon(initialData.icon);
    } else {
      setName('');
      setSelectedColor(DEFAULT_FOLDER_COLORS[0]);
      setSelectedIcon(DEFAULT_FOLDER_ICONS[0]);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: {[key: string]: string} = {};
    if (!name.trim()) {
      newErrors.name = '폴더명을 입력해주세요.';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(name.trim(), selectedColor, selectedIcon);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              {mode === 'create' ? (
                <>
                  <FolderPlus className="w-5 h-5 mr-2" />
                  새 폴더 만들기
                </>
              ) : (
                <>
                  <Edit2 className="w-5 h-5 mr-2" />
                  폴더 수정
                </>
              )}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4">
            {/* Folder Name */}
            <div className="mb-4">
              <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-1">
                폴더명 *
              </label>
              <input
                type="text"
                id="folderName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="폴더명을 입력하세요"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={20}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Icon Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아이콘
              </label>
              <div className="grid grid-cols-5 gap-2">
                {DEFAULT_FOLDER_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedIcon(icon)}
                    className={`p-2 rounded-lg border-2 text-lg transition-colors ${
                      selectedIcon === icon
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                색상
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DEFAULT_FOLDER_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-gray-800 scale-110'
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">미리보기</p>
              <div className="flex items-center">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium mr-2"
                  style={{ backgroundColor: selectedColor }}
                >
                  {selectedIcon}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {name || '폴더명'}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
              <div>
                {mode === 'edit' && onDelete && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {mode === 'create' ? (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      생성
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      저장
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="폴더 삭제"
        message="정말로 이 폴더를 삭제하시겠습니까? 폴더 내의 모든 즐겨찾기가 삭제됩니다."
        confirmText="삭제"
        cancelText="취소"
        type="danger"
      />
    </>
  );
} 