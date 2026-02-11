/**
 * 토큰 서비스 유틸리티
 *
 * 토큰 관련 저수준 로직을 캡슐화합니다.
 * - localStorage 접근 로직
 * - 쿠키 옵션 등 토큰 관련 설정
 *
 * 이 모듈은 토큰의 물리적 저장소 접근만 담당하며,
 * 비즈니스 로직은 상위 레이어(auth.store, apiClient)에서 처리합니다.
 */

const ACCESS_TOKEN_KEY = 'accessToken';
const AUTH_FLAG_KEY = 'isAuthenticated'; // 로그인 여부 플래그

/**
 * Access Token을 localStorage에서 가져옵니다.
 * SSR 환경에서는 null을 반환합니다.
 */
export const getAccessTokenFromStorage = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Access Token을 localStorage에 저장합니다.
 * SSR 환경에서는 아무 작업도 수행하지 않습니다.
 */
export const setAccessTokenToStorage = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/**
 * Access Token을 localStorage에서 제거합니다.
 * SSR 환경에서는 아무 작업도 수행하지 않습니다.
 */
export const removeAccessTokenFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

/**
 * 로그인 여부 플래그를 localStorage에 저장합니다.
 * 실제 토큰 유효성과는 별개로, 사용자가 로그인했는지 여부를 추적합니다.
 */
export const setAuthFlag = (isAuthenticated: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_FLAG_KEY, String(isAuthenticated));
};

/**
 * 로그인 여부 플래그를 localStorage에서 가져옵니다.
 */
export const getAuthFlag = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_FLAG_KEY) === 'true';
};

/**
 * 로그인 여부 플래그를 localStorage에서 제거합니다.
 */
export const removeAuthFlag = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_FLAG_KEY);
};

/**
 * 모든 인증 관련 데이터를 localStorage에서 제거합니다.
 */
export const clearAllAuthData = (): void => {
  removeAccessTokenFromStorage();
  removeAuthFlag();
};

/**
 * 쿠키 옵션 설정
 * Refresh Token은 HttpOnly 쿠키로 관리되므로, 클라이언트에서는 직접 접근하지 않습니다.
 * credentials: 'include' 옵션을 통해 자동으로 포함됩니다.
 */
export const COOKIE_OPTIONS = {
  credentials: 'include' as RequestCredentials,
} as const;
