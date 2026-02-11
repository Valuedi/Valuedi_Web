// src/components/common/Toast.tsx
import { useEffect } from 'react';
import { Typography } from '@/shared/components/typography';
import WarningIcon from '@/assets/icons/warning.svg';
import { cn } from '@/shared/utils/cn';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const Toast = ({ message, isOpen, onClose, autoClose = true, autoCloseDelay = 3000 }: ToastProps) => {
  // 자동 닫기 (onClose가 없거나 autoClose가 false면 실행 안 함)
  useEffect(() => {
    if (isOpen && autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose, autoCloseDelay]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-[34px] w-full px-5 z-[9999]">
      <div
        className={cn(
          'flex items-center shadow-lg',
          'w-[320px] min-h-[48px] rounded-[8px] gap-2 px-[10px] py-3',
          'backdrop-blur-[8px]'
        )}
        style={{
          backgroundColor: 'rgba(23, 23, 20, 0.45)',
        }}
      >
        <img src={WarningIcon} alt="경고" className="w-6 h-6 flex-shrink-0" />

        <Typography variant="body-2" className="text-white flex-1 leading-[20px] text-[14px]">
          {message}
        </Typography>
      </div>
    </div>
  );
};
