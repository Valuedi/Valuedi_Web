/**
 * 임시 이자 계산기 (단리 방식)
 * @param monthlyAmount 월 납입액
 * @param duration 기간 (개월)
 * @param rate 연 이율 (%)
 * @returns 세전 이자 금액 (원 단위, 소수점 버림)
 */
export const calculateInterest = (monthlyAmount: number, duration: number, rate: number) => {
  const interest = monthlyAmount * ((duration * (duration + 1)) / 2) * (rate / 100 / 12);

  return Math.floor(interest);
};
