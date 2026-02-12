import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { SectorSummarySection } from './sections/SectorSummarySection';
import { SectorListSection } from './sections/SectorListSection';
import { useGetAssetAnalysis } from '@/shared/hooks/Asset/useGetAssetAnalysis';

export const SectorAnalysis = () => {
  const location = useLocation();

  const [selectedDate, setSelectedDate] = useState<Date>(
    location.state?.selectedDate ? new Date(location.state.selectedDate) : new Date()
  );

  const memoizedDate = useMemo(() => new Date(selectedDate), [selectedDate]);

  const { totalExpense, isLoading, allSectors } = useGetAssetAnalysis(memoizedDate);

  const lastMonthDate = useMemo(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1),
    [selectedDate]
  );
  const { totalExpense: lastMonthTotal } = useGetAssetAnalysis(lastMonthDate);

  const diff = totalExpense - lastMonthTotal;
  const isMore = diff > 0;
  const diffAmountText = Math.abs(diff).toLocaleString();

  const handlePrevMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  const handleNextMonth = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));

  // AssetPage에서 이미 MobileLayout 및 전체 레이아웃을 감싸고 있으므로,
  // 여기서는 순수 섹션만 렌더링하여 태블릿/PC에서도 일관된 반응형 레이아웃을 유지한다.
  return (
    <div className="flex flex-col w-full h-full bg-neutral-0">
      <SectorSummarySection
        selectedDate={selectedDate}
        totalAmount={totalExpense}
        sectorData={allSectors}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        diffAmountText={diffAmountText}
        isMore={isMore}
        isLoading={isLoading}
      />

      <SectorListSection data={allSectors} isLoading={isLoading} selectedDate={selectedDate} />
    </div>
  );
};
