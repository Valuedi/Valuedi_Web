import MoneyIcon from '@/assets/icons/goal/MoneyIcon.svg';
import CalendarIcon from '@/assets/icons/goal/CalendarIcon.svg';
import { getBankDisplayName } from '@/features/connection/constants/organizationCodes';
import { useGoalDetail } from '@/features/goal';

interface GoalSummaryCardProps {
  goalId: number;
  /** 시뮬레이션으로 조정한 목표 금액 (없으면 API 응답값 사용) */
  overrideTargetAmount?: number;
  /** 시뮬레이션으로 조정한 남은 일자 (없으면 API 응답값 사용) */
  overrideRemainingDays?: number;
}

const GoalSummaryCard = ({ goalId, overrideTargetAmount, overrideRemainingDays }: GoalSummaryCardProps) => {
  const { data, isLoading: loading, error: queryError } = useGoalDetail(goalId);
  const goalData = data?.result ?? null;
  const error = queryError ? '데이터를 불러올 수 없습니다.' : data && !data.isSuccess ? data.message : null;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const maskAccountNumber = (accountNumber: string) => {
    const parts = accountNumber.split('-');
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1]}-****${parts[2].slice(-2)}`;
    }
    return accountNumber;
  };

  if (loading) {
    return (
      <div className="p-3 bg-white rounded-3xl">
        <div className="p-5 space-y-4 bg-gray-100 rounded-lg">
          <p className="text-xs text-center text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !goalData) {
    // 에러나 데이터 없음일 때는 카드 자체를 숨겨서 오류 화면처럼 보이지 않게 처리
    return null;
  }

  const targetAmount = overrideTargetAmount ?? goalData.targetAmount;
  const remainingDays = overrideRemainingDays ?? goalData.remainingDays;

  return (
    <div className="p-3 bg-white rounded-3xl">
      <div className="flex items-center gap-2 mb-3"></div>

      <div className="p-5 space-y-4 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <img src={MoneyIcon} alt="" className="w-4 h-4 opacity-50" />
            <span className="text-xs">목표금액</span>
          </div>

          <span className="text-xs font-bold">{formatAmount(targetAmount)}원</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <img src={CalendarIcon} alt="" className="w-4 h-4 opacity-50" />
            <span className="text-xs">남은 일자</span>
          </div>

          <span className="text-xs font-bold">{remainingDays}일</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <img src={MoneyIcon} alt="" className="w-4 h-4 opacity-50" />
            <span className="text-xs">저축 계좌</span>
          </div>

          <span className="text-xs">
            {getBankDisplayName(goalData.account.bankName)} | {maskAccountNumber(goalData.account.accountNumber)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GoalSummaryCard;
