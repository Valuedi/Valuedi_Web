import { useGetAccountDetail } from '@/shared/hooks/Asset/useGetAccountDetail';
import { AssetDailyHeader } from './AssetDailyHeader';
import { AssetItemList } from './AssetItemList';

export const LedgerList = () => {
  const { transactionHistory } = useGetAccountDetail();
  return (
    <div className="flex flex-col gap-[12px]">
      {transactionHistory.map((group, index) => (
        <div key={index} className="flex flex-col">
          <AssetDailyHeader date={group.date} dailyTotal={group.dailyTotal} />

          <div className="flex flex-col gap-[8px]">
            {group.items.map((tx, idx) => (
              <AssetItemList
                key={`${group.day}-${tx.id}-${idx}`}
                title={tx.title}
                subTitle={tx.sub}
                amount={tx.amount}
                type={tx.type}
                category={tx.category}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
