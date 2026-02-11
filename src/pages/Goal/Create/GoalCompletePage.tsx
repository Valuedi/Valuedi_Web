import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import { Typography } from '@/shared/components/typography';
import BackPageIcon from '@/assets/icons/BackPage.svg';
import { useCreateGoal } from '@/features/goal/goal.hooks';
import { paths } from '@/router/paths';
import type { CreateGoalRequest } from '@/features/goal/goal.types';
import type { GoalCompleteState, GoalBeforeCreateState } from './types';
import GoalInfoCard from '@/pages/Goal/Edit/components/GoalInfoCard';

const GoalCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as GoalCompleteState | GoalBeforeCreateState | null;
  const [isCreating, setIsCreating] = useState(false);
  const { mutate: createGoal, isPending, isError, error } = useCreateGoal();

  // 목표 생성 전 데이터인지 확인 (goalId가 없으면 생성 전)
  const isBeforeCreate = state && !('goalId' in state);

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleCreateGoal = () => {
    if (!isBeforeCreate || !state) return;

    const beforeCreateState = state as GoalBeforeCreateState;
    const newGoal: CreateGoalRequest = {
      title: beforeCreateState.goalName,
      targetAmount: beforeCreateState.targetAmount,
      startDate: beforeCreateState.startDate,
      endDate: beforeCreateState.endDate,
      bankAccountId: beforeCreateState.bankAccountId,
      colorCode: beforeCreateState.colorCode,
      iconId: beforeCreateState.iconId,
    };

    setIsCreating(true);
    createGoal(newGoal, {
      onSuccess: (data) => {
        // 목표 생성 성공 후 목표 상세 페이지로 이동
        navigate(paths.goal.amountAchieved(data.result.goalId));
      },
      onError: (err) => {
        console.error('Goal creation failed:', err);
        setIsCreating(false);
      },
    });
  };

  const handleGoToGoal = () => {
    if (isBeforeCreate) {
      // 목표 생성 전이면 API 요청
      handleCreateGoal();
    } else {
      // 목표 생성 후면 목표 상세 페이지로 이동
      const completeState = state as GoalCompleteState;
      if (completeState.goalId) {
        navigate(paths.goal.amountAchieved(completeState.goalId));
      } else {
        navigate('/goal/current');
      }
    }
  };

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
            <button
              type="button"
              onClick={() => navigate('/goal/current')}
              className="w-full max-w-[320px] mt-6 py-3 px-4 bg-primary-normal text-neutral-90 rounded-lg font-semibold font-pretendard"
            >
              목표 목록으로
            </button>
          </main>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout className="p-0 overflow-hidden bg-white">
      <div className="flex flex-col w-full min-h-screen">
        {/* 헤더 */}
        <header className="flex items-center justify-between w-full h-[50px] px-5 bg-white flex-shrink-0">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 -ml-2"
            aria-label="뒤로가기"
          >
            <img src={BackPageIcon} alt="뒤로가기" className="w-6 h-6" />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2">
            <Typography style="text-body-1-16-regular" fontFamily="pretendard" className="text-transparent">
              수정하기
            </Typography>
          </div>
          <div className="w-10" />
        </header>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 flex flex-col items-center px-5 pt-12 pb-8 overflow-y-auto">
          {/* 텍스트 영역 */}
          <div className="flex flex-col gap-3 items-center justify-center w-full max-w-[320px] mb-12">
            <Typography
              style="text-headline-3-18-semi-bold"
              fontFamily="pretendard"
              className="text-neutral-90 text-center"
              as="h1"
            >
              목표를 완성했어요
            </Typography>
            <Typography style="text-body-2-14-regular" fontFamily="pretendard" className="text-neutral-70 text-center">
              <p className="mb-0">밸류디와 함께 목표를 달성해보아요</p>
              <p className="mb-0">화이팅!</p>
            </Typography>
          </div>

          {/* 목표 정보 카드 */}
          <div className="w-full max-w-[320px] mb-auto">
            <GoalInfoCard
              title={state.goalName}
              colorCode={state.colorCode}
              iconId={state.iconId}
              targetAmount={state.targetAmount}
              startDate={state.startDate}
              endDate={state.endDate}
              remainingDays={state.remainingDays}
              bankName={state.bankName}
              accountNumber={state.accountNumber}
            />
          </div>
        </main>

        {/* 푸터 */}
        <footer className="w-full px-5 pb-10 pt-2 flex-shrink-0 flex flex-col gap-4">
          {/* 목표로 이동하기 버튼 */}
          <button
            type="button"
            onClick={handleGoToGoal}
            disabled={isPending || isCreating}
            className="w-full max-w-[320px] mx-auto h-12 bg-primary-normal text-neutral-90 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed font-pretendard text-base"
          >
            {isPending || isCreating ? '목표를 생성 중입니다...' : '목표로 이동하기'}
          </button>

          {/* 홈으로 이동 링크 */}
          <button
            type="button"
            onClick={handleGoHome}
            className="w-full max-w-[320px] mx-auto py-2 text-center text-neutral-50 font-pretendard text-sm"
          >
            홈으로 이동
          </button>

          {/* 에러 메시지 */}
          {isError && (
            <p className="text-red-500 text-center text-sm font-pretendard">
              목표 생성 실패: {error?.message || '알 수 없는 오류가 발생했습니다.'}
            </p>
          )}
        </footer>
      </div>
    </MobileLayout>
  );
};

export default GoalCompletePage;
export type { GoalCompleteState } from './types';
