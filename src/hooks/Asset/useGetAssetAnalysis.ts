import { useState, useEffect, useMemo } from 'react';
import {
  TransactionWithDetails,
  transformToCategoryGroups,
  normalizeSectorPercentages,
  getIntegerPercentagesSum100,
} from '@/pages/Asset/tab/SectorAnalysis/utils/sectorUtils';
import { useGetAccountDetail } from '@/hooks/Asset/useGetAccountDetail';
import {
  rematchCategoriesApi,
  getTransactionsByCategoryApi,
  syncTransactionsApi,
  getTransactionsApi,
  type LedgerTransactionItem,
} from '@/features/asset/asset.api';
import { normalizeCategoryCode, inferCategoryFromTitle } from '@/features/asset/constants/category';

function getCategoryFromItem(item: LedgerTransactionItem): { code: string; name: string; id?: number } {
  const cat = item.category;
  if (cat && typeof cat === 'object' && cat !== null) {
    const code = (cat.code ?? cat.category_code ?? '').toString().trim() as string;
    const name = (cat.name ?? cat.category_name ?? '').toString().trim() as string;
    const id = typeof cat.id === 'number' ? cat.id : typeof cat.category_id === 'number' ? cat.category_id : undefined;
    return { code, name, id };
  }
  const code = (item.categoryCode ?? item.category_code ?? (typeof cat === 'string' ? cat : '') ?? '')
    .toString()
    .trim();
  const name = (item.categoryName ?? item.category_name ?? '').toString().trim();
  const id =
    typeof item.categoryId === 'number'
      ? item.categoryId
      : typeof item.category_id === 'number'
        ? item.category_id
        : undefined;
  return { code, name, id };
}
import type { SectorData } from '@/pages/Asset/tab/SectorAnalysis/components/SectorListItem';

function mapLedgerItemToTransactionWithDetails(
  item: LedgerTransactionItem,
  accountDisplay: string
): TransactionWithDetails {
  const amount = Number(item.amount) ?? 0;
  const type = (item.type?.toUpperCase() === 'INCOME' ? 'income' : 'expense') as 'income' | 'expense';
  const rawDate = item.date ?? item.transactionAt ?? '';
  const date = rawDate.slice(0, 10); // YYYY-MM-DD만 사용 (transactionAt이 ISO면 앞 10자리)
  const { code, name, id } = getCategoryFromItem(item);
  let category = normalizeCategoryCode(code || undefined, name || undefined, id ?? item.categoryId ?? item.category_id);
  if (category === 'others') {
    const inferred = inferCategoryFromTitle(item.title);
    if (inferred) category = inferred;
  }
  const displayName = name || (item.categoryName as string) || '';
  return {
    id: item.transactionId ?? 0,
    title: item.title ?? '',
    sub: displayName,
    amount,
    type,
    category,
    date,
    displayDetails: [
      { label: '거래일자', value: date.replace(/-/g, '.') },
      { label: '거래구분', value: displayName || '-' },
      { label: '거래금액', value: `${Math.abs(amount).toLocaleString()}원`, isBold: true },
      { label: '입금계좌', value: accountDisplay },
    ],
  };
}

export const useGetAssetAnalysis = (selectedDate: Date = new Date()) => {
  const { accountInfo } = useGetAccountDetail();
  const accountDisplay = accountInfo?.accountNumber || '국민은행 592802-04-170725';

  const [isLoading, setIsLoading] = useState(true);
  const [sectorsFromApi, setSectorsFromApi] = useState<SectorData[]>([]);
  const [totalExpenseFromApi, setTotalExpenseFromApi] = useState(0);
  const [transactionsFromApi, setTransactionsFromApi] = useState<TransactionWithDetails[]>([]);

  // Swagger: rematchCategories → sync(동기화 트리거) → by-category + getTransactions(거래 목록 조회)
  useEffect(() => {
    setIsLoading(true);
    const yearMonth = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;

    const run = async () => {
      await rematchCategoriesApi({ yearMonth }).catch(() => {});
      await syncTransactionsApi({ yearMonth }).catch(() => {});
      return Promise.all([
        getTransactionsByCategoryApi(yearMonth),
        getTransactionsApi({ yearMonth, size: 200, sort: 'LATEST' }),
      ]);
    };

    run()
      .then(([categoryRes, listRes]) => {
        if (categoryRes?.isSuccess && Array.isArray(categoryRes?.result)) {
          const total = categoryRes.result.reduce((sum, item) => sum + item.totalAmount, 0);
          const mapped: SectorData[] = categoryRes.result.map((item) => ({
            key: normalizeCategoryCode(item.categoryCode, item.categoryName),
            category: item.categoryName,
            amount: item.totalAmount,
            percentage: item.percentage <= 1 ? item.percentage * 100 : item.percentage,
            items: [],
          }));
          setSectorsFromApi(mapped);
          setTotalExpenseFromApi(total);
        } else {
          setSectorsFromApi([]);
          setTotalExpenseFromApi(0);
        }

        // result.content / result.transactions / result가 배열인 경우 모두 처리 (백엔드 스펙 차이 대응)
        const raw = listRes?.result as
          | { content?: LedgerTransactionItem[]; transactions?: LedgerTransactionItem[] }
          | LedgerTransactionItem[]
          | null;
        const content = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.content)
            ? raw.content
            : Array.isArray((raw as { transactions?: LedgerTransactionItem[] })?.transactions)
              ? (raw as { transactions: LedgerTransactionItem[] }).transactions
              : [];
        if (listRes?.isSuccess && content.length >= 0) {
          setTransactionsFromApi(
            content.map((item: LedgerTransactionItem) => mapLedgerItemToTransactionWithDetails(item, accountDisplay))
          );
        } else {
          setTransactionsFromApi([]);
        }
      })
      .catch(() => {
        setSectorsFromApi([]);
        setTotalExpenseFromApi(0);
        setTransactionsFromApi([]);
      })
      .finally(() => setIsLoading(false));
  }, [selectedDate, accountDisplay]);

  const totalExpense = useMemo(() => {
    if (totalExpenseFromApi > 0) return totalExpenseFromApi;
    return transactionsFromApi.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [totalExpenseFromApi, transactionsFromApi]);

  const hasUsefulCategoryApi = sectorsFromApi.length > 1 || sectorsFromApi.some((s) => s.key !== 'others');

  const allSectors = useMemo((): SectorData[] => {
    let sectors: SectorData[];
    if (hasUsefulCategoryApi) {
      sectors = sectorsFromApi.map((s) => ({
        ...s,
        items: transactionsFromApi.filter(
          (t) => t.type === 'expense' && (t.category === s.key || (t.category || 'others') === s.key)
        ),
      }));
    } else {
      sectors = transformToCategoryGroups(transactionsFromApi, totalExpense);
    }
    sectors = normalizeSectorPercentages(sectors, totalExpense);
    const displayPcts = getIntegerPercentagesSum100(sectors.map((s) => s.percentage));
    return sectors.map((s, i) => ({ ...s, displayPct: displayPcts[i] ?? 0 }));
  }, [sectorsFromApi, transactionsFromApi, hasUsefulCategoryApi, totalExpense]);

  return {
    isLoading,
    totalExpense,
    transactions: transactionsFromApi,
    allSectors,
    topSectors: allSectors.slice(0, 6),
    otherSectors: allSectors.slice(6),
    otherCount: Math.max(0, allSectors.length - 6),
    otherTotalAmount: allSectors.slice(6).reduce((sum, s) => sum + s.amount, 0),
  };
};
