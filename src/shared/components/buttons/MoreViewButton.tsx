import React from 'react';
import { cn } from '@/shared/utils/cn';
import MoreViewIcon from '@/assets/icons/MoreView.svg?react';

export interface MoreViewButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const MoreViewButton: React.FC<MoreViewButtonProps> = ({ className, ...props }) => {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center justify-center',
        'w-[18px] h-[18px] md:w-[20px] md:h-[20px]',
        'cursor-pointer',
        className
      )}
      {...props}
    >
      <MoreViewIcon className="text-neutral-50 w-full h-full" />
    </button>
  );
};
