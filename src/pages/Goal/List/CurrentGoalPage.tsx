import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeGNB } from '@/shared/components/gnb/HomeGNB';
import { BottomNavigation } from '@/shared/components/gnb/BottomNavigation';
import { SidebarNavigation } from '@/shared/components/gnb/SidebarNavigation';
import DropDown from '@/assets/icons/goal/Dropdown.svg';
import GoalCard from '@/shared/components/goal/GoalCard';
import { useActiveGoals } from '@/features/goal';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import { paths } from '@/router/paths';

export const CurrentGoalPage = () => {
  const [sortBy, setSortBy] = useState<'latest' | 'achieve'>('latest');
  const navigate = useNavigate();

  // API 연결
  const sortParam = sortBy === 'latest' ? 'TIME_DESC' : 'PROGRESS_DESC';
  const { data, isLoading, error } = useActiveGoals(sortParam);
  const goals = data?.result.goals || [];

  const handleNavClick = (item: 'home' | 'asset' | 'recommend' | 'goal') => {
    switch (item) {
      case 'home':
        navigate('/home');
        break;
      case 'asset':
        navigate('/asset');
        break;
      case 'recommend':
        navigate('/recommend');
        break;
      case 'goal':
        navigate('/goal/current');
        break;
    }
  };

  return (
    <MobileLayout>
      {/* 데스크탑 레이아웃: 사이드바 + 메인 콘텐츠 */}
      <div className="flex flex-row min-h-screen md:h-screen">
        {/* 데스크탑 사이드바 */}
        <SidebarNavigation activeItem="goal" onItemClick={handleNavClick} />

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col min-h-screen bg-gray-100">
          <div className="sticky top-0 z-20 w-full bg-white">
            <HomeGNB
              title="목표"
              tabs={[
                { label: '현재 목표', path: paths.goal.current },
                { label: '지난 목표', path: paths.goal.past },
              ]}
            />
          </div>

          <main className="flex-1 pb-24 md:pb-0">
            <div className="flex flex-col gap-5 p-5 md:p-8 lg:p-10">
              {/* 목표 추가 버튼 */}
              <div
                onClick={() => navigate('/goal/create')}
                className="flex items-center gap-4 p-3 transition-colors bg-white shadow-sm cursor-pointer rounded-xl active:bg-gray-50"
              >
                <div className="flex items-center justify-center w-8 h-8 text-gray-400 border border-gray-200 rounded-full">
                  <span className="text-xl font-light">+</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400">또 다른 목표가 있나요?</span>
                  <span className="text-sm font-semibold text-gray-900">목표 추가하기</span>
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
              <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {isLoading ? (
                  <div className="text-center text-gray-400 md:col-span-full">로딩 중...</div>
                ) : error ? (
                  <div className="text-center text-red-500 md:col-span-full">목표를 불러오는데 실패했습니다.</div>
                ) : goals.length === 0 ? (
                  <div className="text-center text-gray-400 md:col-span-full">목표가 없습니다.</div>
                ) : (
                  goals.map((goal) => (
                    <GoalCard
                      key={goal.goalId}
                      goal={{
                        id: goal.goalId,
                        title: goal.title,
                        progress: goal.achievementRate,
                        targetAmount: goal.savedAmount,
                        remainingDays: goal.remainingDays,
                        colorCode: goal.colorCode,
                        iconId: goal.iconId,
                      }}
                      type="current"
                    />
                  ))
                )}
              </div>

              <button className="flex items-center justify-center gap-1 py-6 text-sm font-medium text-gray-400 transition-opacity active:opacity-50 md:col-span-full">
                목록 더 보기
                <img src={DropDown} alt="dropdown" className="w-4 h-4 opacity-40" />
              </button>
            </div>
          </main>

          {/* Bottom Navigation - 모바일 전용 */}
          <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 md:hidden">
            <BottomNavigation activeItem="goal" onItemClick={handleNavClick} />
          </footer>
        </div>
      </div>
    </MobileLayout>
  );
};
