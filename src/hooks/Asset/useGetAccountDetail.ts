import { AccountInfo, TransactionGroup } from '@/features/asset/constants/account';

export const useGetAccountDetail = () => {
  // API 연동 전까지 사용할 임시 목업 데이터
  const mockAccountInfo: AccountInfo = {
    bankName: 'KB국민ONE은행',
    accountNumber: '국민은행 | 592802-04-170725',
    balance: 526387,
    bgColor: 'bank-kb',
  };

  const mockHistory: TransactionGroup[] = [
    {
      date: '19일 오늘',
      day: 19,
      totalIncome: 0,
      totalExpense: 45500,
      dailyTotal: -45500,
      items: [
        { id: 1, title: '스타벅스 사당점', sub: '식비 | 체크카드', amount: -4500, type: 'expense', category: 'food' },
        {
          id: 2,
          title: '카카오T_택시',
          sub: '교통 | 카카오뱅크 카드',
          amount: -12000,
          type: 'expense',
          category: 'traffic',
        },
        { id: 3, title: '올리브영 사당', sub: '쇼핑 | 화장품', amount: -25000, type: 'expense', category: 'shopping' },
        { id: 4, title: 'GS25 편의점', sub: '식비 | 간식 구매', amount: -4000, type: 'expense', category: 'food' },
      ],
    },
    {
      date: '18일 어제',
      day: 18,
      dailyTotal: 2457000,
      totalIncome: 2500000,
      totalExpense: 43000,
      items: [
        {
          id: 6,
          title: '급여 입금',
          sub: '수입 | (주)밸류디컴퍼니',
          amount: 2500000,
          type: 'income',
          category: 'default',
        },
        {
          id: 7,
          title: '쿠팡 로켓배송',
          sub: '쇼핑 | 생필품 구매',
          amount: -28000,
          type: 'expense',
          category: 'shopping',
        },
        {
          id: 8,
          title: 'CGV 사당',
          sub: '여가/문화 | 영화 예매',
          amount: -15000,
          type: 'expense',
          category: 'leisure',
        },
      ],
    },
    {
      date: '17일 금요일',
      day: 17,
      dailyTotal: -60550,
      totalIncome: 350,
      totalExpense: 60900,
      items: [
        {
          id: 10,
          title: '김*주',
          sub: '내계좌이체 | KB국민ONE통장',
          amount: -50000,
          type: 'expense',
          category: 'transfer',
        },
        {
          id: 11,
          title: '멜론 정기결제',
          sub: '여가/문화 | 스트리밍',
          amount: -10900,
          type: 'expense',
          category: 'leisure',
        },
        {
          id: 12,
          title: '이자입금',
          sub: '금융수입 | 쏠편한 입출금통장(저축예금)',
          amount: 350,
          type: 'income',
          category: 'default',
        },
      ],
    },
  ];

  return {
    accountInfo: mockAccountInfo,
    transactionHistory: mockHistory,
    totalCount: 10,
  };
};
