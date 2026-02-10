import React from 'react';
import { cn } from '@/utils/cn';
import { Typography } from '../typography';
import BankIcon from '@/assets/icons/mypage/Bank.svg';
import CardIcon from '@/assets/icons/mypage/Card.svg';

export interface ConnectionDetailListItemProps {
  displayName: string;
  accountNumber: string;
  isCardType: boolean;
  className?: string;
  bgColor?: string; // 💡 외부에서 특정 색상을 주입하고 싶을 때 사용
}

const ConnectionDetailListItem: React.FC<ConnectionDetailListItemProps> = ({
  displayName,
  accountNumber,
  isCardType,
  className,
  bgColor,
}) => {
  // 💡 타입별 기본 배경색 설정 (시안의 bg-bank-plus 등이 있다면 변수로 활용)
  const defaultBgColor = isCardType ? 'bg-atomic-yellow-95' : 'bg-bank-plus';

  return (
    <div className={cn('flex items-center gap-[8px] py-2', className)}>
      {/* 💡 아이콘 박스 규격 수정 및 배경색 로직 적용 */}
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden',
          !bgColor && defaultBgColor // bgColor가 없을 때만 기본 색상 적용
        )}
        style={bgColor ? { backgroundColor: bgColor } : undefined}
      >
        <img src={isCardType ? CardIcon : BankIcon} alt="type icon" />
      </div>

      <div className="flex flex-col min-w-0">
        <Typography variant="body-2" weight="semi-bold" className="text-neutral-90 truncate">
          {displayName}
        </Typography>
        <Typography variant="caption-1" className="text-neutral-70">
          {accountNumber}
        </Typography>
      </div>
    </div>
  );
};

export default ConnectionDetailListItem;
