/**
 * 계좌 관련 API 함수들
 */

import { apiGet } from '@/shared/api';
import { createQueryKeys } from '@/shared/api/queryKeys';
import type { AccountsResponse } from './account.types';

// ========== Query Key Factory ==========

export const accountKeys = createQueryKeys('accounts', {
  lists: () => ['list'] as const,
});

// ========== API 함수들 ==========

/**
 * 연결된 계좌 목록 조회
 */
export const getAccounts = async (): Promise<AccountsResponse> => {
  return apiGet<AccountsResponse['result']>('/api/accounts') as Promise<AccountsResponse>;
};

// ========== API 객체 (하위 호환성) ==========

export const accountApi = {
  getAccounts,
};
