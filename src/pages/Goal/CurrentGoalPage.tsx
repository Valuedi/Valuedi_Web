import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalGNB from '@/components/goal/GoalGNB';
import { BottomNavigation } from '@/components/gnb/BottomNavigation';
import DropDown from '@/assets/icons/goal/Dropdown.svg';
import ExBank from '@/assets/icons/goal/ExBank.svg';
import GoalCard from '@/components/goal/GoalCard';

/* 목데이터 */
const mockGoals = [
  { id: 1, bankIcon: ExBank, title: '목표진행입니다', progress: 32, targetAmount: 10000000, remainingDays: 91 },
  { id: 2, bankIcon: ExBank, title: '목표진행입니다', progress: 32, targetAmount: 10000000, remainingDays: 91 },
  { id: 3, bankIcon: ExBank, title: '목표진행입니다', progress: 32, targetAmount: 10000000, remainingDays: 91 },
  { id: 4, bankIcon: ExBank, title: '목표진행입니다', progress: 32, targetAmount: 10000000, remainingDays: 91 },
  { id: 5, bankIcon: ExBank, title: '목표진행입니다', progress: 32, targetAmount: 10000000, remainingDays: 91 },
];

export const CurrentGoalPage = () => {
  const [sortBy, setSortBy] = useState<'latest' | 'achieve'>('latest');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <div className="sticky top-0 z-20 w-full bg-white">
        <GoalGNB />
      </div>

      <main className="flex-1 pb-24">
        <div className="flex flex-col gap-5 p-5">
          {/* 목표 추가 버튼: paths.goal.create (추가 필요) 또는 직접 경로 */}
          <div
            onClick={() => navigate('/goal/create')} // paths에 추가되어 있다면 교체 권장
            className="flex items-center gap-4 p-6 transition-colors bg-white shadow-sm cursor-pointer rounded-2xl active:bg-gray-50"
          >
            <div className="flex items-center justify-center w-12 h-12 text-gray-400 border border-gray-200 rounded-full">
              <span className="text-3xl font-light">+</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">또 다른 목표가 있나요?</span>
              <span className="text-lg font-bold text-gray-900">목표 추가하기</span>
            </div>
          </div>

          {/* 정렬 필터 UI */}
          <div className="flex items-center gap-2 px-1 text-[13px] font-medium">
            <button 
              onClick={() => setSortBy('latest')} 
              className={`transition-colors ${sortBy === 'latest' ? 'text-gray-900' : 'text-gray-400'}`}
            >
              최신순
            </button>
            <span className="text-gray-200">·</span>
            <button 
              onClick={() => setSortBy('achieve')} 
              className={`transition-colors ${sortBy === 'achieve' ? 'text-gray-900' : 'text-gray-400'}`}
            >
              달성순
            </button>
          </div>

          {/* Goal 리스트 */}
          <div className="flex flex-col gap-4">
            {mockGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} type="current" />
            ))}
          </div>

          <button className="flex items-center justify-center gap-1 py-6 text-sm font-medium text-gray-400 transition-opacity active:opacity-50">
            목록 더 보기
            <img src={DropDown} alt="dropdown" className="w-4 h-4 opacity-40" />
          </button>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100">
        <BottomNavigation activeItem="goal" />
      </footer>
    </div>
  );
};
