import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/typography';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import kbIcon from '@/assets/icons/bank/kb.svg';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';
import { AssetItemList } from './components/AssetItemList';
import { AssetDailyHeader } from './components/AssetDailyHeader';
import { useGetAccountDetail } from '@/shared/hooks/Asset/useGetAccountDetail';
import { ColorToken, getColorToken } from '@/shared/styles/design-system';
import { BANKS } from '@/features/bank/constants/banks';
import { CARDS } from '@/features/card/constants/cards';
import {
  getBankIdFromOrganizationCode,
  getCardIdFromOrganizationCode,
} from '@/features/connection/constants/organizationCodes';

const getBankIconByOrganizationCode = (organizationCode?: string) => {
  if (!organizationCode) return kbIcon;
  const bankId = getBankIdFromOrganizationCode(organizationCode);
  return BANKS.find((bank) => bank.id === bankId)?.icon ?? kbIcon;
};

const getCardIconByOrganizationCode = (organizationCode?: string) => {
  if (!organizationCode) return kbIcon;
  const cardId = getCardIdFromOrganizationCode(organizationCode);
  return CARDS.find((card) => card.id === cardId)?.icon ?? kbIcon;
};

const BankIcon = ({ bgColor, iconSrc, alt }: { bgColor: ColorToken; iconSrc: string; alt: string }) => (
  <div
    className={cn('w-[32px] h-[32px] rounded-[8px] flex items-center justify-center')}
    style={{ backgroundColor: getColorToken(bgColor) }}
  >
    <img src={iconSrc} alt={alt} className="w-[22px] h-[22px] object-contain" />
  </div>
);

export const AssetAccountDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountInfo, transactionHistory, totalCount } = useGetAccountDetail();
  const balance = accountInfo.balance;
  const isBalanceUnavailable = balance == null;
  const isCardDetail = location.pathname.startsWith('/asset/card/');
  const iconSrc = isCardDetail
    ? getCardIconByOrganizationCode(accountInfo.organizationCode)
    : getBankIconByOrganizationCode(accountInfo.organizationCode);

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
          <BankIcon
            bgColor={accountInfo.bgColor}
            iconSrc={iconSrc}
            alt={isCardDetail ? '카드 아이콘' : '은행 아이콘'}
          />

          <div className={cn('flex flex-col gap-[4px]')}>
            <Typography style="text-caption-1-12-regular" className={cn('text-neutral-70')}>
              {accountInfo.accountNumber}
            </Typography>
            {isBalanceUnavailable ? (
              <div className={cn('flex items-center gap-[8px]')}>
                <Typography style="text-body-3-13-medium" className={cn('text-neutral-90')}>
                  승인 내역만 제공되는 카드예요
                </Typography>
                <span
                  className={cn(
                    'inline-flex items-center rounded-[999px] bg-white/70 px-[8px] py-[2px]',
                    'text-[11px] leading-[16px] font-pretendard font-medium text-neutral-70'
                  )}
                >
                  잔액 정보 없음
                </span>
              </div>
            ) : (
              <Typography style="text-headline-1-22-semi-bold" className={cn('text-neutral-90')}>
                {formatCurrency(balance)}
              </Typography>
            )}
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
                  {group.items.map((item, idx) => (
                    <AssetItemList
                      key={`${group.day}-${item.id}-${idx}`}
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
