import { Typography } from '@/shared/components/typography';
import type { TrendItem } from '@/features/asset/asset.api';
import { cn } from '@/shared/utils/cn';

interface SectorTrendChartProps {
  data: TrendItem[];
  isLoading?: boolean;
  className?: string;
}

export function SectorTrendChart({ data, isLoading, className }: SectorTrendChartProps) {
  if (isLoading) {
    return <div className={cn('w-full h-[120px] bg-neutral-10 rounded-lg animate-pulse', className)} />;
  }

  const values = data.map((d) => Number(d.amount ?? d.totalExpense ?? 0));
  const maxAmount = Math.max(1, ...values);

  return (
    <div className={cn('w-full', className)}>
      <Typography variant="caption-1" color="neutral-50" className="mb-2">
        월별 지출 추이
      </Typography>
      <div className="flex items-end justify-between gap-1 h-[100px]">
        {data.map((item, idx) => {
          const amount = Number(item.amount ?? item.totalExpense ?? 0);
          const heightPct = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
          const monthLabel = item.yearMonth ? `${new Date(item.yearMonth + '-01').getMonth() + 1}월` : `${idx + 1}`;
          return (
            <div key={item.yearMonth ?? idx} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end h-20">
                <div
                  className="w-full bg-primary-normal rounded-t min-h-[4px] transition-all"
                  style={{ height: `${Math.max(4, heightPct)}%` }}
                />
              </div>
              <Typography variant="caption-2" color="neutral-50">
                {monthLabel}
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
}
