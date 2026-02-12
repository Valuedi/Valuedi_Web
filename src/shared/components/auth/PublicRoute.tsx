import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';

/**
 * PublicRoute
 * - 이미 로그인된 사용자가 로그인/회원가입 페이지에 접근하지 못하도록 막는 가드
 */
export const PublicRoute = () => {
  const { isAuthenticated } = useAuthStore();

  // 이미 로그인된 상태라면 홈으로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // 비로그인 상태라면 하위 라우트를 그대로 렌더링
  return <Outlet />;
};
