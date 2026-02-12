import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { SectorSummarySection } from './sections/SectorSummarySection';
import { SectorListSection } from './sections/SectorListSection';
import { useGetAssetAnalysis } from '@/shared/hooks/Asset/useGetAssetAnalysis';

export const SectorAnalysis = () => {
  const location = useLocation();

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (location.state?.selectedDate) {
      const date = new Date(location.state.selectedDate);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  });

  // 선택된 날짜의 년월 기준으로 데이터 조회 (날짜 객체를 직접 전달)
  const { totalExpense, isLoading, allSectors } = useGetAssetAnalysis(selectedDate);

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
