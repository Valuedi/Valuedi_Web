import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast } from '@/shared/components/common/Toast';

interface ToastContextType {
  showToast: (message: string, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toastState, setToastState] = useState<{
    message: string;
    isOpen: boolean;
    duration: number;
  }>({
    message: '',
    isOpen: false,
    duration: 3000,
  });

  const showToast = useCallback((message: string, duration = 3000) => {
    setToastState({
      message,
      isOpen: true,
      duration,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToastState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={toastState.message}
        isOpen={toastState.isOpen}
        onClose={hideToast}
        autoCloseDelay={toastState.duration}
      />
    </ToastContext.Provider>
  );
};
