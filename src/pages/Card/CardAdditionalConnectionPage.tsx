import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '@/components/layout/MobileLayout';
import CardGNB from '@/components/card/CardGNB';
import { Typography } from '@/components/typography';
import { BaseButton } from '@/components/buttons/BaseButton';
import BankInfiniteGrid from '@/components/bank/BankInfiniteGrid';
import { CARDS } from '@/features/card/constants/cards';
import { useQuery } from '@tanstack/react-query';
import { getConnectionsApi } from '@/features/connection';
import { getBankIdFromOrganizationCode } from '@/features/connection/constants/organizationCodes';

const CardAdditionalConnectionPage = () => {
  const navigate = useNavigate();

  const { data: connectionsData } = useQuery({
    queryKey: ['connections'],
    queryFn: () => getConnectionsApi(),
  });

  // 2. 이미 연결된 카드사 ID 필터링
  const connectedCardIds =
    connectionsData?.result
      ?.filter((conn) => {
        const businessType = conn.businessType || conn.type;
        return businessType === 'CD';
      })
      .map((conn) => {
        const organizationCode = conn.organizationCode || conn.organization;
        return organizationCode ? getBankIdFromOrganizationCode(organizationCode) : null;
      })
      .filter((id): id is string => id !== null) || [];

  // 연결되지 않은 카드사만 필터링
  const availableCards = CARDS.filter((card) => !connectedCardIds.includes(card.id));

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddMore = () => {
    // 카드 선택 페이지로 이동
    navigate('/card/select');
  };

  const handleSkip = () => {
    // mbti 검사 페이지로 이동
    navigate('/mbti');
  };

  return (
    <MobileLayout>
      <div className="w-full bg-white">
        <CardGNB onBack={handleBack} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[12px] items-center justify-center w-[320px] mx-auto mt-[20px]">
        <div className="flex items-center w-full">
          <Typography style="text-headline-3-18-semi-bold" className="text-neutral-90 tracking-[-0.36px] w-[147px]">
            <p className="mb-0">추가로 연결하고 싶은</p>
            <p>카드사가 있나요?</p>
          </Typography>
        </div>
        <Typography variant="body-2" weight="regular" className="text-neutral-70 w-full">
          여러 카드를 연결하면 더 정확한 소비 분석이 가능해요
        </Typography>
      </div>

      {/* Placeholder for illustration */}
      <BankInfiniteGrid availableBanks={availableCards} />

      {/* Button */}
      <div className="absolute bottom-[41px] left-1/2 transform -translate-x-1/2 w-[320px]">
        <BaseButton variant="primary" size="medium" text="추가할래요" fullWidth onClick={handleAddMore} />
      </div>

      {/* Skip Button */}
      <div className="absolute bottom-[89px] left-1/2 transform -translate-x-1/2 w-[320px] flex items-center justify-center px-[10px] py-[8px]">
        <button type="button" onClick={handleSkip} className="cursor-pointer">
          <Typography variant="body-2" weight="regular" className="text-neutral-50 text-center whitespace-nowrap">
            나중에 할래요
          </Typography>
        </button>
      </div>
    </MobileLayout>
  );
};

export default CardAdditionalConnectionPage;
