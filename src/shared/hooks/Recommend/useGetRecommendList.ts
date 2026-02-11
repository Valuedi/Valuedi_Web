export type ProductType = 'all' | 'free' | 'fixed';

export interface RecommendProduct {
  id: number;
  bankName: string;
  productName: string;
  type: ProductType;
  description: string;
}

export const categoryList = [
  { type: 'all', label: '전체' },
  { type: 'free', label: '자유적금' },
  { type: 'fixed', label: '정기적금' },
] as const;

const MOCK_DATA: RecommendProduct[] = [
  {
    id: 1,
    bankName: '농협은행',
    productName: 'NH청년도약계좌',
    type: 'free',
    description: '자유적금 | 농협은행',
  },
  {
    id: 2,
    bankName: '하나은행',
    productName: 'NH청년도약계좌',
    type: 'fixed',
    description: '정기적금 | 하나은행',
  },
  {
    id: 3,
    bankName: '씨티은행',
    productName: 'NH청년도약계좌',
    type: 'free',
    description: '자유적금 | 씨티은행',
  },
  {
    id: 4,
    bankName: '산업은행',
    productName: 'NH청년도약계좌',
    type: 'fixed',
    description: '정기적금 | 산업은행',
  },
  {
    id: 5,
    bankName: '농협은행',
    productName: 'NH청년도약계좌',
    type: 'free',
    description: '자유적금 | 농협은행',
  },
  {
    id: 6,
    bankName: '농협은행',
    productName: 'NH청년도약계좌',
    type: 'free',
    description: '자유적금 | 농협은행',
  },
  {
    id: 7,
    bankName: '씨티은행',
    productName: 'NH청년도약계좌',
    type: 'fixed',
    description: '자유적금 | 씨티은행',
  },
];

export const useGetRecommendList = () => {
  return {
    data: MOCK_DATA,
  };
};
