/**
 * 카드 번호를 4자리마다 하이픈(-)을 넣어 포맷팅
 * 624363******2018 -> 6243-63**-****-2018 (또는 데이터 길이에 맞게 분할)
 */
export const formatCardNumber = (cardNumber?: string): string => {
  if (!cardNumber) return '';

  // 1. 혹시 이미 들어있는 하이픈이 있다면 모두 제거해서 순수 데이터만 추출
  const pureNumber = cardNumber.replace(/-/g, '');

  try {
    // 2. 4자리 단위로 끊어서 배열로 만든 뒤 하이픈으로 연결
    // 정규식: . {1,4} -> 어떤 문자든(숫자든 *든) 1개에서 4개까지 그룹핑
    const chunks = pureNumber.match(/.{1,4}/g);
    return chunks ? chunks.join('-') : pureNumber;
  } catch (error) {
    return cardNumber;
  }
};
