import { useNavigate } from 'react-router-dom';
import { Typography } from '@/shared/components/typography';
import { SectorChart } from '../components/SectorChart';
import { SectorChartSkeleton } from '../components/SectorChartSkeleton';
import { SectorData } from '../utils/sectorUtils';
import { Skeleton } from '@/shared/components/skeleton/Skeleton';

interface SectorSummarySectionProps {
  selectedDate: Date;
  totalAmount: number;
  diffAmountText: string;
  isMore: boolean;
  sectorData: SectorData[];
  onPrev: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

export const SectorSummarySection = ({
  selectedDate,
  totalAmount,
  diffAmountText,
  isMore,
  sectorData,
  onPrev,
  onNext,
  isLoading = false,
}: SectorSummarySectionProps) => {
  const navigate = useNavigate();
  const monthDisplay = `${selectedDate.getMonth() + 1}월`;

  return (
    <section className="px-5 pt-5 pb-5 bg-white flex flex-col items-start">
      <div className="flex items-center gap-1 mb-4">
        <button onClick={onPrev} className="text-neutral-40 px-1 text-xl">
          ◀
        </button>
        <Typography variant="body-1" weight="bold" color="neutral-90">
          {monthDisplay}
        </Typography>
        <button onClick={onNext} className="text-neutral-40 px-1 text-xl">
          ▶
        </button>
      </div>

      <div
        onClick={() => !isLoading && navigate('/asset/sector-full', { state: { selectedDate } })}
        className="cursor-pointer active:opacity-70 transition-opacity"
      >
        {isLoading ? (
          <Skeleton className="w-32 h-8 mb-2 rounded" />
        ) : (
          <Typography variant="headline-1" weight="bold" color="neutral-90" className="mb-1">
            {totalAmount.toLocaleString()}원
          </Typography>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="w-48 h-4 mb-5 rounded" />
      ) : (
        <Typography variant="body-3" color="neutral-50" className="mb-5">
          지난 달 같은 기간보다 <span className="text-neutral-90 font-bold text-[13px]">{diffAmountText}원</span>
          {isMore ? ' 더 ' : ' 덜 '} 썼어요
        </Typography>
      )}

      <div className="w-full flex justify-center mb-0">
        {isLoading ? (
          <SectorChartSkeleton />
        ) : (
          <SectorChart
            data={(() => {
              // others가 아닌 항목들만 상위 5개 선택
              const nonOthersItems = sectorData.filter((item) => item.key !== 'others').slice(0, 5);
              
              // 모든 others 항목을 찾아서 합치기
              const allOthersItems = sectorData.filter((item) => item.key === 'others');
              const mergedOthers =
                allOthersItems.length > 0
                  ? {
                      key: 'others',
                      amount: allOthersItems.reduce((sum, i) => sum + i.amount, 0),
                      percentage: allOthersItems.reduce((sum, i) => sum + i.percentage, 0),
                      category: 'others',
                      items: [],
                    }
                  : null;

              // others가 있고 금액이 0보다 크면 추가
              return mergedOthers && mergedOthers.amount > 0
                ? [...nonOthersItems, mergedOthers]
                : nonOthersItems;
            })()}
          />
        )}
      </div>
    </section>
  );
};
