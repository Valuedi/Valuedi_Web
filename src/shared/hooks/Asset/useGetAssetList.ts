import { useMemo } from 'react';
import { useAccounts, useCards } from '@/features/asset';
import { AccountData } from '@/features/asset/constants/account';
import type { ColorToken } from '@/shared/styles/design-system';
import { getBankDisplayName } from '@/features/connection/constants/organizationCodes';

/**
 * 기관 코드(은행 코드) → 뱅크 컬러 토큰 매핑
 * API에서 내려주는 organization 코드(예: 0004, 0088 등)를 UI에 사용할 색상 토큰으로 변환한다.
 */
const getBankColorByOrgCode = (orgCode?: string | null): ColorToken => {
  switch (orgCode) {
    case '0004': // KB국민은행
      return 'bank-kb';
    case '0089': // K뱅크
      return 'bank-kbank';
    case '0045': // 새마을금고
      return 'bank-saemaul';
    case '0003': // 기업은행
      return 'bank-ibk';
    case '0032': // 부산은행
    case '0034': // 광주은행
    case '0037': // 전북은행
    case '0039': // 경남은행
      return 'bank-gwangju_jeonbuk';
    case '0011': // 농협은행
      return 'bank-nh';
    case '0007': // 수협은행
      return 'bank-suhyup';
    case '0020': // 우리은행
      return 'bank-woori';
    case '0023': // SC은행
      return 'bank-sc';
    case '0048': // 신협은행
      return 'bank-shinhyup';
    case '0071': // 우체국
      return 'bank-postbank';
    case '0081': // 하나은행
      return 'bank-hana';
    case '0088': // 신한은행
      return 'bank-shinhan';
    default:
      return 'bank-plus';
  }
};

/**
 * 카드 기관 코드 → 컬러 토큰 매핑
 * 카드사는 은행 색상을 재사용하거나 공통 색상을 사용한다.
 */
const getCardColorByOrgCode = (orgCode?: string | null): ColorToken => {
  switch (orgCode) {
    case '0301': // KB카드
      return 'bank-kb';
    case '0306': // 신한카드
      return 'bank-shinhan';
    case '0313': // 하나카드
      return 'bank-hana';
    case '0304': // NH카드
      return 'bank-nh';
    case '0309': // 우리카드
      return 'bank-woori';
    default:
      return 'bank-plus';
  }
};

/**
 * 자산 탭에서 사용하는 전체 자산/계좌/카드 목록 훅
 * - GET /api/assets/accounts
 * - GET /api/assets/cards
 * 를 사용해 목업 대신 실제 API 데이터를 반환한다.
 */
export const useGetAssetList = () => {
  const { data: accountsData, isLoading: isAccountsLoading, isError: isAccountsError } = useAccounts();
  const { data: cardsData, isLoading: isCardsLoading, isError: isCardsError } = useCards();

  const bankAccounts: AccountData[] = useMemo(() => {
    const list = accountsData?.result?.accountList ?? [];
    return list.map((acc) => ({
      id: acc.accountId,
      name: acc.accountName,
      amount: acc.balanceAmount,
      bankName: getBankDisplayName(acc.organization),
      iconBg: getBankColorByOrgCode(acc.organization),
    }));
  }, [accountsData]);

  const cardAccounts: AccountData[] = useMemo(() => {
    const list = cardsData?.result?.cardList ?? [];
    return list.map((card, index) => ({
      // 카드 API에 별도 ID가 없으므로 인덱스로 임시 ID 생성
      id: index + 1,
      name: card.cardName,
      // 카드 API 응답에 잔고 필드가 없어 금액은 표시용으로 사용하지 않는다.
      amount: 0,
      cardName: card.cardName,
      cardNoMasked: card.cardNoMasked,
      iconBg: getCardColorByOrgCode(card.organization),
    }));
  }, [cardsData]);

  const totalAsset = useMemo(() => bankAccounts.reduce((sum, account) => sum + account.amount, 0), [bankAccounts]);

  return {
    totalAsset,
    bankAccounts,
    cardAccounts,
    isLoading: isAccountsLoading || isCardsLoading,
    isError: isAccountsError || isCardsError,
  };
};
