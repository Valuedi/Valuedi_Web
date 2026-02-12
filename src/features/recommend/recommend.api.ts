/**
 * 추천 상품 관련 API 함수들
 */

import { apiGet, apiPost, ApiResponse } from '@/shared/api';
import { createQueryKeys } from '@/shared/api/queryKeys';

// ========== 타입 정의 ==========

export interface RecommendedProduct {
  korCoNm: string;
  finPrdtCd: string;
  finPrdtNm: string;
  rsrvType: string;
  rsrvTypeNm: string;
  score?: number; // POST 응답에만 포함
}

export interface RecommendationsResponse {
  totalCount: number;
  maxPageNo: number;
  nowPageNo: number;
  products: RecommendedProduct[];
  status?: string;
  message?: string;
}

export interface Top3RecommendationsResponse {
  totalCount: number;
  maxPageNo: number;
  nowPageNo: number;
  products: RecommendedProduct[];
}

export interface CreateRecommendationsResponse {
  products: RecommendedProduct[];
  rationale: string;
}

export interface SavingsOption {
  intrRateType: string;
  intrRateTypeNm: string;
  rsrvType: string;
  rsrvTypeNm: string;
  saveTrm: string;
  intrRate: number;
  intrRate2: number;
}

export interface SavingsDetailProduct {
  korCoNm: string;
  finPrdtCd: string;
  finPrdtNm: string;
  basicRate: number;
  maxRate: number;
  joinWay: string;
  mtrtInt: string;
  spclCnd: string;
  joinDeny: string;
  joinMember: string;
  etcNote: string;
  maxLimit: string | null;
  options: SavingsOption[];
}

// ========== Query Key Factory ==========

export const recommendKeys = createQueryKeys('recommendations', {
  savings: () => ['savings'] as const,
  savingsList: (rsrvType?: 'S' | 'F') => ['savings', 'list', rsrvType] as const,
  savingsDetail: (finPrdtCd: string) => ['savings', 'detail', finPrdtCd] as const,
  top3: () => ['savings', 'top3'] as const,
});

// ========== API 함수들 ==========

/**
 * 최신 추천 15개 조회
 * GET /api/savings/recommendations
 * @param rsrvType 적립유형 필터 (S=정기적금, F=자유적금). 미입력 시 전체
 */
export const getSavingsRecommendationsApi = async (
  rsrvType?: 'S' | 'F'
): Promise<ApiResponse<RecommendationsResponse>> => {
  const queryParams = rsrvType ? `?rsrvType=${rsrvType}` : '';
  return apiGet<RecommendationsResponse>(`/api/savings/recommendations${queryParams}`);
};

/**
 * 적금 추천 생성/저장 (15개)
 * POST /api/savings/recommendations
 */
export const createSavingsRecommendationsApi = async (): Promise<ApiResponse<CreateRecommendationsResponse>> => {
  return apiPost<CreateRecommendationsResponse>('/api/savings/recommendations');
};

/**
 * 추천 상품 상세 조회
 * GET /api/savings/recommendations/{finPrdtCd}
 * @param finPrdtCd 금융상품 코드
 */
export const getSavingsDetailApi = async (finPrdtCd: string): Promise<ApiResponse<SavingsDetailProduct>> => {
  return apiGet<SavingsDetailProduct>(`/api/savings/recommendations/${finPrdtCd}`);
};

/**
 * 최신 추천 Top3 조회
 * GET /api/savings/recommendations/top3
 */
export const getTop3RecommendationsApi = async (): Promise<ApiResponse<Top3RecommendationsResponse>> => {
  return apiGet<Top3RecommendationsResponse>('/api/savings/recommendations/top3');
};
