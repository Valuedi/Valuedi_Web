import { apiGet, apiPost, ApiResponse } from '@/shared/api';

// Swagger 기준 약관 항목
// {
//   "termsId": 1,
//   "code": "AGE_14",
//   "title": "만 14세 이상입니다.",
//   "isRequired": true
// }
export interface TermItem {
  termsId: number;
  code: string;
  title: string;
  isRequired: boolean;
}

// /api/terms 응답 래퍼
export interface TermsListResponse {
  termsLists: TermItem[];
}

// 회원 약관 동의 내역
export interface MemberTermAgreement {
  termsId: number;
  agreedVersion: string;
  agreedAt?: string;
  // 클라이언트에서 사용할 플래그 (서버 응답에는 없을 수 있음)
  isAgreed?: boolean;
  [key: string]: unknown;
}

// 약관 동의 요청
export interface TermsAgreeRequest {
  memberId: number;
  agreements: MemberTermAgreement[];
}

// 모든 약관 목록 조회
export const getTermsApi = async (): Promise<ApiResponse<TermsListResponse>> => {
  return apiGet<TermsListResponse>('/api/terms');
};

// 회원의 약관 동의 내역 조회
export const getMemberTermsApi = async (): Promise<ApiResponse<MemberTermAgreement[]>> => {
  return apiGet<MemberTermAgreement[]>('/api/terms/member');
};

// 약관 동의/갱신
export const agreeTermsApi = async (data: TermsAgreeRequest): Promise<ApiResponse<null>> => {
  return apiPost<null>('/api/terms/agree', data);
};
