import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { paths } from '@/router/paths';
import { useGoalDetail, useDeleteGoal, useUpdateGoal } from '@/features/goal';
import {
  GOAL_COLOR_NAME_TO_HEX,
  GOAL_ICON_NAME_TO_ID,
  GOAL_ICON_ID_TO_NAME,
  getColorNameFromHex,
} from '@/features/goal';
import { getBankDisplayName } from '@/features/connection/constants/organizationCodes';
import { basenameNoExt, toInputDate } from '@/utils/goal/goalHelpers';

/** 목표 상세 공통 액션 (달성 금액 / 절약 시뮬레이션 공유) */
export function useGoalDetailActions() {
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const goalId = Number(id);

  const { data: goalDetail, isLoading: isGoalLoading, error: goalError } = useGoalDetail(goalId);
  const deleteGoalMutation = useDeleteGoal();
  const updateGoalMutation = useUpdateGoal();

  const isCurrentActive = id ? location.pathname === paths.goal.amountAchieved(id) : false;
  const isPastActive = id ? location.pathname === paths.goal.savingsSimulation(id) : false;

  const detail = goalDetail?.result ?? null;
  const goal =
    detail != null
      ? {
          goalId: detail.goalId,
          progress: detail.achievementRate,
          title: detail.title,
          targetAmount: detail.targetAmount,
          remainingDays: detail.remainingDays,
          savedAmount: detail.savedAmount,
          account: detail.account,
        }
      : null;

  const handleDeleteGoalClick = () => {
    setMoreSheetOpen(false);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteGoalMutation.mutate(goalId, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        navigate('/goal/current');
      },
      onError: () => {
        alert('목표 삭제에 실패했습니다.');
      },
    });
  };

  const handleEditGoal = () => {
    setMoreSheetOpen(false);
    if (!id || !detail) return;
    navigate(paths.goal.edit(id), {
      state: {
        goalName: detail.title,
        startDate: toInputDate(detail.startDate) ?? '',
        endDate: toInputDate(detail.endDate) ?? '',
        goalAmount: detail.targetAmount != null ? String(detail.targetAmount) : '',
        selectedAccount: detail.account
          ? {
              id: 'linked',
              bankName: getBankDisplayName(detail.account.bankName),
              accountNumber: detail.account.accountNumber,
            }
          : null,
      },
    });
  };

  const handleIconChangeConfirm = (payload: { colorId: string; iconId: string }) => {
    if (!detail) return;
    const colorName = basenameNoExt(payload.colorId);
    const iconName = basenameNoExt(payload.iconId);
    const colorCode =
      GOAL_COLOR_NAME_TO_HEX[colorName] ??
      Object.entries(GOAL_COLOR_NAME_TO_HEX).find(([k]) => k.toLowerCase() === colorName.toLowerCase())?.[1];
    const iconId =
      GOAL_ICON_NAME_TO_ID[iconName] ??
      Object.entries(GOAL_ICON_NAME_TO_ID).find(([k]) => k.toLowerCase() === iconName.toLowerCase())?.[1];
    if (!colorCode || iconId == null) {
      console.warn('아이콘 변경: 매핑 실패', { colorName, iconName });
      alert('선택한 색상 또는 아이콘을 사용할 수 없습니다.');
      return;
    }
    updateGoalMutation.mutate(
      { goalId, data: { title: detail.title, colorCode, iconId } },
      {
        onSuccess: () => setMoreSheetOpen(false),
        onError: (err: Error & { response?: { data?: { message?: string } } }) => {
          const msg = err?.response?.data?.message ?? err?.message ?? '아이콘/색상 변경에 실패했습니다.';
          alert(msg);
        },
      }
    );
  };

  return {
    id,
    goalId,
    detail,
    goal,
    isGoalLoading,
    goalError,
    goalDetail,
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
  };
}

/** GoalMoreActionsBottomSheet용 initialColorId/initialIconId 계산 */
export function useGoalDetailSheetInitials(detail: { colorCode?: string; iconId?: number } | null) {
  if (!detail)
    return { initialColorId: undefined as string | undefined, initialIconId: undefined as string | undefined };
  return {
    initialColorId: detail.colorCode
      ? `/src/assets/icons/goal/color/${getColorNameFromHex(detail.colorCode) ?? 'Red'}.svg`
      : undefined,
    initialIconId:
      detail.iconId != null && GOAL_ICON_ID_TO_NAME[detail.iconId]
        ? `/src/assets/icons/goal/icon/${GOAL_ICON_ID_TO_NAME[detail.iconId]}.svg`
        : undefined,
  };
}
