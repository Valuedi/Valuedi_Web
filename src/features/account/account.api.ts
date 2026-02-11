import { API_BASE_URL, getAuthHeaders } from '@/shared/api';
import type { AccountsResponse } from './account.types';

interface ApiError extends Error {
  response?: { status: number; data: unknown };
}

export const accountApi = {
  // 연결된 계좌 목록 조회
  async getAccounts(): Promise<AccountsResponse> {
    const url = `${API_BASE_URL}/api/accounts`;

    console.log('계좌 목록 조회 API 요청:', { url });

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('서버 에러 응답:', errorData);
      } catch {
        errorData = { message: response.statusText };
      }

      const error: ApiError = new Error(`Failed to fetch accounts: ${response.statusText}`);
      error.response = {
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    const result = await response.json();
    console.log('계좌 목록 조회 성공:', result);
    return result;
  },
};
