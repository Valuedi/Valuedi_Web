/**
 * 트로피 관련 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { getTrophiesApi, getMyTrophiesApi, trophyKeys } from './trophy.api';
import type { GetMyTrophiesParams, Trophy, MyTrophy } from './trophy.types';

/**
 * 전체 트로피 목록 조회 훅
 * GET /api/trophies
 */
export function useTrophies() {
  return useQuery({
    queryKey: trophyKeys.all(),
    queryFn: async () => {
      const response = await getTrophiesApi();
      if (!response.isSuccess || !response.result) {
        return [] as Trophy[];
      }
      return Array.isArray(response.result) ? response.result : ([] as Trophy[]);
    },
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 1,
  });
}

/**
 * 내 트로피 현황 조회 훅
 * GET /api/members/me/trophies?periodType={periodType}&periodKey={periodKey}
 */
export function useMyTrophies(params: GetMyTrophiesParams) {
  return useQuery({
    queryKey: trophyKeys.my(params),
    queryFn: async () => {
      const response = await getMyTrophiesApi(params);
      if (!response.isSuccess || !response.result) {
        return [] as MyTrophy[];
      }
      return Array.isArray(response.result) ? response.result : ([] as MyTrophy[]);
    },
    staleTime: 2 * 60 * 1000, // 2분간 캐시 유지
    retry: 1,
  });
}
