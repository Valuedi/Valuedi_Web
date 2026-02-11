import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import { Typography } from '@/shared/components/typography';
import { BaseButton } from '@/shared/components/buttons/BaseButton';
import BackPageIcon from '@/assets/icons/BackPage.svg';
import { useGoalCompletePage } from '@/shared/hooks/Goal/useGoalCompletePage';
import { GoalSummaryCard } from '@/shared/components/goal/GoalSummaryCard';
import { formatToYYMMDD, maskAccountNumber } from '@/shared/utils/goal/goalHelpers';

const GoalCompletePage = () => {
  const { state, navigate, handleBack, handleGoHome, handleGoToGoal } = useGoalCompletePage();

  if (!state) {
    return (
      <MobileLayout className="p-0 overflow-hidden bg-white">
        <div className="flex flex-col w-full min-h-screen">
          <header className="flex items-center w-full h-[50px] px-5 bg-white flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate('/goal/current')}
              className="flex items-center justify-center w-10 h-10 -ml-2"
            >
              <img src={BackPageIcon} alt="뒤로가기" className="w-6 h-6" />
            </button>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
            <p className="text-neutral-60 text-center">목표 정보를 찾을 수 없습니다.</p>
            <BaseButton
              size="large"
              variant="primary"
              text="목표 목록으로"
              onClick={() => navigate('/goal/current')}
              fullWidth
              typographyStyle="text-body-1-16-semi-bold"
              className="bg-primary-normal mt-6 max-w-[320px]"
            />
          </main>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout className="p-0 overflow-hidden bg-white">
      <div className="flex flex-col w-full min-h-screen">
        <header className="flex items-center w-full h-[50px] px-5 bg-white flex-shrink-0">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 -ml-2"
            aria-label="뒤로가기"
          >
            <img src={BackPageIcon} alt="뒤로가기" className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 flex flex-col px-5 pt-6 pb-8 overflow-y-auto">
          <div className="flex flex-col gap-2 mb-8">
            <Typography style="text-headline-1-22-bold" fontFamily="pretendard" className="text-neutral-90" as="h1">
              목표를 완성했어요
            </Typography>
            <Typography style="text-body-1-16-regular" fontFamily="pretendard" className="text-neutral-90">
              밸류디와 함께 목표를 달성해보아요 화이팅!
            </Typography>
          </div>
          <GoalSummaryCard
            title={state.goalName}
            colorCode={state.colorCode}
            iconId={state.iconId}
            targetAmountText={`${new Intl.NumberFormat('ko-KR').format(state.targetAmount)} 원`}
            startDateText={formatToYYMMDD(state.startDate)}
            endDateText={formatToYYMMDD(state.endDate)}
            remainingDaysText={`${state.remainingDays} 일`}
            bankName={state.bankName}
            accountText={maskAccountNumber(state.accountNumber)}
          />
        </main>

        <footer className="w-full px-5 pb-8 pt-2 flex-shrink-0 flex flex-col gap-4">
          <button type="button" onClick={handleGoHome} className="text-center text-neutral-60">
            <Typography style="text-body-2-14-regular" fontFamily="pretendard" color="neutral-60">
              홈으로 이동
            </Typography>
          </button>
          <BaseButton
            size="large"
            variant="primary"
            text="목표로 이동하기"
            onClick={handleGoToGoal}
            fullWidth
            typographyStyle="text-body-1-16-semi-bold"
            className="bg-primary-normal"
          />
        </footer>
      </div>
    </MobileLayout>
  );
};

export default GoalCompletePage;
export type { GoalCompleteState } from './types';
