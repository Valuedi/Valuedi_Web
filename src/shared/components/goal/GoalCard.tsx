import { useNavigate } from 'react-router-dom';
import { paths } from '@/router/paths';
import MoneyIcon from '@/assets/icons/goal/MoneyIcon.svg';
import CalendarIcon from '@/assets/icons/goal/CalendarIcon.svg';
import { toHexColor, type GoalStatus } from '@/features/goal';
import { GOAL_ICON_SRC } from '@/shared/components/goal/goalIconAssets';
import ExBank from '@/assets/icons/goal/ExBank.svg';

interface GoalCardProps {
  goal: {
    id: number;
    bankIcon?: string;
    title: string;
    progress: number;
    targetAmount: number;
    remainingDays: number;
    colorCode?: string;
    iconId?: number;
    status?: GoalStatus;
    savedAmount?: number;
  };
  type?: 'current' | 'past';
}

const GoalCard = ({ goal, type = 'current' }: GoalCardProps) => {
  const navigate = useNavigate();
  const isPast = type === 'past';
  /** 달성 실패한 목표는 계좌 연결이 끊어져 상세 접근 시 서버 에러 발생 → 상세 진입 비활성화 */
  const isDisabled = isPast && goal.status === 'FAILED';

  const handleClick = () => {
    if (isDisabled) return;
    navigate(paths.goal.amountAchieved(goal.id));
  };

  const hasGoalStyle = goal.colorCode != null && goal.iconId != null;
  const bgColor = goal.colorCode ? toHexColor(goal.colorCode) : undefined;
  const iconSrc = goal.iconId != null ? GOAL_ICON_SRC[goal.iconId] : null;

  // 상단 제목 & 상태 배지
  const titleText = goal.title;
  let statusLabel: string | null = null;
  let statusClass = '';

  if (isPast) {
    if (goal.status === 'COMPLETE') {
      statusLabel = '달성완료';
      statusClass = 'bg-primary-normal text-[#171714]';
    } else if (goal.status === 'FAILED') {
      statusLabel = '달성실패';
      statusClass = 'bg-gray-200 text-gray-600';
    }
  } else {
    statusLabel = `${goal.progress}% 달성`;
    statusClass = 'bg-primary-normal text-[#171714]';
  }

  return (
    <div
      onClick={handleClick}
      className={`w-full transition-colors bg-white shadow-sm p-5 rounded-xl ${
        isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer active:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className={
            hasGoalStyle && bgColor
              ? 'flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-lg shrink-0'
              : 'flex items-center justify-center w-9 h-9 md:w-11 md:h-11 bg-neutral-10 rounded-lg shrink-0'
          }
          style={hasGoalStyle && bgColor ? { backgroundColor: bgColor } : undefined}
        >
          {iconSrc ? (
            <img src={iconSrc} alt="" className="w-6 h-6 md:w-7 md:h-7 brightness-0 invert" />
          ) : (
            <img src={goal.bankIcon ?? ExBank} alt="" className="w-6 h-6 md:w-7 md:h-7" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#171714]">{titleText}</span>
          {statusLabel && (
            <div className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusClass}`}>
              {statusLabel}
            </div>
          )}
        </div>
      </div>

      {/* 하단 내용 */}
      {isPast ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-50">
              <img src={MoneyIcon} alt="money" className="w-4 h-4 opacity-40" />
              <span className="text-xs font-medium">달성금액</span>
            </div>
            <span className="text-xs font-semibold text-[#171714]">
              {(goal.savedAmount ?? goal.targetAmount).toLocaleString()}원
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-50">
              <img src={MoneyIcon} alt="money" className="w-4 h-4 opacity-40" />
              <span className="text-xs font-medium">목표 금액</span>
            </div>
            <span className="text-xs font-semibold text-[#171714]">{goal.targetAmount.toLocaleString()}원</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-50">
              <img src={CalendarIcon} alt="calendar" className="w-4 h-4 opacity-40" />
              <span className="text-xs font-medium">남은 일자</span>
            </div>
            <span className="text-xs font-semibold text-[#171714]">{goal.remainingDays}일</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalCard;
