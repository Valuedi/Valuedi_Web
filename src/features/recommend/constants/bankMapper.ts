// 은행 명칭 -> 배너 ID 변환
export const getBankIdByName = (bankName: string): string => {
  if (bankName.includes('국민')) return 'kb';
  if (bankName.includes('기업')) return 'kdb';
  if (bankName.includes('산업')) return 'ibk';
  if (bankName.includes('농협')) return 'nh';
  if (bankName.includes('우리')) return 'woori';
  if (bankName.includes('하나')) return 'hana';
  if (bankName.includes('케이뱅크') || bankName.includes('K뱅크')) return 'kbank';
  if (bankName.includes('신한')) return 'shinhan';
  if (bankName.includes('부산')) return 'busan';
  if (bankName.includes('새마을')) return 'saemaul';
  if (bankName.includes('우체국')) return 'postbank';
  if (bankName.includes('수협')) return 'suhyup';
  if (bankName.includes('신협')) return 'shinhyup';

  return 'default';
};
