import type { TransactionItem } from '@/shared/utils/goal/ledgerHelpers';

interface AmountAchievedLedgerListProps {
  transactions: TransactionItem[];
  isLoading: boolean;
  sortBy: 'latest' | 'achieve';
  onSortChange: (sort: 'latest' | 'achieve') => void;
  onItemClick: (item: TransactionItem) => void;
}

export default function AmountAchievedLedgerList({
  transactions,
  isLoading,
  onItemClick,
}: AmountAchievedLedgerListProps) {
  // 날짜별 그룹핑 및 일일 합계 계산
  const groups = transactions.reduce<
    {
      dateKey: string;
      dateLabel: string;
      totalAmount: number;
      items: TransactionItem[];
    }[]
  >((acc, tx) => {
    let group = acc.find((g) => g.dateKey === tx.dateKey);
    if (!group) {
      group = { dateKey: tx.dateKey, dateLabel: tx.dateLabel, totalAmount: 0, items: [] };
      acc.push(group);
    }
    group.totalAmount += tx.rawAmount;
    group.items.push(tx);
    return acc;
  }, []);

  return (
    <div className="py-2">
      <div className="mb-2 text-lg font-bold text-gray-900">저금 목록</div>

      <div className="flex flex-col">
        {isLoading ? (
          <div className="py-8 text-center text-gray-400 text-sm">거래내역 로딩 중...</div>
        ) : transactions.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">저금 내역이 없습니다.</div>
        ) : (
          groups.map((group) => {
            const totalAbs = Math.abs(group.totalAmount);
            const totalLabel =
              group.totalAmount >= 0
                ? `${totalAbs.toLocaleString('ko-KR')} 원`
                : `- ${totalAbs.toLocaleString('ko-KR')} 원`;

            return (
              <div key={group.dateKey} className="flex flex-col mb-4">
                <div className="flex justify-between py-3 text-sm text-gray-400 border-b border-gray-50">
                  <span>{group.dateLabel}</span>
                  <span>{totalLabel}</span>
                </div>
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className="flex justify-between px-1 py-5 transition-colors cursor-pointer active:bg-gray-50 border-b border-gray-50"
                  >
                    <span className="text-base font-medium text-gray-600">{item.type}</span>
                    <span className={`text-base font-bold ${item.isPositive ? 'text-gray-900' : 'text-primary-heavy'}`}>
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
