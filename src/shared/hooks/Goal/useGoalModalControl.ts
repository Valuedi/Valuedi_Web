import { useState, useCallback, useMemo } from 'react';
import type { SelectedAccount, SelectedIcon } from './goalForm.types';

export interface UseGoalModalControlOptions {
  initialAccount?: SelectedAccount | null;
}

export function useGoalModalControl(options: UseGoalModalControlOptions = {}) {
  const [selectedAccount, setSelectedAccount] = useState<SelectedAccount | null>(options.initialAccount ?? null);
  const [selectedIcon, setSelectedIcon] = useState<SelectedIcon | null>(null);
  const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false);
  const [isIconSheetOpen, setIsIconSheetOpen] = useState(false);

  const openAccountSheet = useCallback(() => setIsAccountSheetOpen(true), []);
  const closeAccountSheet = useCallback(() => setIsAccountSheetOpen(false), []);

  const openIconSheet = useCallback(() => setIsIconSheetOpen(true), []);
  const closeIconSheet = useCallback(() => setIsIconSheetOpen(false), []);

  const handleAccountSelect = useCallback(
    (account: SelectedAccount) => {
      setSelectedAccount(account);
      closeAccountSheet();
    },
    [closeAccountSheet]
  );

  const handleIconSelect = useCallback(
    (icon: SelectedIcon) => {
      setSelectedIcon(icon);
      closeIconSheet();
    },
    [closeIconSheet]
  );

  const accountDisplay = useMemo(() => {
    if (!selectedAccount) return '';
    return `${selectedAccount.bankName} | ${selectedAccount.accountNumber}`;
  }, [selectedAccount]);

  return {
    selectedAccount,
    selectedIcon,
    isAccountSheetOpen,
    isIconSheetOpen,
    accountDisplay,
    openAccountSheet,
    closeAccountSheet,
    openIconSheet,
    closeIconSheet,
    handleAccountSelect,
    handleIconSelect,
  };
}
