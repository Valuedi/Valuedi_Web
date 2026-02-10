import { useState, useCallback, useEffect, useMemo } from 'react';
import type { GoalStep, GoalFormField, GoalFormValues, GoalFormMode } from './goalForm.types';
import { formatDateInput, formatAmountInput } from '@/utils/goal/goalHelpers';

export interface UseGoalFormFieldsOptions {
  mode?: GoalFormMode;
  initialValues?: Partial<GoalFormValues>;
}

export function useGoalFormFields(options: UseGoalFormFieldsOptions = {}) {
  const isEdit = options.mode === 'edit';
  const [fields, setFields] = useState<GoalFormValues>({
    goalName: options.initialValues?.goalName ?? '',
    startDate: options.initialValues?.startDate ?? '',
    endDate: options.initialValues?.endDate ?? '',
    goalAmount: options.initialValues?.goalAmount ?? '',
  });

  const [hasInputStarted, setHasInputStarted] = useState(false);

  // edit 모드: initialValues가 변경되면 폼 상태 동기화
  useEffect(() => {
    if (!isEdit || !options.initialValues) return;
    const iv = options.initialValues;
    if (iv.goalName !== undefined) setFields((prev) => ({ ...prev, goalName: iv.goalName ?? '' }));
    if (iv.startDate !== undefined) setFields((prev) => ({ ...prev, startDate: iv.startDate ?? '' }));
    if (iv.endDate !== undefined) setFields((prev) => ({ ...prev, endDate: iv.endDate ?? '' }));
    if (iv.goalAmount !== undefined) setFields((prev) => ({ ...prev, goalAmount: iv.goalAmount ?? '' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isEdit,
    options.initialValues?.goalName,
    options.initialValues?.startDate,
    options.initialValues?.endDate,
    options.initialValues?.goalAmount,
  ]);

  const markInputStarted = useCallback(
    (nextValue: string) => {
      if (!hasInputStarted && nextValue.length > 0) setHasInputStarted(true);
    },
    [hasInputStarted]
  );

  const updateField = useCallback(
    (field: GoalFormField, value: string) => {
      // 날짜 필드인 경우 자동 포맷팅 적용
      if (field === 'startDate' || field === 'endDate') {
        const formattedValue = formatDateInput(value);
        setFields((prev) => ({ ...prev, [field]: formattedValue }));
        markInputStarted(formattedValue);
      } else if (field === 'goalAmount') {
        // 금액 필드인 경우 자동 포맷팅 적용 (3자리마다 콤마)
        const formattedValue = formatAmountInput(value);
        setFields((prev) => ({ ...prev, [field]: formattedValue }));
        markInputStarted(formattedValue);
      } else {
        setFields((prev) => ({ ...prev, [field]: value }));
        markInputStarted(value);
      }
    },
    [markInputStarted]
  );

  const resetInputStarted = useCallback(() => {
    setHasInputStarted(false);
  }, []);

  // 단계별 필드 유효성 검사
  const isFieldValid = useCallback(
    (step: GoalStep): boolean => {
      switch (step) {
        case 1:
          return fields.goalName.trim().length > 0;
        case 2:
          return fields.startDate.trim().length > 0;
        case 3:
          return fields.endDate.trim().length > 0;
        case 4:
          return fields.goalAmount.trim().length > 0;
        default:
          return false;
      }
    },
    [fields]
  );

  // 현재 단계의 필드값 반환
  const getCurrentStepValue = useCallback(
    (step: GoalStep): string => {
      switch (step) {
        case 1:
          return fields.goalName;
        case 2:
          return fields.startDate;
        case 3:
          return fields.endDate;
        case 4:
          return fields.goalAmount;
        default:
          return '';
      }
    },
    [fields]
  );

  // 전체 폼 유효성 검사 (edit 모드용)
  const isFormValid = useMemo(() => {
    return (
      fields.goalName.trim().length > 0 &&
      fields.startDate.trim().length > 0 &&
      fields.endDate.trim().length > 0 &&
      fields.goalAmount.trim().length > 0
    );
  }, [fields]);

  return {
    fields,
    hasInputStarted,
    updateField,
    resetInputStarted,
    isFieldValid,
    getCurrentStepValue,
    isFormValid,
  };
}
