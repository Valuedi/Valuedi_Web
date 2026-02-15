import { useState, useMemo } from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/typography';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { useGetAccountDetail } from '@/shared/hooks/Asset/useGetAccountDetail';
import { TransactionGroup } from '@/features/asset/constants/account';
import { DailyTransactionSheet } from './DailyTransactionSheet';
import { useLedgerStore } from '@/shared/hooks/Asset/usetLedgerStore';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const LedgerCalendar = () => {
  const currentMonth = useLedgerStore((state) => state.currentMonth);

  const currentYear = new Date().getFullYear();

  const { startDayIndex, totalDays } = useMemo(() => {
    // 해당 월의 1일 객체 생성
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    // 해당 월의 마지막 날 객체 생성 (다음 달의 0일은 이번 달의 마지막 날)
    const lastDay = new Date(currentYear, currentMonth, 0);

    return {
      startDayIndex: firstDay.getDay(), // 0(일) ~ 6(토)
      totalDays: lastDay.getDate(), // 28, 29, 30, 31 등 실재하는 일수
    };
  }, [currentYear, currentMonth]);

  const yearMonth = useMemo(() => {
    const year = new Date().getFullYear();
    return `${year}-${String(currentMonth).padStart(2, '0')}`;
  }, [currentMonth]);

  const { transactionHistory } = useGetAccountDetail({ yearMonth });

  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // 데이터를 미리 날짜별로 정리정돈 해주는 코드
  const calendarData = useMemo(() => {
    const dataMap: Record<number, TransactionGroup> = {};
    transactionHistory.forEach((group) => {
      if (group.day) {
        dataMap[group.day] = group;
      }
    });
    return dataMap;
  }, [transactionHistory]);

  const daysArray = [...Array(startDayIndex).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)];

  const selectedData = selectedDate ? calendarData[selectedDate] : null;

  return (
    <div className={cn('flex flex-col w-full')}>
      <div className={cn('grid grid-cols-7 w-full')}>
        {WEEKDAYS.map((day) => (
          <div key={day} className={cn('flex justify-center items-center py-[4px] gap-[4px]')}>
            <Typography style="text-caption-1-12-regular" className={cn('text-neutral-90')}>
              {day}
            </Typography>
          </div>
        ))}
      </div>

      <div className={cn('grid grid-cols-7 w-full py-[4px]')}>
        {daysArray.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} />;

          const data = calendarData[date];

          return (
            <div
              key={date}
              onClick={() => {
                if (data) setSelectedDate(date);
              }}
              className={cn('flex flex-col items-center h-[70px] py-[4px]', data && 'cursor-pointer')}
            >
              <div className={cn('flex gap-[4px] py-[8px]')}>
                <Typography style="text-body-2-14-medium" className={cn(data ? 'text-neutral-90' : 'text-neutral-50')}>
                  {date}
                </Typography>
              </div>

              {data && (
                <div className={cn('flex flex-col items-center')}>
                  {data.totalIncome > 0 && (
                    <span className={cn('text-[8px] leading-[12px] font-pretendard text-neutral-90')}>
                      +{formatCurrency(data.totalIncome, false)}
                    </span>
                  )}
                  {data.totalExpense > 0 && (
                    <span className={cn('text-[8px] leading-[12px] font-pretendard text-neutral-70')}>
                      -{formatCurrency(data.totalExpense, false)}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedData && (
        <>
          <div className="absolute inset-0 z-40 bg-neutral-90 opacity-[0.65]" onClick={() => setSelectedDate(null)} />

          <DailyTransactionSheet
            data={selectedData}
            onClose={() => setSelectedDate(null)}
            currentMonth={currentMonth}
          />
        </>
      )}
    </div>
  );
};

export default LedgerCalendar;
