import { Skeleton } from '@/shared/components/skeleton/Skeleton';

export const CompareBarSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* 1. 금액 자리 (회색 박스) */}
      <Skeleton className="w-16 h-4" />

      {/* 2. 막대 자리 (기본 높이로 고정) */}
      <Skeleton className="w-full h-32 rounded-t-md" />

      {/* 3. 라벨 자리 */}
      <Skeleton className="w-12 h-3 mt-1" />
    </div>
  );
};
