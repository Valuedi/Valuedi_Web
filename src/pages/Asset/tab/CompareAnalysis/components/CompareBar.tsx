import { Typography } from '@/shared/components/typography';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { cn } from '@/shared/utils/cn';

interface CompareBarProps {
  label: string;
  amount: number;
  isHighlight?: boolean;
  maxAmount?: number;
}

export const CompareBar = ({ label, amount, isHighlight, maxAmount = 200000 }: CompareBarProps) => {
  const barHeight = Math.max(10, (amount / maxAmount) * 120);

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* 1. 금액 */}
      <Typography
        variant="body-3"
        color={isHighlight ? 'neutral-90' : 'neutral-50'}
        weight="semi-bold"
        className="whitespace-nowrap"
      >
        {formatCurrency(amount)}
      </Typography>

      {/* 2. 막대 */}
      <div
        className={cn(
          'w-full rounded-t-md transition-all duration-1000 ease-out',
          isHighlight ? 'bg-atomic-yellow-50' : 'bg-neutral-30'
        )}
        style={{ height: `${barHeight}px` }}
      />

      {/* 3. 라벨 */}
      <Typography variant="body-3" color="neutral-70" weight="regular" className="whitespace-nowrap pt-1">
        {label}
      </Typography>
    </div>
  );
};
