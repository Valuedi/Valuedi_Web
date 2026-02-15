import { ColorToken } from '@/shared/styles/design-system';

export interface AccountData {
  id: number | null;
  name: string;
  amount: number;
  organizationCode?: string;
  bankName?: string;
  cardName?: string;
  cardNoMasked?: string;
  iconBg: ColorToken;
}

export interface AccountInfo {
  bankName: string;
  accountNumber: string;
  balance: number | null;
  bgColor: ColorToken;
  organizationCode?: string;
}

export interface TransactionItem {
  id: number;
  title: string;
  sub: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface TransactionGroup {
  date: string;
  day: number;
  dailyTotal: number;
  totalIncome: number;
  totalExpense: number;
  items: TransactionItem[];
}
