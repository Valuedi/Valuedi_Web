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

/**
 * 액세스 토큰을 로컬 스토리지에서 가져옵니다
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
};

/**
 * 액세스 토큰을 로컬 스토리지에 저장합니다
 */
export const setAccessToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', token);
};

/**
 * 액세스 토큰을 로컬 스토리지에서 제거합니다
 */
export const removeAccessToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
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

// 토큰 재발급 중 플래그 (무한 루프 방지)
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

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
      const newToken = await refreshToken();
      if (newToken) {
        // 토큰 재발급 성공 시 원래 요청 재시도
        return apiFetch<T>(endpoint, options, retryCount + 1);
      } else {
        // 토큰 재발급 실패 - 로그아웃 처리
        removeAccessToken();
        throw new ApiError('AUTH_ERROR', '인증이 만료되었습니다. 다시 로그인해주세요.', 401);
      }
    }

    // 응답이 성공이 아니면 에러로 처리
    if (!response.ok || !data.isSuccess) {
      // 정상적인 상황으로 처리해야 하는 에러 코드 목록 (에러로 로깅하지 않음)
      const silentErrorCodes = ['MBTI404_2']; // MBTI 결과가 없는 것은 정상적인 상황
      const isSilentError = silentErrorCodes.includes(data.code);

      // 디버깅: 에러 응답 로그 (정상적인 에러는 제외)
      if (!isSilentError) {
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

      throw new ApiError(data.code, errorMessage, response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // 네트워크 에러 등
    throw new ApiError('NETWORK_ERROR', '네트워크 오류가 발생했습니다.', 0);
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
 * 401 에러 발생 시 자동으로 호출됩니다
 * 동시에 여러 요청이 401을 받아도 한 번만 재발급 요청을 하도록 처리
 */
export async function refreshToken(): Promise<string | null> {
  // 이미 재발급 중이면 기존 Promise 반환
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const url = `${API_BASE_URL}/auth/token/refresh`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data: ApiResponse<{ accessToken: string; memberId: number }> = await response.json();

      if (data.result?.accessToken) {
        setAccessToken(data.result.accessToken);
        return data.result.accessToken;
      }
      return null;
    } catch (error) {
      // 리프레시 토큰도 만료된 경우
      removeAccessToken();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
