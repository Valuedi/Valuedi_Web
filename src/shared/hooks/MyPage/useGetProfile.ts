import { MY_TROPHIES, TROPHY_GUIDE } from '@/features/mypage/constants/trophy';
import { useGetMbtiTestResult } from '@/shared/hooks/Mbti/useGetMbtiTestResult';
import { useAuthStore } from '@/features/auth';

export const useGetProfile = () => {
  const mbtiResult = useGetMbtiTestResult();
  const { user } = useAuthStore();
  const userName = user?.name || '회원';
  return {
    userName,
    mbtiResult: mbtiResult?.data,
    isLoading: mbtiResult?.isLoading || false,
    myTrophies: MY_TROPHIES,
    trophyGuide: TROPHY_GUIDE,
  };
};
