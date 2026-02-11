import { useState } from 'react';
import { useGoalLedgers } from '@/features/goal';
import { getBankDisplayName } from '@/features/connection/constants/organizationCodes';
import { ledgerToTransactionItem, type TransactionItem } from '@/shared/utils/goal/ledgerHelpers';
import { useGoalDetailActions } from './useGoalDetailActions';

const LEDGERS_PAGE_SIZE = 20;

export function useAmountAchievedPage() {
  const actions = useGoalDetailActions();
  const { goalId, goalDetail } = actions;

  const [sortBy, setSortBy] = useState<'latest' | 'achieve'>('latest');
  const [selectedItem, setSelectedItem] = useState<TransactionItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { data: ledgersData, isLoading: ledgersLoading } = useGoalLedgers(goalId, {
    page: 0,
    size: LEDGERS_PAGE_SIZE,
  });

  const accountLabel =
    goalDetail?.result?.account != null
      ? `${getBankDisplayName(goalDetail.result.account.bankName)} ${goalDetail.result.account.accountNumber}`
      : '';

  const transactions: TransactionItem[] =
    ledgersData?.result?.content?.map((ledger) => ledgerToTransactionItem(ledger, accountLabel)) ?? [];

  const handleItemClick = (item: TransactionItem) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };

  return {
    ...actions,
    transactions,
    ledgersLoading,
    sortBy,
    setSortBy,
    selectedItem,
    isSheetOpen,
    setIsSheetOpen,
    handleItemClick,
  };
}
