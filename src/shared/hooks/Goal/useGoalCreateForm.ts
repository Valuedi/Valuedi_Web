import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateGoal, useLinkAccount } from '@/features/goal';
import { paths } from '@/router/paths';
import { formatDateInput, formatAmountInput } from '@/shared/utils/goal/goalHelpers';

export type GoalStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface SelectedAccount {
  id: string;
  bankName: string;
  accountNumber: string;
}

export type GoalFormField = 'goalName' | 'startDate' | 'endDate' | 'goalAmount';

export function useGoalForm() {
  const navigate = useNavigate();
  const createGoalMutation = useCreateGoal();
  const linkAccountMutation = useLinkAccount();

  const [currentStep, setCurrentStep] = useState<GoalStep>(1);
  const [goalName, setGoalName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<SelectedAccount | null>(null);

  const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false);
  const [hasInputStarted, setHasInputStarted] = useState(false);

  const accountDisplay = useMemo(() => {
    if (!selectedAccount) return '';
    return `${selectedAccount.bankName} | ${selectedAccount.accountNumber}`;
  }, [selectedAccount]);

  const openAccountSheet = useCallback(() => setIsAccountSheetOpen(true), []);
  const closeAccountSheet = useCallback(() => setIsAccountSheetOpen(false), []);

  const markInputStarted = useCallback(
    (nextValue: string) => {
      if (!hasInputStarted && nextValue.length > 0) setHasInputStarted(true);
    },
    [hasInputStarted]
  );

  const updateField = useCallback(
    (field: GoalFormField, value: string) => {
      switch (field) {
        case 'goalName':
          setGoalName(value);
          break;
        case 'startDate':
          // 날짜 자동 포맷팅 적용
          setStartDate(formatDateInput(value));
          break;
        case 'endDate':
          // 날짜 자동 포맷팅 적용
          setEndDate(formatDateInput(value));
          break;
        case 'goalAmount':
          // 금액 자동 포맷팅 적용 (3자리마다 콤마)
          setGoalAmount(formatAmountInput(value));
          break;
        default:
          break;
      }
      markInputStarted(value);
    },
    [markInputStarted]
  );

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as GoalStep);
      setHasInputStarted(false);
      return;
    }
    // 히스토리 스택에 중복을 방지하기 위해 replace 사용
    navigate('/goal/create', { replace: true });
  }, [currentStep, navigate]);

  const handleAccountSelect = useCallback((account: SelectedAccount) => {
    setSelectedAccount(account);
    setCurrentStep(6);
    setHasInputStarted(false);
  }, []);

  const handleNext = useCallback(async () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as GoalStep);
      setHasInputStarted(false);
      return;
    }

    if (currentStep === 5) {
      openAccountSheet();
      return;
    }

    if (currentStep === 6) {
      navigate(paths.goal.almostDone, {
        state: {
          goalName,
          startDate,
          endDate,
          goalAmount,
          selectedAccount,
        },
      });
      return;
    }
  }, [
    currentStep,
    navigate,
    openAccountSheet,
    createGoalMutation,
    linkAccountMutation,
    selectedAccount,
    goalName,
    startDate,
    endDate,
    goalAmount,
  ]);

  const primaryButtonText = useMemo(() => (currentStep === 6 ? '추가하기' : '다음으로'), [currentStep]);

  const shouldShowPrimaryButton = useMemo(() => {
    if (currentStep === 5) return false;
    if (currentStep === 6) return selectedAccount !== null && goalAmount.length > 0;

    const currentValue =
      currentStep === 1 ? goalName : currentStep === 2 ? startDate : currentStep === 3 ? endDate : goalAmount;

    return hasInputStarted && currentValue.length > 0;
  }, [currentStep, endDate, goalAmount, goalName, hasInputStarted, selectedAccount, startDate]);

  return {
    currentStep,
    setCurrentStep,
    goalName,
    startDate,
    endDate,
    goalAmount,
    selectedAccount,
    accountDisplay,

    // bottom sheet
    isAccountSheetOpen,
    openAccountSheet,
    closeAccountSheet,

    // actions
    updateField,
    handleBack,
    handleNext,
    handleAccountSelect,

    // footer
    shouldShowPrimaryButton,
    primaryButtonText,
  };
}
