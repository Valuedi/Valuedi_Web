import BackPageIcon from '@/assets/icons/BackPage.svg';
import ProgressBar from '@/components/bar/ProgressBar';

interface GoalCreateStepHeaderProps {
  currentStep: number;
  onBack: () => void;
}

const GoalCreateStepHeader = ({ currentStep, onBack }: GoalCreateStepHeaderProps) => {
  // 총 6단계이므로 진행률 계산
  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <header className="relative flex flex-col w-full bg-white flex-shrink-0">
      <div className="flex items-center w-full h-[50px] px-[20px]">
        <button type="button" onClick={onBack} className="flex items-center justify-center cursor-pointer w-[24px]">
          <img src={BackPageIcon} alt="뒤로가기" />
        </button>
      </div>
      <div className="px-[20px] pb-[8px]">
        <ProgressBar percentage={progressPercentage} className="w-full h-[2px]" aria-label="목표 생성 진행률" />
      </div>
    </header>
  );
};

export default GoalCreateStepHeader;
