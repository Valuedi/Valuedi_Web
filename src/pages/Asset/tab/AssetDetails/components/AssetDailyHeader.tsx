import { cn } from '@/utils/cn';
import { Typography } from '@/components/typography';
import { formatCurrency } from '@/utils/formatCurrency';

interface AssetDailyHeaderProps {
  date: string;
  dailyTotal: number;
}

export const AssetDailyHeader = ({ date, dailyTotal }: AssetDailyHeaderProps) => {
  return (
    <div className="flex flex-col">
      <div className={cn('flex items-center justify-between py-[4px]')}>
        <Typography style="text-caption-1-12-regular" className={cn('text-neutral-90')}>
          {date}
        </Typography>
        <Typography style="text-caption-1-12-regular" className={cn('text-neutral-70')}>
          {formatCurrency(dailyTotal)}
        </Typography>
      </div>

      <div className="w-full h-[1px] bg-neutral-10 my-[4px]" />
    </div>
  );
};
