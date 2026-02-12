import { MY_TROPHIES, TROPHY_GUIDE } from '@/features/mypage/constants/trophy';
import { useGetMbtiTestResult } from '@/shared/hooks/Mbti/useGetMbtiTestResult';
import { useUserName } from '@/shared/hooks/useUserName';

export const useGetProfile = () => {
  const mbtiResult = useGetMbtiTestResult();
  const userName = useUserName();
  return {
    userName,
    mbtiResult: mbtiResult?.data,
    isLoading: mbtiResult?.isLoading || false,
    myTrophies: MY_TROPHIES,
    trophyGuide: TROPHY_GUIDE,
  };
};
