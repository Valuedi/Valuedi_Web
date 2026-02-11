import { cn } from '@/shared/utils/cn';

export const Skeleton = ({ className }: { className?: string }) => {
  return <div className={cn('animate-pulse bg-neutral-10 rounded', className)} />;
};
