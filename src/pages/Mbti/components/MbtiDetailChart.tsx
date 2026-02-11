import { useState } from 'react';
import { Typography } from '@/shared/components';
import { cn } from '@/shared/utils/cn';
import { MoreViewButton } from '@/shared/components/buttons';

interface MbtiDetailChartProps {
  title: string;
  leftLabel: string;
  rightLabel: string;
  leftScore: number;
  description: string;
  details: string[];
}

export const MbtiDetailChart = ({
  title,
  leftLabel,
  rightLabel,
  leftScore,
  description,
  details,
}: MbtiDetailChartProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const isLeftDominant = leftScore >= 50;
  const rightScore = 100 - leftScore;
  const dominantScore = isLeftDominant ? leftScore : rightScore;

  return (
    <div className={cn('flex flex-col w-full gap-[12px]')}>
      <Typography style="text-body-1-16-semi-bold" className="text-neutral-90">
        {title}
      </Typography>
      <div className={cn('flex flex-col gap-[4px]')}>
        <div className={cn('flex justify-between items-center')}>
          <Typography
            style={isLeftDominant ? 'text-body-1-16-semi-bold' : 'text-body-1-16-regular'}
            className={cn(isLeftDominant ? 'text-neutral-90' : 'text-neutral-50')}
          >
            {leftLabel}
          </Typography>

          <Typography
            style={!isLeftDominant ? 'text-body-1-16-semi-bold' : 'text-body-1-16-regular'}
            className={cn(!isLeftDominant ? 'text-neutral-90' : 'text-neutral-50')}
          >
            {rightLabel}
          </Typography>
        </div>

        <div className={cn('flex items-center')}>
          <Typography
            style={isLeftDominant ? 'text-body-2-14-semi-bold' : 'text-body-2-14-regular'}
            className={cn('w-[48px]', isLeftDominant ? 'text-neutral-90' : 'text-neutral-50')}
          >
            {leftScore}%
          </Typography>

          <div
            className={cn('flex-1 h-[8px] w-full bg-neutral-10 rounded-full flex', !isLeftDominant && 'justify-end')}
          >
            <div
              className={cn('h-[8px] bg-primary-normal rounded-full transition-all duration-500')}
              style={{ width: `${dominantScore}%` }}
            />
          </div>

          <Typography
            style={!isLeftDominant ? 'text-body-2-14-semi-bold' : 'text-body-2-14-regular'}
            className={cn('w-[48px] text-right', !isLeftDominant ? 'text-neutral-90' : 'text-neutral-50')}
          >
            {rightScore}%
          </Typography>
        </div>
      </div>

      <div className={cn('flex flex-col rounded-[8px] px-[8px] py-[12px] gap-[12px] bg-neutral-10')}>
        <Typography style="text-caption-1-12-semi-bold" className={cn('text-neutral-90')}>
          {isLeftDominant ? leftLabel : rightLabel}이란?
        </Typography>

        <div className={cn('flex flex-col gap-[8px]')}>
          <Typography style="text-caption-1-12-regular" className={cn('text-neutral-70')}>
            • {description}
          </Typography>

          {isOpen && (
            <div className="flex flex-col gap-[8px]">
              {details.map((text, index) => (
                <div key={index} className="flex">
                  <Typography style="text-caption-1-12-regular" className="text-neutral-70">
                    • {text}
                  </Typography>
                </div>
              ))}
            </div>
          )}

          <div onClick={() => setIsOpen(!isOpen)} className={cn('flex gap-[4px] items-center w-fit')}>
            <Typography style="text-caption-1-12-regular" className={cn('text-neutral-50')}>
              {isOpen ? '간략히보기' : '자세히보기'}
            </Typography>
            <MoreViewButton className={cn(isOpen ? '-rotate-90' : 'rotate-90')} />
          </div>
        </div>
      </div>
    </div>
  );
};
