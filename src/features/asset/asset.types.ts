// 연동된 은행 정보
export interface ConnectedBank {
  id: number;
  organizationCode: string;
  organizationName: string;
  connectedAt: string;
  status: string;
}

// API 응답 - 연동된 은행 목록
export interface ConnectedBanksResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ConnectedBank[];
}

// 은행별 계좌 정보
export interface BankAccountItem {
  accountId: number;
  accountName: string;
  balanceAmount: number;
  connectedGoalId: number | null;
}

/** 홈 등에서 사용하는 계좌 타입 (목표 연동 정보 포함) */
export interface Account {
  accountId: number;
  accountName: string;
  balanceAmount: number;
  connectedGoalId: number | null;
  bankName?: string;
  goalInfo: { goalId: number; title: string } | null;
}

// 은행별 목표 정보
export interface BankGoalItem {
  goalId: number;
  title: string;
  linkedAccountId: number;
}

// API 응답 - 은행별 계좌 및 목표 목록
export interface BankAccountsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    bankName: string;
    totalBalance: number;
    accountList: BankAccountItem[];
    goalList: BankGoalItem[];
  };
}

// ========== 자산 요약 및 목록 조회 타입 ==========

// 자산 요약 정보
export interface AssetSummary {
  totalAccountCount: number; // 연동된 계좌 개수
  totalCardCount: number; // 연동된 카드 개수
  totalAssetCount: number; // 전체 자산 개수 (계좌 + 카드)
}

// API 응답 - 자산 요약
export interface AssetSummaryResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AssetSummary;
}

// 계좌 상세 정보 (전체 계좌 목록 조회용)
export interface AccountDetail {
  accountId: number;
  accountName: string;
  balanceAmount: number;
  organization: string; // 은행 코드 (예: "0004")
  createdAt: string; // 등록일시
  goalInfo: {
    goalId: number;
    title: string;
  } | null; // 연동된 목표 정보
}

// API 응답 - 전체 계좌 목록
export interface AccountsListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accountList: AccountDetail[];
    totalCount: number;
  };
}

// 카드 상세 정보 (전체 카드 목록 조회용)
export interface CardDetail {
  cardName: string; // 카드명
  cardNoMasked: string; // 마스킹된 카드번호 (예: "4321-****-****-1234")
  cardType: 'CREDIT' | 'CHECK' | 'DEBIT'; // 카드 타입 (신용카드, 체크카드, 직불카드)
  organization: string; // 카드사 코드 (예: "0302")
  createdAt: string; // 등록일시
}

// API 응답 - 전체 카드 목록
export interface CardsListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    cardList: CardDetail[];
    totalCount: number;
  };
}

// 카드사별 카드 상세 정보
export interface CardIssuerCardDetail {
  cardName: string; // 카드명
  cardNoMasked: string; // 마스킹된 카드번호
  cardType: 'CREDIT' | 'CHECK' | 'DEBIT'; // 카드 타입
  organization: string; // 카드사 코드
  createdAt: string; // 등록일시
}

// API 응답 - 카드사별 카드 목록
export interface CardIssuerCardsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    cardList: CardIssuerCardDetail[];
    totalCount: number;
  };
}

// 연동된 카드사 정보
export interface ConnectedCardIssuer {
  id: number;
  organizationCode: string;
  organizationName: string;
  connectedAt: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// API 응답 - 연동된 카드사 목록
export interface CardIssuersListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ConnectedCardIssuer[];
}
