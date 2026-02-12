import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth';
import { getUserInfoApi } from '@/features/auth/auth.api';

/**
 * 사용자 이름을 가져오는 훅
 * API를 호출해서 사용자 정보를 가져오고, auth store에 저장
 */
export const useUserName = (): string => {
  const { user, setUser, isAuthenticated } = useAuthStore();

  // 로그인 상태일 때만 사용자 정보 조회
  const { data: userInfoData } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getUserInfoApi(),
    enabled: isAuthenticated && !user?.name, // 로그인 상태이고 이름이 없을 때만 호출
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });

  // API 응답으로 사용자 정보 업데이트
  useEffect(() => {
    // user?.name이 이미 있으면 업데이트하지 않음 (무한 루프 방지)
    if (userInfoData?.result && !user?.name) {
      const currentUser = useAuthStore.getState().user; // 최신 user 상태 가져오기
      setUser({
        id: userInfoData.result.memberId,
        name: userInfoData.result.name,
        ...currentUser, // 기존 user 정보 유지 (email 등)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfoData]); // userInfoData만 의존성으로 사용하여 무한 루프 방지

  return user?.name || '회원';
};
