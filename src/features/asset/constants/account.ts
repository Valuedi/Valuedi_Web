import { ColorToken } from '@/shared/styles/design-system';

export interface AccountData {
  id: number;
  name: string;
  amount: number;
  bankName?: string;
  cardName?: string;
  iconBg: ColorToken;
}

export interface AccountInfo {
  bankName: string;
  accountNumber: string;
  balance: number;
  bgColor: ColorToken;
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
