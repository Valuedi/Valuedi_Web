import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AccountInfo, TransactionGroup } from '@/features/asset/constants/account';
import { useAccounts } from '@/features/asset';
import { getTransactionsApi, type LedgerTransactionItem } from '@/features/asset/asset.api';
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
    const isIncome = (item.type ?? '').toString().toUpperCase() === 'INCOME';
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

export const useGetAccountDetail = () => {
  const { id } = useParams<{ id?: string }>();
  const accountId = id ? Number(id) : null;

  const { data: accountsData } = useAccounts();
  const [transactionHistory, setTransactionHistory] = useState<TransactionGroup[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // 계좌 정보는 자산 계좌 목록(/api/assets/accounts) 기반
  const accountInfo: AccountInfo = useMemo(() => {
    const list = accountsData?.result?.accountList ?? [];
    const selected =
      (accountId && list.find((a) => a.accountId === accountId)) || (list.length > 0 ? list[0] : undefined);

    if (!selected) {
      return {
        bankName: '내 계좌',
        accountNumber: '연결된 계좌가 없습니다',
        balance: 0,
        bgColor: 'bank-plus',
      };
    }

    const bankName = getBankDisplayName(selected.organization);
    const accountNumber = `${bankName} | ${selected.accountName}`;

    return {
      bankName,
      accountNumber,
      balance: selected.balanceAmount,
      bgColor: getBankColorByOrgCode(selected.organization),
    };
  }, [accountsData, accountId]);

  // 현재 월 기준 거래 내역(/api/transactions) 조회
  useEffect(() => {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    getTransactionsApi({ yearMonth, size: 200, sort: 'LATEST' })
      .then((res) => {
        const raw = res?.result as { content?: LedgerTransactionItem[] } | LedgerTransactionItem[] | null | undefined;

        const content = Array.isArray(raw) ? raw : Array.isArray(raw?.content) ? raw.content : [];

        const groups = groupTransactionsByDate(content);
        setTransactionHistory(groups);
        setTotalCount(content.length);
      })
      .catch(() => {
        setTransactionHistory([]);
        setTotalCount(0);
      });
  }, []);

  return {
    accountInfo,
    transactionHistory,
    totalCount,
  };
};
