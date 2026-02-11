import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSavingsRecommendationsApi,
  createSavingsRecommendationsApi,
  getSavingsDetailApi,
  getTop3RecommendationsApi,
  recommendKeys,
} from './recommend.api';

/**
 * 최신 추천 15개 조회
 * @param rsrvType 적립유형 필터 (S=정기적금, F=자유적금). 미입력 시 전체
 * @param refetchInterval 폴링 간격 (ms). undefined면 폴링 안함
 */
export function useSavingsRecommendations(rsrvType?: 'S' | 'F', refetchInterval?: number) {
  return useQuery({
    queryKey: recommendKeys.savingsList(rsrvType),
    queryFn: () => getSavingsRecommendationsApi(rsrvType),
    select: (data) => data.result,
    refetchInterval: refetchInterval,
    // 폴링 중일 때는 결과가 있으면 자동으로 중단
    refetchIntervalInBackground: false,
  });
}

/**
 * 적금 추천 생성/저장 (15개)
 */
export function useCreateSavingsRecommendations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createSavingsRecommendationsApi(),
    onSuccess: () => {
      // 모든 추천 목록 쿼리 무효화 (모든 필터 타입)
      queryClient.invalidateQueries({ queryKey: recommendKeys.savingsList() });
      queryClient.invalidateQueries({ queryKey: recommendKeys.top3() });
    },
  });
}

/**
 * 추천 상품 상세 조회
 * @param finPrdtCd 금융상품 코드
 */
export function useSavingsDetail(finPrdtCd?: string) {
  return useQuery({
    queryKey: recommendKeys.savingsDetail(finPrdtCd!),
    queryFn: () => getSavingsDetailApi(finPrdtCd!),
    enabled: !!finPrdtCd,
    select: (data) => data.result,
  });
}

/**
 * 최신 추천 Top3 조회
 */
export function useTop3Recommendations() {
  return useQuery({
    queryKey: recommendKeys.top3(),
    queryFn: () => getTop3RecommendationsApi(),
    select: (data) => data.result,
  });
}
