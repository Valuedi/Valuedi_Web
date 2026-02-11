import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MobileLayout } from '@/shared/components/layout/MobileLayout';
import BackPageGNB from '@/shared/components/gnb/BackPageGNB';
import { Typography } from '@/shared/components/typography';
import { MoreViewButton } from '@/shared/components/buttons/MoreViewButton';
import { BANKS } from '@/features/bank/constants/banks';
import { CARDS } from '@/features/card/constants/cards';
import { getConnectionsApi } from '@/features/connection/connection.api';
import {
  getBankIdFromOrganizationCode,
  getCardIdFromOrganizationCode,
} from '@/features/connection/constants/organizationCodes';
import { cn } from '@/shared/utils/cn';
import { Toast } from '@/shared/components/common/Toast';

export const ConnectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cardSectionRef = useRef<HTMLDivElement>(null);

  const [showToast, setShowToast] = useState(false);

  // 연결 목록 조회
  const {
    data: connectionsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['connections'],
    queryFn: () => getConnectionsApi(),
  });

  // 연결된 은행과 카드 분리
  const banks =
    connectionsData?.result
      ?.filter((conn) => {
        const businessType = conn.businessType || conn.type; // API 응답 필드명 대응
        return businessType === 'BK';
      })
      .map((conn) => {
        // organizationCode를 bankId로 변환하여 은행 정보 찾기
        const organizationCode = conn.organizationCode || conn.organization; // API 응답 필드명 대응
        const bankId = organizationCode ? getBankIdFromOrganizationCode(organizationCode) : null;
        const bank = bankId ? BANKS.find((b) => b.id === bankId) : null;
        return bank ? bank.name : conn.organizationName || organizationCode || '알 수 없음';
      }) || [];

  const cards =
    connectionsData?.result
      ?.filter((conn) => {
        const businessType = conn.businessType || conn.type; // API 응답 필드명 대응
        return businessType === 'CD';
      })
      .map((conn) => {
        // organizationCode를 cardId로 변환하여 카드 정보 찾기
        const organizationCode = conn.organizationCode || conn.organization; // API 응답 필드명 대응
        const cardId = organizationCode ? getCardIdFromOrganizationCode(organizationCode) : null;
        const card = cardId ? CARDS.find((c) => c.id === cardId) : null;
        return card ? card.name : conn.organizationName || organizationCode || '알 수 없음';
      }) || [];

  useEffect(() => {
    // 💡 2. 상세 페이지에서 '해제' 후 넘어왔는지 확인
    if (location.state?.shouldShowToast) {
      // 데이터 새로고침
      refetch();

      // 토스트 띄우기
      setShowToast(true);

      // 토스트 자동 종료 및 state 초기화 (뒤로가기 시 중복 실행 방지)
      const timer = setTimeout(() => setShowToast(false), 2000);

      // 💡 replace를 통해 URL의 state를 비워줍니다 (중요!)
      navigate(location.pathname, { replace: true, state: {} });

      return () => clearTimeout(timer);
    }

    // 기존 카드 섹션 스크롤 로직
    if (location.state?.target === 'card' && cardSectionRef.current) {
      const timer = setTimeout(() => {
        cardSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location, navigate, refetch]);

  const handleItemClick = (name: string) => {
    navigate('/mypage/connection/detail', { state: { bankName: name } });
  };

  const getBankInfo = (label: string) => {
    // 은행과 카드를 합친 전체 리스트에서 검색하도록 수정
    const allProviders = [...BANKS, ...CARDS];

    // label(예: NH카드)에서 '은행', '카드'를 제거한 키워드로 비교
    const provider = allProviders.find((p) =>
      label.replace('은행', '').replace('카드', '').includes(p.name.replace('은행', '').replace('카드', ''))
    );

    // 2. 배경색 매핑 규칙 적용
    const colorMapping: Record<string, string> = {
      국민은행: 'kb',
      KB국민카드: 'kb',
      기업은행: 'ibk',
      IBK기업은행: 'ibk',
      신한은행: 'shinhan',
      신한카드: 'shinhan',
      농협은행: 'nh',
      NH카드: 'nh',
      우리은행: 'woori',
      우리카드: 'woori',
      수협은행: 'suhyup',
      수협카드: 'suhyup',
      하나카드: 'hana',
      하나은행: 'hana',
    };

    const colorId = colorMapping[label] || provider?.id;

    return {
      icon: provider?.icon,
      bgColor: colorId ? `var(--color-bank-${colorId})` : 'var(--color-neutral-5)',
    };
  };

  return (
    <MobileLayout className={cn('bg-neutral-0')}>
      <div className={cn('sticky top-0 z-10 w-full')}>
        <BackPageGNB
          className={cn('bg-neutral-0')}
          onBack={() => navigate(-1)}
          text=""
          title="연결관리"
          titleColor="text-neutral-90"
        />
      </div>

      <div className="flex-1 pb-10">
        {/* 💡 banks 상태 사용 */}
        <ConnectionSection title="연결된 은행">
          {isLoading ? (
            <div className="px-5 py-4">
              <Typography variant="body-2" className="text-neutral-60">
                로딩 중...
              </Typography>
            </div>
          ) : banks.length > 0 ? (
            banks.map((name) => {
              const { icon, bgColor } = getBankInfo(name);
              return (
                <ConnectionItem
                  key={name}
                  label={name}
                  icon={icon}
                  bgColor={bgColor}
                  onClick={() => handleItemClick(name)}
                />
              );
            })
          ) : (
            <div className="px-5 py-4">
              <Typography variant="body-2" className="text-neutral-60">
                연결된 은행이 없습니다.
              </Typography>
            </div>
          )}
        </ConnectionSection>

        <div ref={cardSectionRef}>
          <div className="h-2 bg-neutral-10 w-full" />
          {/* 💡 cards 상태 사용 */}
          <ConnectionSection title="연결된 카드">
            {isLoading ? (
              <div className="px-5 py-4">
                <Typography variant="body-2" className="text-neutral-60">
                  로딩 중...
                </Typography>
              </div>
            ) : cards.length > 0 ? (
              cards.map((name) => {
                const { icon, bgColor } = getBankInfo(name);
                return (
                  <ConnectionItem
                    key={name}
                    label={name}
                    icon={icon}
                    bgColor={bgColor}
                    onClick={() => handleItemClick(name)}
                  />
                );
              })
            ) : (
              <div className="px-5 py-4">
                <Typography variant="body-2" className="text-neutral-60">
                  연결된 카드가 없습니다.
                </Typography>
              </div>
            )}
          </ConnectionSection>
        </div>
      </div>

      {/* 💡 3. 토스트 컴포넌트 추가 */}
      <Toast message="해제되었습니다" isOpen={showToast} />
    </MobileLayout>
  );
};

const ConnectionSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col py-6">
    <div className="px-5 mb-4">
      <Typography variant="body-1" weight="bold" className="text-neutral-90">
        {title}
      </Typography>
    </div>
    <div className="flex flex-col">{children}</div>
  </div>
);

const ConnectionItem = ({
  label,
  icon,
  bgColor,
  onClick,
}: {
  label: string;
  icon?: string;
  bgColor?: string;
  onClick: () => void;
}) => (
  <div
    className="w-full px-5 py-4 flex items-center justify-between active:bg-neutral-3 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden border border-neutral-10"
        style={{ backgroundColor: bgColor }} // 💡 인라인 스타일로 컬러칩 적용
      >
        {icon ? (
          <img src={icon} alt={label} className="w-6 h-6 object-contain" />
        ) : (
          <div className="w-6 h-6 bg-neutral-20 rounded-full" />
        )}
      </div>
      <Typography variant="body-2" weight="semi-bold" className="text-neutral-90">
        {label}
      </Typography>
    </div>
    <MoreViewButton className="opacity-40" />
  </div>
);
