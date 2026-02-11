import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { ApiError } from '@/shared/api/apiClient';

// 전역 에러/토스트 핸들러 (런타임에 주입)
let globalToastHandler: ((message: string) => void) | null = null;
let globalAuthErrorHandler: ((error: ApiError) => void) | null = null;

/**
 * 전역 핸들러 설정 함수들
 * App.tsx에서 초기화 시 호출됩니다.
 */
export const setGlobalHandlers = (handlers: {
  toast?: (message: string) => void;
  loading?: { show: () => void; hide: () => void };
  authError?: (error: ApiError) => void;
}) => {
  if (handlers.toast) globalToastHandler = handlers.toast;
  // loading 핸들러는 현재 사용하지 않지만, 향후 확장을 위해 파라미터는 유지
  // if (handlers.loading) { /* 향후 사용 예정 */ }
  if (handlers.authError) globalAuthErrorHandler = handlers.authError;
};

// Query Cache 설정: 전역 에러 처리
const queryCache = new QueryCache({
  onError: (error) => {
    // ApiError인 경우에만 처리
    if (error instanceof ApiError) {
      // 401 에러는 인증 에러 핸들러로 처리 (토큰 재발급 실패 등)
      if (error.status === 401 && globalAuthErrorHandler) {
        globalAuthErrorHandler(error);
        return;
      }

      // 네트워크 에러는 별도 처리
      if (error.code === 'NETWORK_ERROR' && globalToastHandler) {
        globalToastHandler('네트워크 연결을 확인해주세요.');
        return;
      }

      // 기타 에러는 토스트로 표시
      if (globalToastHandler && error.status >= 400) {
        // 일부 에러는 사용자에게 표시하지 않음
        const silentErrorCodes = ['MBTI404_2'];
        if (!silentErrorCodes.includes(error.code)) {
          globalToastHandler(error.message || '오류가 발생했습니다.');
        }
      }
    } else if (globalToastHandler) {
      // 예상치 못한 에러
      globalToastHandler('알 수 없는 오류가 발생했습니다.');
    }
  },
});

// Mutation Cache 설정: 전역 에러 처리
const mutationCache = new MutationCache({
  onError: (error) => {
    // ApiError인 경우에만 처리
    if (error instanceof ApiError) {
      // 401 에러는 인증 에러 핸들러로 처리
      if (error.status === 401 && globalAuthErrorHandler) {
        globalAuthErrorHandler(error);
        return;
      }

      // 네트워크 에러는 별도 처리
      if (error.code === 'NETWORK_ERROR' && globalToastHandler) {
        globalToastHandler('네트워크 연결을 확인해주세요.');
        return;
      }

      // 기타 에러는 토스트로 표시
      if (globalToastHandler && error.status >= 400) {
        const silentErrorCodes = ['MBTI404_2'];
        if (!silentErrorCodes.includes(error.code)) {
          globalToastHandler(error.message || '요청 처리 중 오류가 발생했습니다.');
        }
      }
    } else if (globalToastHandler) {
      // 예상치 못한 에러
      globalToastHandler('알 수 없는 오류가 발생했습니다.');
    }
  },
});

// TanStack Query 클라이언트 설정
export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // 401 에러는 재시도하지 않음 (토큰 재발급 로직에서 처리)
        if (error instanceof ApiError && error.status === 401) {
          return false;
        }
        // 네트워크 에러는 1회 재시도
        if (error instanceof ApiError && error.code === 'NETWORK_ERROR') {
          return failureCount < 1;
        }
        // 기타 에러는 1회 재시도
        return failureCount < 1;
      },
      staleTime: 5 * 60 * 1000, // 5분
      // 로딩 상태는 전역 핸들러로 관리하지 않음 (각 컴포넌트에서 개별 처리)
      // 필요시 useIsFetching, useIsMutating 훅 사용
    },
    mutations: {
      retry: (failureCount, error) => {
        // 401 에러는 재시도하지 않음
        if (error instanceof ApiError && error.status === 401) {
          return false;
        }
        // 네트워크 에러는 1회 재시도
        if (error instanceof ApiError && error.code === 'NETWORK_ERROR') {
          return failureCount < 1;
        }
        // 기타 에러는 재시도하지 않음 (사용자 액션은 즉시 피드백 필요)
        return false;
      },
    },
  },
});
