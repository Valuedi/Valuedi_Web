import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/auth.store';
import { ApiError, setGlobalAuthErrorHandler } from '@/shared/api/apiClient';
import { useToast } from '@/shared/contexts/ToastContext';
import { getErrorMessage } from '@/shared/utils/errorHandler';

/**
 * 전역 인증 에러 핸들러 컴포넌트
 * 401 재발급 실패 시 세션 만료 안내 및 로그인 페이지로 이동을 처리합니다.
 *
 * 실무 요구사항: Hard Redirect를 사용하여 세션 만료 시 확실하게 페이지를 리프레시하며 이동
 */
export const AuthErrorHandler = () => {
  const { clearAuth } = useAuthStore();
  const { showToast } = useToast();

  useEffect(() => {
    const handleAuthError = (error: ApiError) => {
      // 인증 상태 초기화
      clearAuth();

      // 사용자 친화적 메시지 가져오기
      const errorMessage = getErrorMessage(error);

      // 토스트 메시지 표시
      showToast(errorMessage, 3000);

      // 현재 경로가 로그인 페이지가 아닌 경우에만 Hard Redirect
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/login/form') {
        // 약간의 지연을 두어 토스트 메시지를 볼 수 있도록 함
        setTimeout(() => {
          // Hard Redirect: window.location.href를 사용하여 페이지를 완전히 리프레시하며 이동
          // 이는 React Router의 navigate보다 더 확실하며, 모든 상태를 초기화합니다.
          // 금융 서비스에서는 보안상 더 안전한 방법입니다.
          window.location.href = '/login';
        }, 500);
      }
    };

    // 전역 인증 에러 핸들러 등록
    setGlobalAuthErrorHandler(handleAuthError);

    // 컴포넌트 언마운트 시 핸들러 제거
    return () => {
      setGlobalAuthErrorHandler(null);
    };
  }, [clearAuth, showToast]);

  return null;
};
