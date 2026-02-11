import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  percentage: number;
  className?: string;
  /**
   * 접근성을 위한 라벨. 스크린 리더가 읽을 텍스트입니다.
   * @default "진행률"
   */
  'aria-label'?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  className,
  'aria-label': ariaLabel = '진행률',
  ...props
}) => {
  const validPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div
      role="progressbar"
      aria-valuenow={validPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={cn('w-[360px]', 'h-[1px]', 'bg-neutral-10', className)}
      {...props}
    >
      <div className={cn('h-full', 'bg-primary-normal', 'rounded-r-[4px]')} style={{ width: `${validPercentage}%` }} />
    </div>
  );
};

export default ProgressBar;
