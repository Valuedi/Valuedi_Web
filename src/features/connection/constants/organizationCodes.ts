// 은행/카드 ID를 기관 코드로 매핑하는 상수

// 은행 ID -> 기관 코드 매핑
export const BANK_ORGANIZATION_CODES: Record<string, string> = {
  ibk: '0002', // 산업은행
  kdb: '0003', // 기업은행
  kb: '0004', // 국민은행
  suhyup: '0007', // 수협은행
  nh: '0011', // 농협은행
  woori: '0020', // 우리은행
  sc: '0023', // SC은행
  citi: '0027', // 씨티은행
  dgb: '0037', // 전북은행
  busan: '0032', // 부산은행
  gwangju: '0034', // 광주은행
  jeju: '0035', // 제주은행
  gyeongnam: '0039', // 경남은행
  saemaul: '0045', // 새마을금고
  shinhyup: '0048', // 신협은행
  postbank: '0071', // 우체국
  hana: '0081', // KEB하나은행
  shinhan: '0088', // 신한은행
  kbank: '0089', // K뱅크
};

/** 기관 코드(4자리) → 은행 표시명. API가 bankName으로 코드를 내려줄 때 사용 */
export const ORGANIZATION_CODE_TO_BANK_NAME: Record<string, string> = {
  '0002': '산업은행',
  '0003': '기업은행',
  '0004': '국민은행',
  '0007': '수협은행',
  '0011': '농협은행',
  '0020': '우리은행',
  '0023': 'SC은행',
  '0027': '씨티은행',
  '0032': '부산은행',
  '0034': '광주은행',
  '0035': '제주은행',
  '0037': '전북은행',
  '0039': '경남은행',
  '0045': '새마을금고',
  '0048': '신협은행',
  '0071': '우체국',
  '0081': '하나은행',
  '0088': '신한은행',
  '0089': 'K뱅크',
};

// 카드 ID -> 기관 코드 매핑
export const CARD_ORGANIZATION_CODES: Record<string, string> = {
  kb: '0301', // KB카드
  hyundai: '0302', // 현대카드
  samsung: '0303', // 삼성카드
  nh: '0304', // NH카드
  bc: '0305', // BC카드
  shinhan: '0306', // 신한카드
  citi: '0307', // 씨티카드
  woori: '0309', // 우리카드
  lotte: '0311', // 롯데카드
  hana: '0313', // 하나카드
  dgb: '0315', // 전북카드
  gwangju: '0316', // 광주카드
  suhyup: '0320', // 수협카드
  jeju: '0321', // 제주카드
};
// 은행 ID를 기관 코드로 변환
export const getBankOrganizationCode = (bankId: string): string | null => {
  return BANK_ORGANIZATION_CODES[bankId] || null;
};
// 카드 ID를 기관 코드로 변환
export const getCardOrganizationCode = (cardId: string): string | null => {
  return CARD_ORGANIZATION_CODES[cardId] || null;
};
// 기관 코드를 은행 ID로 변환 (역방향)
export const getBankIdFromOrganizationCode = (orgCode: string): string | null => {
  const entry = Object.entries(BANK_ORGANIZATION_CODES).find(([, code]) => code === orgCode);
  return entry ? entry[0] : null;
};
// 기관 코드를 카드 ID로 변환 (역방향)
export const getCardIdFromOrganizationCode = (orgCode: string): string | null => {
  const entry = Object.entries(CARD_ORGANIZATION_CODES).find(([, code]) => code === orgCode);
  return entry ? entry[0] : null;
};
// API에서 내려준 bankName이 기관 코드(4자리)면 은행 표시명으로 변환, 아니면 그대로 반환
export function getBankDisplayName(bankNameOrCode: string | undefined): string {
  if (!bankNameOrCode) return '';
  const trimmed = bankNameOrCode.trim();
  return ORGANIZATION_CODE_TO_BANK_NAME[trimmed] ?? trimmed;
}
