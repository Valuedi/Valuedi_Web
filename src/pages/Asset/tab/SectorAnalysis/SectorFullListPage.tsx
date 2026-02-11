import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';
import { SectorListItem } from './components/SectorListItem';
import { CATEGORY_LABELS } from '@/features/asset/constants/category';
import { useGetAssetAnalysis } from '@/shared/hooks/Asset/useGetAssetAnalysis';
import type { SectorData } from './components/SectorListItem';
import { Skeleton } from '@/shared/components/skeleton/Skeleton';

export const SectorFullListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedDate = location.state?.selectedDate ? new Date(location.state.selectedDate) : new Date();

  const { allSectors, isLoading } = useGetAssetAnalysis(selectedDate);

  const isFilterOthers = location.state?.filter === 'others';
  const displayItems = isFilterOthers ? allSectors.slice(5) : allSectors;
  const title = isFilterOthers ? `그외 ${displayItems.length}개` : `분야별 전체내역`;

  return (
    <MobileLayout className="bg-neutral-0 shadow-none">
      <div className={cn('flex flex-col min-h-screen bg-neutral-0')}>
        {/* 상단 GNB */}
        <div className={cn('sticky top-0 z-10 w-full bg-white border-b border-neutral-5')}>
          <BackPageGNB
            className={cn('bg-white')}
            text=""
            titleColor="text-neutral-90"
            title={title}
            onBack={() => navigate('/asset/sector', { state: { selectedDate } })} // 💡 단순 -1 이동이 더 안전합니다 ㅋ
          />
        </div>

        {/* 분야별 리스트 영역 */}
        <div className={cn('flex-1 flex flex-col px-[20px] gap-[12px] mt-[20px] no-scrollbar pb-10')}>
          {isLoading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="w-24 h-4 rounded" />
                      <Skeleton className="w-12 h-3 rounded" />
                    </div>
                  </div>
                  <Skeleton className="w-20 h-5 rounded" />
                </div>
              ))
            : displayItems.map((item: SectorData) => {
                const categoryKey = item.key || 'default';
                return (
                  <SectorListItem
                    key={categoryKey}
                    data={item}
                    label={CATEGORY_LABELS[categoryKey] || item.category || CATEGORY_LABELS.default}
                    onClick={() => {
                      navigate(`/asset/sector/${categoryKey}`, {
                        state: { sectorData: item, selectedDate: selectedDate.toISOString() },
                      });
                    }}
                  />
                );
              })}
        </div>
      </div>
    </MobileLayout>
  );
};
