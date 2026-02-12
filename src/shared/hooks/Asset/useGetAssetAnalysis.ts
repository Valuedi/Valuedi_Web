import { useState, useEffect, useMemo } from 'react';
import {
  TransactionWithDetails,
  normalizeSectorPercentages,
  getIntegerPercentagesSum100,
} from '@/pages/Asset/tab/SectorAnalysis/utils/sectorUtils';
import { getTransactionsApi, rematchCategoriesApi, type LedgerTransactionItem } from '@/features/asset/asset.api';
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

/**
 * 프론트엔드에서 거래 내역을 카테고리별로 그룹화하고 합계 계산
 * 백엔드 API 응답이 부족할 때 사용하는 fallback 로직
 */
function groupTransactionsByCategory(
  transactions: TransactionWithDetails[]
): Record<string, { items: TransactionWithDetails[]; totalAmount: number }> {
  return transactions.reduce(
    (acc, transaction) => {
      // 지출(expense) 타입만 처리
      if (transaction.type !== 'expense') return acc;

      // TRANSFER 카테고리는 제외
      if (transaction.category === 'transfer') return acc;

      const categoryKey = transaction.category || 'others';

      if (!acc[categoryKey]) {
        acc[categoryKey] = {
          items: [],
          totalAmount: 0,
        };
      }

      acc[categoryKey].items.push(transaction);
      acc[categoryKey].totalAmount += Math.abs(transaction.amount);

      return acc;
    },
    {} as Record<string, { items: TransactionWithDetails[]; totalAmount: number }>
  );
}

/**
 * 카테고리별 통계를 SectorData 형태로 변환
 */
function createSectorsFromGroupedData(
  grouped: Record<string, { items: TransactionWithDetails[]; totalAmount: number }>,
  totalExpense: number,
  categoryNameMap?: Record<string, string>
): SectorData[] {
  return Object.entries(grouped)
    .map(([categoryKey, { items, totalAmount }]) => {
      // 카테고리 이름 매핑 (API에서 받은 이름 또는 기본값)
      const categoryName = categoryNameMap?.[categoryKey] || items[0]?.sub || categoryKey;

      return {
        key: categoryKey,
        category: categoryName,
        amount: totalAmount,
        percentage: totalExpense > 0 ? (totalAmount / totalExpense) * 100 : 0,
        items: items,
      };
    })
    .filter((sector) => sector.amount > 0) // 금액이 0보다 큰 것만
    .sort((a, b) => b.amount - a.amount); // 금액이 큰 순서대로 정렬
}

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
    id: item.id ?? item.transactionId ?? 0,
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

export const useGetAssetAnalysis = (selectedDate: Date = new Date(), options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true;
  // 상세 모달용 계좌 표시명 (분석 페이지에서는 구체 계좌 정보가 중요하지 않아 고정값 사용)
  const accountDisplay = useMemo(() => '연결 계좌', []);

  const [isLoading, setIsLoading] = useState(true);
  const [transactionsFromApi, setTransactionsFromApi] = useState<TransactionWithDetails[]>([]);

  // selectedDate를 년월 문자열로 변환하여 안정화 (무한 루프 방지)
  const yearMonth = useMemo(() => {
    const date = selectedDate || new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }, [selectedDate.getFullYear(), selectedDate.getMonth()]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const [year, month] = yearMonth.split('-').map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    const fromDate = `${yearMonth}-01`;
    const toDate = `${yearMonth}-${String(lastDay).padStart(2, '0')}`;

    const run = async () => {
      // 먼저 카테고리 재매칭 실행 (백그라운드에서 실행, 실패해도 계속 진행)
      try {
        await rematchCategoriesApi({ yearMonth, fromDate, toDate });
      } catch (error) {
        // 카테고리 재매칭 실패 시 무시하고 계속 진행
      }

      // 거래 내역만 조회 (프론트엔드에서 직접 그룹화)
      return getTransactionsApi({ yearMonth, size: 200, sort: 'LATEST' });
    };

    run()
      .then((listRes) => {
        // 거래 내역 데이터 처리
        // result.content / result.transactions / result가 배열인 경우 모두 처리 (백엔드 스펙 차이 대응)
        if (listRes?.isSuccess) {
          const raw = listRes?.result as
            | { content?: LedgerTransactionItem[]; transactions?: LedgerTransactionItem[] }
            | LedgerTransactionItem[]
            | null
            | undefined;
          const content = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.content)
              ? raw.content
              : Array.isArray((raw as { transactions?: LedgerTransactionItem[] })?.transactions)
                ? (raw as { transactions: LedgerTransactionItem[] }).transactions
                : [];

          if (content.length > 0) {
            // 지출(EXPENSE) 타입만 필터링하여 매핑
            const expenseItems = content.filter((item) => {
              const type = (item.type || '').toString().toUpperCase();
              return type === 'EXPENSE';
            });

            const mapped = expenseItems
              .filter((item) => item && item.amount !== undefined && item.amount !== null)
              .map((item: LedgerTransactionItem) => mapLedgerItemToTransactionWithDetails(item, accountDisplay));

            // TRANSFER 카테고리 제외 (소비 통계에서)
            const nonTransferMapped = mapped.filter((t) => {
              const categoryKey = t.category || '';
              const isTransfer = categoryKey === 'transfer';
              return !isTransfer;
            });

            setTransactionsFromApi(nonTransferMapped);
          } else {
            setTransactionsFromApi([]);
          }
        } else {
          setTransactionsFromApi([]);
        }
      })
      .catch(() => {
        setTransactionsFromApi([]);
      })
      .finally(() => setIsLoading(false));
  }, [yearMonth, enabled, accountDisplay]);

  // 프론트엔드에서 직접 총 지출 금액 계산
  const totalExpense = useMemo(() => {
    return transactionsFromApi
      .filter((t) => t.type === 'expense' && t.category !== 'transfer')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [transactionsFromApi]);

  // 프론트엔드에서 직접 카테고리별로 그룹화
  const allSectors = useMemo((): SectorData[] => {
    // 카테고리별로 그룹화 및 합계 계산
    const grouped = groupTransactionsByCategory(transactionsFromApi);

    // 카테고리 이름 매핑 생성 (거래 내역에서 추출)
    const categoryNameMap: Record<string, string> = {};
    Object.entries(grouped).forEach(([key, { items }]) => {
      if (items.length > 0 && items[0].sub) {
        categoryNameMap[key] = items[0].sub;
      }
    });

    // SectorData 형태로 변환
    let sectors = createSectorsFromGroupedData(grouped, totalExpense, categoryNameMap);

    // 금액이 큰 순서대로 정렬
    sectors.sort((a, b) => b.amount - a.amount);

    // 실제 금액 기반으로 percentage 재계산
    sectors = sectors.map((s) => ({
      ...s,
      percentage: totalExpense > 0 ? (s.amount / totalExpense) * 100 : 0,
    }));

    // percentage 정규화 (합이 100이 되도록)
    sectors = normalizeSectorPercentages(sectors, totalExpense);

    // 표시용 정수 퍼센트 계산 (합이 정확히 100이 되도록)
    const displayPcts = getIntegerPercentagesSum100(sectors.map((s) => s.percentage));

    const finalSectors = sectors.map((s, i) => ({ ...s, displayPct: displayPcts[i] ?? 0 }));

    return finalSectors;
  }, [transactionsFromApi, totalExpense]);

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
