import { toHexColor } from '@/features/goal';
import type { GoalDetail } from '@/features/goal';
import { GOAL_ICON_SRC } from '@/shared/components/goal/goalIconAssets';
import ExBank from '@/assets/icons/goal/ExBank.svg';

interface PastGoalSummarySectionProps {
  detail: GoalDetail;
}

const formatAmount = (amount: number) => new Intl.NumberFormat('ko-KR').format(amount);

export default function PastGoalSummarySection({ detail }: PastGoalSummarySectionProps) {
  const hasGoalStyle = detail.colorCode != null && detail.iconId != null;
  const bgColor = detail.colorCode ? toHexColor(detail.colorCode) : undefined;
  const iconSrc = detail.iconId != null ? GOAL_ICON_SRC[detail.iconId] : null;

  const achievementLabel = detail.status === 'COMPLETE' ? '달성성공' : '달성실패';
  const achievementPillClass =
    detail.status === 'COMPLETE'
      ? 'bg-primary-normal text-[#171714]'
      : 'bg-neutral-20 text-neutral-70';

  /** 달성 성공이면 총 모인금액 = 목표 금액으로 표시 (서버가 0을 줄 수 있음) */
  const totalCollectedAmount =
    detail.status === 'COMPLETE' ? detail.targetAmount : detail.savedAmount;

  return (
    <div className="relative overflow-hidden bg-primary-normal px-5 pt-5 pb-8">
      <div className="flex items-center gap-2 mb-2">
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
        <span className="text-sm font-semibold text-[#171714]">{detail.title}</span>
      </div>

      <p className="text-sm font-medium text-neutral-50 mb-1">총 모인금액</p>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-2xl font-bold text-[#171714] leading-tight">
          {formatAmount(totalCollectedAmount)} 원
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${achievementPillClass}`}>
          {achievementLabel}
        </span>
      </div>
    </div>
  );
}
