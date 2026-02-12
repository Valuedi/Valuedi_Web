import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import { BaseButton } from '@/shared/components/buttons/BaseButton';
import GoalIconPickerBottomSheet from '@/shared/components/goal/detail/GoalIconPickerBottomSheet';
import { paths } from '@/router/paths';
import { basenameNoExt, formatDate, parseAmountToNumber } from '@/shared/utils/goal/goalHelpers';
import BackPageIcon from '@/assets/icons/BackPage.svg';
import { GOAL_COLOR_NAME_TO_HEX, GOAL_ICON_NAME_TO_ID } from '@/features/goal';
import type { SelectedAccount } from '@/shared/hooks/Goal/useGoalForm';
import GoalInfoCard from './components/GoalInfoCard';

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

    // 남은 일자 계산
    const remainingDays = Math.max(
      0,
      Math.ceil((new Date(formatDate(endDate)).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    );

    // API 요청 없이 완성 페이지로 이동
    setIsIconPickerOpen(false);
    navigate(paths.goal.createComplete, {
      state: {
        goalName,
        targetAmount: parseAmountToNumber(goalAmount),
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        remainingDays,
        bankName: selectedAccount.bankName ?? '',
        accountNumber: selectedAccount.accountNumber ?? '',
        bankAccountId: Number(selectedAccount.id),
        colorCode,
        iconId,
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
        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex flex-col items-start justify-start px-5 py-4">
          <h1 className="text-lg font-bold text-gray-900 mb-2 text-left font-pretendard">거의 다 왔어요!</h1>
          <p className="text-xs text-gray-600 mb-6 text-left font-pretendard">
            마지막으로 목표의 대표 이미지를 선택해 주세요
          </p>

          {/* 목표 정보 카드 */}
          <div className="w-full mb-6">
            <GoalInfoCard
              title={goalFormData.goalName}
              targetAmount={parseAmountToNumber(goalFormData.goalAmount)}
              startDate={goalFormData.startDate}
              endDate={goalFormData.endDate}
              remainingDays={Math.max(
                0,
                Math.ceil(
                  (new Date(formatDate(goalFormData.endDate)).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )
              )}
              bankName={goalFormData.selectedAccount?.bankName ?? ''}
              accountNumber={goalFormData.selectedAccount?.accountNumber ?? ''}
            />
          </div>

          {/* 아이콘 선택 버튼 */}
          <button
            type="button"
            onClick={() => setIsIconPickerOpen(true)}
            className="w-full py-3 px-4 bg-primary-normal text-neutral-90 rounded-lg font-semibold font-pretendard"
          >
            목표 아이콘 선택하기
          </button>
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
