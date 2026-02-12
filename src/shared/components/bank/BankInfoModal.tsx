import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '../typography';
import { BaseButton } from '../buttons/BaseButton';

export interface BankInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

const BankInfoModal: React.FC<BankInfoModalProps> = ({ isOpen, onClose, onConfirm, className }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-90 opacity-[0.65] z-40" onClick={onClose} />

      {/* Centered Modal (Goal 모달과 동일한 레이아웃) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
        <div className={cn('w-full max-w-[320px] bg-white rounded-xl px-6 py-6 shadow-lg', className)}>
          <Typography style="text-body-1-16-semi-bold" fontFamily="pretendard" className="text-neutral-90 text-center">
            정보안내
          </Typography>
          <Typography
            style="text-body-2-14-regular"
            fontFamily="pretendard"
            className="text-neutral-70 text-center mt-2"
          >
            계좌 인증에 사용된 모든 정보는 인증 완료 즉시 폐기되며, 당사 서버에 저장되지 않습니다
          </Typography>

          <div className="mt-6 flex">
            <BaseButton
              size="custom"
              variant="primary"
              onClick={onConfirm}
              className="flex-1 h-[48px] rounded-lg bg-primary-normal"
              typographyStyle="text-body-1-16-semi-bold"
              text="이해했어요"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BankInfoModal;
