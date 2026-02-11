import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/typography';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { TransactionGroup } from '@/features/asset/constants/account';
import { AssetItemList } from './AssetItemList';
import { LoginButton } from '@/shared/components/buttons';

interface DailyTransactionSheetProps {
  data: TransactionGroup;
  onClose: () => void;
  currentMonth: number;
}

export const DailyTransactionSheet = ({ data, onClose, currentMonth }: DailyTransactionSheetProps) => {
  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-[12px] flex flex-col gap-[20px] px-[20px] animate-slide-up'
      )}
    >
      <div className={cn('flex justify-center gap-[10px] py-[10px]')}>
        <div className={cn('w-[80px] h-[2px] bg-neutral-50 rounded-full cursor-pointer')} onClick={onClose} />
      </div>

      <div className={cn('flex gap-[12px]')}>
        <Typography style="text-body-1-16-semi-bold" className={cn('text-neutral-90')}>
          {currentMonth + '월 ' + data.date}
        </Typography>
      </div>

      <div className={cn('flex flex-col gap-[4px]')}>
        <div className={cn('flex justify-between items-center py-[4px]')}>
          <Typography style="text-caption-1-12-regular" className={cn('text-neutral-90')}>
            총 {data.items.length}건
          </Typography>
          <Typography style="text-caption-1-12-regular" className={cn('text-neutral-70')}>
            {formatCurrency(data.dailyTotal)}
          </Typography>
        </div>

        <div className="w-full h-[1px] bg-neutral-10 my-[4px]" />

        <div className={cn('flex flex-col gap-[8px]')}>
          {data.items.slice(0, 7).map((item) => (
            <AssetItemList
              key={item.id}
              title={item.title}
              subTitle={item.sub}
              amount={item.amount}
              type={item.type}
              category={item.category}
            />
          ))}
        </div>
      </div>

      <div className={cn('flex pb-[20px] gap-[10px]')}>
        <LoginButton text="확인하기" onClick={onClose} />
      </div>
    </div>
  );
};
