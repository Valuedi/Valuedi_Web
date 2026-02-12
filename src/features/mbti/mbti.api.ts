/**
 * 금융 MBTI 관련 API 함수들
 */

import { apiGet, apiPost, ApiResponse } from '@/shared/api';
import { createQueryKeys } from '@/shared/api/queryKeys';

// ========== 타입 정의 ==========

export interface FinanceMbtiResult {
  testId: number;
  memberId: number;
  resultType: string;
  anxietyScore: number;
  stabilityScore: number;
  impulseScore: number;
  planningScore: number;
  aggressiveScore: number;
  conservativeScore: number;
  avoidanceScore: number;
  rationalScore: number;
  createdAt: string;
}

export interface MbtiQuestion {
  id: number;
  content: string;
}

export interface MbtiTypeDetail {
  type: string;
  title: string;
  tagline: string;
  detail: string;
  cautions: string[];
  recommendedActions: string[];
}

// ========== Query Key Factory ==========

export const mbtiKeys = createQueryKeys('mbti', {
  questions: () => ['questions'] as const,
  result: () => ['result'] as const,
  typeDetails: () => ['type-details'] as const,
});

// ========== API 함수들 ==========

/** 1. 질문지 리스트 가져오기 */
export const getMbtiQuestions = async (): Promise<ApiResponse<MbtiQuestion[]>> => {
  return apiGet<MbtiQuestion[]>('/api/finance-mbti/questions');
};

/** 2. 답변 제출하기 */
export const submitMbtiTest = async (answers: { questionId: number; choiceValue: number }[]) => {
  return apiPost('/api/finance-mbti/test', { answers });
};

/**
 * 사용자의 금융 MBTI 결과 조회
 * GET /api/finance-mbti/result
 */
export const getFinanceMbtiResultApi = async (): Promise<ApiResponse<FinanceMbtiResult>> => {
  return apiGet<FinanceMbtiResult>('/api/finance-mbti/result');
};

/** 3. 모든 MBTI 유형 상세 정보 가져오기 */
export const getMbtiTypeDetails = async (): Promise<ApiResponse<MbtiTypeDetail[]>> => {
  return apiGet<MbtiTypeDetail[]>('/api/finance-mbti/result/type');
};
