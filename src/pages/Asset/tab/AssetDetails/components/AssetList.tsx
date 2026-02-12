import { useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/typography';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import kbIcon from '@/assets/icons/bank/kb.svg';
import BankPlusIcon from '@/assets/icons/asset/BankPlus.svg';
import CardPlusIcon from '@/assets/icons/asset/CardPlus.svg';
import { MoreViewButton } from '@/shared/components/buttons';
import { useNavigate } from 'react-router-dom';
import { ColorToken, getColorToken } from '@/shared/styles/design-system';
import CheckDownIcon from '@/assets/icons/CheckDown.svg?react';
import { useGetAssetList } from '@/shared/hooks/Asset/useGetAssetList';

const BankIcon = ({ bgColor }: { bgColor: ColorToken }) => (
  <div
    className={cn('w-[32px] h-[32px] rounded-[8px] flex items-center justify-center')}
    style={{ backgroundColor: getColorToken(bgColor) }}
  >
    <img src={kbIcon} alt="은행 아이콘" className="w-[22px] h-[22px] object-contain" />
  </div>
);

const CardIcon = ({ bgColor }: { bgColor: ColorToken }) => (
  <div
    className={cn('w-[32px] h-[40px] rounded-[8px] flex items-center justify-center')}
    style={{ backgroundColor: getColorToken(bgColor) }}
  >
    <img src={kbIcon} alt="카드 아이콘" className="w-[22px] h-[22px] object-contain" />
  </div>
);

export const AssetList = () => {
  const navigate = useNavigate();
  const { bankAccounts, cardAccounts, totalAsset } = useGetAssetList();

  const [isBankExpanded, setIsBankExpanded] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  return (
    <div className={cn('flex flex-col gap-[8px] px-[20px] md:px-[32px] lg:px-[40px] mt-[20px]')}>
      <div className={cn('rounded-[8px] px-[12px] py-[16px] gap-[2px]')}>
        <div className={cn('flex flex-col gap-[2px]')}>
          <Typography style="text-body-2-14-regular" className="text-neutral-70">
            총 자산
          </Typography>
          <Typography style="text-headline-1-22-semi-bold" className="text-neutral-90">
            {formatCurrency(totalAsset)}
          </Typography>
        </div>
      </div>

      <div className={cn('flex flex-col rounded-[8px] px-[12px] py-[16px] gap-[16px]')}>
        <Typography style="text-body-2-14-regular" className="text-neutral-70">
          연결된 은행
        </Typography>
        <div className={cn('flex flex-col gap-[8px]')}>
          {(isBankExpanded ? bankAccounts : bankAccounts.slice(0, 4)).map((account) => (
            <div key={account.id} className={cn('flex items-center justify-between py-[8px]')}>
              <div className={cn('flex items-center gap-[8px]')}>
                <BankIcon bgColor={account.iconBg} />
                <div className={cn('flex flex-col gap-[2px]')}>
                  <Typography style="text-body-2-14-semi-bold" className="text-neutral-90">
                    {formatCurrency(account.amount)}
                  </Typography>
                  <Typography style="text-caption-1-12-regular" className="text-neutral-70">
                    {account.name}
                  </Typography>
                </div>
              </div>
              <div className="w-[18px] h-[18px] flex items-center justify-center">
                <MoreViewButton onClick={() => navigate(`/asset/account/${account.id}`)} />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsBankExpanded(!isBankExpanded)}
          className={cn(
            'flex items-center justify-center gap-[8px] border border-neutral-10 rounded-[4px] p-[8px] shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)]'
          )}
        >
          <Typography style="text-body-2-14-regular" className="text-neutral-70 text-center">
            {isBankExpanded ? '은행 목록 접기' : '은행 목록 더보기'}
          </Typography>
          <CheckDownIcon className={cn('text-neutral-70', isBankExpanded && 'rotate-180')} />
        </button>
      </div>

      <div className={cn('flex flex-col rounded-[8px] px-[12px] py-[16px] gap-[16px]')}>
        <Typography style="text-body-2-14-regular" className="text-neutral-70">
          연결된 카드
        </Typography>
        <div className={cn('flex flex-col gap-[8px]')}>
          {(isCardExpanded ? cardAccounts : cardAccounts.slice(0, 4)).map((card) => (
            <div key={card.id} className={cn('flex items-center justify-between py-[8px]')}>
              <div className={cn('flex items-center gap-[8px]')}>
                <CardIcon bgColor={card.iconBg} />
                <div className={cn('flex flex-col gap-[2px]')}>
                  <Typography style="text-body-2-14-semi-bold" className="text-neutral-90">
                    {formatCurrency(card.amount)}
                  </Typography>
                  <Typography style="text-caption-1-12-regular" className="text-neutral-70">
                    {card.name}
                  </Typography>
                </div>
              </div>
              <div className="w-[18px] h-[18px] flex items-center justify-center">
                <MoreViewButton onClick={() => navigate(`/asset/account/${card.id}`)} />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsCardExpanded(!isCardExpanded)}
          className={cn(
            'flex items-center justify-center gap-[8px] border border-neutral-10 rounded-[4px] p-[8px] shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)]'
          )}
        >
          <Typography style="text-body-2-14-regular" className="text-neutral-70 text-center">
            {isCardExpanded ? '카드 목록 접기' : '카드 목록 더보기'}
          </Typography>
          <CheckDownIcon className={cn('text-neutral-70', isCardExpanded && 'rotate-180')} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => navigate('/bank/start')}
        className={cn('flex items-center justify-between py-[8px] w-full')}
      >
        <div className={cn('flex items-center gap-[8px]')}>
          <div className={cn('w-[32px] h-[32px] rounded-[8px] flex items-center justify-center bg-bank-plus')}>
            <img src={BankPlusIcon} alt="은행 추가" className="w-[20px] h-[20px] object-contain opacity-70" />
          </div>
          <Typography style="text-body-2-14-semi-bold" className="text-neutral-90">
            은행 추가하기
          </Typography>
        </div>
        <MoreViewButton />
      </button>

      <button
        type="button"
        onClick={() => navigate('/card/start')}
        className={cn('flex items-center justify-between py-[8px] w-full')}
      >
        <div className={cn('flex items-center gap-[8px]')}>
          <div className={cn('w-[32px] h-[32px] rounded-[8px] flex items-center justify-center bg-atomic-yellow-95')}>
            <img src={CardPlusIcon} alt="카드 추가" className="w-[20px] h-[20px] object-contain opacity-70" />
          </div>
          <Typography style="text-body-2-14-semi-bold" className="text-neutral-90">
            카드 추가하기
          </Typography>
        </div>
        <MoreViewButton />
      </button>
    </div>
  );
};
