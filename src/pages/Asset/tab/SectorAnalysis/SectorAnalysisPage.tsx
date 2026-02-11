import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
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

  return (
    <MobileLayout className="overflow-hidden shadow-none">
      <div className="flex flex-col">
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
    </MobileLayout>
  );
};
