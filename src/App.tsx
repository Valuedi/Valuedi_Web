import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient, setGlobalHandlers } from './lib/queryClient';
import { router } from './router/Router';
import { ToastProvider, useToast } from '@/shared/contexts/ToastContext';
import { LoadingProvider } from '@/shared/contexts/LoadingContext';
import { GlobalLoadingSpinner } from '@/shared/components/common/GlobalLoadingSpinner';
import { AuthErrorHandler } from '@/shared/components/common/AuthErrorHandler';
import { ApiError } from '@/shared/api/apiClient';
import { useEffect } from 'react';

/**
 * 전역 핸들러 설정 컴포넌트
 * TanStack Query의 전역 에러 핸들러를 설정합니다.
 */
const GlobalHandlers = () => {
  const { showToast } = useToast();

  useEffect(() => {
    // TanStack Query 전역 핸들러 설정
    setGlobalHandlers({
      toast: showToast,
      authError: (_error: ApiError) => {
        // 인증 에러는 AuthErrorHandler에서 처리하므로 여기서는 추가 처리 없음
        // 필요시 추가 로직 구현 가능
      },
    });
  }, [showToast]);

  return null;
};

/**
 * 앱 루트 컴포넌트
 */
function AppContent(): JSX.Element {
  return (
    <>
      <GlobalHandlers />
      <AuthErrorHandler />
      <GlobalLoadingSpinner />
      <RouterProvider router={router} />
    </>
  );
}

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <LoadingProvider>
          <AppContent />
        </LoadingProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
