import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Typography } from '@/shared/components/typography';
import { CompareBar } from './CompareBar';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { Skeleton } from '@/shared/components/skeleton/Skeleton';
import { CompareBarSkeleton } from './CompareBarSkeleton';
import { getTrendApi, type TrendItem } from '@/features/asset/asset.api';

// 💡 3. 인터페이스 추가
interface HistoryCompareSectionProps {
  isLoading?: boolean;
}

export const HistoryCompareSection = ({ isLoading = false }: HistoryCompareSectionProps) => {
  // 기준: 이번 달을 포함한 최근 4개월 추이
  const now = useMemo(() => new Date(), []);
  const toYearMonth = useMemo(() => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`, [now]);
  const fromYearMonth = useMemo(() => {
    const d = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }, [now]);

  const { data, isLoading: isTrendLoading } = useQuery({
    queryKey: ['transactions', 'trend', fromYearMonth, toYearMonth],
    queryFn: () => getTrendApi({ fromYearMonth, toYearMonth }),
  });

  const { totalJan, totalDec, totalNov } = useMemo(() => {
    const trendItems: TrendItem[] = data?.result ?? [];
    const map = new Map<string, number>();
    trendItems.forEach((item) => {
      const ym = item.yearMonth;
      if (!ym) return;
      const value = Number(item.totalExpense ?? item.amount ?? 0);
      map.set(ym, value);
    });

    const thisMonth = toYearMonth;
    const decDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const novDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const ymDec = `${decDate.getFullYear()}-${String(decDate.getMonth() + 1).padStart(2, '0')}`;
    const ymNov = `${novDate.getFullYear()}-${String(novDate.getMonth() + 1).padStart(2, '0')}`;

    return {
      totalJan: map.get(thisMonth) ?? 0,
      totalDec: map.get(ymDec) ?? 0,
      totalNov: map.get(ymNov) ?? 0,
    };
  }, [data, toYearMonth, now]);

  const diffAmount = Math.abs(totalJan - totalDec);
  const isReduced = totalJan < totalDec;
  const maxAmount = Math.max(totalNov, totalDec, totalJan, 150000);

  return (
    <section className="px-5 py-6 bg-white pb-4">
      <Typography variant="headline-3" weight="bold" color="neutral-90" className="mb-1">
        소비내역 비교
      </Typography>

      {/* 문구 로딩 처리 */}
      {isLoading || isTrendLoading ? (
        <Skeleton className="w-56 h-4 mb-10 rounded" />
      ) : (
        <Typography variant="body-3" color="neutral-60" className="mb-10 leading-relaxed">
          소비내역이 지난 달보다 <span className="font-bold text-neutral-90">{formatCurrency(diffAmount)}</span>{' '}
          {isReduced ? '줄었어요' : '늘었어요'}
        </Typography>
      )}

      {/* 최근 3개월치 바 차트 스켈레톤/실제 데이터 */}
      <div className="flex justify-between items-end gap-2 min-h-[120px] w-full max-w-[340px] mx-auto px-1">
        {isLoading || isTrendLoading ? (
          <>
            <CompareBarSkeleton />
            <CompareBarSkeleton />
            <CompareBarSkeleton />
          </>
        ) : (
          <>
            <CompareBar label="2개월 전" amount={totalNov} maxAmount={maxAmount * 1.2} />
            <CompareBar label="지난 달" amount={totalDec} maxAmount={maxAmount * 1.2} />
            <CompareBar label="이번 달" amount={totalJan} isHighlight={true} maxAmount={maxAmount * 1.2} />
          </>
        )}
      </div>
    </section>
  );
};
