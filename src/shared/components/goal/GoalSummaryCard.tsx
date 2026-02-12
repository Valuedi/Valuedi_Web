import { Typography } from '@/shared/components/typography';
import MoneyIcon from '@/assets/icons/goal/MoneyIcon.svg';
import CalendarIcon from '@/assets/icons/goal/CalendarIcon.svg';
import { toHexColor, GOAL_COLOR_NAME_TO_CODE } from '@/features/goal';
import { GOAL_ICON_SRC, DEFAULT_GOAL_ICON } from '@/shared/components/goal/goalIconAssets';
import { getBankDisplayName } from '@/features/connection/constants/organizationCodes';

interface GoalSummaryCardProps {
  /** 카드 타이틀 (예: '나의 목표') */
  title: string;
  /** 목표 색상 코드 (없으면 기본 노란색) */
  colorCode?: string;
  /** 목표 아이콘 ID (없으면 기본 아이콘) */
  iconId?: number | null;
  /** 목표 금액 텍스트 (예: '1,000,000 원' 또는 '??? 원') */
  targetAmountText: string;
  /** 시작일 텍스트 */
  startDateText: string;
  /** 종료일 텍스트 */
  endDateText: string;
  /** 남은일자 텍스트 (예: '30 일', '?? 일') */
  remainingDaysText: string;
  /** 저축계좌 텍스트 (예: '국민은행 1234-****-5678', '연결된 계좌가 없어요') */
  accountText: string;
  /** 은행 표시명 변환에 사용할 원본 은행 코드/이름 (없으면 accountText만 사용) */
  bankName?: string | null;
  /** 시작일/종료일 노출 여부 (기본값: true) */
  showDates?: boolean;
  /** 저축계좌 노출 여부 (기본값: true) */
  showAccount?: boolean;
}

export function GoalSummaryCard({
  title,
  colorCode,
  iconId,
  targetAmountText,
  startDateText,
  endDateText,
  remainingDaysText,
  accountText,
  bankName,
  showDates = true,
  showAccount = true,
}: GoalSummaryCardProps) {
  const resolvedColor = colorCode ? toHexColor(colorCode) : GOAL_COLOR_NAME_TO_CODE.yellow;
  const resolvedIcon = iconId != null ? (GOAL_ICON_SRC[iconId] ?? DEFAULT_GOAL_ICON) : DEFAULT_GOAL_ICON;

  const resolvedAccountText =
    bankName != null && bankName !== '' ? `${getBankDisplayName(bankName)} ${accountText}`.trim() : accountText;

  return (
    <div className="w-full max-w-[320px] mx-auto bg-white rounded-2xl shadow-sm border border-neutral-10 overflow-hidden mb-8">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
            style={{ backgroundColor: resolvedColor }}
          >
            <img src={resolvedIcon} alt="" className="w-6 h-6 brightness-0 invert" />
          </div>
          <Typography style="text-body-1-16-semi-bold" fontFamily="pretendard" className="text-neutral-90 truncate">
            {title}
          </Typography>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-50">
              <img src={MoneyIcon} alt="" className="w-4 h-4 opacity-60" />
              <span className="text-sm">목표금액</span>
            </div>
            <span className="text-sm font-bold text-neutral-90">{targetAmountText}</span>
          </div>

          {showDates && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-50">
                  <img src={CalendarIcon} alt="" className="w-4 h-4 opacity-60" />
                  <span className="text-sm">시작일</span>
                </div>
                <span className="text-sm font-bold text-neutral-90">{startDateText}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-50">
                  <img src={CalendarIcon} alt="" className="w-4 h-4 opacity-60" />
                  <span className="text-sm">종료일</span>
                </div>
                <span className="text-sm font-bold text-neutral-90">{endDateText}</span>
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-50">
              <img src={CalendarIcon} alt="" className="w-4 h-4 opacity-60" />
              <span className="text-sm">남은일자</span>
            </div>
            <span className="text-sm font-bold text-neutral-90">{remainingDaysText}</span>
          </div>

          {showAccount && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-50">
                <img src={MoneyIcon} alt="" className="w-4 h-4 opacity-60" />
                <span className="text-sm">저축계좌</span>
              </div>
              <span className="text-sm text-neutral-90 truncate max-w-[180px] text-right">{resolvedAccountText}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
