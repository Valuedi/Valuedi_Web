import React from 'react';
import { cn } from '@/shared/utils/cn';
import CheckButtonOnIcon from '@/assets/icons/mypage/CheckButtonOn.svg';
import CheckButtonOffIcon from '@/assets/icons/mypage/CheckButtonOff.svg';

export interface CheckBoxButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isChecked: boolean;
  className?: string;
}

const CheckBoxButton: React.FC<CheckBoxButtonProps> = ({ isChecked, className, ...props }) => {
  return (
    <button
      type="button"
      aria-checked={isChecked}
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <img src={isChecked ? CheckButtonOnIcon : CheckButtonOffIcon} alt="checkbox" />
    </button>
  );
};

export default CheckBoxButton;
