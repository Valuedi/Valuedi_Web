/**
 * API 클라이언트 유틸리티
 * 백엔드 API와 통신하기 위한 공통 함수들
 *
 * 이 파일은 프로젝트 전반에서 사용되는 공통 API 클라이언트를 제공합니다.
 * 인증 토큰 관리, 에러 핸들링, 토큰 재발급 등의 기능을 포함합니다.
 */

export const API_BASE_URL = 'https://api.valuedi.site';

// 공통 응답 타입
export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T | null;
}

// 에러 타입
export class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
    // TypeScript에서 Error를 상속할 때 필요
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

import { getAccessTokenFromStorage, setAccessTokenToStorage, clearAllAuthData } from './tokenService';
import { isSilentError } from '@/shared/utils/errorHandler';

/**
 * Auth Store 참조 타입
 * 순환 참조를 피하기 위해 전역 변수로 관리합니다.
 */
type AuthStoreRef = {
  getAccessToken: () => string | null;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
} | null;

// 전역 변수: auth.store 참조 (순환 참조 방지)
let authStoreRef: AuthStoreRef = null;

/**
 * Auth Store 참조를 등록합니다.
 * auth.store가 초기화될 때 호출되어야 합니다.
 * @internal
 */
export const registerAuthStore = (store: AuthStoreRef): void => {
  authStoreRef = store;
};

/**
 * 액세스 토큰을 가져옵니다 (하위 호환성 유지)
 * auth.store의 메모리 상태에서 토큰을 가져오도록 시도하고, 없으면 localStorage에서 가져옵니다.
 */
export const getAccessToken = (): string | null => {
  // auth.store에서 토큰을 가져오도록 시도
  if (authStoreRef) {
    const token = authStoreRef.getAccessToken();
    if (token) return token;
  }
  // fallback: localStorage에서 직접 가져오기
  return getAccessTokenFromStorage();
};

/**
 * 액세스 토큰을 저장합니다 (하위 호환성 유지)
 * auth.store의 메모리 상태와 localStorage에 모두 저장합니다.
 */
export const setAccessToken = (token: string): void => {
  // auth.store에 토큰을 저장하도록 시도
  if (authStoreRef) {
    authStoreRef.setAccessToken(token);
    return;
  }
  // fallback: localStorage에 직접 저장
  setAccessTokenToStorage(token);
};

/**
 * 액세스 토큰을 제거합니다 (하위 호환성 유지)
 * auth.store의 메모리 상태와 localStorage에서 모두 제거합니다.
 */
export const removeAccessToken = (): void => {
  // auth.store에서 토큰을 제거하도록 시도
  if (authStoreRef) {
    authStoreRef.clearAuth();
    return;
  }
  // fallback: localStorage에서 직접 제거
  clearAllAuthData();
};

/**
 * 인증 헤더 (Authorization Bearer)를 반환합니다.
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * API 요청 기본 설정
 */
interface RequestOptions extends RequestInit {
  skipAuth?: boolean; // 인증이 필요 없는 요청인지 여부
}

/**
 * 에러 핸들러 타입 정의
 * 인터셉터는 에러를 감지하여 핸들러에 알리기만 하고,
 * 실제 "로그인 페이지로 이동"이나 "토스트 메시지 표시"는 상위 레이어에서 처리합니다.
 */
export type ErrorHandler = (error: ApiError) => void;

// 전역 에러 핸들러 (기본값: null)
let globalErrorHandler: ErrorHandler | null = null;

/**
 * 전역 에러 핸들러 설정
 * Router나 전역 에러 바운더리에서 호출하여 중앙 집중 에러 처리를 활성화합니다.
 */
export const setGlobalErrorHandler = (handler: ErrorHandler | null): void => {
  globalErrorHandler = handler;
};

/**
 * 전역 인증 에러 핸들러 (토큰 재발급 실패 시 호출)
 * 로그인 페이지로 이동 및 토스트 메시지 표시를 담당합니다.
 */
type AuthErrorHandler = (error: ApiError) => void;
let globalAuthErrorHandler: AuthErrorHandler | null = null;

export const setGlobalAuthErrorHandler = (handler: AuthErrorHandler | null): void => {
  globalAuthErrorHandler = handler;
};

/**
 * HTTP 상태 코드별 에러 처리 전략
 */
const handleErrorByStatus = (status: number, error: ApiError, endpoint: string): void => {
  switch (status) {
    case 401:
      // 401은 이미 토큰 재발급 로직에서 처리되므로 여기서는 추가 처리만
      // 전역 핸들러에 알림 (로그인 페이지 이동 등은 상위 레이어에서 처리)
      if (globalErrorHandler) {
        globalErrorHandler(error);
      }
      break;

    case 403:
      // 접근 권한 없음 - 권한 부족 알림
      if (globalErrorHandler) {
        globalErrorHandler(error);
      }
      console.warn('접근 권한이 없습니다:', endpoint);
      break;

    case 404:
      // 리소스를 찾을 수 없음
      console.warn('리소스를 찾을 수 없습니다:', endpoint);
      break;

    case 500:
    case 502:
    case 503:
    case 504:
      // 서버 에러
      if (globalErrorHandler) {
        globalErrorHandler(error);
      }
      console.error('서버 오류가 발생했습니다:', status, endpoint);
      break;

    default:
      // 기타 에러
      if (globalErrorHandler && status >= 400) {
        globalErrorHandler(error);
      }
      break;
  }
};

// 토큰 재발급 중 플래그 (무한 루프 방지)
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Request Queue 타입 정의
 * 토큰 재발급 중에 발생한 요청들을 대기시키고 재실행하기 위한 큐
 */
interface QueuedRequest {
  resolve: (value: ApiResponse<unknown>) => void;
  reject: (error: unknown) => void;
  endpoint: string;
  options: RequestOptions;
}

// 토큰 재발급 중 대기 중인 요청들의 큐
const failedQueue: QueuedRequest[] = [];

/**
 * 대기 중인 모든 요청을 처리합니다.
 * 토큰 재발급 성공 시 새 토큰으로 재시도하고, 실패 시 모두 거절합니다.
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  const queue = [...failedQueue];
  failedQueue.length = 0; // 큐 초기화

  if (error || !token) {
    // 토큰 재발급 실패: 모든 대기 중인 요청 거절
    queue.forEach(({ reject }) => {
      reject(error || new ApiError('AUTH_ERROR', '인증이 만료되었습니다. 다시 로그인해주세요.', 401));
    });
  } else {
    // 토큰 재발급 성공: 모든 대기 중인 요청 재시도
    queue.forEach(({ resolve, reject, endpoint, options }) => {
      apiFetch(endpoint, options, 1) // retryCount를 1로 설정하여 재시도
        .then(resolve)
        .catch(reject);
    });
  }
};

/**
 * 공통 fetch 래퍼 함수
 *
 * 이 함수는 모든 API 요청의 기반이 되며, 다음 기능을 제공합니다:
 * - 자동 인증 토큰 주입
 * - 401 에러 시 자동 토큰 재발급 및 재시도
 * - 공통 에러 핸들링
 * - 네트워크 에러 처리
 */
async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
  retryCount = 0
): Promise<ApiResponse<T>> {
  const { skipAuth = false, ...fetchOptions } = options;

  // endpoint가 슬래시로 시작하지 않으면 추가
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  // 액세스 토큰이 있으면 헤더에 추가
  if (!skipAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  // credentials: 'include'를 설정하여 쿠키를 포함
  const config: RequestInit = {
    ...fetchOptions,
    headers,
    credentials: 'include', // 쿠키 포함
  };

  try {
    const response = await fetch(url, config);

    // 응답이 JSON이 아닌 경우 처리
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      if (response.ok) {
        return {
          isSuccess: true,
          code: 'SUCCESS',
          message: '요청이 성공했습니다.',
          result: null as T,
        };
      }
      throw new ApiError('UNKNOWN', '알 수 없는 오류가 발생했습니다.', response.status);
    }

    const data: ApiResponse<T> = await response.json();

    // 401 에러이고 인증이 필요한 요청인 경우 토큰 재발급 시도
    if (response.status === 401 && !skipAuth && retryCount === 0) {
      // 이미 재발급 중이면 큐에 추가하고 대기
      if (isRefreshing && refreshPromise) {
        return new Promise<ApiResponse<T>>((resolve, reject) => {
          failedQueue.push({
            resolve: resolve as (value: ApiResponse<unknown>) => void,
            reject,
            endpoint,
            options,
          });
        });
      }

      // 토큰 재발급 시도
      const newToken = await refreshToken();
      if (newToken) {
        // 토큰 재발급 성공 시 원래 요청 재시도
        return apiFetch<T>(endpoint, options, retryCount + 1);
      } else {
        // 토큰 재발급 실패 - 큐에 있는 모든 요청 거절 및 로그아웃 처리
        const error = new ApiError('AUTH_ERROR', '세션이 만료되었습니다. 다시 로그인해주세요.', 401);
        processQueue(error);
        removeAccessToken();

        // 전역 인증 에러 핸들러 호출 (토스트 메시지 및 로그인 페이지 이동)
        if (globalAuthErrorHandler) {
          globalAuthErrorHandler(error);
        }

        throw error;
      }
    }

    // 403 에러 처리 (접근 권한 없음)
    if (response.status === 403 && !skipAuth) {
      const error = new ApiError('FORBIDDEN', '접근 권한이 없습니다.', 403);
      handleErrorByStatus(403, error, endpoint);
      throw error;
    }

    // 응답이 성공이 아니면 에러로 처리
    if (!response.ok || !data.isSuccess) {
      // 정상적인 상황으로 처리해야 하는 에러 코드 확인
      const shouldSilent = isSilentError(data.code);

      // 디버깅: 에러 응답 로그 (정상적인 에러는 제외)
      if (!shouldSilent) {
        const errorResult = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
        console.error('API 에러 응답:', {
          status: response.status,
          code: data.code,
          message: data.message,
          result: errorResult,
          url: url,
        });
      }

      // 카카오 API 에러(KOE320 등)가 포함된 경우 메시지에 추가
      const errorResult = typeof data.result === 'string' ? data.result : JSON.stringify(data.result);
      let errorMessage = data.message;
      if (errorResult && errorResult.includes('KOE320')) {
        errorMessage += '\n\n카카오 API 에러가 발생했습니다. 백엔드 개발자에게 문의해주세요.';
      }

      const error = new ApiError(data.code, errorMessage, response.status);

      // HTTP 상태 코드별 에러 처리 전략 적용
      handleErrorByStatus(response.status, error, endpoint);

      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      // ApiError는 이미 처리되었으므로 그대로 전파
      throw error;
    }
    // 네트워크 에러 등 예상치 못한 에러
    const networkError = new ApiError('NETWORK_ERROR', '네트워크 오류가 발생했습니다.', 0);
    handleErrorByStatus(0, networkError, endpoint);
    throw networkError;
  }
}

/**
 * GET 요청
 */
export async function apiGet<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST 요청
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  data?: unknown,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT 요청
 */
export async function apiPut<T = unknown>(
  endpoint: string,
  data?: unknown,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH 요청
 */
export async function apiPatch<T = unknown>(
  endpoint: string,
  data?: unknown,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE 요청
 */
export async function apiDelete<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
}

/**
 * 토큰 재발급 함수
 * 401 에러 발생 시 자동으로 호출됩니다.
 * 서버가 HttpOnly 쿠키에 보관 중인 Refresh Token을 사용하여 세션을 연장합니다.
 *
 * - 동시에 여러 요청이 401을 받아도 한 번만 재발급 요청을 하도록 처리
 * - 재발급 중 발생한 요청들은 큐에 담아두고, 재발급 완료 후 일괄 처리합니다.
 */
export async function refreshToken(): Promise<string | null> {
  // 이미 재발급 중이면 기존 Promise 반환
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      // Refresh Token은 HttpOnly 쿠키로 관리되므로, 클라이언트에서는 쿼리 파라미터를 전달하지 않습니다.
      // 공통 apiPost를 사용하되 skipAuth: true로 설정하여 401 시 재귀 호출을 방지합니다.
      const data: ApiResponse<{ accessToken: string; refreshToken?: string; memberId: number }> = await apiPost(
        '/auth/token/refresh',
        undefined,
        { skipAuth: true }
      );

      if (data.result?.accessToken) {
        const newAccessToken = data.result.accessToken;

        // 새 Access Token 저장 (메모리 + localStorage)
        setAccessToken(newAccessToken);

        // 대기 중인 모든 요청을 새 토큰으로 재시도
        processQueue(null, newAccessToken);

        return newAccessToken;
      }

      const error = new ApiError('REFRESH_ERROR', '토큰 재발급 응답이 올바르지 않습니다.', 0);
      processQueue(error);
      return null;
    } catch (error) {
      // 리프레시 토큰 만료 또는 네트워크 에러
      const apiError =
        error instanceof ApiError
          ? error
          : new ApiError('NETWORK_ERROR', '토큰 재발급 중 네트워크 오류가 발생했습니다.', 0);

      processQueue(apiError);
      removeAccessToken();

      // 인증 에러인 경우 전역 핸들러 호출 (토스트 메시지 및 로그인 페이지 이동)
      if (globalAuthErrorHandler) {
        globalAuthErrorHandler(apiError);
      }

      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
