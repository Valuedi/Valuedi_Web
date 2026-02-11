import { useMemo, useState } from 'react';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import SavingList from '@/shared/components/goal/detail/SavingList';
import GoalMoreActionsBottomSheet from '@/shared/components/goal/detail/GoalMoreActionsBottomSheet';
import GoalDeleteConfirmModal from '@/shared/components/goal/detail/GoalDeleteConfirmModal';
import GoalDetailPageHeader from '@/shared/components/goal/detail/GoalDetailPageHeader';
import GoalProgressGauge from '@/shared/components/goal/detail/GoalProgressGauge';
import GoalSummaryCard from '@/shared/components/goal/detail/GoalSummaryCard';
import { useGoalDetailActions, useGoalDetailSheetInitials } from '@/shared/hooks/Goal/useGoalDetailActions';

const SavingSimulationPage = () => {
  const {
    id,
    isGoalLoading,
    goalError,
    goalDetail,
    detail,
    goal,
    moreSheetOpen,
    setMoreSheetOpen,
    deleteModalOpen,
    setDeleteModalOpen,
    isCurrentActive,
    isPastActive,
    handleEditGoal,
    handleDeleteGoalClick,
    handleDeleteConfirm,
    handleIconChangeConfirm,
  } = useGoalDetailActions();

  const { initialColorId, initialIconId } = useGoalDetailSheetInitials(detail);

  // ====== 목표 계산기 시뮬레이션 상태 ======
  const originalRemainingDays = useMemo(() => (detail ? detail.remainingDays : 0), [detail]);
  const savedAmount = useMemo(() => (detail ? detail.savedAmount : 0), [detail]);

  const [simulatedRemainingDays, setSimulatedRemainingDays] = useState(originalRemainingDays);
  // 목표 계산기에서 입력한 절약 금액 총합 (게이지/요약에 반영)
  const [simulatedSavingAmount, setSimulatedSavingAmount] = useState(0);

  const handleSavingTotalChange = (totalSavingAmount: number) => {
    // 조정 전 남은 목표 금액
    const originalRemainingGoalAmount = Math.max((detail ? detail.targetAmount : 0) - savedAmount, 0);

    // 줄어든 목표 금액 (남은 금액보다 더 줄일 수 없음)
    const reducedGoalAmount = Math.max(0, Math.min(totalSavingAmount, originalRemainingGoalAmount));

    // 조정 후 남은 목표 금액
    const newRemainingGoalAmount = originalRemainingGoalAmount - reducedGoalAmount;

    // 하루 모으는 금액 = (조정 전 남은 목표 금액) ÷ (조정 전 남은 일수)
    const dailyAmount =
      originalRemainingGoalAmount > 0 && originalRemainingDays > 0
        ? originalRemainingGoalAmount / originalRemainingDays
        : 0;

    // 단축 일수 = (줄어든 목표 금액) ÷ (하루 모으는 금액)
    const reducedDays = dailyAmount > 0 ? Math.floor(reducedGoalAmount / dailyAmount) : 0;

    // 최종 남은 일수 = 기존 남은 일수 − 단축 일수 (0일 미만은 0일로)
    let finalRemainingDays = Math.max(0, originalRemainingDays - reducedDays);

    // 목표를 모두 달성한 경우 남은 일수는 0일로 표시
    if (newRemainingGoalAmount <= 0) {
      finalRemainingDays = 0;
    }

    // 게이지/요약에서 사용할 시뮬레이션 절약 금액: 사용자가 목표 계산기에 입력한 총합
    setSimulatedSavingAmount(totalSavingAmount);
    setSimulatedRemainingDays(finalRemainingDays);
  };

  if (isGoalLoading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400">로딩 중...</div>
        </div>
      </MobileLayout>
    );
  }

  if (goalError || !goalDetail?.result || !detail || !goal) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">목표를 찾을 수 없습니다.</div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="relative flex flex-col w-full min-h-screen bg-white overflow-x-hidden">
        <GoalDetailPageHeader
          goalId={id}
          isAmountAchievedActive={isCurrentActive}
          isSavingsSimulationActive={isPastActive}
          onMoreClick={() => setMoreSheetOpen(true)}
          isSimulationEnabled={detail?.status === 'ACTIVE'}
        />

        {/* AmountAchievedPage와 동일한 게이지 + 요약 섹션 (시뮬레이션 값 반영) */}
        <GoalProgressGauge goalId={goal.goalId} extraSavingAmount={simulatedSavingAmount} />
        <div className="px-5">
          <GoalSummaryCard goalId={goal.goalId} overrideRemainingDays={simulatedRemainingDays} />
        </div>

        <div className="text-xl font-bold pb-5 px-6">목표 계산기</div>
        <SavingList onTotalChange={handleSavingTotalChange} />

        <GoalMoreActionsBottomSheet
          isOpen={moreSheetOpen}
          onClose={() => setMoreSheetOpen(false)}
          onEditGoal={handleEditGoal}
          onDeleteGoal={handleDeleteGoalClick}
          onIconChangeConfirm={handleIconChangeConfirm}
          initialColorId={initialColorId}
          initialIconId={initialIconId}
        />
        <GoalDeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </MobileLayout>
  );
};

export default SavingSimulationPage;
