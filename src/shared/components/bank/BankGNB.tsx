import React from 'react';
import { cn } from '@/shared/utils/cn';
import BankGNBBackIcon from '@/assets/icons/BankGNBBack.svg';

export interface BankGNBProps {
  className?: string;
  onBack?: () => void;
  onClose?: () => void;
}

const BankGNB: React.FC<BankGNBProps> = ({ className, onBack, onClose }) => {
  return (
    <div className={cn('w-full h-12 px-5 inline-flex justify-between items-center', className)}>
      {/* Back Button */}
      <button type="button" onClick={onBack} className="w-6 h-6 flex justify-center items-center cursor-pointer">
        <img src={BankGNBBackIcon} alt="뒤로가기" className="w-6 h-6" />
      </button>

      {/* Right side - Status area (can be used for close button if needed) */}
      <div className="h-6 px-[5px] flex justify-center items-center gap-2.5 overflow-hidden">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="size-3.5 flex justify-start items-center gap-1 cursor-pointer"
          >
            <div className="size-0.5 bg-neutral-900 rounded-full" />
            <div className="size-0.5 bg-neutral-900 rounded-full" />
            <div className="size-0.5 bg-neutral-900 rounded-full" />
          </button>
        ) : (
          <div className="h-3.5 flex justify-start items-center gap-1">
            <div className="size-0.5 bg-neutral-900/0 rounded-full" />
            <div className="size-0.5 bg-neutral-900/0 rounded-full" />
            <div className="size-0.5 bg-neutral-900/0 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BankGNB;
