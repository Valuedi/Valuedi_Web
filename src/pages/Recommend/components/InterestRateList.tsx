import { Typography } from '@/shared/components/typography';
import { cn } from '@/shared/utils/cn';

export interface InterestRateItem {
  description: string;
  rate: number;
}

interface InterestRateListProps {
  items: InterestRateItem[];
  className?: string;
}

export const InterestRateList = ({ items, className }: InterestRateListProps) => {
  return (
    <div className={cn('flex flex-col gap-[8px]', className)}>
      <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
        금리 정보
      </Typography>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn('flex flex-col gap-[8px] px-[12px] py-[16px] rounded-[8px] bg-neutral-10 shadow-sm')}
        >
          <div className={cn('flex justify-between items-center')}>
            <Typography style="text-body-2-14-regular" className={cn('text-neutral-90 whitespace-pre-wrap')}>
              {item.description}
            </Typography>
            <div className={cn('flex gap-[2px]')}>
              <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
                {item.rate}
              </Typography>
              <Typography style="text-body-2-14-regular" className={cn('text-neutral-90')}>
                %
              </Typography>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
