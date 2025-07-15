import { ModalConfig } from '@/contexts/ModalContext';

// 전역 모달 제어를 위한 함수
let globalShowModal: ((config: ModalConfig) => void) | null = null;

export const setGlobalShowModal = (showModal: (config: ModalConfig) => void) => {
  globalShowModal = showModal;
};

// 브라우저 alert 대체 함수
export const showAlert = (message: string, title?: string, type?: 'info' | 'success' | 'warning' | 'error') => {
  if (globalShowModal) {
    globalShowModal({
      title: title || '알림',
      message,
      type: type || 'info'
    });
  } else {
    // fallback to browser alert
    alert(message);
  }
};

// 브라우저 confirm 대체 함수
export const showConfirm = (
  message: string,
  onConfirm: () => void,
  title?: string,
  confirmText?: string,
  cancelText?: string
) => {
  if (globalShowModal) {
    globalShowModal({
      title: title || '확인',
      message,
      type: 'warning',
      onConfirm
    });
  } else {
    // fallback to browser confirm
    if (confirm(message)) {
      onConfirm();
    }
  }
};

// 성공 메시지 표시
export const showSuccess = (message: string, title?: string) => {
  showAlert(message, title || '성공', 'success');
};

// 경고 메시지 표시
export const showWarning = (message: string, title?: string) => {
  showAlert(message, title || '경고', 'warning');
};

// 오류 메시지 표시
export const showError = (message: string, title?: string) => {
  showAlert(message, title || '오류', 'error');
};

// 삭제 확인 메시지 표시
export const showDeleteConfirm = (
  itemName: string,
  onConfirm: () => void,
  message?: string
) => {
  const confirmMessage = message || `정말로 ${itemName}을(를) 삭제하시겠습니까?`;
  showConfirm(confirmMessage, onConfirm, '삭제 확인', '삭제', '취소');
}; 