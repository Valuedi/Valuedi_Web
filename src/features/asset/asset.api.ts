/**
 * 자산/거래 분석 및 계좌 관련 API
 * Swagger: https://api.valuedi.site/swagger-ui/index.html → Ledger (거래내역)
 */

import { apiGet, apiPost, ApiResponse } from '@/shared/api';
import { createQueryKeys } from '@/shared/api/queryKeys';
import type {
  ConnectedBanksResponse,
  BankAccountsResponse,
  Account,
  AssetSummaryResponse,
  AccountsListResponse,
  CardsListResponse,
  CardIssuerCardsResponse,
  CardIssuersListResponse,
} from './asset.types';

export type { Account };

const API_BASE_URL = 'https://api.valuedi.site';

// ========== Query Key Factory ==========

export const assetKeys = createQueryKeys('assets', {
  banks: () => ['banks'] as const,
  bankAccounts: (bankCode: string) => ['banks', bankCode] as const,
  summary: () => ['summary'] as const,
  accounts: () => ['accounts'] as const,
  cards: () => ['cards'] as const,
  cardIssuers: () => ['cardIssuers'] as const,
  cardIssuerCards: (issuerCode: string) => ['cardIssuers', issuerCode, 'cards'] as const,
});

// ========== 거래(가계부) 관련 타입 및 API ==========

/** rematchCategories 요청 (Swagger 스펙에 맞게 조정) */
export interface RematchCategoriesRequest {
  yearMonth?: string; // YYYY-MM
  [key: string]: unknown;
}

/** rematchCategories 응답 */
export interface RematchCategoriesResult {
  matchedCount?: number;
  message?: string;
  [key: string]: unknown;
}

/**
 * 거래 내역 카테고리 재매칭 (키워드 등으로 재분류)
 * POST /api/transactions/rematch-categories
 * Swagger: Ledger (거래내역) → rematchCategories
 */
export const rematchCategoriesApi = async (
  params?: RematchCategoriesRequest
): Promise<ApiResponse<RematchCategoriesResult | null>> => {
  return apiPost<RematchCategoriesResult | null>('/api/transactions/rematch-categories', params ?? {});
};

// ========== GET /api/transactions/by-category (getCategoryStats) ==========

/** 카테고리별 소비 집계 응답 한 항목 */
export interface TransactionByCategoryItem {
  categoryCode: string;
  categoryName: string;
  totalAmount: number;
  percentage: number; // 0~100 또는 0~1 (백엔드 스펙에 맞춰 매핑 시 처리)
}

/**
 * 카테고리별 소비 집계
 * GET /api/transactions/by-category?yearMonth=YYYY-MM
 * Swagger: Ledger (거래내역) → getCategoryStats
 */
export const getTransactionsByCategoryApi = async (
  yearMonth: string
): Promise<ApiResponse<TransactionByCategoryItem[]>> => {
  return apiGet<TransactionByCategoryItem[]>(
    `/api/transactions/by-category?yearMonth=${encodeURIComponent(yearMonth)}`
  );
};

// ========== GET /api/transactions (거래 내역 조회) ==========

/** API가 내려주는 카테고리 객체 (중첩 시, camel/snake 둘 다 허용) */
export interface LedgerCategoryRef {
  code?: string;
  name?: string;
  id?: number;
  category_code?: string;
  category_name?: string;
  category_id?: number;
  [key: string]: unknown;
}

export interface LedgerTransactionItem {
  /** 공통 ID (신규 스펙: id, 구 스펙: transactionId) */
  id?: number;
  transactionId?: number;
  date?: string;
  transactionAt?: string; // API가 ISO 날짜로 내려줄 수 있음
  amount?: number;
  title?: string;
  categoryCode?: string;
  categoryName?: string;
  categoryId?: number;
  /** snake_case 응답 대응 */
  category_code?: string;
  category_name?: string;
  category_id?: number;
  /** 문자열이면 코드, 객체면 { code, name, id } */
  category?: string | LedgerCategoryRef;
  type?: string;
  memo?: string;
  afterBalance?: number;
  [key: string]: unknown;
}

export interface LedgerListResponse {
  content?: LedgerTransactionItem[];
  totalElements?: number;
  totalPages?: number;
  [key: string]: unknown;
}

// ========== POST /api/transactions/sync (거래 동기화·목록) ==========

/** sync 요청 (Swagger 스펙에 맞게 조정) */
export interface SyncTransactionsRequest {
  yearMonth?: string; // YYYY-MM
  [key: string]: unknown;
}

/** sync 응답 - 동기화 후 거래 목록을 내려줄 수 있음 */
export interface SyncTransactionsResult {
  content?: LedgerTransactionItem[];
  totalElements?: number;
  totalPages?: number;
  syncedCount?: number;
  [key: string]: unknown;
}

/**
 * 거래 내역 동기화 (외부 연동 후 최신 거래 반영, 응답에 목록 포함 시 사용)
 * POST /api/transactions/sync
 * Swagger: Ledger (거래내역) → sync
 */
export const syncTransactionsApi = async (
  params?: SyncTransactionsRequest
): Promise<ApiResponse<SyncTransactionsResult | null>> => {
  return apiPost<SyncTransactionsResult | null>('/api/transactions/sync', params ?? {});
};

/**
 * 거래 내역 조회 (월별/일별, 페이징)
 * GET /api/transactions?yearMonth=YYYY-MM&date=YYYY-MM-DD&page=0&size=20&sort=LATEST
 * Swagger: Ledger (거래내역) → getTransactions
 */
export const getTransactionsApi = async (params: {
  yearMonth: string;
  date?: string;
  page?: number;
  size?: number;
  sort?: 'LATEST' | 'OLDEST' | 'AMOUNT_DESC' | 'AMOUNT_ASC';
}): Promise<ApiResponse<LedgerListResponse>> => {
  const search = new URLSearchParams({ yearMonth: params.yearMonth });
  if (params.date) search.set('date', params.date);
  if (params.page != null) search.set('page', String(params.page));
  if (params.size != null) search.set('size', String(params.size));
  if (params.sort) search.set('sort', params.sort);
  return apiGet<LedgerListResponse>(`/api/transactions?${search.toString()}`);
};

// ========== GET /api/transactions/summary (월 소비 내역 요약) ==========

export interface LedgerSummaryResult {
  totalIncome?: number;
  totalExpense?: number;
  previousMonthExpense?: number;
  expenseDiff?: number; // 전월 대비 증감 (음수: 덜 씀, 양수: 더 씀)
  [key: string]: unknown;
}

/**
 * 월 소비 내역 요약 (총 수입/지출, 전월 대비)
 * GET /api/transactions/summary?yearMonth=YYYY-MM
 * Swagger: Ledger (거래내역) → getMonthlySummary
 */
export const getMonthlySummaryApi = async (yearMonth: string): Promise<ApiResponse<LedgerSummaryResult>> => {
  return apiGet<LedgerSummaryResult>(`/api/transactions/summary?yearMonth=${encodeURIComponent(yearMonth)}`);
};

// ========== GET /api/transactions/trend (월별 지출 추이) ==========

export interface TrendItem {
  yearMonth?: string; // "YYYY-MM"
  amount?: number;
  totalExpense?: number;
  [key: string]: unknown;
}

/**
 * 월별 지출 추이 (차트용)
 * GET /api/transactions/trend?fromYearMonth=YYYY-MM&toYearMonth=YYYY-MM
 * Swagger: Ledger (거래내역) → getTrend
 */
export const getTrendApi = async (params: {
  fromYearMonth: string;
  toYearMonth: string;
}): Promise<ApiResponse<TrendItem[]>> => {
  const search = new URLSearchParams({
    fromYearMonth: params.fromYearMonth,
    toYearMonth: params.toYearMonth,
  });
  return apiGet<TrendItem[]>(`/api/transactions/trend?${search.toString()}`);
};

// ========== GET /api/transactions/top-category (최다 소비 항목) ==========

export interface TopCategoryItem {
  categoryCode?: string;
  categoryName?: string;
  totalAmount?: number;
  percentage?: number;
  [key: string]: unknown;
}

/**
 * 최다 소비 항목 (상위 N개)
 * GET /api/transactions/top-category?yearMonth=YYYY-MM&limit=3
 * Swagger: Ledger (거래내역) → getTopCategories
 */
export const getTopCategoriesApi = async (params: {
  yearMonth: string;
  limit?: number;
}): Promise<ApiResponse<TopCategoryItem[]>> => {
  const search = new URLSearchParams({ yearMonth: params.yearMonth });
  if (params.limit != null) search.set('limit', String(params.limit));
  return apiGet<TopCategoryItem[]>(`/api/transactions/top-category?${search.toString()}`);
};

// ========== GET /api/transactions/peer-compare (또래 비교) ==========

export interface PeerCompareResult {
  myTotalExpense?: number;
  perAverageExpense?: number;
  message?: string;
  [key: string]: unknown;
}

/**
 * 또래 비교 (MVP)
 * GET /api/transactions/peer-compare?yearMonth=YYYY-MM
 * Swagger: Ledger (거래내역) → peer-compare
 */
export const getPeerCompareApi = async (yearMonth: string): Promise<ApiResponse<PeerCompareResult>> => {
  return apiGet<PeerCompareResult>(`/api/transactions/peer-compare?yearMonth=${encodeURIComponent(yearMonth)}`);
};

// ========== GET /api/transactions/by-day (일별 수입/지출 합계) ==========

export interface DailyTransactionSummary {
  date: string; // YYYY-MM-DD
  totalIncome: number;
  totalExpense: number;
}

/**
 * 일별 수입/지출 합계 (달력용)
 * GET /api/transactions/by-day?yearMonth=YYYY-MM
 * Swagger: Ledger (거래내역) → by-day
 */
export const getDailyTransactionsApi = async (yearMonth: string): Promise<ApiResponse<DailyTransactionSummary[]>> => {
  return apiGet<DailyTransactionSummary[]>(`/api/transactions/by-day?yearMonth=${encodeURIComponent(yearMonth)}`);
};

// ========== 자산(계좌) 관련 타입 및 API ==========

// 인증 헤더 생성 함수 (fetch 사용 시 - 하위 호환성 유지)
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const assetApi = {
  /**
   * 연동된 은행 목록 조회
   * GET /api/assets/banks
   */
  async getConnectedBanks(): Promise<ConnectedBanksResponse> {
    const url = `${API_BASE_URL}/api/assets/banks`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const error = new Error(`Failed to fetch connected banks: ${response.statusText}`) as Error & {
        response?: { status: number; data: typeof errorData };
      };
      error.response = {
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    const result = await response.json();
    return result;
  },

  /**
   * 은행별 계좌 및 목표 목록 조회
   * GET /api/assets/banks/{bankCode}
   */
  async getBankAccounts(bankCode: string): Promise<BankAccountsResponse> {
    const url = `${API_BASE_URL}/api/assets/banks/${encodeURIComponent(bankCode)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const error = new Error(`Failed to fetch bank accounts: ${response.statusText}`) as Error & {
        response?: { status: number; data: typeof errorData };
      };
      error.response = {
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    const result = await response.json();
    return result;
  },

  /**
   * 연동 자산 개수 및 요약 조회
   * GET /api/assets/summary
   */
  async getAssetSummary(): Promise<ApiResponse<AssetSummaryResponse['result']>> {
    return apiGet<AssetSummaryResponse['result']>('/api/assets/summary');
  },

  /**
   * 전체 계좌 목록 조회
   * GET /api/assets/accounts
   */
  async getAccounts(): Promise<ApiResponse<AccountsListResponse['result']>> {
    return apiGet<AccountsListResponse['result']>('/api/assets/accounts');
  },

  /**
   * 전체 카드 목록 조회
   * GET /api/assets/cards
   */
  async getCards(): Promise<ApiResponse<CardsListResponse['result']>> {
    return apiGet<CardsListResponse['result']>('/api/assets/cards');
  },

  /**
   * 연동된 카드사 목록 조회
   * GET /api/assets/cardIssuers
   */
  async getCardIssuers(): Promise<CardIssuersListResponse> {
    const url = `${API_BASE_URL}/api/assets/cardIssuers`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const error = new Error(`Failed to fetch card issuers: ${response.statusText}`) as Error & {
        response?: { status: number; data: typeof errorData };
      };
      error.response = {
        status: response.status,
        data: errorData,
      };
      throw error;
    }

    const result = await response.json();
    return result;
  },

  /**
   * 카드사별 카드 목록 조회
   * GET /api/assets/cardIssuers/{issuerCode}/cards
   */
  async getCardIssuerCards(issuerCode: string): Promise<ApiResponse<CardIssuerCardsResponse['result']>> {
    return apiGet<CardIssuerCardsResponse['result']>(`/api/assets/cardIssuers/${encodeURIComponent(issuerCode)}/cards`);
  },
};

/** 연동 은행 목록 + 은행별 계좌를 합쳐 accountList, totalCount 형태로 반환 (홈 등에서 사용) */
export interface GetAccountsApiResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accountList: Account[];
    totalCount: number;
  };
}

export async function getAccountsApi(): Promise<GetAccountsApiResponse> {
  const banksRes = await assetApi.getConnectedBanks();
  const banks = banksRes?.result?.filter((b) => b.status === 'ACTIVE') ?? [];
  const accountList: Account[] = [];

  for (const bank of banks) {
    try {
      const res = await assetApi.getBankAccounts(bank.organizationCode);
      if (!res?.result) continue;
      const { accountList: list, goalList } = res.result;
      list.forEach((acc) => {
        const goal = goalList?.find((g) => g.linkedAccountId === acc.accountId);
        accountList.push({
          accountId: acc.accountId,
          accountName: acc.accountName,
          balanceAmount: acc.balanceAmount,
          connectedGoalId: acc.connectedGoalId,
          goalInfo: goal ? { goalId: goal.goalId, title: goal.title } : null,
        });
      });
    } catch {
      // 은행별 조회 실패 시 해당 은행만 스킵
    }
  }

  return {
    isSuccess: true,
    code: 'OK',
    message: '',
    result: {
      accountList,
      totalCount: accountList.length,
    },
  };
}
