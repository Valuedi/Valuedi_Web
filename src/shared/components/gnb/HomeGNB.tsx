import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/typography';
import ValuediLogo from '@/assets/icons/ValuediLogo.svg?react';
import HamburgerIcon from '@/assets/icons/Hamburger.svg';

export interface GNBTab {
  label: string;
  path: string;
}

export interface HomeGNBProps {
  className?: string;
  onMenuClick?: () => void;
  title?: string; // 페이지별 타이틀을 받을 수 있도록 추가됨
  tabs?: GNBTab[]; // 추가: 탭 메뉴 구성 데이터
}

export const HomeGNB: React.FC<HomeGNBProps> = ({ className, onMenuClick, title, tabs }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 햄버거 버튼 클릭 핸들러: 부모의 커스텀 기능이 있으면 실행하고, 없으면 기본 메뉴로 이동
  const handleHamburgerClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      navigate('/menu');
    }
  };

  return (
    <header className={cn('w-full flex flex-col bg-white sticky top-0 z-50', className)}>
      {/* 상단 영역 */}
      <div className="w-full h-[50px] px-[20px] flex items-center justify-between">
        {/* 왼쪽 영역: 타이틀이 있으면 타이틀을, 없으면 로고를 표시 (클릭 시 홈으로 이동) */}
        <div className="flex items-center gap-[4px] cursor-pointer" onClick={() => navigate('/home')}>
          {title ? (
            <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90">
              {title}
            </Typography>
          ) : (
            <div className="flex items-center justify-center">
              <ValuediLogo className="w-[31px] h-auto" />
            </div>
          )}
        </div>

        {/* 오른쪽 영역: 메뉴 버튼 */}
        <button
          type="button"
          onClick={handleHamburgerClick}
          className={cn('flex items-center justify-center', 'w-[24px] h-[24px]', 'cursor-pointer')}
          aria-label="메뉴 열기"
        >
          <img src={HamburgerIcon} alt="메뉴" className="w-[24px] h-[24px]" />
        </button>
      </div>

      {/* 하단 탭 영역: tabs 프롭이 있을 때만 렌더링 */}
      {tabs && tabs.length > 0 && (
        <div className="flex w-full border-b border-gray-200">
          {tabs.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              (tab.path === '/goal/current' &&
                (location.pathname === '/goal' || location.pathname === '/goal/current'));
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  'flex-1 py-4 text-center text-base transition-all',
                  isActive ? 'font-semibold text-gray-900 border-b-2 border-gray-900' : 'font-medium text-gray-400'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
