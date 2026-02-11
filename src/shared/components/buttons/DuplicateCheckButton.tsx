import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '../typography';

export interface DuplicateCheckButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  text?: string;
}

const DuplicateCheckButton: React.FC<DuplicateCheckButtonProps> = ({
  className,
  disabled,
  text = '중복 확인',
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'flex items-center justify-center',
        'w-[80px]',
        'h-[48px]',
        'px-[24px] py-[10px]',
        'rounded-[8px]',
        disabled
          ? 'bg-neutral-20 cursor-not-allowed border border-neutral-40'
          : 'bg-neutral-0 border border-neutral-90 cursor-pointer',
        className
      )}
      {...props}
    >
      <Typography
        style="text-body-2-14-semi-bold"
        fontFamily="pretendard"
        className={cn('text-center', 'whitespace-nowrap', disabled ? 'text-neutral-60' : 'text-neutral-90')}
      >
        {text}
      </Typography>
    </button>
  );
};

export default DuplicateCheckButton;
