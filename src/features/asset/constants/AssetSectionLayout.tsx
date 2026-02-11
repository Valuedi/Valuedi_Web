import { ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface AssetSectionLayoutProps {
  children: ReactNode;
  className?: string;
  /** 하단 회색 구분선(8px) 표시 여부 (기본값: true) */
  showDivider?: boolean;
}

export const AssetSectionLayout = ({ children, className, showDivider = true }: AssetSectionLayoutProps) => {
  return (
    <section className={cn('px-5 py-8 bg-white', showDivider && 'border-b-[8px] border-neutral-5', className)}>
      {children}
    </section>
  );
};
