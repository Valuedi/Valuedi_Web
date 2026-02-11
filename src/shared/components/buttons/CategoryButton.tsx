import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '../typography';

export interface CategoryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  text?: string;
  isSelected?: boolean;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ className, text = '전체', isSelected = false, ...props }) => {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center justify-center',
        'h-[32px]',
        'px-[12px] py-[8px]',
        'rounded-full',
        isSelected ? 'bg-primary-normal' : 'bg-neutral-10',
        className
      )}
      {...props}
    >
      <Typography
        style={isSelected ? 'text-caption-1-12-semi-bold' : 'text-caption-1-12-regular'}
        color={isSelected ? 'neutral-90' : 'neutral-70'}
        className="text-[12px] leading-[16px]"
        fontFamily="pretendard"
      >
        {text}
      </Typography>
    </button>
  );
};

export default CategoryButton;
