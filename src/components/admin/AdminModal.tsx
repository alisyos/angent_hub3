import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlay?: boolean;
  footer?: React.ReactNode;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl'
};

const typeConfig = {
  default: {
    icon: null,
    iconColor: '',
    borderColor: 'border-gray-200'
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    borderColor: 'border-green-200'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    borderColor: 'border-yellow-200'
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-600',
    borderColor: 'border-red-200'
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200'
  }
};

export default function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlay = true,
  footer,
  type = 'default'
}: AdminModalProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleOverlayClick}
        />
        
        {/* Modal */}
        <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}>
          {/* Header */}
          <div className={`px-6 py-4 border-b ${config.borderColor} bg-gray-50`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {Icon && (
                  <Icon className={`w-6 h-6 ${config.iconColor}`} />
                )}
                <h2 className="text-lg font-semibold text-gray-900">
                  {title}
                </h2>
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={`px-6 py-4 border-t ${config.borderColor} bg-gray-50`}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 확인 모달 컴포넌트
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'error' | 'info';
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  type = 'warning',
  loading = false
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'error':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      type={type}
      footer={
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${getConfirmButtonClass()}`}
          >
            {loading ? '처리중...' : confirmText}
          </button>
        </div>
      }
    >
      <p className="text-gray-600">{message}</p>
    </AdminModal>
  );
} 