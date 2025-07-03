'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Modal from '@/components/Modal';

interface ModalConfig {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onConfirm?: () => void;
}

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showModal = (config: ModalConfig) => {
    setModalConfig(config);
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setModalConfig(null);
    }, 150); // 애니메이션 시간
  };

  const handleConfirm = () => {
    if (modalConfig?.onConfirm) {
      modalConfig.onConfirm();
    }
    hideModal();
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalConfig && (
        <Modal
          isOpen={isOpen}
          onClose={handleConfirm}
          title={modalConfig.title}
          type={modalConfig.type}
        >
          <div className="whitespace-pre-line">
            {modalConfig.message}
          </div>
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

// alert() 대체 함수
export function showAlert(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', title?: string) {
  // 이 함수는 컴포넌트 외부에서는 사용할 수 없으므로, 각 컴포넌트에서 useModal 훅을 사용해야 합니다.
  console.warn('showAlert should be used within a component using useModal hook');
} 