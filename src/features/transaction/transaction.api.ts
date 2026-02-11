/**
 * 거래 관련 API 함수들
 */

import { apiGet, ApiResponse } from '@/shared/api';

// ========== 타입 정의 ==========

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  diffFromLastMonth: number;
}

// ========== API 함수들 ==========

/**
 * 월 소비 내역 요약
 * GET /api/transactions/summary?yearMonth={yearMonth}
 */
export const getTransactionSummaryApi = async (yearMonth: string): Promise<ApiResponse<TransactionSummary>> => {
  return apiGet<TransactionSummary>(`/api/transactions/summary?yearMonth=${yearMonth}`);
};
