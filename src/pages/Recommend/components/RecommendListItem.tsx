import { cn } from '@/shared/utils/cn';
import { Typography } from '@/shared/components/typography';
import { getColorToken } from '@/shared/styles/design-system';
import { BANNER } from '@/features/recommend/constants/banner';
import { BGBANKS } from '@/features/bank/constants/bgbanks';

interface Props {
  bankName: string;
  productName: string;
  description: string;
  onClick?: () => void;
}

export const RecommendListItem = ({ bankName, productName, description, onClick }: Props) => {
  // 은행명 정규화 함수
  const normalizeBankName = (name: string): string => {
    return name
      .replace(/주식회사\s*/g, '')
      .replace(/\(주\)\s*/g, '')
      .replace(/\s*은행\s*/g, '')
      .replace(/\s+/g, '')
      .trim();
  };

  // 은행명 매칭 함수
  const matchBankName = (bankName: string, targetName: string): boolean => {
    const normalizedBank = normalizeBankName(bankName);
    const normalizedTarget = normalizeBankName(targetName);

    // 정규화된 이름으로 매칭
    if (
      normalizedBank === normalizedTarget ||
      normalizedBank.includes(normalizedTarget) ||
      normalizedTarget.includes(normalizedBank)
    ) {
      return true;
    }

    // 특수 케이스: 케이뱅크 <-> K뱅크
    if (normalizedBank.includes('케이뱅크') && normalizedTarget === 'K뱅크') {
      return true;
    }
    if (normalizedBank === 'K뱅크' && normalizedTarget.includes('케이뱅크')) {
      return true;
    }

    // 원본 이름으로도 매칭 시도
    return bankName.includes(targetName) || targetName.includes(bankName);
  };

  // 1차: 추천 배너용 은행 매핑 (색상 토큰 포함)
  const bannerBank = BANNER.find((item) => matchBankName(bankName, item.name));

  // 2차: 홈 화면에서 사용하는 배경 은행 아이콘 매핑 (아이콘만 사용)
  const bgBank = BGBANKS.find((item) => matchBankName(bankName, item.name));

  // 아이콘은 BANNER > BGBANKS 순으로 우선 적용
  const iconSrc = bannerBank?.icon ?? bgBank?.icon;

  // 배경 색상은 BANNER가 있는 경우에만 사용, 없으면 기본 중립 색상
  const backgroundColor = bannerBank ? getColorToken(bannerBank.color) : getColorToken('neutral-10');

  return (
    <div onClick={onClick} className={cn('flex items-center gap-[8px] py-[8px] w-full cursor-pointer')}>
      <div
        style={{ backgroundColor: backgroundColor }}
        className={cn('w-[32px] h-[32px] rounded-[8px] flex items-center justify-center')}
      >
        {iconSrc ? <img src={iconSrc} alt={bankName} className="w-[20px] h-[20px]" /> : null}
      </div>

      <div className={cn('flex flex-col gap-[2px]')}>
        <Typography style="text-body-2-14-semi-bold" className={cn('text-neutral-90')}>
          {productName}
        </Typography>
        <Typography style="text-caption-1-12-regular" className={cn('text-neutral-50')}>
          {description}
        </Typography>
      </div>
    </div>
  );
};
