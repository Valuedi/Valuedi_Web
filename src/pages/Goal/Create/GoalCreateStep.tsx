import type { ChangeEvent, KeyboardEvent } from 'react';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import AuthInput from '@/shared/components/login/AuthInput';
import AccountLinkBottomSheet from '@/shared/components/goal/list/AccountLinkBottomSheet';
import GoalCreateStepHeader from '@/shared/components/goal/create/GoalCreateStepHeader';
import GoalCreateStepFooter from '@/shared/components/goal/create/GoalCreateStepFooter';
import { useGoalForm, type GoalStep, type GoalFormField } from '@/shared/hooks/Goal/useGoalCreateForm';

type StepField =
  | {
      kind: 'input';
      field: GoalFormField;
      label: string;
      placeholder?: string;
      readOnly?: boolean;
      isGrayBg?: boolean;
      clickable?: boolean;
    }
  | {
      kind: 'account';
      label: string;
      placeholder: string;
      readOnly?: boolean;
      isGrayBg?: boolean;
    };

const GoalCreateStep = () => {
  const {
    currentStep,
    goalName,
    startDate,
    endDate,
    goalAmount,
    accountDisplay,
    isAccountSheetOpen,
    openAccountSheet,
    closeAccountSheet,
    updateField,
    handleBack,
    handleNext,
    handleAccountSelect,
    shouldShowPrimaryButton,
    primaryButtonText,
  } = useGoalForm();

  const steps: Record<GoalStep, StepField[]> = {
    1: [
      {
        kind: 'input',
        field: 'goalName',
        label: '목표 이름',
        placeholder: '목표명을 작성 해주세요',
      },
    ],
    2: [
      { kind: 'input', field: 'startDate', label: '시작일', placeholder: 'YYYY-MM-DD' },
      { kind: 'input', field: 'goalName', label: '목표 이름', readOnly: true, isGrayBg: true },
    ],
    3: [
      { kind: 'input', field: 'endDate', label: '종료일', placeholder: 'YYYY-MM-DD' },
      { kind: 'input', field: 'startDate', label: '시작일', readOnly: true, isGrayBg: true },
      { kind: 'input', field: 'goalName', label: '목표 이름', readOnly: true, isGrayBg: true },
    ],
    4: [
      { kind: 'input', field: 'goalAmount', label: '목표 금액', placeholder: '목표액은 얼마인가요?' },
      { kind: 'input', field: 'endDate', label: '종료일', readOnly: true, isGrayBg: true },
      { kind: 'input', field: 'startDate', label: '시작일', readOnly: true, isGrayBg: true },
      { kind: 'input', field: 'goalName', label: '목표 이름', readOnly: true, isGrayBg: true },
    ],
    5: [
      { kind: 'account', label: '계좌 연동', placeholder: '계좌를 선택해주세요', readOnly: false, isGrayBg: false },
      { kind: 'input', field: 'goalAmount', label: '목표 금액', readOnly: true, isGrayBg: true },
      { kind: 'input', field: 'endDate', label: '종료일', readOnly: true, isGrayBg: true },
      { kind: 'input', field: 'startDate', label: '시작일', readOnly: true, isGrayBg: true },
      { kind: 'input', field: 'goalName', label: '목표 이름', readOnly: true, isGrayBg: true },
    ],
    6: [
      { kind: 'account', label: '계좌 연동', placeholder: '계좌를 선택해주세요', readOnly: true, isGrayBg: true },
      { kind: 'input', field: 'goalAmount', label: '목표 금액', placeholder: '목표액은 얼마인가요?' },
      { kind: 'input', field: 'endDate', label: '종료일', readOnly: true, isGrayBg: true },
      { kind: 'input', field: 'startDate', label: '시작일', readOnly: true, isGrayBg: true },
      { kind: 'input', field: 'goalName', label: '목표 이름', readOnly: true, isGrayBg: true },
    ],
  };

  const valuesByField: Record<GoalFormField, string> = {
    goalName,
    startDate,
    endDate,
    goalAmount,
  };

  // 엔터 키 핸들러: 유효성 검사 통과 시 다음 단계로 이동
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, field: GoalFormField) => {
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      e.preventDefault();
      // 현재 단계의 첫 번째 입력 필드이고, 유효한 값이 있을 때만 다음 단계로
      const currentStepFields = steps[currentStep];
      const firstInputField = currentStepFields.find((item) => item.kind === 'input' && !item.readOnly);

      if (firstInputField && firstInputField.kind === 'input' && firstInputField.field === field) {
        // 유효성 검사: 값이 있고 에러가 없어야 함
        const value = valuesByField[field];
        if (value.trim().length > 0) {
          handleNext();
        }
      }
    }
  };

  return (
    <>
      <MobileLayout className="p-0 overflow-hidden bg-white">
        <div className="flex flex-col w-full min-h-screen">
          <GoalCreateStepHeader currentStep={currentStep} onBack={handleBack} />

          <main className="flex-1 flex flex-col px-[20px] pt-[40px] pb-[32px] overflow-y-auto">
            <div className="flex flex-col gap-6">
              {steps[currentStep].map((item, idx) => {
                if (item.kind === 'account') {
                  const value = accountDisplay;
                  const readOnly = item.readOnly ?? false;
                  const isGrayBg = item.isGrayBg ?? false;

                  return (
                    <div
                      key={`account-${idx}`}
                      onClick={!readOnly ? openAccountSheet : undefined}
                      className={!readOnly ? 'cursor-pointer' : ''}
                    >
                      <AuthInput
                        label={item.label}
                        name="linkedAccount"
                        value={value}
                        onChange={() => {}}
                        placeholder={item.placeholder}
                        readOnly={readOnly}
                        isGrayBg={isGrayBg}
                        width="full"
                        className={!readOnly ? 'cursor-pointer' : ''}
                      />
                    </div>
                  );
                }

                const value = valuesByField[item.field];
                const readOnly = item.readOnly ?? false;
                const placeholder = item.placeholder;

                return (
                  <AuthInput
                    key={`${item.field}-${idx}`}
                    label={item.label}
                    name={item.field}
                    value={value}
                    onChange={
                      readOnly
                        ? () => {}
                        : (e: ChangeEvent<HTMLInputElement>) => updateField(item.field, e.target.value)
                    }
                    onKeyDown={
                      readOnly ? undefined : (e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, item.field)
                    }
                    placeholder={placeholder}
                    readOnly={readOnly}
                    isGrayBg={item.isGrayBg}
                    width="full"
                  />
                );
              })}
            </div>
          </main>

          <GoalCreateStepFooter isVisible={shouldShowPrimaryButton} buttonText={primaryButtonText} onClick={handleNext} />
        </div>
      </MobileLayout>

      <AccountLinkBottomSheet isOpen={isAccountSheetOpen} onClose={closeAccountSheet} onSelect={handleAccountSelect} />
    </>
  );
};

export default GoalCreateStep;
