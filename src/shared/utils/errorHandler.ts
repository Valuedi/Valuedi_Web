import { ApiError } from '@/shared/api/apiClient';

/**
 * 금융 도메인 에러 코드 타입
 */
export type FinancialErrorCode =
  | 'ERR_001' // 일반 오류
  | 'ERR_002' // 시스템 오류
  | 'INVALID_BALANCE' // 잔액 부족
  | 'INVALID_ACCOUNT' // 계좌 정보 오류
  | 'TRANSACTION_FAILED' // 거래 실패
  | 'AUTH401_5' // 보안 인증 실패
  | 'MEMBER403_1' // 휴면 회원
  | 'MBTI404_2' // MBTI 결과 없음 (정상)
  | 'NETWORK_ERROR' // 네트워크 오류
  | 'AUTH_ERROR' // 인증 오류
  | 'REFRESH_ERROR' // 토큰 재발급 오류
  | 'FORBIDDEN'; // 권한 없음

/**
 * 에러 코드별 사용자 친화적 메시지 매핑
 */
const ERROR_MESSAGE_MAP: Record<string, string> = {
  ERR_001: '요청 처리 중 오류가 발생했습니다.',
  ERR_002: '시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  INVALID_BALANCE: '잔액이 부족합니다.',
  INVALID_ACCOUNT: '계좌 정보가 올바르지 않습니다.',
  TRANSACTION_FAILED: '거래 처리에 실패했습니다.',
  AUTH401_5: '보안 인증에 실패했습니다. 다시 시도해주세요.',
  MEMBER403_1: '휴면 상태의 회원입니다.',
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  AUTH_ERROR: '인증이 만료되었습니다. 다시 로그인해주세요.',
  REFRESH_ERROR: '세션이 만료되었습니다. 다시 로그인해주세요.',
  FORBIDDEN: '접근 권한이 없습니다.',
};

/**
 * 사용자에게 표시하지 않을 에러 코드 목록 (정상적인 상황)
 */
const SILENT_ERROR_CODES: readonly string[] = ['MBTI404_2'] as const;

/**
 * 에러 코드가 무시 가능한지 확인
 */
export const isSilentError = (errorCode: string): boolean => {
  return SILENT_ERROR_CODES.includes(errorCode);
};

/**
 * 에러 코드에 대한 사용자 친화적 메시지 반환
 */
export const getErrorMessage = (error: ApiError): string => {
  // 에러 코드별 메시지가 있으면 사용
  if (ERROR_MESSAGE_MAP[error.code]) {
    return ERROR_MESSAGE_MAP[error.code];
  }

  // 서버에서 내려온 메시지가 있으면 사용
  if (error.message) {
    return error.message;
  }

  // 기본 메시지
  return '오류가 발생했습니다.';
};

/**
 * HTTP 상태 코드별 에러 처리 전략
 */
export enum ErrorHandlingStrategy {
  TOAST = 'TOAST', // 토스트 메시지 표시
  REDIRECT = 'REDIRECT', // 페이지 리디렉션
  IGNORE = 'IGNORE', // 무시 (정상적인 상황)
  CUSTOM = 'CUSTOM', // 커스텀 처리
}

/**
 * HTTP 상태 코드별 처리 전략 매핑
 */
export const getErrorHandlingStrategy = (status: number, errorCode: string): ErrorHandlingStrategy => {
  // 정상적인 상황으로 처리해야 하는 에러
  if (isSilentError(errorCode)) {
    return ErrorHandlingStrategy.IGNORE;
  }

  switch (status) {
    case 401:
      // 인증 에러는 AuthErrorHandler에서 처리
      return ErrorHandlingStrategy.CUSTOM;
    case 403:
      // 권한 없음 - 토스트 표시
      return ErrorHandlingStrategy.TOAST;
    case 404:
      // 리소스 없음 - 토스트 표시
      return ErrorHandlingStrategy.TOAST;
    case 500:
    case 502:
    case 503:
    case 504:
      // 서버 에러 - 토스트 표시 (향후 서버 점검 페이지로 리디렉션 가능)
      return ErrorHandlingStrategy.TOAST;
    default:
      // 기타 에러 - 토스트 표시
      return ErrorHandlingStrategy.TOAST;
  }
};

/**
 * 에러가 금융 도메인 특화 에러인지 확인
 */
export const isFinancialDomainError = (errorCode: string): boolean => {
  return (
    errorCode.startsWith('ERR_') ||
    errorCode.includes('BALANCE') ||
    errorCode.includes('ACCOUNT') ||
    errorCode.includes('TRANSACTION')
  );
};
