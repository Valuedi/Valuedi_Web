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

      {/* Modal */}
      <div
        className={cn(
          'fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white rounded-tl-[12px] rounded-tr-[12px] w-[360px] z-50 flex flex-col',
          className
        )}
      >
        {/* Handle */}
        <div className="flex items-center justify-center py-[10px] px-0 w-full">
          <div className="bg-neutral-50 h-[2px] rounded-[100px] w-[80px]" />
        </div>

        <div className="px-[20px] pb-0 flex flex-col gap-[20px]">
          <Typography style="text-body-1-16-semi-bold" className="text-black">
            정보안내
          </Typography>
          <Typography variant="body-2" weight="regular" className="text-neutral-70 w-[320px]">
            계좌 인증에 사용된 모든 정보는 인증 완료 즉시 폐기되며, 당사 서버에 저장되지 않습니다
          </Typography>
        </div>

        <div className="flex flex-col items-start">
          <div className="bg-white flex flex-col items-center pb-[20px] pt-[20px] px-0 w-[360px]">
            <BaseButton
              variant="primary"
              size="medium"
              text="이해했어요"
              fullWidth
              className="w-[320px]"
              onClick={onConfirm}
            />
          </div>
          <div className="flex flex-col items-start rounded-tl-[8px] rounded-tr-[8px] w-[360px]">
            <div className="flex flex-col items-center overflow-hidden px-[120px] py-[8px] w-full">
              <div className="bg-neutral-90 h-[5px] rounded-[100px] w-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankInfoModal;
