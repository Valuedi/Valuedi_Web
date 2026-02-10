import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { Typography } from '@/components/typography';
import HomeIconActive from '@/assets/icons/home/HomeActive.svg';
import HomeIconInactive from '@/assets/icons/home/HomeInactive.svg';
import AssetIconActive from '@/assets/icons/home/AssetActive.svg';
import AssetIconInactive from '@/assets/icons/home/AssetInactive.svg';
import RecommendIconActive from '@/assets/icons/home/RecommendActive.svg';
import RecommendIconInactive from '@/assets/icons/home/RecommendInactive.svg';
import GoalIconActive from '@/assets/icons/home/GoalActive.svg';
import GoalIconInactive from '@/assets/icons/home/GoalInactive.svg';

export type BottomNavItem = 'home' | 'asset' | 'recommend' | 'goal';

export interface BottomNavigationProps {
  activeItem?: BottomNavItem;
  className?: string;
  onItemClick?: (item: BottomNavItem) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeItem = 'home', className, onItemClick }) => {
  const navigate = useNavigate();

  const navItems: { id: BottomNavItem; label: string; iconActive: string; iconInactive: string }[] = [
    { id: 'home', label: '홈', iconActive: HomeIconActive, iconInactive: HomeIconInactive },
    { id: 'asset', label: '자산', iconActive: AssetIconActive, iconInactive: AssetIconInactive },
    { id: 'recommend', label: '추천', iconActive: RecommendIconActive, iconInactive: RecommendIconInactive },
    { id: 'goal', label: '목표', iconActive: GoalIconActive, iconInactive: GoalIconInactive },
  ];

  const handleItemClick = (itemId: BottomNavItem) => {
    if (onItemClick) {
      onItemClick(itemId);
      return;
    }

    // 기본 네비게이션 동작
    switch (itemId) {
      case 'home':
        navigate('/');
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
    <nav
      className={cn(
        // 모바일: 하단 고정
        'md:hidden',
        'w-full h-[64px] flex items-center justify-center',
        'bg-white border-t border-neutral-10',
        'shadow-[0px_-8px_16px_0px_rgba(25,25,25,0.04)]',
        className
      )}
    >
      <div className="flex items-center justify-center w-full">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          const iconSrc = isActive ? item.iconActive : item.iconInactive;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              className={cn('flex flex-col gap-[4px] items-center justify-center', 'p-[10px] flex-1 max-w-[90px]')}
            >
              <div className="w-[24px] h-[24px] flex items-center justify-center">
                <img src={iconSrc} alt={item.label} className="w-full h-full" />
              </div>
              <Typography
                style={isActive ? 'text-caption-1-12-semi-bold' : 'text-caption-1-12-regular'}
                className={cn('text-center', isActive ? 'text-neutral-90' : 'text-neutral-70')}
                fontFamily="pretendard"
              >
                {item.label}
              </Typography>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
