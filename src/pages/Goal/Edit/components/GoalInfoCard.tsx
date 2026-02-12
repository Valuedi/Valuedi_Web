import MoneyIcon from '@/assets/icons/goal/MoneyIcon.svg';
import CalendarIcon from '@/assets/icons/goal/CalendarIcon.svg';
import { toHexColor } from '@/features/goal';
import { GOAL_ICON_SRC, DEFAULT_GOAL_ICON } from '@/shared/components/goal/goalIconAssets';
import { getBankDisplayName } from '@/features/connection/constants/organizationCodes';
import { formatToYYMMDD, maskAccountNumber } from '@/shared/utils/goal/goalHelpers';

interface GoalInfoCardProps {
  title: string;
  colorCode?: string;
  iconId?: number;
  targetAmount: number;
  startDate: string;
  endDate: string;
  remainingDays: number;
  bankName: string;
  accountNumber: string;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount);
}

export default function GoalInfoCard({
  title,
  colorCode,
  iconId,
  targetAmount,
  startDate,
  endDate,
  remainingDays,
  bankName,
  accountNumber,
}: GoalInfoCardProps) {
  const bgColor = colorCode ? toHexColor(colorCode) : '#FFEB38';
  const iconSrc = iconId != null ? (GOAL_ICON_SRC[iconId] ?? DEFAULT_GOAL_ICON) : DEFAULT_GOAL_ICON;
  const displayBankName = getBankDisplayName(bankName);
  const maskedAccount = maskAccountNumber(accountNumber);

  return (
    <div className="bg-white flex flex-col gap-5 items-start px-3 py-4 rounded-lg shadow-[0px_0px_16px_0px_rgba(25,25,20,0.04)] w-full">
      {/* 상단: 목표 아이콘과 이름 */}
      <div className="flex flex-col items-start relative shrink-0 w-full">
        <div className="flex gap-2 items-center relative shrink-0 w-full">
          <div className="flex gap-[10px] items-center justify-center p-2 relative shrink-0 size-8">
            <button className="cursor-pointer flex items-center justify-center p-1 relative shrink-0 size-8">
              <div className="rounded-lg shrink-0 size-8" style={{ backgroundColor: bgColor }} />
            </button>
            <div className="absolute left-1 size-6 top-1">
              <div className="-translate-x-1/2 absolute left-1/2 size-5 top-0.5">
                <img alt="" className="block max-w-none size-full brightness-0 invert" src={iconSrc} />
              </div>
            </div>
          </div>
          <div className="flex items-center relative shrink-0">
            <p className="font-pretendard font-semibold leading-6 not-italic relative shrink-0 text-base text-neutral-90">
              {title}
            </p>
          </div>
        </div>
      </div>

      {/* 하단: 목표 정보 리스트 */}
      <div className="flex flex-col gap-2 items-start relative rounded-lg shrink-0 w-full">
        {/* 목표금액 */}
        <div className="flex items-center justify-between relative shrink-0 w-full">
          <div className="flex items-center relative shrink-0">
            <div className="flex items-center relative shrink-0">
              <div className="flex flex-col items-center justify-center p-[10px] relative rounded size-6">
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-start justify-items-start leading-0 relative shrink-0">
                  <div className="col-1 ml-0 mt-0 relative row-1 size-3">
                    <img alt="" className="block max-w-none size-full" src={MoneyIcon} />
                  </div>
                </div>
              </div>
              <p className="font-pretendard font-normal leading-6 not-italic relative shrink-0 text-sm text-neutral-70">
                목표금액
              </p>
            </div>
          </div>
          <div className="flex items-center relative shrink-0">
            <div className="flex gap-0.5 items-center not-italic relative shrink-0 text-sm text-neutral-90">
              <p className="font-pretendard font-semibold leading-[22px] relative shrink-0">
                {formatAmount(targetAmount)}
              </p>
              <p className="font-pretendard font-normal leading-6 relative shrink-0">원</p>
            </div>
          </div>
        </div>

        {/* 시작일 */}
        <div className="flex items-start justify-between relative shrink-0 w-full">
          <div className="flex items-center relative shrink-0">
            <div className="flex items-center relative shrink-0">
              <div className="flex flex-col items-center justify-center p-[10px] relative rounded size-6">
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-start justify-items-start leading-0 relative shrink-0">
                  <div className="col-1 h-[11px] ml-0 mt-0 relative row-1 w-3">
                    <img alt="" className="block max-w-none size-full" src={CalendarIcon} />
                  </div>
                </div>
              </div>
              <p className="font-pretendard font-normal leading-6 not-italic relative shrink-0 text-sm text-neutral-70">
                시작일
              </p>
            </div>
          </div>
          <div className="flex items-center relative shrink-0">
            <div className="flex items-center relative shrink-0">
              <p className="font-pretendard font-semibold leading-[22px] not-italic relative shrink-0 text-sm text-neutral-90">
                {formatToYYMMDD(startDate)}
              </p>
            </div>
          </div>
        </div>

        {/* 종료일 */}
        <div className="flex items-start justify-between relative shrink-0 w-full">
          <div className="flex items-center relative shrink-0">
            <div className="flex items-center relative shrink-0">
              <div className="flex flex-col items-center justify-center p-[10px] relative rounded size-6">
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-start justify-items-start leading-0 relative shrink-0">
                  <div className="col-1 h-[11px] ml-0 mt-0 relative row-1 w-3">
                    <img alt="" className="block max-w-none size-full" src={CalendarIcon} />
                  </div>
                </div>
              </div>
              <p className="font-pretendard font-normal leading-6 not-italic relative shrink-0 text-sm text-neutral-70">
                종료일
              </p>
            </div>
          </div>
          <div className="flex items-center relative shrink-0">
            <div className="flex items-center relative shrink-0">
              <p className="font-pretendard font-semibold leading-[22px] not-italic relative shrink-0 text-sm text-neutral-90">
                {formatToYYMMDD(endDate)}
              </p>
            </div>
          </div>
        </div>

        {/* 남은일자 */}
        <div className="flex items-start justify-between relative shrink-0 w-full">
          <div className="flex items-center relative shrink-0">
            <div className="flex items-center relative shrink-0">
              <div className="flex flex-col items-center justify-center p-[10px] relative rounded size-6">
                <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-start justify-items-start leading-0 relative shrink-0">
                  <div className="col-1 h-[11px] ml-0 mt-0 relative row-1 w-3">
                    <img alt="" className="block max-w-none size-full" src={CalendarIcon} />
                  </div>
                </div>
              </div>
              <p className="font-pretendard font-normal leading-6 not-italic relative shrink-0 text-sm text-neutral-70">
                남은일자
              </p>
            </div>
          </div>
          <div className="flex items-center relative shrink-0">
            <div className="flex gap-0.5 items-center not-italic relative shrink-0 text-sm text-neutral-90">
              <p className="font-pretendard font-semibold leading-[22px] relative shrink-0">{remainingDays}</p>
              <p className="font-pretendard font-normal leading-6 relative shrink-0">일</p>
            </div>
          </div>
        </div>

        {/* 저축계좌 */}
        <div className="flex items-start justify-between relative shrink-0 w-full">
          <div className="flex items-center relative shrink-0">
            <div className="flex flex-col items-center justify-center p-[10px] relative rounded size-6">
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-start justify-items-start leading-0 relative shrink-0">
                <div className="col-1 ml-0 mt-0 relative row-1 size-3">
                  <img alt="" className="block max-w-none size-full" src={MoneyIcon} />
                </div>
              </div>
            </div>
            <p className="font-pretendard font-normal leading-6 not-italic relative shrink-0 text-sm text-neutral-70">
              저축계좌
            </p>
          </div>
          <div className="flex items-center relative shrink-0">
            <div className="flex items-center relative shrink-0">
              <p className="font-pretendard font-normal leading-6 not-italic relative shrink-0 text-sm text-neutral-90">
                {displayBankName} {maskedAccount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
