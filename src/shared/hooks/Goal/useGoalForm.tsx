import { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate, useBlocker } from 'react-router-dom';
import { useGoalStep } from './useGoalStep';
import { useGoalFormFields } from './useGoalFormFields';
import { useGoalModalControl } from './useGoalModalControl';
import type { GoalStep, GoalFormField, SelectedAccount, SelectedIcon, UseGoalFormOptions } from './goalForm.types';

// 타입 재export (기존 코드와의 호환성 유지)
export type { GoalStep, GoalFormField, SelectedAccount, SelectedIcon, UseGoalFormOptions };
export type { GoalFormMode } from './goalForm.types';

export function useGoalForm(options: UseGoalFormOptions = {}) {
  const navigate = useNavigate();
  const mode = options.mode ?? 'create';
  const isEdit = mode === 'edit';

  // 단계 관리
  const { currentStep, setCurrentStep, goToNext, goToBack } = useGoalStep({ initialStep: 1 });

  // 입력 필드 관리
  const {
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
  } = useGoalFormFields({
    mode,
    initialValues: options.initialValues,
  });

  // 이탈 방지 모달 상태
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // useBlocker를 사용한 SPA 내 네비게이션 이탈 방지
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname && !isLeaveModalOpen
  );

  // blocker 상태가 변경될 때 모달 표시
  useEffect(() => {
    if (blocker.state === 'blocked') {
      setIsLeaveModalOpen(true);
      setPendingNavigation(() => {
        return () => {
          blocker.proceed?.();
          setIsLeaveModalOpen(false);
        };
      });
    }
  }, [blocker]);

  // 브라우저 이탈 방지 (새로고침, 탭 닫기 등)
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // 이탈 방지 모달 핸들러
  const handleLeaveConfirm = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    } else {
      blocker.proceed?.();
    }
    setIsLeaveModalOpen(false);
  }, [pendingNavigation, blocker]);

  const handleLeaveCancel = useCallback(() => {
    blocker.reset?.();
    setIsLeaveModalOpen(false);
    setPendingNavigation(null);
  }, [blocker]);

  // 모달 제어
  const {
    selectedAccount,
    selectedIcon,
    isAccountSheetOpen,
    isIconSheetOpen,
    accountDisplay,
    openAccountSheet,
    closeAccountSheet,
    openIconSheet,
    closeIconSheet,
    handleAccountSelect: baseHandleAccountSelect,
    handleIconSelect,
  } = useGoalModalControl({
    initialAccount: options.initialValues?.selectedAccount,
  });

  // 계좌 선택 핸들러 (단계 이동 로직 포함)
  const handleAccountSelect = useCallback(
    (account: SelectedAccount) => {
      baseHandleAccountSelect(account);
      resetInputStarted();
      if (!isEdit) {
        goToNext(6);
      }
    },
    [baseHandleAccountSelect, resetInputStarted, isEdit, goToNext]
  );

  // 뒤로가기 핸들러
  const handleBack = useCallback(() => {
    if (options.onBack) {
      options.onBack();
      return;
    }
    if (isEdit) {
      navigate(-1);
      return;
    }
    if (currentStep > 1) {
      goToBack();
      resetInputStarted();
      return;
    }
    navigate('/goal/create');
  }, [currentStep, isEdit, navigate, options, goToBack, resetInputStarted]);

  // 다음 단계 핸들러
  const handleNext = useCallback(() => {
    if (isEdit) return;

    if (currentStep < 5) {
      // 1~4단계: 유효성 검사 후 다음 단계로
      if (!isFieldValid(currentStep)) return;
      goToNext();
      resetInputStarted();
      return;
    }

    if (currentStep === 5) {
      // 5단계: 계좌 선택 시트 오픈
      openAccountSheet();
      return;
    }

    if (currentStep === 6) {
      // 6단계: 7단계로 이동
      goToNext(7);
      resetInputStarted();
      return;
    }

    // 7단계: 완료 페이지로 이동
    if (currentStep === 7) {
      navigate('/goal/create/complete');
    }
  }, [currentStep, isEdit, navigate, openAccountSheet, goToNext, resetInputStarted, isFieldValid]);

  // 버튼 텍스트
  const primaryButtonText = useMemo(() => {
    if (currentStep === 6) return '다음으로';
    if (currentStep === 7) return '추가하기';
    return '다음으로';
  }, [currentStep]);

  // 버튼 표시 여부
  const shouldShowPrimaryButton = useMemo(() => {
    if (currentStep === 5) return false;
    if (currentStep === 6) return selectedAccount !== null && fields.goalAmount.length > 0;
    if (currentStep === 7) return selectedIcon !== null;

    const currentValue = getCurrentStepValue(currentStep);
    return hasInputStarted && currentValue.length > 0;
  }, [currentStep, selectedAccount, selectedIcon, fields.goalAmount, hasInputStarted, getCurrentStepValue]);

  // 버튼 disabled 상태 (Step별 Validation 적용)
  const isPrimaryButtonDisabled = useMemo(() => {
    if (currentStep === 5) return false;
    if (currentStep === 6) return !(selectedAccount !== null && fields.goalAmount.length > 0);
    if (currentStep === 7) return selectedIcon === null;

    // 1~4단계: 해당 단계의 유효성 검사 결과에 따라 disabled
    if (currentStep >= 1 && currentStep <= 4) {
      return !isStepValid(currentStep);
    }

    return false;
  }, [currentStep, selectedAccount, selectedIcon, fields.goalAmount, isStepValid]);

  // 제출 가능 여부 (edit 모드용)
  const canSubmit = useMemo(() => {
    if (!isEdit) return false;
    return isFormValid && selectedAccount !== null;
  }, [isEdit, isFormValid, selectedAccount]);

  const submitButtonText = useMemo(() => (isEdit ? '수정하기' : ''), [isEdit]);

  // 제출 핸들러
  const handleSubmit = useCallback(async () => {
    await options.onSubmit?.({
      goalName: fields.goalName,
      startDate: fields.startDate,
      endDate: fields.endDate,
      goalAmount: fields.goalAmount, // 포맷팅된 값 전달 (서버에서 parseAmountToNumber 사용)
      selectedAccount,
    });
  }, [fields, selectedAccount, options]);

  // 기존 인터페이스 유지 (개별 필드 반환)
  return {
    currentStep,
    setCurrentStep,
    goalName: fields.goalName,
    startDate: fields.startDate,
    endDate: fields.endDate,
    goalAmount: fields.goalAmount,
    selectedAccount,
    selectedIcon,
    accountDisplay,
    isAccountSheetOpen,
    isIconSheetOpen,
    openAccountSheet,
    closeAccountSheet,
    openIconSheet,
    closeIconSheet,
    updateField,
    handleBack,
    handleNext,
    handleAccountSelect,
    handleIconSelect,
    shouldShowPrimaryButton,
    isPrimaryButtonDisabled,
    primaryButtonText,
    canSubmit,
    submitButtonText,
    handleSubmit,
    // Dirty 상태 및 유틸 함수 추가
    isDirty,
    getRawGoalAmount,
    isStepValid,
    getStepValidation,
    fieldErrors,
    // 이탈 방지 관련
    isLeaveModalOpen,
    handleLeaveConfirm,
    handleLeaveCancel,
  };
}
