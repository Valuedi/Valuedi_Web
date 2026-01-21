import { cn } from '@/utils/cn';
import { Typography } from '@/components/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import PolygonButtonIcon from '@/assets/icons/asset/PolygonButton.svg?react';
import { ViewToggleButton } from '@/components/buttons';
import { LedgerList } from './LedgerList';
import LedgerCalendar from './LedgerCalendar';
import { useLedgerActions, useLedgerStore } from '@/hooks/Asset/usetLedgerStore';

export const AssetLedger = () => {
  const currentMonth = useLedgerStore((state) => state.currentMonth);
  const viewMode = useLedgerStore((state) => state.viewMode);
  const { prevMonth, nextMonth, setViewMode } = useLedgerActions();

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
            <Typography style="text-headline-1-22-bold" className={cn('text-neutral-100')}>
              {formatCurrency(526387)}
            </Typography>
            <Typography style="text-body-3-13-medium" className={cn('text-neutral-60')}>
              지난 달 같은 기간보다 <span className={cn('font-bold text-neutral-80')}>10만원</span> 덜 썼어요
            </Typography>
          </div>
        </div>

        <div className={cn('flex flex-col w-full bg-neutral-10 rounded-[8px] gap-[8px] px-[12px] py-[16px]')}>
          <div className={cn('flex justify-between')}>
            <Typography style="text-body-2-14-regular" className={cn('text-neutral-70')}>
              오늘 지출
            </Typography>
            <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
              0 원
            </Typography>
          </div>

          <div className={cn('flex justify-between items-center')}>
            <Typography style="text-body-2-14-medium" className={cn('text-neutral-70')}>
              최다 소비항목
            </Typography>
            <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
              식비
            </Typography>
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
