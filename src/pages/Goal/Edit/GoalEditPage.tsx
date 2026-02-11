import type { ChangeEvent, KeyboardEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AuthInput from '@/shared/components/login/AuthInput';
import AccountLinkBottomSheet from '@/shared/components/goal/list/AccountLinkBottomSheet';
import GoalCreateStepFooter from '@/shared/components/goal/create/GoalCreateStepFooter';
import { paths } from '@/router/paths';
import { useGoalForm, type SelectedAccount } from '@/shared/hooks/Goal/useGoalForm';
import { useUpdateGoal, useGoalDetail } from '@/features/goal';
import type { GoalDetail } from '@/features/goal';
import { getBankDisplayName } from '@/features/connection/constants/organizationCodes';
import { formatDate, toInputDate, parseAmountToNumber } from '@/shared/utils/goal/goalHelpers';
import GoalEditPageLayout from './components/GoalEditPageLayout';
import GoalLeaveConfirmModal from '@/shared/components/goal/GoalLeaveConfirmModal';

type GoalEditLocationState = {
  goalName?: string;
  startDate?: string;
  endDate?: string;
  goalAmount?: string;
  selectedAccount?: SelectedAccount | null;
};

/** 상세(detail)가 있을 때만 마운트되어, 처음부터 저장된 값으로 폼 초기화 */
function GoalEditForm({
  id,
  detail,
  state,
  updateGoalMutation,
  onSuccess,
}: {
  id: string;
  detail: GoalDetail;
  state: GoalEditLocationState | null;
  updateGoalMutation: ReturnType<typeof useUpdateGoal>;
  onSuccess: () => void;
}) {
  const navigate = useNavigate();
  // 목표 상세 조회 응답에 포함된 시작일/종료일 사용
  const startDateFromApi = detail.startDate;
  const endDateFromApi = detail.endDate;

  const initialSelectedAccount: SelectedAccount =
    state?.selectedAccount ??
    (detail.account
      ? {
          id: 'linked',
          bankName: getBankDisplayName(detail.account.bankName),
          accountNumber: detail.account.accountNumber,
        }
      : { id: 'linked', bankName: '국민은행', accountNumber: '592802-04-****25' });

  const initialValues = {
    goalName: state?.goalName ?? detail.title ?? '',
    startDate: state?.startDate ?? toInputDate(startDateFromApi),
    endDate: state?.endDate ?? toInputDate(endDateFromApi),
    goalAmount: state?.goalAmount ?? (detail.targetAmount != null ? String(detail.targetAmount) : ''),
    selectedAccount: initialSelectedAccount,
  };

  const {
    goalName,
    startDate,
    endDate,
    goalAmount,
    accountDisplay,
    isAccountSheetOpen,
    openAccountSheet,
    closeAccountSheet,
    updateField,
    handleAccountSelect,
    canSubmit,
    submitButtonText,
    handleSubmit,
    fieldErrors,
    isLeaveModalOpen,
    handleLeaveConfirm,
    handleLeaveCancel,
  } = useGoalForm({
    mode: 'edit',
    initialValues,
    onSubmit: async (payload) => {
      const { goalName: title, startDate: start, endDate: end, goalAmount: amount } = payload;
      const targetAmount = parseAmountToNumber(amount);
      if (targetAmount === 0 && amount.trim().length > 0) {
        alert('목표 금액을 확인해주세요.');
        return;
      }
      updateGoalMutation.mutate(
        {
          goalId: Number(id),
          data: {
            title: title.trim(),
            startDate: formatDate(start),
            endDate: formatDate(end),
            targetAmount,
            ...(detail.colorCode != null && { colorCode: detail.colorCode }),
            ...(detail.iconId != null && { iconId: detail.iconId }),
          },
        },
        {
          onSuccess,
          onError: () => {
            alert('목표 수정에 실패했습니다.');
          },
        }
      );
    },
    onBack: () => navigate(-1),
  });

  // 엔터 키 핸들러: 유효성 검사 통과 시 제출
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'NumpadEnter') && canSubmit && !updateGoalMutation.isPending) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <main className="flex-1 flex flex-col px-[20px] pt-[28px] pb-[32px] overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div onClick={openAccountSheet} className="cursor-pointer">
            <AuthInput
              label="계좌 연동"
              name="linkedAccount"
              value={accountDisplay}
              onChange={() => {}}
              placeholder="계좌를 선택해주세요"
              readOnly
              width="full"
              className="cursor-pointer"
            />
          </div>

          <AuthInput
            label="목표 금액"
            name="goalAmount"
            value={goalAmount}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('goalAmount', e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="목표액은 얼마인가요?"
            focusBorderClassName="border-primary-normal"
            width="full"
            error={fieldErrors.goalAmount}
          />

          <AuthInput
            label="종료일"
            name="endDate"
            value={endDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('endDate', e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="YYYY-MM-DD"
            focusBorderClassName="border-primary-normal"
            width="full"
            error={fieldErrors.endDate}
          />

          <AuthInput
            label="시작일"
            name="startDate"
            value={startDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('startDate', e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="YYYY-MM-DD"
            focusBorderClassName="border-primary-normal"
            width="full"
            error={fieldErrors.startDate}
          />

          <AuthInput
            label="목표 이름"
            name="goalName"
            value={goalName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('goalName', e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="목표명을 작성 해주세요"
            focusBorderClassName="border-primary-normal"
            width="full"
            error={fieldErrors.goalName}
          />
        </div>
      </main>

      <GoalCreateStepFooter
        isVisible={canSubmit}
        buttonText={updateGoalMutation.isPending ? '수정 중...' : submitButtonText || '수정하기'}
        onClick={handleSubmit}
        disabled={updateGoalMutation.isPending}
      />

      <AccountLinkBottomSheet isOpen={isAccountSheetOpen} onClose={closeAccountSheet} onSelect={handleAccountSelect} />

      <GoalLeaveConfirmModal isOpen={isLeaveModalOpen} onClose={handleLeaveCancel} onConfirm={handleLeaveConfirm} />
    </>
  );
}

const GoalEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const updateGoalMutation = useUpdateGoal();
  const goalId = id ? Number(id) : 0;
  const { data: goalDetailData, isLoading: isDetailLoading } = useGoalDetail(goalId);

  const state = (location.state as GoalEditLocationState | null) ?? null;
  const detail = goalDetailData?.result ?? null;

  const onBack = () => navigate(-1);

  const renderContent = () => {
    if (id && isDetailLoading) {
      return (
        <main className="flex-1 flex items-center justify-center px-5">
          <p className="text-gray-500">로딩 중...</p>
        </main>
      );
    }
    if (id && !detail) {
      return (
        <main className="flex-1 flex items-center justify-center px-5">
          <p className="text-red-500">목표를 찾을 수 없습니다.</p>
        </main>
      );
    }
    if (detail && id) {
      return (
        <GoalEditForm
          key={id}
          id={id}
          detail={detail}
          state={state}
          updateGoalMutation={updateGoalMutation}
          onSuccess={() => navigate(paths.goal.amountAchieved(id))}
        />
      );
    }
    return null;
  };

  return <GoalEditPageLayout onBack={onBack}>{renderContent()}</GoalEditPageLayout>;
};

export default GoalEditPage;
