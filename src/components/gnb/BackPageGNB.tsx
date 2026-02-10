import React from 'react';
import { cn } from '@/utils/cn';
import { Typography } from '../typography';
import BackPageIcon from '@/assets/icons/BackPage.svg';

export interface BackPageGNBProps {
  className?: string;
  title?: string;
  text?: React.ReactNode;
  titleColor?: string;
  onBack?: () => void;
  onSkip?: () => void;
}

const BackPageGNB: React.FC<BackPageGNBProps> = ({
  className,
  title = '목표 설정하기',
  text = '건너뛰기',
  titleColor = 'text-neutral-70',
  onBack,
  onSkip,
}) => {
  return (
    <header
      className={cn(
        'relative flex items-center justify-between',
        'w-full md:w-full',
        'h-[50px] md:h-[56px]',
        'px-[20px] md:px-[32px] lg:px-[40px]',
        'bg-neutral-10',
        className
      )}
    >
      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center cursor-pointer w-[16px] md:w-[20px]"
        >
          <img src={BackPageIcon} alt="뒤로가기" className="w-[16px] h-[16px] md:w-[20px] md:h-[20px]" />
        </button>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Typography
          style="text-body-1-16-medium"
          fontFamily="pretendard"
          className={cn(titleColor, 'md:text-headline-3-18-medium')}
        >
          {title}
        </Typography>
      </div>

      <div onClick={onSkip} className="flex items-center justify-end z-10 cursor-pointer min-w-[16px] md:min-w-[20px]">
        {text}
      </div>
    </header>
  );
};

export default BackPageGNB;
