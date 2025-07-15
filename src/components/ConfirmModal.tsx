import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  type = 'danger'
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          background: 'border-red-200 bg-red-50',
          icon: 'text-red-600',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      case 'warning':
        return {
          background: 'border-yellow-200 bg-yellow-50',
          icon: 'text-yellow-600',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        };
      default:
        return {
          background: 'border-blue-200 bg-blue-50',
          icon: 'text-blue-600',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`relative w-full max-w-md rounded-lg border bg-white p-6 shadow-xl ${typeStyles.background}`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon and Title */}
          <div className="flex items-center mb-4">
            <AlertTriangle className={`h-6 w-6 mr-3 ${typeStyles.icon}`} />
            <h3 className={`text-lg font-semibold ${typeStyles.icon}`}>
              {title}
            </h3>
          </div>

          {/* Message */}
          <div className="mb-6 text-gray-700 pl-9">
            {message}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${typeStyles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 