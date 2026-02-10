import { PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';

interface MobileLayoutProps extends PropsWithChildren {
  className?: string;
}

export const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  return (
    <div className={cn('min-h-screen w-full bg-gray-100 flex justify-center items-start md:items-start')}>
      <div
        className={cn(
          // 모바일: 전체 너비, 그림자 적용
          'w-full min-h-screen bg-white relative flex flex-col',
          'shadow-lg md:shadow-none',
          'pt-[env(safe-area-inset-top)]',
          // 태블릿 이상: 컨테이너 제한 및 중앙 정렬
          'md:max-w-full md:w-full',
          // 데스크탑: 최대 너비 제한
          'lg:max-w-[1920px]',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
