import { useNavigate } from 'react-router-dom';
import BackPageIcon from '@/assets/icons/BackPage.svg';
import MoreIcon from '@/assets/icons/goal/MoreIcon.svg';
import { paths } from '@/router/paths';

interface GoalDetailPageHeaderProps {
  goalId: string | undefined;
  isAmountAchievedActive: boolean;
  isSavingsSimulationActive: boolean;
  onMoreClick: () => void;
  /** 지난 목표 등 시뮬레이션 비활성화 여부 */
  isSimulationEnabled: boolean;
}

export default function GoalDetailPageHeader({
  goalId,
  isAmountAchievedActive,
  isSavingsSimulationActive,
  onMoreClick,
  isSimulationEnabled,
}: GoalDetailPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between px-5 py-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 -ml-2"
          aria-label="뒤로가기"
        >
          <img src={BackPageIcon} alt="뒤로가기" className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">목표</h1>
        <button
          type="button"
          onClick={onMoreClick}
          className="flex items-center justify-center w-10 h-10 p-1"
          aria-label="더보기"
        >
          <img src={MoreIcon} alt="더보기" className="w-6 h-6" />
        </button>
      </div>

      <div className="flex w-full border-b border-gray-200">
        <button
          onClick={() => goalId && navigate(paths.goal.amountAchieved(goalId))}
          className={`flex-1 py-4 text-center text-base transition-all ${
            isAmountAchievedActive ? 'font-bold text-gray-900 border-b-2 border-gray-900' : 'font-medium text-gray-400'
          }`}
        >
          달성 금액
        </button>
        <button
          type="button"
          disabled={!isSimulationEnabled}
          onClick={() => {
            if (!isSimulationEnabled || !goalId) return;
            navigate(paths.goal.savingsSimulation(goalId));
          }}
          className={`flex-1 py-4 text-center text-base transition-all ${
            isSimulationEnabled && isSavingsSimulationActive
              ? 'font-bold text-gray-900 border-b-2 border-gray-900'
              : 'font-medium text-gray-300 cursor-not-allowed'
          }`}
        >
          절약 시뮬레이션
        </button>
      </div>
    </div>
  );
}
