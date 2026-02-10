import { useQuery } from '@tanstack/react-query';
import { getFinanceMbtiResultApi, getMbtiTypeDetails } from '@/features/mbti/mbti.api';
import DefaultIcon from '@/assets/icons/Mbti.svg?react';
import { MBTI_LOCAL_EXTENSIONS } from '@/features/mbti/constants/mbtiType';

export const useGetMbtiTestResult = () => {
  return useQuery({
    queryKey: ['mbtiResult'],
    queryFn: async () => {
      try {
        const [myRes, typesRes] = await Promise.all([
          getFinanceMbtiResultApi().catch(() => null), // MBTI 결과가 없을 수 있음
          getMbtiTypeDetails().catch(() => null), // MBTI 타입 상세 정보
        ]);

        // MBTI 결과가 없으면 null 반환
        if (!myRes?.result || !typesRes?.result) {
          return null;
        }

        const myData = myRes.result;
        const serverDetail = typesRes.result.find((t) => t.type === myData.resultType);

        // 서버에서 해당 타입의 상세 정보를 찾지 못한 경우 기본값 사용
        if (!serverDetail) {
          return null;
        }

        const localExtension = MBTI_LOCAL_EXTENSIONS[myData.resultType] || {
          icon: DefaultIcon,
          extraDescription: '',
        };

        return {
          ...myData, // 내 점수 (anxietyScore 등)
          ...serverDetail, // 서버의 유형 설명 (title, tagline 등)
          ...localExtension, // 내가 직접 만든 아이콘과 추가 설명
        };
      } catch (error) {
        console.error('MBTI 결과 조회 실패:', error);
        return null;
      }
    },
    retry: false, // MBTI 결과가 없을 때는 재시도하지 않음
  });
};
