import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { Typography } from '@/components/typography';
import { useGetProfile } from '@/hooks/MyPage/useGetProfile';
import HomeIconActive from '@/assets/icons/home/HomeActive.svg';
import HomeIconInactive from '@/assets/icons/home/HomeInactive.svg';
import AssetIconActive from '@/assets/icons/home/AssetActive.svg';
import AssetIconInactive from '@/assets/icons/home/AssetInactive.svg';
import RecommendIconActive from '@/assets/icons/home/RecommendActive.svg';
import RecommendIconInactive from '@/assets/icons/home/RecommendInactive.svg';
import GoalIconActive from '@/assets/icons/home/GoalActive.svg';
import GoalIconInactive from '@/assets/icons/home/GoalInactive.svg';

export type NavItem = 'home' | 'asset' | 'recommend' | 'goal';

export interface SidebarNavigationProps {
  activeItem?: NavItem;
  className?: string;
  onItemClick?: (item: NavItem) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeItem = 'home',
  className,
  onItemClick,
}) => {
  const navigate = useNavigate();
  const { userName, mbtiResult } = useGetProfile();

  const navItems: { id: NavItem; label: string; iconActive: string; iconInactive: string }[] = [
    { id: 'home', label: '홈', iconActive: HomeIconActive, iconInactive: HomeIconInactive },
    { id: 'asset', label: '자산', iconActive: AssetIconActive, iconInactive: AssetIconInactive },
    { id: 'recommend', label: '추천', iconActive: RecommendIconActive, iconInactive: RecommendIconInactive },
    { id: 'goal', label: '목표', iconActive: GoalIconActive, iconInactive: GoalIconInactive },
  ];

  const handleItemClick = (itemId: NavItem) => {
    if (onItemClick) {
      onItemClick(itemId);
      return;
    }

    // 기본 네비게이션 동작
    switch (itemId) {
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

  const handleProfileClick = () => {
    navigate('/mypage');
  };

  return (
    <nav
      className={cn(
        'hidden md:flex flex-col',
        'w-[240px] h-screen',
        'bg-white border-r border-neutral-10',
        'shadow-[8px_0px_16px_0px_rgba(25,25,25,0.04)]',
        'sticky top-0',
        className
      )}
    >
      <div className="flex flex-col py-4 flex-1">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          const iconSrc = isActive ? item.iconActive : item.iconInactive;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              className={cn(
                'flex items-center gap-3 px-6 py-3',
                'transition-colors',
                isActive
                  ? 'bg-neutral-10 border-r-2 border-primary-normal text-neutral-90'
                  : 'text-neutral-70 hover:bg-neutral-10'
              )}
            >
              <div className="w-[24px] h-[24px] flex items-center justify-center flex-shrink-0">
                <img src={iconSrc} alt={item.label} className="w-full h-full" />
              </div>
              <Typography
                style={isActive ? 'text-body-2-14-semi-bold' : 'text-body-2-14-regular'}
                className="text-left"
                fontFamily="pretendard"
              >
                {item.label}
              </Typography>
            </button>
          );
        })}
      </div>

      {/* 프로필 섹션 */}
      <div className="border-t border-neutral-10 p-4">
        <button
          type="button"
          onClick={handleProfileClick}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-neutral-10 transition-colors"
        >
          <div className="w-[40px] h-[40px] flex items-center justify-center flex-shrink-0 bg-neutral-10 rounded-lg">
            {mbtiResult?.icon ? (
              <mbtiResult.icon className="w-full h-full" />
            ) : (
              <div className="w-6 h-6 bg-neutral-20 rounded" />
            )}
          </div>
          <div className="flex flex-col items-start flex-1 min-w-0">
            <Typography
              style="text-body-2-14-semi-bold"
              className="text-neutral-90 truncate w-full"
              fontFamily="pretendard"
            >
              {userName}님
            </Typography>
            {mbtiResult?.title && (
              <Typography
                style="text-caption-1-12-regular"
                className="text-neutral-70 truncate w-full"
                fontFamily="pretendard"
              >
                {mbtiResult.title}
              </Typography>
            )}
          </div>
        </button>
      </div>
    </nav>
  );
};
