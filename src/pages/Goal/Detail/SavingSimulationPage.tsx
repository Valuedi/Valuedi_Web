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
        />

        {/* AmountAchievedPage와 동일한 게이지 + 요약 섹션 */}
        <GoalProgressGauge goalId={goal.goalId} />
        <div className="px-5">
          <GoalSummaryCard goalId={goal.goalId} />
        </div>

        <div className="text-xl font-bold pb-5 px-6">목표 계산기</div>
        <SavingList />

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
