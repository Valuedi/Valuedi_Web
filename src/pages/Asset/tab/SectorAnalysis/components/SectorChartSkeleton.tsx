import { Skeleton } from '@/shared/components/skeleton/Skeleton';

export const SectorChartSkeleton = () => {
  return (
    // 실제 차트 컨테이너와 동일한 구조

    <div className="flex h-5 w-full rounded overflow-hidden gap-0.5 animate-pulse">
      {/* 비율이 다른 막대 3~4개를 배치 */}

      <Skeleton className="h-full w-[45%] bg-neutral-10" />

      <Skeleton className="h-full w-[25%] bg-neutral-10" />

      <Skeleton className="h-full w-[15%] bg-neutral-10" />

      <Skeleton className="h-full w-[10%] bg-neutral-10" />

      <Skeleton className="h-full w-[5%] bg-neutral-10" />
    </div>
  );
};
