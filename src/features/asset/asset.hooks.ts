import { useQuery, useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { assetApi, assetKeys } from './asset.api';
import type { BankAccountItem } from './asset.types';

/**
 * 연동된 은행 목록 조회
 */
export function useConnectedBanks() {
  return useQuery({
    queryKey: assetKeys.banks(),
    queryFn: () => assetApi.getConnectedBanks(),
  });
}

/**
 * 은행별 계좌 목록 조회 (단일 은행)
 */
export function useBankAccounts(bankCode: string | null) {
  return useQuery({
    queryKey: assetKeys.bankAccounts(bankCode ?? ''),
    queryFn: () => assetApi.getBankAccounts(bankCode!),
    enabled: !!bankCode,
  });
}

/** 계좌 선택용 플랫 리스트 아이템 */
export interface AccountOption {
  accountId: number;
  accountName: string;
  bankName: string;
  balanceAmount: number;
  connectedGoalId: number | null;
}

/**
 * 모든 연동 은행의 계좌 목록을 합쳐서 조회
 * (은행 목록 조회 → 각 은행별 계좌 조회 후 플랫 리스트로 반환)
 */
export function useAllBankAccounts(enabled = true) {
  const { data: banksData, isLoading: banksLoading, error: banksError } = useConnectedBanks();

  const bankCodes = useMemo(
    () => banksData?.result?.filter((b) => b.status === 'ACTIVE').map((b) => b.organizationCode) ?? [],
    [banksData]
  );

  const accountQueries = useQueries({
    queries: bankCodes.map((bankCode) => ({
      queryKey: assetKeys.bankAccounts(bankCode),
      queryFn: () => assetApi.getBankAccounts(bankCode),
      enabled: enabled && bankCodes.length > 0,
    })),
  });

  const isLoading = banksLoading || accountQueries.some((q) => q.isLoading);
  const error = banksError ?? accountQueries.find((q) => q.error)?.error;

  const accounts: AccountOption[] = useMemo(() => {
    const list: AccountOption[] = [];
    accountQueries.forEach((query) => {
      if (!query.data?.result) return;
      const { bankName, accountList } = query.data.result;
      accountList.forEach((acc: BankAccountItem) => {
        list.push({
          accountId: acc.accountId,
          accountName: acc.accountName,
          bankName,
          balanceAmount: acc.balanceAmount,
          connectedGoalId: acc.connectedGoalId,
        });
      });
    });
    return list;
  }, [accountQueries]);

  return {
    data: accounts,
    isLoading,
    error,
    banksData,
  };
}

/**
 * 연동 자산 개수 및 요약 조회
 * GET /api/assets/summary
 */
export function useAssetSummary() {
  return useQuery({
    queryKey: assetKeys.summary(),
    queryFn: () => assetApi.getAssetSummary(),
  });
}

/**
 * 전체 계좌 목록 조회
 * GET /api/assets/accounts
 */
export function useAccounts() {
  return useQuery({
    queryKey: assetKeys.accounts(),
    queryFn: () => assetApi.getAccounts(),
  });
}

/**
 * 전체 카드 목록 조회
 * GET /api/assets/cards
 */
export function useCards() {
  return useQuery({
    queryKey: assetKeys.cards(),
    queryFn: () => assetApi.getCards(),
  });
}

/**
 * 연동된 카드사 목록 조회
 * GET /api/assets/cardIssuers
 */
export function useCardIssuers() {
  return useQuery({
    queryKey: assetKeys.cardIssuers(),
    queryFn: () => assetApi.getCardIssuers(),
  });
}

/**
 * 카드사별 카드 목록 조회
 * GET /api/assets/cardIssuers/{issuerCode}/cards
 */
export function useCardIssuerCards(issuerCode: string | null) {
  return useQuery({
    queryKey: assetKeys.cardIssuerCards(issuerCode ?? ''),
    queryFn: () => assetApi.getCardIssuerCards(issuerCode!),
    enabled: !!issuerCode,
  });
}
