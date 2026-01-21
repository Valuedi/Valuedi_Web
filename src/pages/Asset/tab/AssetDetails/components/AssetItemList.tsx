import { cn } from '@/utils/cn';
import { Typography } from '@/components/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import { CATEGORY_STYLES } from '@/features/asset/constants/category';

interface TransactionItemProps {
  title: string;
  subTitle: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

const TransactionIcon = ({ category }: { category: string }) => {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.default;
  return (
    <div className={cn('w-[32px] h-[32px] rounded-[8px] p-[4px] flex items-center justify-center', style.bgColor)}>
      <img src={style.icon} alt="icon" className="w-[20px] h-[20px] object-contain" />
    </div>
  );
};

export const AssetItemList = ({ title, subTitle, amount, type, category }: TransactionItemProps) => {
  return (
    <div className="flex items-center justify-between w-full py-[8px]">
      <div className="flex items-center gap-[8px]">
        <TransactionIcon category={category} />

        <div className="flex flex-col gap-[2px]">
          <Typography
            style="text-body-2-14-semi-bold"
            className={cn(type === 'expense' ? 'text-primary-heavy' : 'text-neutral-90')}
          >
            {title}
          </Typography>
          <Typography style="text-caption-1-12-regular" className="text-neutral-50">
            {subTitle}
          </Typography>
        </div>
      </div>

      <Typography
        style="text-body-2-14-semi-bold"
        className={cn(type === 'expense' ? 'text-primary-heavy' : 'text-neutral-90')}
      >
        {formatCurrency(amount)}
      </Typography>
    </div>
  );
};
