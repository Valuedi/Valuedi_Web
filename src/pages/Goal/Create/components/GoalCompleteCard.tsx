import { Typography } from '@/shared/components/typography';
import MoneyIcon from '@/assets/icons/goal/MoneyIcon.svg';
import CalendarIcon from '@/assets/icons/goal/CalendarIcon.svg';
import { toHexColor } from '@/features/goal';
import { GOAL_ICON_SRC, DEFAULT_GOAL_ICON } from '@/shared/components/goal/goalIconAssets';
import { getBankDisplayName } from '@/features/connection/constants/organizationCodes';
import { formatToYYMMDD, maskAccountNumber } from '@/shared/utils/goal/goalHelpers';
import type { GoalCompleteState } from '../types';

interface GoalCompleteCardProps {
  state: GoalCompleteState;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('ko-KR').format(amount);
}

export default function GoalCompleteCard({ state }: GoalCompleteCardProps) {
  return (
    <div className="w-full max-w-[320px] mx-auto bg-white rounded-2xl shadow-sm border border-neutral-10 overflow-hidden mb-8">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
            style={state.colorCode ? { backgroundColor: toHexColor(state.colorCode) } : { backgroundColor: '#FFA938' }}
          >
            <img
              src={state.iconId != null ? (GOAL_ICON_SRC[state.iconId] ?? DEFAULT_GOAL_ICON) : DEFAULT_GOAL_ICON}
              alt=""
              className="w-6 h-6 brightness-0 invert"
            />
          </div>
          <Typography style="text-body-1-16-semi-bold" fontFamily="pretendard" className="text-neutral-90 truncate">
            {state.goalName}
          </Typography>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-50">
              <img src={MoneyIcon} alt="" className="w-4 h-4 opacity-60" />
              <span className="text-sm">목표금액</span>
            </div>
            <span className="text-sm font-bold text-neutral-90">{formatAmount(state.targetAmount)} 원</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-50">
              <img src={CalendarIcon} alt="" className="w-4 h-4 opacity-60" />
              <span className="text-sm">시작일</span>
            </div>
            <span className="text-sm font-bold text-neutral-90">{formatToYYMMDD(state.startDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-50">
              <img src={CalendarIcon} alt="" className="w-4 h-4 opacity-60" />
              <span className="text-sm">종료일</span>
            </div>
            <span className="text-sm font-bold text-neutral-90">{formatToYYMMDD(state.endDate)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-50">
              <img src={CalendarIcon} alt="" className="w-4 h-4 opacity-60" />
              <span className="text-sm">남은일자</span>
            </div>
            <span className="text-sm font-bold text-neutral-90">{state.remainingDays} 일</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-50">
              <img src={MoneyIcon} alt="" className="w-4 h-4 opacity-60" />
              <span className="text-sm">저축계좌</span>
            </div>
            <span className="text-sm text-neutral-90 truncate max-w-[180px] text-right">
              {getBankDisplayName(state.bankName)} {maskAccountNumber(state.accountNumber)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
