import { useNavigate, useLocation } from 'react-router-dom';
import Hamburger from '@/assets/icons/hamburger.svg';
import { paths } from '@/router/Router';

const GoalGNB = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // paths 객체를 활용한 활성화 상태 체크 (오타 방지)
  const isCurrentActive = location.pathname === paths.goal.current || location.pathname === '/goal';
  const isPastActive = location.pathname === paths.goal.past;

  return (
    <div className="bg-white">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between px-5 py-5">
        <h1 className="text-xl font-bold text-gray-900">목표</h1>
        <button type="button" className="p-1">
          <img src={Hamburger} alt="menu" className="w-6 h-6" />
        </button>
      </div>

      {/* 탭 메뉴 영역 */}
      <div className="flex w-full border-b border-gray-200">
        <button
          onClick={() => navigate(paths.goal.current)}
          className={`flex-1 py-4 text-center text-base transition-all ${
            isCurrentActive 
              ? 'font-bold text-gray-900 border-b-2 border-gray-900' 
              : 'font-medium text-gray-400'
          }`}
        >
          현재 목표
        </button>
        <button
          onClick={() => navigate(paths.goal.past)}
          className={`flex-1 py-4 text-center text-base transition-all ${
            isPastActive 
              ? 'font-bold text-gray-900 border-b-2 border-gray-900' 
              : 'font-medium text-gray-400'
          }`}
        >
          지난 목표
        </button>
      </div>
    </div>
  );
};

export default GoalGNB;
