import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/auth.store';
import { ApiError, setGlobalAuthErrorHandler } from '@/shared/api/apiClient';
import { useToast } from '@/shared/contexts/ToastContext';

/**
 * 전역 인증 에러 핸들러 컴포넌트
 * 401 재발급 실패 시 세션 만료 안내 및 로그인 페이지로 이동을 처리합니다.
 */
export const AuthErrorHandler = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const { showToast } = useToast();

  useEffect(() => {
    const handleAuthError = (error: ApiError) => {
      // 인증 상태 초기화
      clearAuth();

      // 토스트 메시지 표시
      showToast(error.message || '세션이 만료되었습니다. 다시 로그인해주세요.', 3000);

      // 현재 경로가 로그인 페이지가 아닌 경우에만 이동
      if (window.location.pathname !== '/login' && window.location.pathname !== '/login/form') {
        // 약간의 지연을 두어 토스트 메시지를 볼 수 있도록 함
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 500);
      }
    };

    // 전역 인증 에러 핸들러 등록
    setGlobalAuthErrorHandler(handleAuthError);

    // 컴포넌트 언마운트 시 핸들러 제거
    return () => {
      setGlobalAuthErrorHandler(null);
    };
  }, [navigate, clearAuth, showToast]);

  return null;
};
