import React from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '../typography';

export interface MbtiCardProps {
  mbtiType?: string;
  subDetail?: string;
  description?: string;
  className?: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const MbtiCard: React.FC<MbtiCardProps> = ({ mbtiType, subDetail, description, className, icon: Icon }) => {
  return (
    <div className={cn('w-[320px] flex flex-col ', className)}>
      <Typography style="text-headline-3-18-semi-bold" fontFamily="pretendard" className={cn('text-neutral-90')}>
        회원님의 금융 MBTI는?
      </Typography>
      <div
        className={cn(
          'w-full flex flex-col mt-[20px] gap-[12px] p-[24px] items-center justify-center shadow-trophy-card'
        )}
      >
        <Typography style="text-headline-3-18-semi-bold" fontFamily="pretendard" className={cn('text-neutral-90')}>
          {mbtiType}
        </Typography>

        <div className={cn('flex')}>{Icon && <Icon />}</div>

        <div className={cn('flex flex-col gap-[12px] items-center justify-center text-center')}>
          <Typography style="text-body-2-14-semi-bold" fontFamily="pretendard" className={cn('text-neutral-70')}>
            {subDetail}
          </Typography>

          <Typography style="text-body-2-14-regular" fontFamily="pretendard" className={cn('text-neutral-70')}>
            {description}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default MbtiCard;
