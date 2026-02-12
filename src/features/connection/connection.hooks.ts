/**
 * 금융 연동 관련 React Query 훅들
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConnectionsApi,
  createConnectionApi,
  deleteConnectionApi,
  refreshSyncApi,
  getSyncStatusApi,
  connectionKeys,
  type Connection,
  type CreateConnectionRequest,
  type SyncStatusResponse,
} from './connection.api';
import { ApiResponse, ApiError } from '@/shared/api';

/**
 * 모든 연동 목록 조회
 */
export function useConnections() {
  return useQuery<ApiResponse<Connection[]>>({
    queryKey: connectionKeys.list(),
    queryFn: () => getConnectionsApi(),
  });
}

/**
 * 금융사 계정 연동 (Mutation)
 */
export function useCreateConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConnectionRequest) => createConnectionApi(data),
    onSuccess: () => {
      // 연동 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: connectionKeys.list() });
      // 동기화 상태도 무효화 (새로 연동하면 동기화가 필요할 수 있음)
      queryClient.invalidateQueries({ queryKey: connectionKeys.syncStatus() });
    },
  });
}

/**
 * 금융사 연동 해제 (Mutation)
 */
export function useDeleteConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (connectionId: number) => deleteConnectionApi(connectionId),
    onSuccess: () => {
      // 연동 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: connectionKeys.list() });
    },
  });
}

/**
 * 전체 자산 새로고침(동기화) 요청 (Mutation)
 *
 * 10분 쿨타임이 있으므로, 429 에러 발생 시 적절히 처리해야 합니다.
 */
export function useRefreshSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => refreshSyncApi(),
    onSuccess: () => {
      // 동기화 상태 조회 쿼리 무효화하여 즉시 상태 확인 가능하도록
      queryClient.invalidateQueries({ queryKey: connectionKeys.syncStatus() });
    },
    onError: (error: ApiError | Error) => {
      // 429 에러 (쿨타임) 처리
      if (error instanceof ApiError && error.status === 429) {
        console.warn('동기화 쿨타임:', error.message);
      }
    },
  });
}

/**
 * 자산 동기화 상태 조회
 *
 * 동기화 진행 중일 때는 주기적으로 폴링하여 상태를 확인할 수 있습니다.
 *
 * @param options.pollInterval - 폴링 간격 (ms). 동기화 진행 중일 때만 사용 권장
 */
export function useSyncStatus(options?: { pollInterval?: number; enabled?: boolean }) {
  return useQuery<ApiResponse<SyncStatusResponse>>({
    queryKey: connectionKeys.syncStatus(),
    queryFn: () => getSyncStatusApi(),
    enabled: options?.enabled !== false,
    refetchInterval: (query) => {
      // 동기화가 진행 중일 때만 폴링
      const data = query.state.data;
      if (data?.result?.syncStatus === 'IN_PROGRESS') {
        return options?.pollInterval ?? 3000; // 기본 3초
      }
      return false; // 완료되면 폴링 중지
    },
  });
}
