import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AccountInfo, TransactionGroup } from '@/features/asset/constants/account';
import { useAccounts, useCards } from '@/features/asset';
import {
  getAccountTransactionsApi,
  getCardTransactionsApi,
  type LedgerTransactionItem,
  type AssetTransactionsResult,
} from '@/features/asset/asset.api';
import { getBankDisplayName } from '@/features/connection/constants/organizationCodes';
import type { ColorToken } from '@/shared/styles/design-system';

// 은행 코드 → 색상 토큰 매핑 (자산 목록과 동일한 규칙 사용)
const getBankColorByOrgCode = (orgCode?: string | null): ColorToken => {
  switch (orgCode) {
    case '0004':
      return 'bank-kb';
    case '0089':
      return 'bank-kbank';
    case '0045':
      return 'bank-saemaul';
    case '0003':
      return 'bank-ibk';
    case '0032':
    case '0034':
    case '0037':
    case '0039':
      return 'bank-gwangju_jeonbuk';
    case '0011':
      return 'bank-nh';
    case '0007':
      return 'bank-suhyup';
    case '0020':
      return 'bank-woori';
    case '0023':
      return 'bank-sc';
    case '0048':
      return 'bank-shinhyup';
    case '0071':
      return 'bank-postbank';
    case '0081':
      return 'bank-hana';
    case '0088':
      return 'bank-shinhan';
    default:
      return 'bank-plus';
  }
};

const getCardColorByOrgCode = (orgCode?: string | null): ColorToken => {
  switch (orgCode) {
    case '0301':
      return 'bank-kb';
    case '0306':
      return 'bank-shinhan';
    case '0313':
      return 'bank-hana';
    case '0304':
      return 'bank-nh';
    case '0309':
      return 'bank-woori';
    default:
      return 'bank-plus';
  }
};

// 거래 목록을 날짜별 그룹(TransactionGroup)으로 변환
const groupTransactionsByDate = (items: LedgerTransactionItem[]): TransactionGroup[] => {
  const groups = new Map<number, TransactionGroup>();

  items.forEach((item) => {
    const rawDate = (item.transactionAt ?? item.date ?? '') as string;
    if (!rawDate) return;

    const dateObj = new Date(rawDate);
    if (Number.isNaN(dateObj.getTime())) return;

    const day = dateObj.getDate();
    let group = groups.get(day);
    if (!group) {
      group = {
        date: `${day}일`,
        day,
        dailyTotal: 0,
        totalIncome: 0,
        totalExpense: 0,
        items: [],
      };
      groups.set(day, group);
    }

    const rawAmount = Number(item.amount ?? 0);
    const txType = (item.transactionType ?? item.type ?? '').toString().toUpperCase();
    const isIncome = txType === 'INCOME';
    const amount = isIncome ? Math.abs(rawAmount) : -Math.abs(rawAmount);

    const categoryName = item.categoryName as string | undefined;
    const memo = item.memo as string | undefined;
    const sub = categoryName && memo ? `${categoryName} | ${memo}` : categoryName ? categoryName : memo ? memo : '기타';

    const txId = item.id ?? item.transactionId ?? Date.now() + group.items.length;

    group.items.push({
      id: txId,
      title: (item.title as string) ?? '',
      sub,
      amount,
      type: isIncome ? 'income' : 'expense',
      category: 'default', // 상세 카테고리 색상/아이콘은 기본값 사용
    });

    if (isIncome) {
      group.totalIncome += Math.abs(amount);
      group.dailyTotal += Math.abs(amount);
    } else {
      group.totalExpense += Math.abs(amount);
      group.dailyTotal -= Math.abs(amount);
    }
  });

  return Array.from(groups.values()).sort((a, b) => b.day - a.day);
};

export const useGetAccountDetail = (params?: { yearMonth?: string; date?: string }) => {
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const assetId = id ? Number(id) : null;
  const isCardDetail = location.pathname.startsWith('/asset/card/');

  const { data: accountsData } = useAccounts();
  const { data: cardsData } = useCards();
  const [transactionHistory, setTransactionHistory] = useState<TransactionGroup[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [accountTxMeta, setAccountTxMeta] = useState<AssetTransactionsResult | null>(null);
  const [cardTxMeta, setCardTxMeta] = useState<AssetTransactionsResult | null>(null);

  // 상세 상단 정보는 계좌/카드 목록 API를 기반으로 구성
  const accountInfo: AccountInfo = useMemo(() => {
    if (isCardDetail) {
      const cardList = cardsData?.result?.cardList ?? [];
      const selected =
        (assetId && cardList.find((c) => c.cardId === assetId)) || (cardList.length > 0 ? cardList[0] : undefined);

      return {
        bankName: cardTxMeta?.assetName ?? selected?.cardName ?? '내 카드',
        accountNumber: cardTxMeta?.assetNumber ?? selected?.cardNoMasked ?? '카드번호 정보 없음',
        balance: null,
        bgColor: getCardColorByOrgCode(cardTxMeta?.organizationCode ?? selected?.organization),
        organizationCode: cardTxMeta?.organizationCode ?? selected?.organization,
      };
    }

    const accountList = accountsData?.result?.accountList ?? [];
    const selected =
      (assetId && accountList.find((a) => a.accountId === assetId)) ||
      (accountList.length > 0 ? accountList[0] : undefined);

    if (!selected) {
      return {
        bankName: '내 계좌',
        accountNumber: '연결된 계좌가 없습니다',
        balance: 0,
        bgColor: 'bank-plus',
        organizationCode: undefined,
      };
    }

    const bankName = accountTxMeta?.assetName ?? getBankDisplayName(selected.organization);
    const accountNumber = accountTxMeta?.assetNumber ?? `${bankName} | ${selected.accountName}`;

    return {
      bankName,
      accountNumber,
      balance: accountTxMeta?.currentBalance ?? selected.balanceAmount,
      bgColor: getBankColorByOrgCode(accountTxMeta?.organizationCode ?? selected.organization),
      organizationCode: accountTxMeta?.organizationCode ?? selected.organization,
    };
  }, [accountTxMeta, accountsData, assetId, cardTxMeta, cardsData, isCardDetail]);

  // 계좌/카드 상세내역 API로 조회
  useEffect(() => {
    if (!assetId) {
      setAccountTxMeta(null);
      setCardTxMeta(null);
      setTransactionHistory([]);
      setTotalCount(0);
      return;
    }

    let isCancelled = false;

    const fetchTransactions = async () => {
      try {
        const now = new Date();
        const defaultYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const targetYearMonth = params?.yearMonth ?? defaultYearMonth;
        let content: LedgerTransactionItem[] = [];
        let count = 0;
        let accountMeta: AssetTransactionsResult | null = null;
        let cardMeta: AssetTransactionsResult | null = null;

        if (isCardDetail && assetId) {
          const size = 50;
          let page = 0;
          let totalPages = 1;

          while (page < totalPages) {
            const cardRes = await getCardTransactionsApi(assetId, {
              yearMonth: targetYearMonth,
              date: params?.date,
              page,
              size,
            });

            const result = cardRes?.result;
            if (!result) break;
            if (!cardMeta) cardMeta = result;

            const pageContent = Array.isArray(result.content) ? result.content : [];
            content = content.concat(pageContent);

            totalPages = result.totalPages ?? 1;
            page += 1;
          }

          count = cardMeta?.totalElements ?? content.length;
        } else {
          const size = 50;
          let page = 0;
          let totalPages = 1;

          while (page < totalPages) {
            const accountRes = await getAccountTransactionsApi(assetId, {
              yearMonth: targetYearMonth,
              date: params?.date,
              page,
              size,
            });

            const result = accountRes?.result;
            if (!result) break;
            if (!accountMeta) accountMeta = result;

            const pageContent = Array.isArray(result.content) ? result.content : [];
            content = content.concat(pageContent);

            totalPages = result.totalPages ?? 1;
            page += 1;
          }

          count = accountMeta?.totalElements ?? content.length;
        }

        if (isCancelled) return;
        setAccountTxMeta(accountMeta);
        setCardTxMeta(cardMeta);
        setTransactionHistory(groupTransactionsByDate(content));
        setTotalCount(count);
      } catch {
        if (isCancelled) return;
        setAccountTxMeta(null);
        setCardTxMeta(null);
        setTransactionHistory([]);
        setTotalCount(0);
      }
    };

    fetchTransactions();

    return () => {
      isCancelled = true;
    };
  }, [assetId, isCardDetail, params?.yearMonth, params?.date]);

  return {
    accountInfo,
    transactionHistory,
    totalCount,
  };
};
