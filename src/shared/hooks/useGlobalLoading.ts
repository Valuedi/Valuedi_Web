import { useEffect } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useLoading } from '@/shared/contexts/LoadingContext';

/**
 * TanStack Query의 전역 로딩 상태를 전역 로딩 컨텍스트와 연동하는 훅
 *
 * 사용 예시:
 * ```tsx
 * function MyComponent() {
 *   useGlobalLoading(); // 이 컴포넌트가 마운트된 동안 전역 로딩 상태 연동
 *   // ...
 * }
 * ```
 *
 * 또는 특정 쿼리 키에 대해서만 로딩을 표시하려면:
 * ```tsx
 * useGlobalLoading(['myQueryKey'] as const);
 * ```
 */
export const useGlobalLoading = (queryKeys?: readonly unknown[]) => {
  const { showLoading, hideLoading } = useLoading();

  // 모든 쿼리/뮤테이션의 로딩 상태 확인
  const isFetching = useIsFetching(queryKeys ? { queryKey: queryKeys } : undefined);
  const isMutating = useIsMutating();

  useEffect(() => {
    const isLoading = isFetching > 0 || isMutating > 0;

    if (isLoading) {
      showLoading();
    } else {
      hideLoading();
    }

    return () => {
      // 컴포넌트 언마운트 시 로딩 숨김
      hideLoading();
    };
  }, [isFetching, isMutating, showLoading, hideLoading]);
};
