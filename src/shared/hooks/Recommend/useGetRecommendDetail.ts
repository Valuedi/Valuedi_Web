import { InterestRateItem } from '@/pages/Recommend/components/InterestRateList';
import { ProductInfoItem } from '@/pages/Recommend/components/ProductInfoList';

export const useGetRecommendDetail = () => {
  const productInfo = {
    bankId: 'nh',
    bankName: '농협은행',
    productName: 'NH청년도약계좌',
    maxRate: 6.0,
    basicRate: 4.5,
    maxAmount: 700000,
  };

  const preferentialRates: InterestRateItem[] = [
    { description: '급여이체 실적을 충족한 경우', rate: 0.5 },
    { description: '월 평균 20만원 이상 이용 시', rate: 0.5 },
    { description: '상품 서비스 안내 동의서 동의 시', rate: 0.5 },
    { description: '직전 1년간 농협은행 예적금을 보유하지\n 않았거나 NH청년희망적금 만기해지고객', rate: 0.5 },
  ];

  const productDetailInfo: ProductInfoItem[] = [
    {
      label: '가입금액',
      value: '최소 1천원 ~ 최대 70만원',
      subText: '• 초입금/매회 1천원 이상, 매월 70만원 이하 금액을 만기일 전일까지 자유 적립',
    },
    {
      label: '가입대상',
      value: '(나이) 신규 가입일 기준 만19세 ~ 34세 이하*',
      subText: '* 병역이행기간(최대6년)은 만 나이 계산 시 제외',
    },
    {
      label: '가입방법',
      value: '모바일',
    },
    {
      label: '만기 후 이자율',
      value: '보통예금 이자율',
      subText: '• 만기 후 1년 이내: 만기시점 계약기간별 기본이자율의 1/2\n• 만기 후 1년 초과: 보통예금 이자율',
    },
    {
      label: '세제혜택',
      value: '비과세 상품',
      subText:
        '조세특례제한법 제91조의22에 따른 비과세 상품\n(상품 계약기간 만료 후 이자는 그대로 과세되며, 상품의 약관에\n도 불구하고 조세특례제한법 및 그 시행령과 시행규칙의 변경 시\n해당 법령에 따름)',
    },
    {
      label: '예금자 보호',
      value: '보호가능',
      subText: '예금보험공사 보호금융상품 (1인당 최고 5천만원)',
    },
  ];

  return {
    productInfo,
    preferentialRates,
    productDetailInfo,
  };
};
