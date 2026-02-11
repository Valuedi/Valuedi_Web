import { Typography } from '@/shared/components/typography';
import { BANKS } from '@/features/bank/constants/banks';
import { CARDS } from '@/features/card/constants/cards';
import { formatConnectionDate } from '@/shared/utils/formatConnectionDate';

interface ConnectionHeaderProps {
  bankName: string;
  connectedAt?: string;
}

export const ConnectionHeader = ({ bankName, connectedAt }: ConnectionHeaderProps) => {
  /**
   * 💡 상단 헤더 브랜드 로고 및 컬러 추출 로직
   */
  const getBankDetail = (label: string) => {
    // 💡 1. 은행과 카드를 합친 전체 리스트에서 찾습니다.
    const allProviders = [...BANKS, ...CARDS];

    // label(NH카드)에서 '은행', '카드'를 떼고 핵심 이름만 추출해 비교
    const provider = allProviders.find((p) =>
      label.replace('은행', '').replace('카드', '').includes(p.name.replace('은행', '').replace('카드', ''))
    );

    const colorMapping: Record<string, string> = {
      국민은행: 'kb',
      KB국민카드: 'kb',
      기업은행: 'ibk',
      IBK기업은행: 'ibk',
      신한은행: 'shinhan',
      신한카드: 'shinhan',
      NH카드: 'nh',
      농협은행: 'nh',
      우리은행: 'woori',
      우리카드: 'woori',
      수협은행: 'suhyup',
      수협카드: 'suhyup',
      하나카드: 'hana',
      하나은행: 'hana',
    };

    // 매핑에 있으면 매핑값 사용, 없으면 데이터의 id 사용
    const colorId = colorMapping[label] || provider?.id;

    return {
      icon: provider?.icon,
      bgColor: colorId ? `var(--color-bank-${colorId})` : 'var(--color-neutral-5)',
    };
  };

  const { icon, bgColor } = getBankDetail(bankName);

  return (
    <header className="mb-10 px-5 pt-6">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-neutral-10 shrink-0"
        style={{ backgroundColor: bgColor }}
      >
        <img src={icon} alt={bankName} className="w-6 h-6 object-contain" />
      </div>

      <Typography variant="headline-1" weight="semi-bold" className="text-neutral-90 text-[var(--font-size-7)]">
        {bankName}
      </Typography>

      <Typography variant="caption-1" className="text-neutral-70 mt-1">
        {formatConnectionDate(connectedAt)}
      </Typography>
    </header>
  );
};
