import { useLoading } from '@/shared/contexts/LoadingContext';

export const GlobalLoadingSpinner = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          {/* Outer circle */}
          <div className="absolute inset-0 border-4 border-neutral-20 rounded-full" />
          {/* Spinning circle */}
          <div
            className="absolute inset-0 border-4 border-transparent border-t-primary-main rounded-full animate-spin"
            style={{ animationDuration: '1s' }}
          />
          {/* Center circle */}
          <div className="absolute inset-[20%] bg-neutral-5 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary-main border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        <p className="text-neutral-70 text-sm">로딩 중...</p>
      </div>
    </div>
  );
};
