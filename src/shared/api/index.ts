/**
 * Shared API 모듈
 *
 * 프로젝트 전반에서 사용되는 공통 API 클라이언트를 제공합니다.
 * 각 Feature는 이 모듈의 함수들을 사용하여 API 요청을 수행합니다.
 */

export {
  API_BASE_URL,
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getAuthHeaders,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  refreshToken,
} from './apiClient';

export type { ApiResponse } from './apiClient';
export { ApiError } from './apiClient';

// Query Key Factory 유틸리티
export { createQueryKeys } from './queryKeys';
export type { QueryKeyFactory } from './queryKeys';
