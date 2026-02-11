import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Typography } from '@/shared/components/typography';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { CompareBar } from './CompareBar';
import { Skeleton } from '@/shared/components/skeleton/Skeleton';
import { CompareBarSkeleton } from './CompareBarSkeleton';
import { getPeerCompareApi } from '@/features/asset/asset.api';
import { useUserName } from '@/shared/hooks/useUserName';

// 💡 3. Props 인터페이스 추가
interface PeerCompareSectionProps {
  isLoading?: boolean;
}

export const PeerCompareSection = ({ isLoading = false }: PeerCompareSectionProps) => {
  const userName = useUserName();
  const now = useMemo(() => new Date(), []);
  const yearMonth = useMemo(() => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`, [now]);

  const { data, isLoading: isPeerLoading } = useQuery({
    queryKey: ['transactions', 'peer-compare', yearMonth],
    queryFn: () => getPeerCompareApi(yearMonth),
  });

  const apiResult = data?.result;
  const myTotal = apiResult?.myTotalExpense ?? 0;
  const peerTotal = apiResult?.perAverageExpense ?? 0;

  const loading = isLoading || isPeerLoading;

  const diffAmount = Math.abs(myTotal - peerTotal);
  const isMore = myTotal > peerTotal;

  return (
    <section className="px-5 py-8 bg-white border-b-[8px] border-neutral-5">
      {/* 제목 부분 */}
      <Typography variant="headline-3" weight="semi-bold" color="neutral-90" className="mb-1">
        또래별 비교
      </Typography>

      {/* 로딩 중일 땐 설명 문구 대신 스켈레톤 */}
      {loading ? (
        <Skeleton className="w-56 h-4 mb-10 rounded" />
      ) : (
        <Typography variant="body-3" color="neutral-70" className="mb-10">
          또래 평균보다 월별 <span className="font-semi-bold text-neutral-70">{formatCurrency(diffAmount)}</span>{' '}
          {isMore ? '이상 더 지출해요' : '이하로 지출해요'}
        </Typography>
      )}

      {/* 바 차트 컨테이너 */}
      <div className="flex justify-center items-end gap-14 px-10 h-44">
        {/* 로딩 중일 땐 차트 대신 전용 스켈레톤 2개 배치 */}
        {loading ? (
          <>
            <CompareBarSkeleton />
            <CompareBarSkeleton />
          </>
        ) : (
          <>
            <CompareBar label="또래 평균" amount={peerTotal} maxAmount={Math.max(myTotal, peerTotal) * 1.2} />
            <CompareBar
              label={`${userName}님`}
              amount={myTotal}
              isHighlight={true}
              maxAmount={Math.max(myTotal, peerTotal) * 1.2}
            />
          </>
        )}
      </div>
    </section>
  );
};
