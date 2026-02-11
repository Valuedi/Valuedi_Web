import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/typography';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import PolygonButtonIcon from '@/assets/icons/asset/PolygonButton.svg?react';
import { ViewToggleButton } from '@/shared/components/buttons';
import { LedgerList } from './LedgerList';
import LedgerCalendar from './LedgerCalendar';
import { useLedgerActions, useLedgerStore } from '@/shared/hooks/Asset/usetLedgerStore';
import { getMonthlySummaryApi, getTopCategoriesApi, getDailyTransactionsApi } from '@/features/asset/asset.api';
import { Skeleton } from '@/shared/components/skeleton/Skeleton';

export const AssetLedger = () => {
  const currentMonth = useLedgerStore((state) => state.currentMonth);
  const viewMode = useLedgerStore((state) => state.viewMode);
  const { prevMonth, nextMonth, setViewMode } = useLedgerActions();

  // 현재 선택된 월의 yearMonth 계산
  const yearMonth = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = currentMonth;
    return `${year}-${String(month).padStart(2, '0')}`;
  }, [currentMonth]);

  // 월 소비 내역 요약 API 호출
  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['transactions', 'summary', yearMonth],
    queryFn: () => getMonthlySummaryApi(yearMonth),
  });

  // 최다 소비 항목 API 호출
  const { data: topCategoryData, isLoading: isTopCategoryLoading } = useQuery({
    queryKey: ['transactions', 'top-category', yearMonth],
    queryFn: () => getTopCategoriesApi({ yearMonth, limit: 1 }),
  });

  // 일별 수입/지출 합계 API 호출 (오늘 지출 계산용)
  const { data: dailyData, isLoading: isDailyLoading } = useQuery({
    queryKey: ['transactions', 'by-day', yearMonth],
    queryFn: () => getDailyTransactionsApi(yearMonth),
  });

  // 오늘 날짜의 지출 계산
  const todayExpense = useMemo(() => {
    if (!dailyData?.result) return 0;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const todayData = dailyData.result.find((item) => item.date === today);
    return todayData?.totalExpense ?? 0;
  }, [dailyData]);

  // 총 지출 금액
  const totalExpense = summaryData?.result?.totalExpense ?? 0;

  // 전월 대비 증감액
  const diffFromLastMonth = Number(
    (summaryData?.result as { diffFromLastMonth?: number } | null)?.diffFromLastMonth ?? 0
  );
  const isLess = diffFromLastMonth < 0;
  const diffAmountText = formatCurrency(Math.abs(diffFromLastMonth), false);

  // 최다 소비 항목
  const topCategoryName = topCategoryData?.result?.[0]?.categoryName ?? '';

  const isLoading = isSummaryLoading || isTopCategoryLoading || isDailyLoading;

  return (
    <div className={cn('flex flex-col w-full h-full bg-neutral-0 mt-[20px] px-[20px] gap-[20px]')}>
      <div className={cn('flex flex-col gap-[20px]')}>
        <div className={cn('flex flex-col gap-[12px]')}>
          <div className={cn('flex items-center gap-[8px] py-[4px]')}>
            <div
              className={cn(
                'w-[18px] h-[18px] flex items-center justify-center ',
                'text-neutral-50 hover:text-neutral-90 cursor-pointer'
              )}
            >
              <PolygonButtonIcon onClick={prevMonth} className={cn('fill-current')} />
            </div>

            <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
              {currentMonth}월
            </Typography>

            <div
              className={cn(
                'w-[18px] h-[18px] flex items-center justify-center',
                'text-neutral-50 hover:text-neutral-90 cursor-pointer'
              )}
            >
              <PolygonButtonIcon className={cn('rotate-180')} onClick={nextMonth} />
            </div>
          </div>

          <div className={cn('flex flex-col gap-[4px]')}>
            {isLoading ? (
              <Skeleton className="w-32 h-8 rounded" />
            ) : (
              <Typography style="text-headline-1-22-bold" className={cn('text-neutral-100')}>
                {formatCurrency(totalExpense)}
              </Typography>
            )}
            {isLoading ? (
              <Skeleton className="w-48 h-4 rounded" />
            ) : (
              <Typography style="text-body-3-13-medium" className={cn('text-neutral-60')}>
                지난 달 같은 기간보다 <span className={cn('font-bold text-neutral-80')}>{diffAmountText}원</span>{' '}
                {isLess ? '덜' : '더'} 썼어요
              </Typography>
            )}
          </div>
        </div>

        <div className={cn('flex flex-col w-full bg-neutral-10 rounded-[8px] gap-[8px] px-[12px] py-[16px]')}>
          <div className={cn('flex justify-between')}>
            <Typography style="text-body-2-14-regular" className={cn('text-neutral-70')}>
              오늘 지출
            </Typography>
            {isLoading ? (
              <Skeleton className="w-16 h-5 rounded" />
            ) : (
              <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
                {formatCurrency(todayExpense, false)} 원
              </Typography>
            )}
          </div>

          <div className={cn('flex justify-between items-center')}>
            <Typography style="text-body-2-14-medium" className={cn('text-neutral-70')}>
              최다 소비항목
            </Typography>
            {isLoading ? (
              <Skeleton className="w-12 h-5 rounded" />
            ) : (
              <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
                {topCategoryName || '-'}
              </Typography>
            )}
          </div>
        </div>
      </div>

      <div className={cn('h-[8px] bg-neutral-10 mx-[-20px]')} />

      <div className={cn('flex flex-col gap-[12px] w-full h-full')}>
        <ViewToggleButton mode={viewMode} onToggle={setViewMode} leftText="목록" rightText="달력" />
      </div>

      {viewMode === 'list' ? <LedgerList /> : <LedgerCalendar />}
    </div>
  );
};
