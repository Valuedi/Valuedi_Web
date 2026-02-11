import { useMemo, useState } from 'react';
import BottomSheet from '@/shared/components/common/BottomSheet';
import { BaseButton } from '@/shared/components/buttons/BaseButton';
import { Typography } from '@/shared/components/typography';
import { useAllBankAccounts } from '@/features/asset';
import { useGoalUnlinkedAccounts } from '@/features/goal';
import { getBankDisplayName } from '@/features/connection/constants/organizationCodes';
import { BANKS } from '@/features/bank/constants/banks';

interface Account {
  id: string;
  bankName: string;
  accountNumber: string;
}

interface AccountLinkBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: Account) => void;
}

function getBankIconAndBg(bankNameOrCode: string): { icon: string | undefined; bgColor: string } {
  const displayName = getBankDisplayName(bankNameOrCode);
  const bank = BANKS.find(
    (b) =>
      displayName.includes(b.name.replace('은행', '').replace('카드', '')) ||
      b.name.includes(displayName.replace('은행', ''))
  );
  const colorMapping: Record<string, string> = {
    국민은행: 'kb',
    기업은행: 'ibk',
    신한은행: 'shinhan',
    농협은행: 'nh',
    우리은행: 'woori',
    수협은행: 'suhyup',
    하나은행: 'hana',
  };
  const colorId = colorMapping[displayName] ?? bank?.id;
  return {
    icon: bank?.icon,
    bgColor: colorId ? `var(--color-bank-${colorId})` : 'var(--color-neutral-5)',
  };
}

const AccountLinkBottomSheet = ({ isOpen, onClose, onSelect }: AccountLinkBottomSheetProps) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const { data: allAccounts, isLoading: loadingAll, error } = useAllBankAccounts(isOpen);
  const { data: unlinkedData, isLoading: loadingUnlinked } = useGoalUnlinkedAccounts(isOpen);

  const unlinkedAccountIds = useMemo(() => {
    const ids = new Set<number>();
    unlinkedData?.result?.accounts?.forEach((a) => ids.add(a.accountId));
    return ids;
  }, [unlinkedData]);

  const unlinkedDisplayMap = useMemo(() => {
    const map = new Map<number, string>();
    unlinkedData?.result?.accounts?.forEach((a) => map.set(a.accountId, a.accountDisplay));
    return map;
  }, [unlinkedData]);

  const accounts: Array<{
    id: string;
    bankName: string;
    accountNumber: string;
    isLinkable: boolean;
    accountDisplay?: string;
  }> = useMemo(() => {
    if (!allAccounts) return [];
    return allAccounts.map((acc) => ({
      id: acc.accountId.toString(),
      bankName: getBankDisplayName(acc.bankName),
      accountNumber: unlinkedDisplayMap.get(acc.accountId) ?? `${acc.accountName}`,
      isLinkable: unlinkedAccountIds.has(acc.accountId),
      accountDisplay: unlinkedDisplayMap.get(acc.accountId),
    }));
  }, [allAccounts, unlinkedAccountIds, unlinkedDisplayMap]);

  const isLoading = loadingAll || loadingUnlinked;

  const handleSelect = () => {
    if (selectedAccount) {
      onSelect({
        id: selectedAccount.id,
        bankName: selectedAccount.bankName,
        accountNumber: selectedAccount.accountNumber,
      });
      setSelectedAccount(null);
      onClose();
    }
  };

  const handleAccountClick = (account: (typeof accounts)[0]) => {
    if (!account.isLinkable) return;
    setSelectedAccount(
      selectedAccount?.id === account.id
        ? null
        : { id: account.id, bankName: account.bankName, accountNumber: account.accountNumber }
    );
  };

  const handleManualAdd = () => {
    console.log('수동 추가하기');
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="연결 계좌 연동">
      <div className="flex items-center justify-between mb-6">
        <div />
        <button onClick={handleManualAdd} className="flex items-center gap-1 text-sm text-neutral-70">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 2.66667V13.3333M2.66667 8H13.3333"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Typography style="text-body-3-13-regular" fontFamily="pretendard" color="neutral-70">
            수동 추가하기
          </Typography>
        </button>
      </div>

      <div className="mb-6 space-y-3 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8 text-neutral-60">
            <Typography style="text-body-2-14-regular" fontFamily="pretendard" color="neutral-60">
              계좌를 불러오는 중...
            </Typography>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <Typography style="text-body-2-14-regular" fontFamily="pretendard" className="text-red-500">
              계좌를 불러오는데 실패했습니다.
            </Typography>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-8 text-neutral-60">
            <Typography style="text-body-2-14-regular" fontFamily="pretendard" color="neutral-60">
              연결된 계좌가 없습니다.
            </Typography>
          </div>
        ) : (
          accounts.map((account) => {
            const { icon, bgColor } = getBankIconAndBg(account.bankName);
            const isSelected = selectedAccount?.id === account.id;
            const isDisabled = !account.isLinkable;

            return (
              <div
                key={account.id}
                onClick={() => handleAccountClick(account)}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                  isDisabled
                    ? 'bg-neutral-10 border-neutral-20 cursor-not-allowed opacity-60'
                    : isSelected
                      ? 'bg-primary-light border-primary-normal cursor-pointer'
                      : 'bg-white border-neutral-10 cursor-pointer hover:bg-neutral-5'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: bgColor }}
                >
                  {icon ? (
                    <img src={icon} alt="" className="w-6 h-6 object-contain" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-neutral-30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Typography
                    style="text-body-1-16-semi-bold"
                    fontFamily="pretendard"
                    className={isDisabled ? 'text-neutral-50' : 'text-neutral-90'}
                  >
                    {account.bankName}
                  </Typography>
                  <Typography
                    style="text-body-3-13-regular"
                    fontFamily="pretendard"
                    className={isDisabled ? 'text-neutral-40' : 'text-neutral-60'}
                  >
                    {account.accountNumber}
                  </Typography>
                  {isDisabled && (
                    <Typography
                      style="text-caption-1-12-regular"
                      fontFamily="pretendard"
                      className="text-neutral-50 mt-0.5"
                    >
                      이미 목표에 연결된 계좌입니다
                    </Typography>
                  )}
                </div>
                {account.isLinkable && isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary-normal flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6L4.5 8.5L10 3"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <BaseButton
        size="large"
        variant="primary"
        text="선택하기"
        onClick={handleSelect}
        fullWidth
        disabled={!selectedAccount || isLoading}
        typographyStyle="text-body-1-16-semi-bold"
        className="bg-primary-normal"
      />
    </BottomSheet>
  );
};

export default AccountLinkBottomSheet;
