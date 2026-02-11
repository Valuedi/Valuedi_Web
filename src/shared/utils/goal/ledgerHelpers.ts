import type { LedgerItem } from '@/features/goal';

export interface TransactionItem {
  id: number;
  type: string;
  amount: string; // 포맷된 금액 문자열 (ex. 3,000 원 / - 13,000 원)
  time: string; // 거래 시간 포맷 문자열
  category: string;
  balanceAfter: string;
  account: string;
  isPositive: boolean;
  /** 일 단위 그룹핑용 키 (YYYY-MM-DD) */
  dateKey: string;
  /** 헤더에 표시할 날짜 라벨 (ex. 19일 오늘, 18일 어제, 17일 금요일) */
  dateLabel: string;
  /** 일일 합산을 위한 원시 금액 (입금 +, 출금 -) */
  rawAmount: number;
}

export function formatLedgerTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return iso;
  }
}

function formatDateKey(iso: string): { dateKey: string; dateLabel: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return { dateKey: iso, dateLabel: iso };
  }

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = d.getDate();
  const dateKey = `${yyyy}-${mm}-${String(dd).padStart(2, '0')}`;

  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const targetDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((todayDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];

  if (diffDays === 0) {
    return { dateKey, dateLabel: `${dd}일 오늘` };
  }
  if (diffDays === 1) {
    return { dateKey, dateLabel: `${dd}일 어제` };
  }

  return { dateKey, dateLabel: `${dd}일 ${dayOfWeek}요일` };
}

export function ledgerToTransactionItem(ledger: LedgerItem, accountLabel: string): TransactionItem {
  const isIncome = ledger.type === 'INCOME';
  const signedAmount = isIncome ? ledger.amount : -ledger.amount;
  const amountStr = isIncome
    ? `${ledger.amount.toLocaleString('ko-KR')} 원`
    : `- ${Math.abs(ledger.amount).toLocaleString('ko-KR')} 원`;

  const { dateKey, dateLabel } = formatDateKey(ledger.transactionAt);

  return {
    id: ledger.id,
    type: isIncome ? '입금' : '출금',
    amount: amountStr,
    time: formatLedgerTime(ledger.transactionAt),
    category: ledger.categoryName,
    balanceAfter: '-',
    account: accountLabel,
    isPositive: isIncome,
    dateKey,
    dateLabel,
    rawAmount: signedAmount,
  };
}
