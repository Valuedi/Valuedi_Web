import React from 'react';
import { cn } from '@/utils/cn';
import { Typography } from '../typography';
import BackPageIcon from '@/assets/icons/BackPage.svg';

export interface BackPageGNBProps {
  className?: string;
  title?: string;
  text?: string;
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
      className={cn('relative flex items-center justify-between w-[360px] h-[50px] px-[20px] bg-neutral-10', className)}
    >
      <div className="flex items-center justify-start">
        <button type="button" onClick={onBack} className="flex items-center justify-center cursor-pointer w-[24px]">
          <img src={BackPageIcon} alt="뒤로가기" />
        </button>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Typography style="text-body-1-16-medium" fontFamily="pretendard" className={titleColor}>
          {title}
        </Typography>
      </div>

      <div className="flex items-center justify-end z-10">
        <button type="button" onClick={onSkip}>
          {text && (
            <button type="button" onClick={onSkip}>
              <Typography style="text-body-3-13-regular" fontFamily="pretendard" className="text-neutral-70 underline">
                {text}
              </Typography>
            </button>
          )}
        </button>
      </div>
    </header>
  );
};

export default BackPageGNB;
