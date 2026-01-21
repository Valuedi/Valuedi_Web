import { cn } from '@/utils/cn';
import { Typography } from '@/components/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import kbIcon from '@/assets/icons/bank/kb.svg';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useNavigate } from 'react-router-dom';
import BackPageGNB from '@/components/gnb/BackPageGNB';
import { AssetItemList } from './components/AssetItemList';
import { AssetDailyHeader } from './components/AssetDailyHeader';
import { useGetAccountDetail } from '@/hooks/Asset/useGetAccountDetail';
import { ColorToken, getColorToken } from '@/styles/design-system';

const BankIcon = ({ bgColor }: { bgColor: ColorToken }) => (
  <div
    className={cn('w-[32px] h-[32px] rounded-[8px] flex items-center justify-center')}
    style={{ backgroundColor: getColorToken(bgColor) }}
  >
    <img src={kbIcon} alt="은행 아이콘" className="w-[22px] h-[22px] object-contain" />
  </div>
);

export const AssetAccountDetailPage = () => {
  const navigate = useNavigate();
  const { accountInfo, transactionHistory, totalCount } = useGetAccountDetail();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <MobileLayout className={cn('bg-neutral-0')}>
      <div className={cn('flex flex-col h-full bg-neutral-0')}>
        <div className={cn('sticky top-0 z-10 w-full')}>
          <BackPageGNB
            className={cn('bg-neutral-0')}
            text=""
            titleColor="text-neutral-90"
            title={accountInfo.bankName}
            onBack={handleBack}
          />
        </div>

        <div
          className={cn('flex flex-col p-[20px] w-full h-[134px] gap-[12px]')}
          style={{ backgroundColor: getColorToken(accountInfo.bgColor) }}
        >
          <BankIcon bgColor={accountInfo.bgColor} />

          <div className={cn('flex flex-col gap-[4px]')}>
            <Typography style="text-caption-1-12-regular" className={cn('text-neutral-70')}>
              {accountInfo.accountNumber}
            </Typography>
            <Typography style="text-headline-1-22-bold" className={cn('text-neutral-90')}>
              {formatCurrency(accountInfo.balance)}
            </Typography>
          </div>
        </div>

        <div className={cn('flex-1 flex flex-col px-[20px] gap-[12px] mt-[20px]')}>
          <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
            총 {totalCount}건
          </Typography>

          <div className={cn('flex flex-col gap-[12px]')}>
            {transactionHistory.map((group, groupIndex) => (
              <div key={groupIndex} className={cn('flex flex-col')}>
                <AssetDailyHeader date={group.date} dailyTotal={group.dailyTotal} />

                <div className={cn('flex flex-col gap-[8px]')}>
                  {group.items.map((item) => (
                    <AssetItemList
                      key={item.id}
                      title={item.title}
                      subTitle={item.sub}
                      amount={item.amount}
                      type={item.type as 'income' | 'expense'}
                      category={item.category}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};
