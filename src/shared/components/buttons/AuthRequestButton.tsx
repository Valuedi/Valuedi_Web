import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '../typography';

export interface AuthRequestButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  text?: string;
}

const AuthRequestButton: React.FC<AuthRequestButtonProps> = ({ className, disabled, text = '재전송', ...props }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'flex items-center justify-center',
        'w-[80px]',
        'h-[48px]',
        'rounded-[8px]',
        'transition-all outline-none',
        disabled
          ? 'bg-neutral-20 cursor-not-allowed border border-neutral-40' // 비활성화 시
          : 'bg-primary-normal cursor-pointer hover:bg-atomic-yellow-40 active:bg-atomic-yellow-30 border-none', // 활성화 시 FFE500
        className
      )}
      {...props}
    >
      <Typography
        variant="body-2"
        weight="semi-bold"
        className={cn('text-center whitespace-nowrap', disabled ? 'text-neutral-60' : 'text-neutral-90')}
      >
        {text}
      </Typography>
    </button>
  );
};

export default AuthRequestButton;
