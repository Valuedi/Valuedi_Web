import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '../typography';

export interface SmallLoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  text?: string;
}

const SmallLoginButton: React.FC<SmallLoginButtonProps> = ({ className, text = '로그인', ...props }) => {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center justify-center',
        'h-[34px]',
        'px-[12px]',
        'py-[8px]',
        'rounded-[4px]',
        'bg-primary-normal',
        className
      )}
      {...props}
    >
      <Typography style="text-body-2-14-semi-bold" className="text-neutral-90 text-center" fontFamily="pretendard">
        {text}
      </Typography>
    </button>
  );
};

export default SmallLoginButton;
