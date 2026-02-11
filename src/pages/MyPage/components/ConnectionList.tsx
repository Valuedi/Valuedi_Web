import ConnectionDetailListItem from '@/shared/components/mypage/ConnectionDetailListItem';
import { assetApi } from '@/features/asset';
import { formatCardNumber } from '@/shared/utils/formatCardNumber';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface ConnectionListProps {
  bankName: string;
  organizationCode: string;
}

interface AssetListItem {
  accountId?: number; // 은행 계좌 ID
  accountName?: string; // 은행 계좌 이름
  accountNumber?: string; // 은행 계좌 번호
  cardId?: number; // 카드 ID
  cardName?: string; // 카드 이름
  cardNoMasked?: string; // 마스킹된 카드 번호
}

export const ConnectionList = ({ bankName, organizationCode }: ConnectionListProps) => {
  // 💡 '카드'라는 글자가 포함되어 있는지 확인하여 모드 결정
  const isCard = bankName.includes('카드');

  const { data: bankData } = useQuery({
    queryKey: ['assets', 'bank', organizationCode],
    queryFn: () => assetApi.getBankAccounts(organizationCode),
    enabled: !!organizationCode && !isCard,
  });

  const { data: cardData } = useQuery({
    queryKey: ['assets', 'cardIssuer', organizationCode],
    queryFn: () => assetApi.getCardIssuerCards(organizationCode),
    enabled: !!organizationCode && isCard,
  });

  const filteredList = useMemo(() => {
    if (isCard) {
      // 카드사 API 응답에서 목록 추출
      return cardData?.result?.cardList?.slice(0, 2) || [];
    }
    // 💡 3. 은행 상세 API 응답에서 계좌 목록 추출
    return bankData?.result?.accountList?.slice(0, 4) || [];
  }, [isCard, bankData, cardData]);

  return (
    <section className="px-5 pb-8 space-y-2">
      {filteredList.map((item: AssetListItem) => (
        <ConnectionDetailListItem
          key={isCard ? item.cardId : item.accountId}
          displayName={(isCard ? item.cardName : item.accountName) || '연결된 정보 확인'}
          accountNumber={isCard ? formatCardNumber(item.cardNoMasked) : item.accountNumber || '연결된 정보 확인'}
          isCardType={isCard}
        />
      ))}

      {/* 데이터가 없을 경우 처리 */}
      {filteredList.length === 0 && <div className="py-10 text-center text-neutral-40">연결된 항목이 없습니다.</div>}
    </section>
  );
};
