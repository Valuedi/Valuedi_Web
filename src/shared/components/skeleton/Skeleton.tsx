import { cn } from '@/shared/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  lines?: number; // 텍스트 스켈레톤의 줄 수
}

export const Skeleton = ({ className, variant = 'rectangular', width, height, lines = 1 }: SkeletonProps) => {
  const baseClasses = 'animate-pulse bg-neutral-10';

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, 'rounded', index === lines - 1 ? 'w-3/4' : 'w-full', height || 'h-4')}
            style={width ? { width } : undefined}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <div
        className={cn(baseClasses, 'rounded-full', className)}
        style={{
          width: width || height || '40px',
          height: height || width || '40px',
        }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('flex flex-col gap-3 p-4 border border-neutral-20 rounded-lg', className)}>
        <div className={cn(baseClasses, 'h-6 w-1/2 rounded')} />
        <div className={cn(baseClasses, 'h-4 w-full rounded')} />
        <div className={cn(baseClasses, 'h-4 w-2/3 rounded')} />
        <div className={cn(baseClasses, 'h-32 w-full rounded')} />
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, 'rounded', className)}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
};

// 편의를 위한 프리셋 컴포넌트들
export const SkeletonText = ({ lines = 1, className }: { lines?: number; className?: string }) => (
  <Skeleton variant="text" lines={lines} className={className} />
);

export const SkeletonCircle = ({ size = 40, className }: { size?: number; className?: string }) => (
  <Skeleton variant="circular" width={size} height={size} className={className} />
);

export const SkeletonCard = ({ className }: { className?: string }) => (
  <Skeleton variant="card" className={className} />
);
