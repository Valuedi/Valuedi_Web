/**
 * 숫자를 한국 원화 형식으로 포맷팅
 * @param amount - 포맷팅할 금액
 * @param withUnit - '원' 단위 표시 여부 (기본값: true)
 * @returns 포맷팅된 문자열
 */
export const formatCurrency = (amount: number, withUnit: boolean = true): string => {
  const formatted = amount.toLocaleString('ko-KR');
  return withUnit ? `${formatted}원` : formatted;
};
