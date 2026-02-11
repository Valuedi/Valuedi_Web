// 계좌 정보
export interface Account {
  accountId: number;
  bankName: string;
  accountNumber: string;
  balance?: number;
  bankCode?: string;
}

// API 응답 - 계좌 목록
export interface AccountsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accounts: Account[];
  };
}
