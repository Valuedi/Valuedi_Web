/**
 * 인증 관련 API 함수들
 */

import { apiGet, apiPost, apiDelete, ApiResponse, ApiError } from '@/shared/api';

// ApiError를 re-export하여 features/auth에서 사용할 수 있도록 함
export { ApiError };

// ========== 타입 정의 ==========

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  memberId: number;
}

export interface KakaoLoginUrlResponse {
  url: string;
  state: string;
}

export interface SignUpRequest {
  username: string;
  realName: string;
  rrnPrefix: string; // 주민등록번호 앞자리 (6자리) + 뒷자리 (1자리)
  password: string;
  email: string;
  agreements: Array<{
    termsId: number;
    isAgreed: boolean;
  }>;
}

export interface SignUpResponse {
  memberId: number;
}

export interface EmailSendRequest {
  email: string;
}

export interface EmailVerifyRequest {
  email: string;
  code: string;
}

export interface CheckUsernameRequest {
  username: string;
}

export interface AuthStatusResponse {
  isLogin: boolean;
  memberId: number | null;
}

export interface UserInfoResponse {
  memberId: number;
  name: string;
}

// 회원 탈퇴 사유 코드 (Swagger Member → DELETE /api/users/me 설명에 명시된 값들)
export type WithdrawReasonCode =
  | 'NOT_HELPFUL' // 금융 관리에 도움이 되지 않았어요
  | 'DIFFICULT_TO_USE' // 사용이 어려워요
  | 'MISSING_FEATURES' // 필요한 기능이 없어요
  | 'SECURITY_CONCERNS' // 보안이 걱정돼요
  | 'FREQUENT_ERRORS' // 오류가 자주 발생해요
  | 'OTHER'; // 기타

export interface WithdrawRequest {
  // Swagger/curl 기준 필드명: reason
  reason: WithdrawReasonCode;
}

// ========== API 함수들 ==========

/**
 * 로컬 계정 로그인
 */
export const loginApi = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  return apiPost<LoginResponse>('/auth/login', data, { skipAuth: true });
};

/**
 * 로컬 계정 회원가입
 */
export const signUpApi = async (data: SignUpRequest): Promise<ApiResponse<SignUpResponse>> => {
  return apiPost<SignUpResponse>('/auth/signup', data, { skipAuth: true });
};

/**
 * 로그아웃
 */
export const logoutApi = async (): Promise<ApiResponse<null>> => {
  return apiPost<null>('/auth/logout');
};

/**
 * 토큰 재발급
 */
export const refreshTokenApi = async (): Promise<ApiResponse<LoginResponse>> => {
  return apiPost<LoginResponse>('/auth/token/refresh', undefined, { skipAuth: true });
};

/**
 * 이메일 인증번호 발송
 */
export const sendEmailVerificationApi = async (data: EmailSendRequest): Promise<ApiResponse<null>> => {
  return apiPost<null>('/auth/email/send', data, { skipAuth: true });
};

/**
 * 이메일 인증번호 검증
 */
export const verifyEmailApi = async (data: EmailVerifyRequest): Promise<ApiResponse<null>> => {
  return apiPost<null>('/auth/email/verify', data, { skipAuth: true });
};

/**
 * 아이디 중복 확인
 */
export const checkUsernameApi = async (username: string): Promise<ApiResponse<null>> => {
  return apiGet<null>(`/auth/check-username?username=${encodeURIComponent(username)}`, {
    skipAuth: true,
  });
};

/**
 * 로그인 상태 조회
 */
export const getAuthStatusApi = async (): Promise<ApiResponse<AuthStatusResponse>> => {
  return apiGet<AuthStatusResponse>('/auth/status');
};

/**
 * 카카오 로그인 URL 생성
 */
export const getKakaoLoginUrlApi = async (): Promise<ApiResponse<KakaoLoginUrlResponse>> => {
  return apiGet<KakaoLoginUrlResponse>('/auth/oauth/kakao/login', { skipAuth: true });
};

/**
 * 카카오 로그인 콜백
 * GET /auth/oauth/kakao/callback?code=...&state=...
 */
export const kakaoCallbackApi = async (code: string, state: string): Promise<ApiResponse<LoginResponse>> => {
  // URL 파라미터 구성
  const params = new URLSearchParams({
    code: code,
    state: state,
  });

  const url = `/auth/oauth/kakao/callback?${params.toString()}`;

  // 디버깅: 전달할 파라미터 확인
  console.log('카카오 콜백 API 요청:', {
    code: code.substring(0, 30) + '...',
    codeLength: code.length,
    state,
    url: url.substring(0, 100) + '...',
  });

  return apiGet<LoginResponse>(url, { skipAuth: true });
};

/**
 * 사용자 기본 정보 조회 (이름)
 * GET /api/users/me
 */
export const getUserInfoApi = async (): Promise<ApiResponse<UserInfoResponse>> => {
  return apiGet<UserInfoResponse>('/api/users/me');
};

/**
 * 회원 탈퇴
 * DELETE /api/users/me
 */
export const withdrawMemberApi = async (data: WithdrawRequest): Promise<ApiResponse<null>> => {
  return apiDelete<null>('/api/users/me', {
    body: JSON.stringify(data),
  });
};
