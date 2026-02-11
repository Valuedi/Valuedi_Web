/**
 * 금융 연동 관련 API 함수들
 */

import { apiGet, apiPost, apiDelete, ApiResponse, ApiError } from '@/shared/api';
import { createQueryKeys } from '@/shared/api/queryKeys';

// ApiError를 re-export하여 features/connection에서 사용할 수 있도록 함
export { ApiError };

// ========== 타입 정의 ==========

export interface Connection {
  connectionId: number;
  organization: string; // API 응답 필드명 (금융사 코드, 예: "0020", "0309")
  type: 'BK' | 'CD'; // API 응답 필드명 (BK: 은행, CD: 카드)
  connectedAt: string;
  // 하위 호환성을 위한 별칭 (기존 코드에서 사용 중)
  organizationCode?: string; // organization의 별칭
  organizationName?: string; // API 응답 필드명 (선택적)
  businessType?: 'BK' | 'CD'; // type의 별칭
}

export interface ConnectionListResponse {
  connections: Connection[];
}

export interface CreateConnectionRequest {
  organization: string; // 금융사 코드 (예: "0020", "0309")
  businessType: 'BK' | 'CD'; // BK: 은행, CD: 카드
  loginId: string;
  loginPassword: string;
  countryCode?: string; // 기본값: "KR"
  clientType?: string; // 기본값: "P"
  loginType?: string; // 기본값: "1"
}

// 동기화 상태 타입
export type SyncStatus = 'IN_PROGRESS' | 'SUCCESS' | 'FAILED';
export type SyncType = 'ALL' | 'PARTIAL';

export interface SyncStatusResponse {
  syncLogId: number;
  syncStatus: SyncStatus;
  syncType: SyncType;
  errorMessage: string | null;
  updatedAt: string;
}

// ========== Query Key Factory ==========

export const connectionKeys = createQueryKeys('connections', {
  list: () => ['list'] as const,
  syncStatus: () => ['sync', 'status'] as const,
});

// ========== API 함수들 ==========

/**
 * 모든 연동 목록 조회
 * GET /api/connections
 */
export const getConnectionsApi = async (): Promise<ApiResponse<Connection[]>> => {
  return apiGet<Connection[]>('/api/connections');
};

/**
 * 금융사 계정 연동
 * POST /api/connections
 */
export const createConnectionApi = async (data: CreateConnectionRequest): Promise<ApiResponse<null>> => {
  // 기본값 설정
  const requestData: CreateConnectionRequest = {
    ...data,
    countryCode: data.countryCode || 'KR',
    clientType: data.clientType || 'P',
    loginType: data.loginType || '1',
  };

  return apiPost<null>('/api/connections', requestData);
};

/**
 * 금융사 연동 해제
 * DELETE /api/connections/{connectionId}
 */
export const deleteConnectionApi = async (connectionId: number): Promise<ApiResponse<null>> => {
  return apiDelete<null>(`/api/connections/${connectionId}`);
};

/**
 * 전체 자산 새로고침(동기화) 요청
 * POST /api/connections/sync/refresh
 *
 * 백그라운드에서 동기화 작업을 시작하고 즉시 응답을 반환합니다.
 * 10분 쿨타임이 있습니다.
 */
export const refreshSyncApi = async (): Promise<ApiResponse<null>> => {
  return apiPost<null>('/api/connections/sync/refresh');
};

/**
 * 자산 동기화 상태 조회
 * GET /api/connections/sync/status
 *
 * 최근 요청한 자산 동기화 작업의 진행 상태를 조회합니다.
 */
export const getSyncStatusApi = async (): Promise<ApiResponse<SyncStatusResponse>> => {
  return apiGet<SyncStatusResponse>('/api/connections/sync/status');
};
