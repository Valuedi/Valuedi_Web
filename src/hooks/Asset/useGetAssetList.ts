import { AccountData } from '@/features/asset/constants/account';

export const useGetAssetList = () => {
  const totalAsset = 526387;

  const bankAccounts: AccountData[] = [
    { id: 1, name: 'KB국민ONE통장', amount: 11125023, bankName: 'KB국민은행', iconBg: 'bank-kb' },
    { id: 2, name: 'KB국민ONE통장', amount: 11125023, bankName: '새마을은행', iconBg: 'bank-saemaul' },
    { id: 3, name: 'KB국민ONE통장', amount: 11125023, bankName: 'Kbank은행', iconBg: 'bank-kbank' },
    { id: 4, name: 'KB국민ONE통장', amount: 11125023, bankName: '씨티은행', iconBg: 'bank-citi' },
    { id: 5, name: 'KB국민ONE통장', amount: 11125023, bankName: '은행나무은행', iconBg: 'bank-plus' },
  ];

  const cardAccounts: AccountData[] = [
    { id: 1, name: 'KB국민ONE카드', amount: 11125023, cardName: 'KB국민카드', iconBg: 'bank-kb' },
    { id: 2, name: 'KB국민ONE카드', amount: 11125023, cardName: '전북카드', iconBg: 'bank-gwangju_jeonbuk' },
    { id: 3, name: 'KB국민ONE카드', amount: 11125023, cardName: '새마을카드', iconBg: 'bank-saemaul' },
    { id: 4, name: 'KB국민ONE카드', amount: 11125023, cardName: 'ibk카드', iconBg: 'bank-ibk' },
  ];

  return {
    totalAsset,
    bankAccounts,
    cardAccounts,
  };
};
