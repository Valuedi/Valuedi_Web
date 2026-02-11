/**
 * 트로피 관련 API
 */

import { apiGet, ApiResponse } from '@/shared/api';
import type { Trophy, MyTrophy, GetMyTrophiesParams } from './trophy.types';

/**
 * 전체 트로피 목록 조회
 * GET /api/trophies
 */
export const getTrophiesApi = async (): Promise<ApiResponse<Trophy[]>> => {
  return apiGet<Trophy[]>('/api/trophies');
};

/**
 * 내 트로피 현황 조회
 * GET /api/members/me/trophies?periodType={periodType}&periodKey={periodKey}
 */
export const getMyTrophiesApi = async (params: GetMyTrophiesParams): Promise<ApiResponse<MyTrophy[]>> => {
  const { periodType = 'MONTHLY', periodKey } = params;
  const searchParams = new URLSearchParams({
    periodType,
    periodKey,
  });
  return apiGet<MyTrophy[]>(`/api/members/me/trophies?${searchParams.toString()}`);
};
