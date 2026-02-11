import React from 'react';
import { cn } from '@/shared/utils/cn';
import RadioButtonOnIcon from '@/assets/icons/RadioButtonOn.svg';
import RadioButtonOffIcon from '@/assets/icons/RadioButtonOff.svg';

export interface CheckBoxButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isChecked: boolean;
  className?: string;
}

const CheckBoxButton: React.FC<CheckBoxButtonProps> = ({ isChecked, className, ...props }) => {
  return (
    <button
      type="button"
      aria-checked={isChecked}
      className={cn('flex items-center justify-center', 'w-[20px] h-[20px]', className)}
      {...props}
    >
      <img src={isChecked ? RadioButtonOnIcon : RadioButtonOffIcon} alt="checkbox" />
    </button>
  );
};

export default CheckBoxButton;
