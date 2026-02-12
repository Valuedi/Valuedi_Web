import React from 'react';
import { cn } from '@/shared/utils/cn';
import HamburgerIcon from '@/assets/icons/Hamburger.svg';
import XIcon from '@/assets/icons/X.svg';

export interface MenuToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const MenuToggleButton: React.FC<MenuToggleButtonProps> = ({ isOpen, onClick, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('flex items-center justify-center', 'w-[24px] h-[24px]', 'cursor-pointer', className)}
      aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
      aria-expanded={isOpen}
    >
      <img src={isOpen ? XIcon : HamburgerIcon} width="24" height="24" alt={isOpen ? 'close menu' : 'open menu'} />
    </button>
  );
};

export default MenuToggleButton;
