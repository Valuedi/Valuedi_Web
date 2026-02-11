import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type {
  GoalStep,
  GoalFormField,
  GoalFormValues,
  GoalFormMode,
  GoalFormErrors,
  StepValidationResult,
} from './goalForm.types';
import { formatDateInput, formatAmountInput, parseAmountToNumber } from '@/shared/utils/goal/goalHelpers';

export interface UseGoalFormFieldsOptions {
  mode?: GoalFormMode;
  initialValues?: Partial<GoalFormValues>;
}

export function useGoalFormFields(options: UseGoalFormFieldsOptions = {}) {
  const isEdit = options.mode === 'edit';

  // 초기값 저장 (dirty 상태 비교용)
  const initialValuesRef = useRef<GoalFormValues>({
    goalName: options.initialValues?.goalName ?? '',
    startDate: options.initialValues?.startDate ?? '',
    endDate: options.initialValues?.endDate ?? '',
    goalAmount: options.initialValues?.goalAmount ?? '',
  });

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
    const newFields: GoalFormValues = {
      goalName: iv.goalName ?? '',
      startDate: iv.startDate ?? '',
      endDate: iv.endDate ?? '',
      goalAmount: iv.goalAmount ?? '',
    };

    // 초기값 업데이트
    initialValuesRef.current = newFields;
    setFields(newFields);
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

  // 필드별 에러 메시지 계산
  const fieldErrors = useMemo<GoalFormErrors>(() => {
    const errors: GoalFormErrors = {
      goalName: '',
      startDate: '',
      endDate: '',
      goalAmount: '',
    };

    // 목표 이름 검증
    if (fields.goalName.trim().length === 0) {
      errors.goalName = '';
    } else if (fields.goalName.trim().length < 2) {
      errors.goalName = '목표 이름은 2자 이상이어야 합니다.';
    } else if (fields.goalName.trim().length > 50) {
      errors.goalName = '목표 이름은 50자 이하여야 합니다.';
    }

    // 시작일 검증
    if (fields.startDate.trim().length === 0) {
      errors.startDate = '';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.startDate)) {
      errors.startDate = '올바른 날짜 형식이 아닙니다. (YYYY-MM-DD)';
    } else {
      const startDateObj = new Date(fields.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(startDateObj.getTime())) {
        errors.startDate = '올바른 날짜를 입력해주세요.';
      } else if (startDateObj < today) {
        errors.startDate = '시작일은 오늘 이후여야 합니다.';
      }
    }

    // 종료일 검증
    if (fields.endDate.trim().length === 0) {
      errors.endDate = '';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.endDate)) {
      errors.endDate = '올바른 날짜 형식이 아닙니다. (YYYY-MM-DD)';
    } else {
      const endDateObj = new Date(fields.endDate);
      if (isNaN(endDateObj.getTime())) {
        errors.endDate = '올바른 날짜를 입력해주세요.';
      } else if (fields.startDate && /^\d{4}-\d{2}-\d{2}$/.test(fields.startDate)) {
        const startDateObj = new Date(fields.startDate);
        if (endDateObj <= startDateObj) {
          errors.endDate = '종료일은 시작일보다 이후여야 합니다.';
        }
      }
    }

    // 목표 금액 검증
    if (fields.goalAmount.trim().length === 0) {
      errors.goalAmount = '';
    } else {
      const amount = parseAmountToNumber(fields.goalAmount);
      if (amount <= 0) {
        errors.goalAmount = '목표 금액을 입력해주세요.';
      } else if (amount > 1000000000) {
        errors.goalAmount = '목표 금액은 10억원 이하여야 합니다.';
      } else if (amount < 1000) {
        errors.goalAmount = '목표 금액은 1,000원 이상이어야 합니다.';
      }
    }

    return errors;
  }, [fields]);

  // 단계별 필드 유효성 검사 (기존 호환성 유지)
  const isFieldValid = useCallback(
    (step: GoalStep): boolean => {
      switch (step) {
        case 1:
          return fields.goalName.trim().length > 0 && !fieldErrors.goalName;
        case 2:
          return fields.startDate.trim().length > 0 && !fieldErrors.startDate;
        case 3:
          return fields.endDate.trim().length > 0 && !fieldErrors.endDate;
        case 4:
          return fields.goalAmount.trim().length > 0 && !fieldErrors.goalAmount;
        default:
          return false;
      }
    },
    [fields, fieldErrors]
  );

  // 단계별 유효성 검사 결과 (에러 메시지 포함)
  const getStepValidation = useCallback(
    (step: GoalStep): StepValidationResult => {
      switch (step) {
        case 1:
          return {
            isValid: fields.goalName.trim().length > 0 && !fieldErrors.goalName,
            error: fieldErrors.goalName,
          };
        case 2:
          return {
            isValid: fields.startDate.trim().length > 0 && !fieldErrors.startDate,
            error: fieldErrors.startDate,
          };
        case 3:
          return {
            isValid: fields.endDate.trim().length > 0 && !fieldErrors.endDate,
            error: fieldErrors.endDate,
          };
        case 4:
          return {
            isValid: fields.goalAmount.trim().length > 0 && !fieldErrors.goalAmount,
            error: fieldErrors.goalAmount,
          };
        default:
          return { isValid: false, error: '' };
      }
    },
    [fields, fieldErrors]
  );

  // 단계별 유효성 검사 (isStepValid) - 버튼 disabled에 사용 (기존 호환성 유지)
  const isStepValid = useMemo(() => {
    return (step: GoalStep): boolean => {
      return isFieldValid(step);
    };
  }, [isFieldValid]);

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

  // Dirty 상태: 초기값과 현재값이 다른지 확인
  const isDirty = useMemo(() => {
    const initial = initialValuesRef.current;
    return (
      fields.goalName !== initial.goalName ||
      fields.startDate !== initial.startDate ||
      fields.endDate !== initial.endDate ||
      fields.goalAmount !== initial.goalAmount
    );
  }, [fields]);

  // 금액의 raw 값 반환 (콤마 제거, 서버 전송용)
  const getRawGoalAmount = useCallback((): number => {
    if (!fields.goalAmount) return 0;
    const numbers = fields.goalAmount.replace(/,/g, '');
    const parsed = Number(numbers);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [fields.goalAmount]);

  return {
    fields,
    hasInputStarted,
    updateField,
    resetInputStarted,
    isFieldValid,
    isStepValid,
    getStepValidation,
    getCurrentStepValue,
    isFormValid,
    isDirty,
    getRawGoalAmount,
    fieldErrors,
  };
}
