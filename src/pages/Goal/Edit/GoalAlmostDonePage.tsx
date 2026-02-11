import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import { BaseButton } from '@/shared/components/buttons/BaseButton';
import GoalIconPickerBottomSheet from '@/shared/components/goal/detail/GoalIconPickerBottomSheet';
import { useCreateGoal } from '@/features/goal/goal.hooks';
import { paths } from '@/router/paths';
import { basenameNoExt, formatDate } from '@/shared/utils/goal/goalHelpers';
import BackPageIcon from '@/assets/icons/BackPage.svg';
import type { CreateGoalRequest } from '@/features/goal/goal.types';
import { GOAL_COLOR_NAME_TO_HEX, GOAL_ICON_NAME_TO_ID } from '@/features/goal';
import type { SelectedAccount } from '@/shared/hooks/Goal/useGoalForm';

interface GoalFormData {
  goalName: string;
  startDate: string;
  endDate: string;
  goalAmount: string;
  selectedAccount: SelectedAccount | null;
}

const GoalAlmostDonePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  // 이전 단계에서 전달받은 데이터
  const goalFormData = location.state as GoalFormData;
  // 목표 생성 뮤테이션 훅
  const { mutate: createGoal, isPending, isError, error } = useCreateGoal();
  // 데이터가 없을 경우 예외 처리
  if (!goalFormData) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-screen p-5">
          <h1 className="text-2xl font-bold text-red-500 mb-4 font-pretendard">잘못된 접근</h1>
          <p className="text-base text-gray-600 mb-8 text-center font-pretendard">
            목표 정보를 찾을 수 없습니다. 다시 시도해주세요.
          </p>
          <BaseButton
            size="large"
            variant="primary"
            text="목표 생성으로 돌아가기"
            onClick={() => navigate(paths.goal.create)}
            fullWidth
            typographyStyle="text-body-1-16-semi-bold"
            className="bg-primary-normal"
          />
        </div>
      </MobileLayout>
    );
  }
  // 아이콘 선택 완료 시 호출되는 함수
  const handleIconPickerConfirm = (payload: { colorId: string; iconId: string }) => {
    if (!goalFormData.selectedAccount) {
      console.error('계좌가 선택되지 않았습니다!');
      return;
    }
    const { goalName, startDate, endDate, goalAmount, selectedAccount } = goalFormData;

    // 색상: 6자리 hex 문자열 (예: FF6363)로 전송
    const colorName = basenameNoExt(payload.colorId);
    const colorCode = GOAL_COLOR_NAME_TO_HEX[colorName];

    // 아이콘 이름 추출 및 API iconId 매핑 (1-based)
    const iconName = basenameNoExt(payload.iconId);
    const iconId = GOAL_ICON_NAME_TO_ID[iconName];

    if (!colorCode) {
      console.error('Invalid color selected:', colorName);
      return;
    }
    if (iconId === undefined) {
      console.error('Invalid icon selected:', iconName);
      return;
    }

    // 서버 전송용 데이터 객체 생성
    const newGoal: CreateGoalRequest = {
      title: goalName,
      targetAmount: Number(goalAmount.replace(/,/g, '')),
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      bankAccountId: Number(selectedAccount.id),
      colorCode: colorCode, // 매핑된 색상 코드 사용
      iconId: iconId, // 매핑된 아이콘 ID 사용
    };
    // 서버에 목표 생성 요청
    createGoal(newGoal, {
      onSuccess: (data) => {
        setIsIconPickerOpen(false);
        navigate(paths.goal.createComplete, {
          state: {
            goalId: data.result.goalId,
            goalName: data.result.title,
            targetAmount: data.result.targetAmount,
            startDate: data.result.startDate,
            endDate: data.result.endDate,
            remainingDays: data.result.remainingDays,
            bankName: data.result.account?.bankName ?? '',
            accountNumber: data.result.account?.accountNumber ?? '',
            colorCode,
            iconId,
          },
        });
      },
      onError: (err) => {
        console.error('Goal creation failed:', err);
      },
    });
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen">
        {/* 상단 헤더: 뒤로가기 */}
        <header className="px-5 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-2 h-2"
            aria-label="뒤로 가기"
          >
            <img src={BackPageIcon} alt="Back" className="w-6 h-6" />
          </button>
        </header>
        {/* 메인 컨텐츠: 클릭 시 바텀시트 오픈 */}
        <div
          className="flex-1 flex flex-col items-start justify-start p-8 cursor-pointer"
          onClick={() => !isPending && setIsIconPickerOpen(true)}
        >
          <h1 className="text-lg font-bold text-gray-900 mb-2 text-left font-pretendard">거의 다 왔어요!</h1>
          <p className="text-xs text-gray-600 mb-8 text-left font-pretendard">
            마지막으로 목표의 대표 이미지를 선택해 주세요
          </p>

          {isPending && <p className="text-blue-500 mb-4 font-pretendard">목표를 생성 중입니다...</p>}
          {isError && <p className="text-red-500 mb-4 font-pretendard">목표 생성 실패: {error?.message}</p>}
        </div>
        {/* 아이콘 선택 바텀시트 */}
        <GoalIconPickerBottomSheet
          isOpen={isIconPickerOpen}
          onClose={() => setIsIconPickerOpen(false)}
          onConfirm={handleIconPickerConfirm}
        />
      </div>
    </MobileLayout>
  );
};

export default GoalAlmostDonePage;
