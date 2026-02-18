import { useGoalDetail, toHexColor } from '@/features/goal';
import { useAccounts } from '@/features/asset';
import { GOAL_ICON_SRC } from '@/shared/components/goal/goalIconAssets';
import ExBank from '@/assets/icons/goal/ExBank.svg';
import { getCollectedAmount } from '@/shared/utils/goal/goalHelpers';
interface GoalProgressGaugeProps {
  goalId: number;
  /** 목표 계산기에서 추가로 절약할 금액 (원 단위) */
  extraSavingAmount?: number;
}

const GoalProgressGauge = ({ goalId, extraSavingAmount }: GoalProgressGaugeProps) => {
  const { data, isLoading: loading, error: queryError } = useGoalDetail(goalId);
  const { data: accountsData } = useAccounts();
  const goalData = data?.result ?? null;
  const error = queryError ? '데이터를 불러오는데 실패했습니다.' : null;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  if (loading) {
    return (
      <div className="p-3 bg-white rounded-3xl shadow-sm flex items-center justify-center">
        <p className="text-gray-500 text-sm font-pretendard">로딩 중...</p>
      </div>
    );
  }

  if (error || !goalData) {
    return null;
  }

  const hasGoalStyle = goalData.colorCode != null && goalData.iconId != null;
  const bgColor = goalData.colorCode ? toHexColor(goalData.colorCode) : undefined;
  const iconSrc = goalData.iconId != null ? GOAL_ICON_SRC[goalData.iconId] : null;

  // 목표 금액: 항상 생성 시 입력한 원래 목표 금액 사용
  const targetAmount = goalData.targetAmount;

  // 연결된 목표의 계좌 잔액을 우선 사용 (없으면 목표 상세 응답의 잔액 계열 필드 fallback)
  const linkedAccountBalance = accountsData?.result?.accountList?.find(
    (account) => account.goalInfo?.goalId === goalId
  )?.balanceAmount;

  const baseCollectedAmount = linkedAccountBalance ?? getCollectedAmount(goalData);

  // 모인 금액: 기본 잔액 + (시뮬레이션 추가 절약 금액)
  const totalSavedForGauge = extraSavingAmount != null ? baseCollectedAmount + extraSavingAmount : baseCollectedAmount;
  const rawRate = targetAmount > 0 ? (totalSavedForGauge / targetAmount) * 100 : 0;
  // 0~100으로 클램프, 소수점은 반올림 처리
  const clampedRate = Math.min(Math.max(Math.round(rawRate), 0), 100);

  return (
    <div className="relative overflow-hidden bg-white min-h-[50px] flex flex-col justify-start pb-6 px-5  mx-5">
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden transition-all duration-1000 ease-out bg-primary-normal"
        style={{ height: `${clampedRate}%` }}
      >
        <div className="goal-gauge-wave" />
        <div className="goal-gauge-wave goal-gauge-wave-secondary" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-5 mt-5">
          <div
            className={
              hasGoalStyle && bgColor
                ? 'flex items-center justify-center w-9 h-9 rounded-lg shrink-0'
                : 'flex items-center justify-center w-9 h-9 bg-neutral-10 rounded-lg shrink-0'
            }
            style={hasGoalStyle && bgColor ? { backgroundColor: bgColor } : undefined}
          >
            {iconSrc ? (
              <img src={iconSrc} alt="" className="w-6 h-6 brightness-0 invert" />
            ) : (
              <img src={ExBank} alt="" className="w-6 h-6" />
            )}
          </div>
          <span className="text-sm font-semibold text-[#171714] font-pretendard">{goalData.title}</span>
        </div>

        <div className="px-1 mb-1.5 text-sm font-medium text-gray-600 font-pretendard">현재 보유 자산</div>

        <div className="flex items-center gap-4 px-1">
          <span className="text-2xl font-bold text-black leading-tight font-pretendard">
            {formatAmount(totalSavedForGauge)}원
          </span>

          <div className="px-3 py-1 bg-primary-normal rounded-full text-xs font-bold text-[#171714] font-pretendard">
            {clampedRate}% 달성
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalProgressGauge;
