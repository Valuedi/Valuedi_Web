import { PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';

interface MobileLayoutProps extends PropsWithChildren {
  className?: string;
}

export const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  return (
    <div className={cn('min-h-screen w-full bg-gray-100 flex justify-center items-center')}>
      <div
        className={cn(
          'w-full max-w-[360px] min-h-screen bg-white relative flex flex-col shadow-lg',
          'pt-[env(safe-area-inset-top)]',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
